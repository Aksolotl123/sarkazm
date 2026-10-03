package pl.sarkazm

import org.junit.Assert.assertEquals
import org.junit.Test
import pl.sarkazm.core.Score
import pl.sarkazm.ui.screens.commentFor

class SummaryCommentTest {
    @Test
    fun komentarzZalezyOdWynikuIProgu() {
        assertEquals(R.string.comment_exam_passed, commentFor(Score(15, 15), passed = true, isExam = true))
        assertEquals(R.string.comment_perfect, commentFor(Score(10, 10), passed = true, isExam = false))
        assertEquals(R.string.comment_almost, commentFor(Score(9, 10), passed = true, isExam = false))
        assertEquals(R.string.comment_passed, commentFor(Score(7, 10), passed = true, isExam = false))
        assertEquals(R.string.comment_close, commentFor(Score(6, 10), passed = false, isExam = false))
        assertEquals(R.string.comment_low, commentFor(Score(1, 10), passed = false, isExam = false))
        assertEquals(R.string.comment_zero, commentFor(Score(0, 10), passed = false, isExam = false))
        assertEquals(R.string.comment_close, commentFor(Score(5, 10), passed = null, isExam = false))
    }
}
