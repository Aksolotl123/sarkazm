package pl.sarkazm.core

import java.time.Instant
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertFalse
import kotlin.test.assertTrue

class ProgressTest {
    private val modules = ContentLoader.loadBundled().modules
    private val now = Instant.parse("2026-10-03T12:00:00Z")
    private val first = modules[0]
    private val second = modules[1]
    private val exam = modules.single { it.kind == ModuleKind.EGZAMIN }
    private val lessonIds = modules.filter { it.kind == ModuleKind.LEKCJA }.map { it.id }

    private fun passAll(p: Progress, ids: List<String>) = ids.fold(p) { acc, id -> acc.record(id, 10, 10, now) }

    @Test
    fun `pierwszy wynik jest zapisany z datą w UTC`() {
        val p = Progress().record(first.id, 6, 10, now)
        assertEquals(ModuleResult(6, 10, 1, "2026-10-03T12:00:00Z"), p.modules[first.id])
    }

    @Test
    fun `gorszy wynik nie nadpisuje lepszego, ale liczy próbę`() {
        val p = Progress().record(first.id, 9, 10, now).record(first.id, 4, 10, now)
        assertEquals(9, p.modules[first.id]!!.bestCorrect)
        assertEquals(2, p.modules[first.id]!!.attempts)
    }

    @Test
    fun `lepszy ułamek nadpisuje, nawet przy mniejszej liczbie pytań`() {
        val p = Progress().record(exam.id, 10, 15, now).record(exam.id, 9, 10, now)
        assertEquals(9, p.modules[exam.id]!!.bestCorrect)
        assertEquals(10, p.modules[exam.id]!!.bestTotal)
    }

    @Test
    fun `nieprawidłowe wyniki są odrzucane`() {
        assertFailsWith<IllegalArgumentException> { Progress().record(first.id, 1, 0, now) }
        assertFailsWith<IllegalArgumentException> { Progress().record(first.id, 11, 10, now) }
        assertFailsWith<IllegalArgumentException> { Progress().record(first.id, -1, 10, now) }
    }

    @Test
    fun `na starcie dostępna jest tylko pierwsza lekcja`() {
        val p = Progress()
        assertEquals(ModuleStatus.AVAILABLE, p.status(modules, first))
        modules.drop(1).forEach { assertEquals(ModuleStatus.LOCKED, p.status(modules, it), it.id) }
        assertEquals(listOf(first.id), p.unlockedLessonIds(modules))
        assertEquals(0, p.completedCount(modules))
    }

    @Test
    fun `zaliczenie na progu odblokowuje następną lekcję, wynik pod progiem nie`() {
        val atThreshold = Progress().record(first.id, 7, 10, now)
        assertEquals(ModuleStatus.COMPLETED, atThreshold.status(modules, first))
        assertEquals(ModuleStatus.AVAILABLE, atThreshold.status(modules, second))
        val below = Progress().record(first.id, 6, 10, now)
        assertEquals(ModuleStatus.LOCKED, below.status(modules, second))
    }

    @Test
    fun `egzamin wymaga wszystkich lekcji`() {
        assertFalse(passAll(Progress(), lessonIds.dropLast(1)).isUnlocked(modules, exam.id))
        val all = passAll(Progress(), lessonIds)
        assertTrue(all.isUnlocked(modules, exam.id))
        assertEquals(lessonIds.size, all.completedCount(modules))
        assertEquals(modules.size, all.record(exam.id, 15, 15, now).completedCount(modules))
    }

    @Test
    fun `nieznany moduł jest zablokowany`() {
        assertFalse(Progress().isUnlocked(modules, "nie-ma"))
    }
}
