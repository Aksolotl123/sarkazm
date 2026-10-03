package pl.sarkazm.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.res.pluralStringResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import pl.sarkazm.R
import pl.sarkazm.core.Content
import pl.sarkazm.core.CourseModule
import pl.sarkazm.core.ModuleKind
import pl.sarkazm.core.ModuleResult
import pl.sarkazm.core.ModuleStatus
import pl.sarkazm.core.Progress
import pl.sarkazm.core.completedCount
import pl.sarkazm.core.status
import pl.sarkazm.core.unlockedLessonIds
import pl.sarkazm.ui.Screen
import pl.sarkazm.ui.theme.LocalFeedbackColors

@Composable
fun HomeScreen(
    content: Content,
    progress: Progress,
    onOpen: (Screen) -> Unit,
    onReset: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val modules = content.modules
    val done = progress.completedCount(modules)
    val examDone = modules.any { it.kind == ModuleKind.EGZAMIN && progress.status(modules, it) == ModuleStatus.COMPLETED }
    val trainingLessons = progress.unlockedLessonIds(modules).size
    var confirmReset by rememberSaveable { mutableStateOf(false) }

    ScreenColumn(modifier) {
        Text(stringResource(R.string.home_title), style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold)
        Text(stringResource(R.string.home_lead), color = MaterialTheme.colorScheme.onSurfaceVariant)

        val progressDescription = stringResource(R.string.home_progress_description, done, modules.size)
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            modifier = Modifier.semantics(mergeDescendants = true) { contentDescription = progressDescription },
        ) {
            LinearProgressIndicator(
                progress = { done.toFloat() / modules.size },
                modifier = Modifier.weight(1f),
                trackColor = MaterialTheme.colorScheme.surfaceVariant,
            )
            Text(stringResource(R.string.home_progress, done, modules.size), fontWeight = FontWeight.SemiBold)
        }

        if (examDone) {
            val colors = LocalFeedbackColors.current
            Text(
                stringResource(R.string.home_diploma),
                color = colors.ok,
                fontWeight = FontWeight.SemiBold,
                modifier = Modifier
                    .fillMaxWidth()
                    .background(colors.okContainer, RoundedCornerShape(12.dp))
                    .padding(12.dp),
            )
        }

        modules.forEachIndexed { index, module ->
            ModuleCard(
                index = index,
                module = module,
                status = progress.status(modules, module),
                result = progress.modules[module.id],
                onOpen = onOpen,
            )
        }

        AppCard {
            Text(stringResource(R.string.training_title), style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            Text(pluralStringResource(R.plurals.training_description, trainingLessons, trainingLessons))
            FilledTonalButton(onClick = { onOpen(Screen.Training) }) { Text(stringResource(R.string.training_start)) }
        }

        if (progress.modules.isNotEmpty()) {
            TextButton(
                onClick = { confirmReset = true },
                modifier = Modifier.align(Alignment.CenterHorizontally),
            ) {
                Text(stringResource(R.string.reset_progress), color = MaterialTheme.colorScheme.error)
            }
        }

        Text(
            stringResource(R.string.footer),
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 16.dp),
        )
    }

    if (confirmReset) {
        AlertDialog(
            onDismissRequest = { confirmReset = false },
            title = { Text(stringResource(R.string.reset_confirm_title)) },
            text = { Text(stringResource(R.string.reset_confirm_text)) },
            confirmButton = {
                TextButton(onClick = {
                    confirmReset = false
                    onReset()
                }) { Text(stringResource(R.string.reset_confirm_yes), color = MaterialTheme.colorScheme.error) }
            },
            dismissButton = { TextButton(onClick = { confirmReset = false }) { Text(stringResource(R.string.cancel)) } },
        )
    }
}

@Composable
private fun ModuleCard(
    index: Int,
    module: CourseModule,
    status: ModuleStatus,
    result: ModuleResult?,
    onOpen: (Screen) -> Unit,
) {
    val locked = status == ModuleStatus.LOCKED
    val isExam = module.kind == ModuleKind.EGZAMIN
    val threshold = Math.round(module.passThreshold * 100).toInt()
    val feedback = LocalFeedbackColors.current
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .alpha(if (locked) 0.6f else 1f),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = if (locked) 0.dp else 1.dp),
        border = when (status) {
            ModuleStatus.COMPLETED -> BorderStroke(1.dp, feedback.ok.copy(alpha = 0.5f))
            else -> BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
        },
    ) {
        Row(Modifier.padding(16.dp), horizontalArrangement = Arrangement.spacedBy(14.dp)) {
            EmojiBadge(module.emoji)
            Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                Text(
                    stringResource(R.string.module_title, index + 1, module.title),
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                )
                Text(module.subtitle, color = MaterialTheme.colorScheme.onSurfaceVariant)
                val meta = when {
                    locked -> stringResource(R.string.module_locked)
                    status == ModuleStatus.COMPLETED && result != null ->
                        stringResource(R.string.module_meta_done, result.bestCorrect, result.bestTotal)
                    result != null -> stringResource(R.string.module_meta_best, result.bestCorrect, result.bestTotal, threshold)
                    else -> stringResource(R.string.module_meta_new, module.quizSize, threshold)
                }
                Text(meta, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                if (!locked) {
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.padding(top = 6.dp)) {
                        val target = if (isExam) Screen.Quiz(module.id) else Screen.Lesson(module.id)
                        val label = when {
                            status == ModuleStatus.COMPLETED -> R.string.action_repeat
                            isExam -> R.string.action_take_exam
                            result != null -> R.string.action_try_again
                            else -> R.string.action_start
                        }
                        if (status == ModuleStatus.COMPLETED) {
                            FilledTonalButton(onClick = { onOpen(target) }) { Text(stringResource(label)) }
                        } else {
                            Button(onClick = { onOpen(target) }) { Text(stringResource(label)) }
                        }
                        if (!isExam && result != null) {
                            TextButton(onClick = { onOpen(Screen.Quiz(module.id)) }) {
                                Text(stringResource(R.string.action_exercises_only))
                            }
                        }
                    }
                }
            }
        }
    }
}
