package pl.sarkazm.core

import java.time.Instant
import kotlinx.serialization.Serializable

@Serializable
data class ModuleResult(
    val bestCorrect: Int,
    val bestTotal: Int,
    val attempts: Int,
    /** ISO 8601, UTC. */
    val lastAt: String,
)

/** Format zgodny z wersją webową (klucz sarkazm.progress.v1). */
@Serializable
data class Progress(
    val version: Int = 1,
    val modules: Map<String, ModuleResult> = emptyMap(),
)

enum class ModuleStatus { LOCKED, AVAILABLE, COMPLETED }

/** Zapisuje wynik quizu. Lepszy wynik (wyższy ułamek) nadpisuje poprzedni; liczba prób zawsze rośnie. */
fun Progress.record(moduleId: String, correct: Int, total: Int, now: Instant = Instant.now()): Progress {
    require(total > 0 && correct in 0..total) { "Nieprawidłowy wynik quizu: $correct/$total dla modułu \"$moduleId\"" }
    val prev = modules[moduleId]
    val prevRatio = if (prev != null && prev.bestTotal > 0) prev.bestCorrect.toDouble() / prev.bestTotal else -1.0
    val isBetter = correct.toDouble() / total > prevRatio
    val next = ModuleResult(
        bestCorrect = if (isBetter) correct else prev!!.bestCorrect,
        bestTotal = if (isBetter) total else prev!!.bestTotal,
        attempts = (prev?.attempts ?: 0) + 1,
        lastAt = now.toString(),
    )
    return copy(modules = modules + (moduleId to next))
}

fun Progress.isCompleted(module: CourseModule): Boolean {
    val r = modules[module.id] ?: return false
    return isPassed(r.bestCorrect, r.bestTotal, module.passThreshold)
}

/** Pierwsza lekcja zawsze dostępna; kolejna wymaga zaliczenia poprzedniej; egzamin wymaga wszystkich lekcji. */
fun Progress.isUnlocked(modules: List<CourseModule>, moduleId: String): Boolean {
    val index = modules.indexOfFirst { it.id == moduleId }
    if (index < 0) return false
    val module = modules[index]
    if (module.kind == ModuleKind.EGZAMIN) {
        return modules.filter { it.kind == ModuleKind.LEKCJA }.all { isCompleted(it) }
    }
    if (index == 0) return true
    return isCompleted(modules[index - 1])
}

fun Progress.status(modules: List<CourseModule>, module: CourseModule): ModuleStatus = when {
    isCompleted(module) -> ModuleStatus.COMPLETED
    isUnlocked(modules, module.id) -> ModuleStatus.AVAILABLE
    else -> ModuleStatus.LOCKED
}

/** Lekcje, z których trening może losować pytania. */
fun Progress.unlockedLessonIds(modules: List<CourseModule>): List<String> =
    modules.filter { it.kind == ModuleKind.LEKCJA && isUnlocked(modules, it.id) }.map { it.id }

fun Progress.completedCount(modules: List<CourseModule>): Int = modules.count { isCompleted(it) }
