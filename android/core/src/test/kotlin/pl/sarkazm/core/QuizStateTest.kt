package pl.sarkazm.core

import kotlin.random.Random
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertNull
import kotlin.test.assertSame
import kotlin.test.assertTrue

class QuizStateTest {
    private val content = ContentLoader.loadBundled()
    private val session = buildQuiz("czym-jest", 10, content.exercisesFor("czym-jest"), Random(3))

    private fun QuizState.correctIndex() = current!!.options.indexOfFirst { it.correct }
    private fun QuizState.wrongIndex() = current!!.options.indexOfFirst { !it.correct }

    @Test
    fun `wszystkie poprawne odpowiedzi kończą quiz kompletem`() {
        var s = QuizState(session)
        repeat(session.questions.size) { s = s.choose(s.correctIndex()).next() }
        assertTrue(s.finished)
        assertNull(s.current)
        assertEquals(Score(10, 10), s.score)
    }

    @Test
    fun `dalej bez odpowiedzi nic nie robi`() {
        val s = QuizState(session)
        assertSame(s, s.next())
    }

    @Test
    fun `drugi wybór w tym samym pytaniu jest ignorowany`() {
        val s = QuizState(session)
        val first = s.choose(s.wrongIndex())
        val second = first.choose(first.correctIndex())
        assertSame(first, second)
        assertEquals(1, second.answers.size)
        assertFalse(second.answers.single().correct)
    }

    @Test
    fun `wybór spoza zakresu jest ignorowany`() {
        val s = QuizState(session)
        assertSame(s, s.choose(-1))
        assertSame(s, s.choose(99))
    }

    @Test
    fun `po odpowiedzi znany jest wybrany feedback, a kolejne pytanie zaczyna się czyste`() {
        val s = QuizState(session).choose(0)
        assertEquals(s.current!!.options[0], s.chosenOption)
        val n = s.next()
        assertEquals(1, n.index)
        assertNull(n.chosen)
        assertFalse(n.isAnswered)
    }

    @Test
    fun `pusta sesja nie ma bieżącego pytania i nie przyjmuje akcji`() {
        val s = QuizState(QuizSession("x", emptyList()))
        assertNull(s.current)
        assertSame(s, s.choose(0))
        assertSame(s, s.next())
    }

    @Test
    fun `po zakończeniu akcje nic nie zmieniają`() {
        var s = QuizState(session)
        repeat(session.questions.size) { s = s.choose(s.correctIndex()).next() }
        assertSame(s, s.choose(0))
        assertSame(s, s.next())
    }
}
