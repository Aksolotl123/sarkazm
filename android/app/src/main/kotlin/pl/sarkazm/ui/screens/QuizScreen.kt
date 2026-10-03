package pl.sarkazm.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import pl.sarkazm.R
import pl.sarkazm.core.CourseModule
import pl.sarkazm.core.Option
import pl.sarkazm.core.QuizState
import pl.sarkazm.core.Score
import pl.sarkazm.core.isPassed
import pl.sarkazm.ui.QuizUi
import pl.sarkazm.ui.theme.LocalFeedbackColors

@Composable
fun QuizScreen(
    quiz: QuizUi,
    nextLesson: CourseModule?,
    onChoose: (Int) -> Unit,
    onNext: () -> Unit,
    onRetry: () -> Unit,
    onExit: () -> Unit,
    onNextLesson: (String) -> Unit,
    modifier: Modifier = Modifier,
) {
    val title = when {
        quiz.moduleId == null -> stringResource(R.string.quiz_title_training)
        quiz.isExam -> quiz.title
        else -> stringResource(R.string.quiz_title_lesson, quiz.title)
    }
    val state = quiz.state
    when {
        state.total == 0 -> ScreenColumn(modifier) {
            AppCard {
                Text(title, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                Text(stringResource(R.string.quiz_empty))
                Button(onClick = onExit) { Text(stringResource(R.string.summary_back)) }
            }
        }

        state.finished -> {
            val score = state.score
            val passed = quiz.passThreshold?.let { isPassed(score.correct, score.total, it) }
            SummaryContent(
                title = title,
                score = score,
                passed = passed,
                passThreshold = quiz.passThreshold,
                isExam = quiz.isExam,
                nextLesson = nextLesson.takeIf { passed == true },
                onRetry = onRetry,
                onExit = onExit,
                onNextLesson = onNextLesson,
                modifier = modifier,
            )
        }

        else -> QuestionContent(title, state, onChoose, onNext, modifier)
    }
}

@Composable
private fun QuestionContent(
    title: String,
    state: QuizState,
    onChoose: (Int) -> Unit,
    onNext: () -> Unit,
    modifier: Modifier,
) {
    val question = state.current ?: return
    val exercise = question.exercise
    val feedbackColors = LocalFeedbackColors.current

    ScreenColumn(modifier) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(
                title,
                style = MaterialTheme.typography.titleMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                fontWeight = FontWeight.SemiBold,
                modifier = Modifier.weight(1f),
            )
            Text(
                stringResource(R.string.quiz_counter, state.index + 1, state.total),
                fontWeight = FontWeight.SemiBold,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
        LinearProgressIndicator(
            progress = { (state.index + if (state.isAnswered) 1 else 0).toFloat() / state.total },
            modifier = Modifier.fillMaxWidth(),
            trackColor = MaterialTheme.colorScheme.surfaceVariant,
        )

        AppCard {
            Text(
                exercise.kind.label.uppercase(),
                style = MaterialTheme.typography.labelSmall,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.sp,
                color = MaterialTheme.colorScheme.primary,
                modifier = Modifier
                    .background(MaterialTheme.colorScheme.primaryContainer, RoundedCornerShape(50))
                    .padding(horizontal = 10.dp, vertical = 3.dp),
            )
            exercise.context?.let { Text(it, color = MaterialTheme.colorScheme.onSurfaceVariant) }
            exercise.quote?.let { QuoteBlock(stringResource(R.string.quiz_quote, it)) }
            Text(
                exercise.question,
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(top = 4.dp),
            )

            question.options.forEachIndexed { i, option ->
                OptionButton(
                    index = i,
                    option = option,
                    answered = state.isAnswered,
                    chosen = state.chosen == i,
                    onClick = { onChoose(i) },
                )
            }

            state.chosenOption?.let { chosen ->
                val ok = chosen.correct
                Text(
                    stringResource(if (ok) R.string.feedback_ok else R.string.feedback_bad, chosen.feedback),
                    color = if (ok) feedbackColors.ok else feedbackColors.bad,
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(if (ok) feedbackColors.okContainer else feedbackColors.badContainer, RoundedCornerShape(12.dp))
                        .padding(12.dp)
                        .semantics { liveRegion = LiveRegionMode.Polite },
                )
            }
        }

        Button(
            onClick = onNext,
            enabled = state.isAnswered,
            modifier = Modifier
                .align(Alignment.End)
                .height(52.dp),
        ) {
            Text(stringResource(if (state.isLast) R.string.quiz_finish else R.string.quiz_next))
        }
    }
}

@Composable
private fun QuoteBlock(text: String) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .height(IntrinsicSize.Min)
            .clip(RoundedCornerShape(topEnd = 12.dp, bottomEnd = 12.dp))
            .background(MaterialTheme.colorScheme.surfaceVariant),
    ) {
        Box(
            Modifier
                .width(3.dp)
                .fillMaxHeight()
                .background(MaterialTheme.colorScheme.primary),
        )
        Text(
            text,
            style = MaterialTheme.typography.titleMedium,
            fontStyle = FontStyle.Italic,
            modifier = Modifier.padding(14.dp),
        )
    }
}

