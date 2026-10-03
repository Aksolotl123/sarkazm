package pl.sarkazm.core

import kotlin.random.Random

data class QuizQuestion(
    val exercise: Exercise,
    /** Opcje w kolejności wyświetlania. */
    val options: List<Option>,
)

data class QuizSession(val moduleId: String, val questions: List<QuizQuestion>)

data class Score(val correct: Int, val total: Int) {
    /** correct / total; 0 gdy total = 0. */
    val ratio: Double get() = if (total == 0) 0.0 else correct.toDouble() / total
    val percent: Int get() = Math.round(ratio * 100).toInt()
}

/**
 * Dwie opcje (Sarkazm / Na serio, Tak / Nie) mają stałą kolejność, żeby UI był przewidywalny.
 * Przy trzech i więcej tasujemy, bo w danych poprawna odpowiedź bywa zawsze pierwsza.
 */
fun prepareOptions(exercise: Exercise, random: Random): List<Option> =
    if (exercise.options.size <= 2) exercise.options else exercise.options.shuffled(random)

/** Losuje do [quizSize] pytań z puli bez powtórzeń i przygotowuje kolejność opcji. */
fun buildQuiz(moduleId: String, quizSize: Int, pool: List<Exercise>, random: Random = Random.Default): QuizSession {
    val picked = if (quizSize <= 0) emptyList() else pool.shuffled(random).take(quizSize)
    return QuizSession(moduleId, picked.map { QuizQuestion(it, prepareOptions(it, random)) })
}

/** Porównanie z tolerancją, żeby 7/10 przy progu 0.7 nie przepadło przez zaokrąglenia zmiennoprzecinkowe. */
fun isPassed(correct: Int, total: Int, threshold: Double): Boolean {
    if (total <= 0) return false
    return correct.toDouble() / total + 1e-9 >= threshold
}
