package pl.sarkazm.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import pl.sarkazm.R
import pl.sarkazm.core.CourseModule
import pl.sarkazm.core.Lesson
import pl.sarkazm.core.LessonExample

@Composable
fun LessonScreen(
    module: CourseModule,
    lesson: Lesson,
    onStartQuiz: () -> Unit,
    modifier: Modifier = Modifier,
) {
    ScreenColumn(modifier) {
        EmojiBadge(module.emoji, size = 56.dp)
        Text(
            lesson.title,
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.semantics { heading() },
        )
        Text(lesson.intro, style = MaterialTheme.typography.bodyLarge, color = MaterialTheme.colorScheme.onSurfaceVariant)

        lesson.sections.forEach { section ->
            Text(
                section.heading,
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                modifier = Modifier
                    .padding(top = 8.dp)
                    .semantics { heading() },
            )
            section.paragraphs.forEach { Text(it, style = MaterialTheme.typography.bodyLarge) }
            section.examples.forEach { ExampleBlock(it) }
            section.tip?.let { tip ->
                Text(
                    "💡 $tip",
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(MaterialTheme.colorScheme.primaryContainer, RoundedCornerShape(12.dp))
                        .padding(12.dp),
                    color = MaterialTheme.colorScheme.onPrimaryContainer,
                )
            }
        }

        AppCard(Modifier.padding(top = 8.dp)) {
            Text(stringResource(R.string.lesson_summary), style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            lesson.takeaways.forEach { Text("•  $it") }
        }

        Button(
            onClick = onStartQuiz,
            modifier = Modifier
                .align(Alignment.CenterHorizontally)
                .padding(vertical = 12.dp)
                .height(52.dp),
        ) {
            Text(stringResource(R.string.lesson_start_quiz, module.quizSize))
        }
    }
}

@Composable
private fun ExampleBlock(example: LessonExample) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .height(IntrinsicSize.Min)
            .clip(RoundedCornerShape(topEnd = 12.dp, bottomEnd = 12.dp))
            .background(MaterialTheme.colorScheme.surface),
    ) {
        Box(
            Modifier
                .width(3.dp)
                .fillMaxHeight()
                .background(MaterialTheme.colorScheme.primary),
        )
        Column(Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
            Text(example.text, fontStyle = FontStyle.Italic)
            Text(example.note, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}
