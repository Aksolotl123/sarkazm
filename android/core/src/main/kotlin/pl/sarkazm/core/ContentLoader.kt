package pl.sarkazm.core

import kotlinx.serialization.json.Json

/** Wersja formatu, którą rozumie ta aplikacja. Musi zgadzać się z CONTENT_FORMAT_VERSION w src/data/export.ts. */
const val SUPPORTED_CONTENT_VERSION = 1

class ContentException(message: String, cause: Throwable? = null) : Exception(message, cause)

object ContentLoader {
    private const val RESOURCE = "/content.json"

    private val json = Json { ignoreUnknownKeys = true }

    /** Parsuje i waliduje treść. Rzuca [ContentException] z listą problemów, gdy coś jest nie tak. */
    fun parse(text: String): Content {
        val content = try {
            json.decodeFromString(Content.serializer(), text)
        } catch (e: Exception) {
            throw ContentException("Nie udało się odczytać treści kursu: ${e.message}", e)
        }
        val problems = ContentValidator.validate(content)
        if (problems.isNotEmpty()) {
            throw ContentException("Treść kursu jest niespójna:\n" + problems.joinToString("\n") { "- $it" })
        }
        return content
    }

    /** Treść dołączona do aplikacji (plik generowany przez `npm run export:content`). */
    fun loadBundled(): Content {
        val stream = ContentLoader::class.java.getResourceAsStream(RESOURCE)
            ?: throw ContentException("Brak pliku $RESOURCE w zasobach aplikacji")
        return stream.bufferedReader(Charsets.UTF_8).use { parse(it.readText()) }
    }
}

/** Sprawdza spójność treści. Zwraca listę problemów; pusta lista = wszystko w porządku. */
object ContentValidator {
    fun validate(content: Content): List<String> = buildList {
        if (content.version != SUPPORTED_CONTENT_VERSION) {
            add("Nieobsługiwana wersja treści ${content.version} (obsługiwana: $SUPPORTED_CONTENT_VERSION)")
        }
        val moduleIds = content.modules.map { it.id }
        if (moduleIds.toSet().size != moduleIds.size) add("Zduplikowane id modułów")
        if (content.modules.isEmpty()) add("Brak modułów")
        if (content.modules.count { it.kind == ModuleKind.EGZAMIN } > 1) add("Więcej niż jeden egzamin")

        val lessonModuleIds = content.modules.filter { it.kind == ModuleKind.LEKCJA }.map { it.id }.toSet()
        for (m in content.modules) {
            if (m.quizSize <= 0) add("Moduł ${m.id}: quizSize musi być dodatni")
            if (m.passThreshold <= 0.0 || m.passThreshold > 1.0) add("Moduł ${m.id}: próg poza zakresem (0, 1]")
            if (m.kind == ModuleKind.LEKCJA && content.lesson(m.id) == null) add("Moduł ${m.id}: brak lekcji")
            if (m.kind == ModuleKind.LEKCJA && content.exercisesFor(m.id).isEmpty()) add("Moduł ${m.id}: brak ćwiczeń")
        }

        val exerciseIds = content.exercises.map { it.id }
        if (exerciseIds.toSet().size != exerciseIds.size) add("Zduplikowane id ćwiczeń")
        for (e in content.exercises) {
            if (e.moduleId !in lessonModuleIds) add("Ćwiczenie ${e.id}: nieznana lekcja ${e.moduleId}")
            if (e.options.size < 2) add("Ćwiczenie ${e.id}: mniej niż dwie opcje")
            val correct = e.options.count { it.correct }
            if (correct != 1) add("Ćwiczenie ${e.id}: $correct poprawnych odpowiedzi zamiast jednej")
            if (e.options.map { it.text }.toSet().size != e.options.size) add("Ćwiczenie ${e.id}: zduplikowane opcje")
            if (e.options.any { it.feedback.isBlank() }) add("Ćwiczenie ${e.id}: opcja bez wyjaśnienia")
        }
    }
}
