package pl.sarkazm.core

import kotlin.random.Random
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue

class QuizTest {
    private val content = ContentLoader.loadBundled()

    @Test
    fun `quiz lekcji używa każdego ćwiczenia modułu dokładnie raz`() {
        val lesson = content.module("rodzaje")!!
        val pool = content.poolFor(lesson)
        val session = buildQuiz(lesson.id, lesson.quizSize, pool, Random(5))
        assertEquals(pool.map { it.id }.sorted(), session.questions.map { it.exercise.id }.sorted())
    }

    @Test
    fun `egzamin losuje quizSize unikalnych pytań`() {
        val exam = content.module("egzamin")!!
        val session = buildQuiz(exam.id, exam.quizSize, content.poolFor(exam), Random(9))
        assertEquals(exam.quizSize, session.questions.size)
        assertEquals(exam.quizSize, session.questions.map { it.exercise.id }.toSet().size)
    }

    @Test
    fun `to samo ziarno daje tę samą sesję`() {
        val a = buildQuiz("e", 15, content.exercises, Random(11)).questions.map { it.exercise.id }
        val b = buildQuiz("e", 15, content.exercises, Random(11)).questions.map { it.exercise.id }
        assertEquals(a, b)
    }

    @Test
    fun `pusta pula i zerowy rozmiar dają pustą sesję`() {
        assertTrue(buildQuiz("x", 10, emptyList(), Random(1)).questions.isEmpty())
        assertTrue(buildQuiz("x", 0, content.exercises, Random(1)).questions.isEmpty())
        assertTrue(buildQuiz("x", -3, content.exercises, Random(1)).questions.isEmpty())
    }

    @Test
    fun `dwie opcje zostają w kolejności, więcej jest tasowanych z jedną poprawną`() {
        val two = content.exercises.first { it.options.size == 2 }
        repeat(20) { seed -> assertEquals(two.options, prepareOptions(two, Random(seed))) }
        var moved = false
        for (e in content.exercises.filter { it.options.size >= 3 }) {
            val prepared = prepareOptions(e, Random(e.id.length * 31))
            assertEquals(1, prepared.count { it.correct })
            assertEquals(e.options.toSet(), prepared.toSet())
            if (prepared.first() != e.options.first()) moved = true
        }
        assertTrue(moved)
    }

    @Test
    fun `próg jest włączny i odporny na zaokrąglenia`() {
        assertTrue(isPassed(7, 10, 0.7))
        assertFalse(isPassed(6, 10, 0.7))
        assertTrue(isPassed(12, 15, 0.8))
        assertFalse(isPassed(11, 15, 0.8))
        assertTrue(isPassed(3, 3, 1.0))
        assertFalse(isPassed(0, 0, 0.7))
    }

    @Test
    fun `wynik liczy procenty`() {
        assertEquals(67, Score(2, 3).percent)
        assertEquals(0.0, Score(0, 0).ratio)
    }
}
