package pl.sarkazm

import android.content.Context
import androidx.compose.ui.test.assertCountEquals
import androidx.compose.ui.test.assertIsEnabled
import androidx.compose.ui.test.assertIsNotEnabled
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.compose.ui.test.onAllNodesWithText
import androidx.compose.ui.test.onNodeWithContentDescription
import androidx.compose.ui.test.onNodeWithTag
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.onRoot
import androidx.compose.ui.test.printToString
import androidx.compose.ui.test.performClick
import androidx.compose.ui.test.performScrollTo
import androidx.lifecycle.ViewModelProvider
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Before
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config
import pl.sarkazm.core.ProgressCodec
import pl.sarkazm.data.SharedPrefsProgressStore
import pl.sarkazm.ui.AppViewModel

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [35])
class MainFlowTest {
    @get:Rule
    val compose = createAndroidComposeRule<MainActivity>()

    /**
     * Robolectric potrafi przenieść zapisany postęp do kolejnego testu w tym samym procesie.
     * Zerujemy go tą samą ścieżką co przycisk „Wyzeruj postęp”, więc test zawsze startuje od zera.
     */
    @Before
    fun startFromScratch() {
        compose.runOnUiThread { vm.resetProgress() }
        compose.waitForIdle()
    }

    private val vm: AppViewModel get() = ViewModelProvider(compose.activity)[AppViewModel::class.java]

    private fun storedProgressJson(): String? =
        compose.activity.getSharedPreferences(SharedPrefsProgressStore.PREFS_NAME, Context.MODE_PRIVATE)
            .getString(SharedPrefsProgressStore.KEY, null)

    private fun click(text: String) = withTreeOnFailure {
        compose.onNodeWithText(text).performScrollTo().performClick()
    }

    /** Przy porażce dołącza do komunikatu drzewo semantyczne ekranu, żeby było widać, co faktycznie pokazano. */
    private fun <T> withTreeOnFailure(block: () -> T): T = try {
        block()
    } catch (e: AssertionError) {
        throw AssertionError(e.message + "\n\nEkran:\n" + compose.onRoot().printToString(maxDepth = 30), e)
    }

    /** Odpowiada na wszystkie pytania; poprawnie albo celowo źle. */
    private fun answerAll(correctly: Boolean) {
        val total = vm.quiz.value!!.state.total
        repeat(total) { i ->
            val options = vm.quiz.value!!.state.current!!.options
            val index = options.indexOfFirst { it.correct == correctly }
            compose.onNodeWithText(if (i == total - 1) "Zobacz wynik" else "Dalej").assertIsNotEnabled()
            compose.onNodeWithTag("option-$index").performScrollTo().performClick()
            compose.onNodeWithTag("option-$index").assertIsNotEnabled()
            click(if (i == total - 1) "Zobacz wynik" else "Dalej")
        }
    }

    @Test
    fun naStarcieDostepnaJestTylkoPierwszaLekcja() {
        compose.onNodeWithText("1. Czym jest sarkazm").assertExists()
        withTreeOnFailure {
            compose.onNodeWithText("0/6").assertExists()
            compose.onAllNodesWithText("🔒 Zablokowane").assertCountEquals(5)
            compose.onNodeWithText("Zacznij").assertIsEnabled()
        }
    }

    @Test
    fun zaliczenieLekcjiOdblokowujeNastepnaIZapisujePostep() {
        click("Zacznij")
        compose.onNodeWithText("Czym jest sarkazm").assertExists()
        click("Przejdź do ćwiczeń (10 pytań)")

        answerAll(correctly = true)

        compose.onNodeWithText("10 / 10").assertExists()
        compose.onNodeWithText("✅ Zaliczone").assertExists()
        compose.onNodeWithText("Następna lekcja: Jak go rozpoznać").assertExists()

        click("Wróć do lekcji")
        compose.onNodeWithText("1/6").assertExists()
        compose.onNodeWithText("✅ Zaliczone: 10/10").assertExists()
        compose.onAllNodesWithText("🔒 Zablokowane").assertCountEquals(4)

        val saved = ProgressCodec.decode(storedProgressJson()).modules["czym-jest"]!!
        assertEquals(10, saved.bestCorrect)
        assertEquals(1, saved.attempts)
    }

    @Test
    fun przyciskNastepnejLekcjiOtwieraJa() {
        click("Zacznij")
        click("Przejdź do ćwiczeń (10 pytań)")
        answerAll(correctly = true)
        click("Następna lekcja: Jak go rozpoznać")
        compose.onNodeWithText("Jak rozpoznać sarkazm").assertExists()
        // Wstecz z nowej lekcji wraca na listę, a nie do starego quizu.
        compose.onNodeWithContentDescription("Wstecz").performClick()
        compose.onNodeWithText("1. Czym jest sarkazm").assertExists()
    }

    @Test
    fun oblanieNieOdblokowujeIPozwalaSprobowacPonownie() {
        click("Zacznij")
        click("Przejdź do ćwiczeń (10 pytań)")
        answerAll(correctly = false)

        compose.onNodeWithText("0 / 10").assertExists()
        compose.onNodeWithText("❌ Niezaliczone (próg: 70%)").assertExists()
        compose.onNodeWithText("Następna lekcja: Jak go rozpoznać").assertDoesNotExist()

        click("Spróbuj ponownie")
        compose.onNodeWithText("1 / 10").assertExists()
        assertEquals(0, vm.quiz.value!!.state.answers.size)

        compose.onNodeWithContentDescription("Wstecz").performClick()
        compose.onNodeWithContentDescription("Wstecz").performClick()
        compose.onAllNodesWithText("🔒 Zablokowane").assertCountEquals(5)
        compose.onNodeWithText("Najlepszy wynik: 0/10, próg 70%").assertExists()
    }

    @Test
    fun resetPostepuPoPotwierdzeniu() {
        click("Zacznij")
        click("Przejdź do ćwiczeń (10 pytań)")
        answerAll(correctly = true)
        click("Wróć do lekcji")

        click("Wyzeruj postęp")
        compose.onNodeWithText("Wyzerować postęp?").assertExists()
        compose.onNodeWithText("Wyzeruj").performClick()

        compose.onNodeWithText("0/6").assertExists()
        compose.onAllNodesWithText("🔒 Zablokowane").assertCountEquals(5)
        assertNull(storedProgressJson())
    }

    @Test
    fun treningLosujeDziesiecPytan() {
        click("Rozpocznij trening")
        compose.onNodeWithText("Trening").assertExists()
        compose.onNodeWithText("1 / 10").assertExists()
    }
}
