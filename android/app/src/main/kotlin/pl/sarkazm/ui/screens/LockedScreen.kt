package pl.sarkazm.ui.screens

import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import pl.sarkazm.R

@Composable
fun LockedScreen(onBack: () -> Unit, modifier: Modifier = Modifier) {
    ScreenColumn(modifier) {
        AppCard {
            Text(stringResource(R.string.locked_text))
            Button(onClick = onBack) { Text(stringResource(R.string.locked_back)) }
        }
    }
}