@Composable
private fun OptionButton(index: Int, option: Option, answered: Boolean, chosen: Boolean, onClick: () -> Unit) {
    val feedback = LocalFeedbackColors.current
    val scheme = MaterialTheme.colorScheme
    val (border, container, badge) = when {
        answered && option.correct -> Triple(feedback.ok, feedback.okContainer, feedback.ok)
        answered && chosen -> Triple(feedback.bad, feedback.badContainer, feedback.bad)
        else -> Triple(scheme.outline, scheme.surface, scheme.surfaceVariant)
    }
    val badgeText = if (answered && (option.correct || chosen)) Color.White else scheme.onSurface
    Surface(
        onClick = onClick,
        enabled = !answered,
        shape = RoundedCornerShape(12.dp),
        color = container,
        border = BorderStroke(1.5.dp, border),
        modifier = Modifier
            .fillMaxWidth()
            .heightIn(min = 52.dp)
            .alpha(if (answered && !option.correct && !chosen) 0.55f else 1f)
            .testTag("option-$index"),
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 10.dp),
        ) {
            Box(
                Modifier
                    .size(28.dp)
                    .background(badge, RoundedCornerShape(8.dp)),
                contentAlignment = Alignment.Center,
            ) {
                Text(('A' + index).toString(), fontWeight = FontWeight.Bold, color = badgeText, fontSize = 13.sp)
            }
            Text(option.text, color = scheme.onSurface)
        }
    }
}

@Composable
private fun SummaryContent(
    title: String,
    score: Score,
    passed: Boolean?,
    passThreshold: Double?,
    isExam: Boolean,
    nextLesson: CourseModule?,
    onRetry: () -> Unit,
    onExit: () -> Unit,
    onNextLesson: (String) -> Unit,
    modifier: Modifier,
) {
    val feedback = LocalFeedbackColors.current
    ScreenColumn(modifier) {
        AppCard(Modifier.fillMaxWidth()) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 12.dp),
            ) {
                Text(title, fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.onSurfaceVariant, textAlign = TextAlign.Center)
                Text(
                    stringResource(R.string.summary_score, score.correct, score.total),
                    style = MaterialTheme.typography.displayMedium,
                    fontWeight = FontWeight.Bold,
                )
                Text(stringResource(R.string.summary_percent, score.percent), color = MaterialTheme.colorScheme.onSurfaceVariant)
                if (passed != null && passThreshold != null) {
                    Text(
                        if (passed) stringResource(R.string.summary_passed)
                        else stringResource(R.string.summary_failed, Math.round(passThreshold * 100).toInt()),
                        color = if (passed) feedback.ok else feedback.bad,
                        fontWeight = FontWeight.Bold,
                        style = MaterialTheme.typography.titleMedium,
                    )
                }
                Text(stringResource(commentFor(score, passed, isExam)), textAlign = TextAlign.Center)

                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.padding(top = 12.dp),
                ) {
                    if (nextLesson != null) {
                        Button(onClick = { onNextLesson(nextLesson.id) }) {
                            Text(stringResource(R.string.summary_next_lesson, nextLesson.title), textAlign = TextAlign.Center)
                        }
                        FilledTonalButton(onClick = onRetry) { Text(stringResource(R.string.summary_retry)) }
                    } else {
                        Button(onClick = onRetry) { Text(stringResource(R.string.summary_retry)) }
                    }
                    TextButton(onClick = onExit) { Text(stringResource(R.string.summary_back)) }
                }
            }
        }
    }
}

/** Komentarz do wyniku; ta sama logika co w wersji webowej. */
internal fun commentFor(score: Score, passed: Boolean?, isExam: Boolean): Int {
    val ratio = score.ratio
    return when {
        passed == true && isExam -> R.string.comment_exam_passed
        ratio == 1.0 -> R.string.comment_perfect
        ratio >= 0.9 -> R.string.comment_almost
        passed == true -> R.string.comment_passed
        ratio >= 0.5 -> R.string.comment_close
        ratio > 0.0 -> R.string.comment_low
        else -> R.string.comment_zero
    }
}
