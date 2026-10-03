package pl.sarkazm.core

data class AnswerRecord(val exerciseId: String, val chosenIndex: Int, val correct: Boolean)

/**
 * Niezmienny stan trwającego quizu. Każda akcja zwraca nowy stan; niedozwolone akcje
 * (drugi wybór, „dalej” bez odpowiedzi) zwracają ten sam stan, więc podwójne kliknięcie niczego nie psuje.
 */
data class QuizState(
    val session: QuizSession,
    val index: Int = 0,
    /** Indeks wybranej opcji w bieżącym pytaniu albo null, gdy jeszcze nie odpowiedziano. */
    val chosen: Int? = null,
    val answers: List<AnswerRecord> = emptyList(),
    val finished: Boolean = false,
) {
    val total: Int get() = session.questions.size
    val current: QuizQuestion? get() = if (finished) null else session.questions.getOrNull(index)
    val isAnswered: Boolean get() = chosen != null
    val isLast: Boolean get() = index == total - 1
    val chosenOption: Option? get() = chosen?.let { current?.options?.getOrNull(it) }
    val score: Score get() = Score(answers.count { it.correct }, answers.size)

    fun choose(optionIndex: Int): QuizState {
        val question = current ?: return this
        if (isAnswered) return this
        val option = question.options.getOrNull(optionIndex) ?: return this
        return copy(
            chosen = optionIndex,
            answers = answers + AnswerRecord(question.exercise.id, optionIndex, option.correct),
        )
    }

    fun next(): QuizState {
        if (current == null || !isAnswered) return this
        return if (isLast) copy(finished = true) else copy(index = index + 1, chosen = null)
    }
}
