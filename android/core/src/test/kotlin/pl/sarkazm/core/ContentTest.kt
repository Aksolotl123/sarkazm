package pl.sarkazm.core

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertNotNull
import kotlin.test.assertNull
import kotlin.test.assertTrue

class ContentTest {
    private val content = ContentLoader.loadBundled()

    @Test
    fun `dołączona treść wczytuje się i jest spójna`() {
        assertEquals(emptyList(), ContentValidator.validate(content))
        assertEquals(6, content.modules.size)
        assertEquals(5, content.lessons.size)
        assertEquals(50, content.exercises.size)
    }

    @Test
    fun `każda lekcja ma tyle ćwiczeń, ile wynosi quizSize`() {
        for (m in content.modules.filter { it.kind == ModuleKind.LEKCJA }) {
            assertEquals(m.quizSize, content.exercisesFor(m.id).size, m.id)
        }
    }

    @Test
    fun `polskie znaki i emoji przetrwały eksport`() {
        val first = content.modules.first()
        assertEquals("🎭", first.emoji)
        assertTrue(content.lesson("sygnaly")!!.title.contains("ć"))
    }

    @Test
    fun `pula egzaminu to wszystkie ćwiczenia, pula lekcji to jej własne`() {
        val exam = content.modules.single { it.kind == ModuleKind.EGZAMIN }
        assertEquals(content.exercises.size, content.poolFor(exam).size)
        val lesson = content.modules.first()
        assertTrue(content.poolFor(lesson).all { it.moduleId == lesson.id })
    }

    @Test
    fun `następna lekcja nie wskazuje egzaminu ani nieznanego modułu`() {
        assertEquals("sygnaly", content.nextLessonAfter("czym-jest")?.id)
        assertNull(content.nextLessonAfter("kiedy"))
        assertNull(content.nextLessonAfter("egzamin"))
        assertNull(content.nextLessonAfter("nie-ma"))
        assertNotNull(content.module("egzamin"))
    }

    @Test
    fun `uszkodzony JSON daje czytelny błąd`() {
        assertFailsWith<ContentException> { ContentLoader.parse("{nie json") }
    }

    @Test
    fun `walidacja wyłapuje ćwiczenie z dwiema poprawnymi odpowiedziami i zły próg`() {
        val bad = content.copy(
            modules = content.modules.map { if (it.id == "czym-jest") it.copy(passThreshold = 1.5) else it },
            exercises = content.exercises.map {
                if (it.id == "cj-01") it.copy(options = it.options.map { o -> o.copy(correct = true) }) else it
            },
        )
        val problems = ContentValidator.validate(bad)
        assertTrue(problems.any { "cj-01" in it }, problems.toString())
        assertTrue(problems.any { "próg" in it }, problems.toString())
    }

    @Test
    fun `nieobsługiwana wersja treści jest odrzucana`() {
        val problems = ContentValidator.validate(content.copy(version = 99))
        assertTrue(problems.any { "wersja" in it })
    }
}
