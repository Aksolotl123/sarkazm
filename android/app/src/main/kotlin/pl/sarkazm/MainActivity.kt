package pl.sarkazm

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import pl.sarkazm.ui.SarkazmApp
import pl.sarkazm.ui.theme.SarkazmTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        enableEdgeToEdge()
        super.onCreate(savedInstanceState)
        setContent {
            SarkazmTheme {
                SarkazmApp()
            }
        }
    }
}
