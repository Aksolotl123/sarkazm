package pl.sarkazm.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color

/** Kolory spoza schematu Material: poprawna i błędna odpowiedź. */
@Immutable
data class FeedbackColors(
    val ok: Color,
    val okContainer: Color,
    val bad: Color,
    val badContainer: Color,
)

private val LightScheme = lightColorScheme(
    primary = Color(0xFF6D28D9),
    onPrimary = Color.White,
    primaryContainer = Color(0xFFEDE4FF),
    onPrimaryContainer = Color(0xFF1F1B2E),
    secondaryContainer = Color(0xFFEDE4FF),
    onSecondaryContainer = Color(0xFF1F1B2E),
    background = Color(0xFFF6F3EE),
    onBackground = Color(0xFF1F1B2E),
    surface = Color(0xFFFFFFFF),
    onSurface = Color(0xFF1F1B2E),
    surfaceVariant = Color(0xFFF0EBE3),
    onSurfaceVariant = Color(0xFF625C74),
    surfaceContainerLow = Color(0xFFFFFFFF),
    surfaceContainer = Color(0xFFFFFFFF),
    surfaceContainerHigh = Color(0xFFF0EBE3),
    outline = Color(0xFFE2DCD2),
    outlineVariant = Color(0xFFE2DCD2),
    error = Color(0xFFB91C1C),
)

private val DarkScheme = darkColorScheme(
    primary = Color(0xFFA78BFA),
    onPrimary = Color(0xFF1A1626),
    primaryContainer = Color(0xFF2F2650),
    onPrimaryContainer = Color(0xFFF2EEF9),
    secondaryContainer = Color(0xFF2F2650),
    onSecondaryContainer = Color(0xFFF2EEF9),
    background = Color(0xFF14121C),
    onBackground = Color(0xFFF2EEF9),
    surface = Color(0xFF1F1B2E),
    onSurface = Color(0xFFF2EEF9),
    surfaceVariant = Color(0xFF2A2540),
    onSurfaceVariant = Color(0xFFAAA3BD),
    surfaceContainerLow = Color(0xFF1F1B2E),
    surfaceContainer = Color(0xFF1F1B2E),
    surfaceContainerHigh = Color(0xFF2A2540),
    outline = Color(0xFF3A3452),
    outlineVariant = Color(0xFF3A3452),
    error = Color(0xFFF87171),
)

private val LightFeedback = FeedbackColors(
    ok = Color(0xFF15803D),
    okContainer = Color(0xFFDCFCE7),
    bad = Color(0xFFB91C1C),
    badContainer = Color(0xFFFEE2E2),
)

private val DarkFeedback = FeedbackColors(
    ok = Color(0xFF4ADE80),
    okContainer = Color(0xFF14351F),
    bad = Color(0xFFF87171),
    badContainer = Color(0xFF3B1A1A),
)

val LocalFeedbackColors = staticCompositionLocalOf { LightFeedback }

@Composable
fun SarkazmTheme(darkTheme: Boolean = isSystemInDarkTheme(), content: @Composable () -> Unit) {
    CompositionLocalProvider(LocalFeedbackColors provides if (darkTheme) DarkFeedback else LightFeedback) {
        MaterialTheme(
            colorScheme = if (darkTheme) DarkScheme else LightScheme,
            content = content,
        )
    }
}
