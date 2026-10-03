package pl.sarkazm.core

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

/** Rodzaj ćwiczenia: etykieta w UI, nie zmienia mechaniki (zawsze wybór jednej opcji). */
@Serializable
enum class ExerciseKind(val label: String) {
    @SerialName("rozpoznaj") ROZPOZNAJ("Rozpoznawanie"),
    @SerialName("pojecie") POJECIE("Pojęcia"),
    @SerialName("sygnal") SYGNAL("Sygnały"),
    @SerialName("rodzaj") RODZAJ("Rodzaje"),
    @SerialName("riposta") RIPOSTA("Riposta"),
    @SerialName("technika") TECHNIKA("Technika"),
    @SerialName("stosownosc") STOSOWNOSC("Stosowność"),
}

@Serializable
data class Option(
    val text: String,
    val correct: Boolean,
    /** Wyjaśnienie pokazywane po wybraniu tej opcji. */
    val feedback: String,
)

@Serializable
data class Exercise(
    val id: String,
    val moduleId: String,
    val kind: ExerciseKind,
    /** Opis sytuacji, w której pada wypowiedź. */
    val context: String? = null,
    /** Wypowiedź, którą oceniamy. */
    val quote: String? = null,
    val question: String,
    val options: List<Option>,
)

@Serializable
data class LessonExample(val text: String, val note: String)

@Serializable
data class LessonSection(
    val heading: String,
    val paragraphs: List<String>,
    val examples: List<LessonExample> = emptyList(),
    val tip: String? = null,
)

@Serializable
data class Lesson(
    /** Równe id modułu. */
    val id: String,
    val title: String,
    val intro: String,
    val sections: List<LessonSection>,
    val takeaways: List<String>,
)

@Serializable
enum class ModuleKind {
    @SerialName("lekcja") LEKCJA,
    @SerialName("egzamin") EGZAMIN,
}

/** Moduł kursu. Nazwa CourseModule, bo „Module” koliduje z java.lang.Module. */
@Serializable
data class CourseModule(
    val id: String,
    val kind: ModuleKind,
    val title: String,
    val subtitle: String,
    val emoji: String,
    /** Liczba pytań w quizie. Lekcja: wszystkie ćwiczenia modułu. Egzamin: losowa próbka ze wszystkich. */
    val quizSize: Int,
    /** Ułamek poprawnych odpowiedzi potrzebny do zaliczenia (0–1]. */
    val passThreshold: Double,
)

@Serializable
data class Content(
    val version: Int,
    /** Kolejność w liście = kolejność odblokowywania. */
    val modules: List<CourseModule>,
    val lessons: List<Lesson>,
    val exercises: List<Exercise>,
) {
    private val lessonsById: Map<String, Lesson> by lazy { lessons.associateBy { it.id } }

    fun module(id: String): CourseModule? = modules.firstOrNull { it.id == id }

    fun lesson(id: String): Lesson? = lessonsById[id]

    fun exercisesFor(moduleId: String): List<Exercise> = exercises.filter { it.moduleId == moduleId }

    /** Pula pytań dla quizu danego modułu: egzamin losuje ze wszystkich ćwiczeń, lekcja z własnych. */
    fun poolFor(module: CourseModule): List<Exercise> =
        if (module.kind == ModuleKind.EGZAMIN) exercises else exercisesFor(module.id)

    /** Następna lekcja po danym module, o ile istnieje (egzaminu nie zwracamy). */
    fun nextLessonAfter(moduleId: String): CourseModule? {
        val index = modules.indexOfFirst { it.id == moduleId }
        if (index < 0) return null
        return modules.getOrNull(index + 1)?.takeIf { it.kind == ModuleKind.LEKCJA }
    }
}
