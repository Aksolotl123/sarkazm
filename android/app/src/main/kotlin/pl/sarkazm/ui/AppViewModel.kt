package pl.sarkazm.ui

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import pl.sarkazm.core.Content
import pl.sarkazm.core.ContentLoader
import pl.sarkazm.core.ModuleKind
import pl.sarkazm.core.Progress
import pl.sarkazm.core.QuizState
import pl.sarkazm.core.buildQuiz
import pl.sarkazm.core.isUnlocked
import pl.sarkazm.core.record
import pl.sarkazm.core.unlockedLessonIds
import pl.sarkazm.data.ProgressStore
import pl.sarkazm.data.SharedPrefsProgressStore

sealed interface Screen {
    data object Home : Screen
    data class Lesson(val moduleId: String) : Screen
    data class Quiz(val moduleId: String) : Screen
    data object Training : Screen
}

/** Stan trwającego quizu wraz z tym, jak go ocenić. */
data class QuizUi(
    /** null = trening (bez zapisu postępu i bez progu). */
    val moduleId: String?,
    val title: String,
    val passThreshold: Double?,
    val isExam: Boolean,
    val state: QuizState,
)

const val TRAINING_SIZE = 10

class AppViewModel(
    application: Application,
) : AndroidViewModel(application) {
    private val store: ProgressStore = SharedPrefsProgressStore(application)

    /** Treść jest dołączona do aplikacji i sprawdzana testami w CI, więc wczytujemy ją raz. */
    val content: Content = ContentLoader.loadBundled()

    private val _progress = MutableStateFlow(store.load())
    val progress: StateFlow<Progress> = _progress.asStateFlow()

    private val _backStack = MutableStateFlow<List<Screen>>(listOf(Screen.Home))
    val backStack: StateFlow<List<Screen>> = _backStack.asStateFlow()

    private val _quiz = MutableStateFlow<QuizUi?>(null)
    val quiz: StateFlow<QuizUi?> = _quiz.asStateFlow()

    fun isUnlocked(moduleId: String): Boolean = _progress.value.isUnlocked(content.modules, moduleId)

    /** Otwiera ekran nad bieżącym (np. lekcja → ćwiczenia). */
    fun push(screen: Screen) {
        prepare(screen)
        _backStack.update { it + screen }
    }

    /** Otwiera ekran bezpośrednio z poziomu listy lekcji (np. „następna lekcja” z podsumowania). */
    fun openFromHome(screen: Screen) {
        prepare(screen)
        _backStack.value = if (screen == Screen.Home) listOf(Screen.Home) else listOf(Screen.Home, screen)
    }

    /** Zwraca false, gdy nie ma dokąd wrócić (wtedy system zamyka aplikację). */
    fun back(): Boolean {
        val stack = _backStack.value
        if (stack.size <= 1) return false
        _backStack.value = stack.dropLast(1)
        return true
    }

    fun home() = openFromHome(Screen.Home)

    fun choose(optionIndex: Int) {
        _quiz.update { it?.copy(state = it.state.choose(optionIndex)) }
    }

    fun next() {
        val current = _quiz.value ?: return
        val nextState = current.state.next()
        _quiz.value = current.copy(state = nextState)
        // Zapis tylko przy przejściu do wyniku, więc ponowne „dalej” nie liczy próby dwa razy.
        if (!current.state.finished && nextState.finished && current.moduleId != null) {
            val score = nextState.score
            if (score.total > 0) {
                val updated = _progress.value.record(current.moduleId, score.correct, score.total)
                _progress.value = updated
                store.save(updated)
            }
        }
    }

    /** Nowa losowa sesja tego samego quizu. */
    fun retry() {
        when (val top = _backStack.value.lastOrNull()) {
            is Screen.Quiz -> prepare(top)
            Screen.Training -> prepare(Screen.Training)
            else -> Unit
        }
    }

    fun resetProgress() {
        store.clear()
        _progress.value = Progress()
        _quiz.value = null
        _backStack.value = listOf(Screen.Home)
    }

    private fun prepare(screen: Screen) {
        when (screen) {
            is Screen.Quiz -> startModuleQuiz(screen.moduleId)
            Screen.Training -> startTraining()
            else -> Unit
        }
    }

    private fun startModuleQuiz(moduleId: String) {
        val module = content.module(moduleId) ?: return
        val session = buildQuiz(module.id, module.quizSize, content.poolFor(module))
        val isExam = module.kind == ModuleKind.EGZAMIN
        _quiz.value = QuizUi(
            moduleId = module.id,
            title = module.title,
            passThreshold = module.passThreshold,
            isExam = isExam,
            state = QuizState(session),
        )
    }

    private fun startTraining() {
        val ids = _progress.value.unlockedLessonIds(content.modules).toSet()
        val pool = content.exercises.filter { it.moduleId in ids }
        _quiz.value = QuizUi(
            moduleId = null,
            title = "",
            passThreshold = null,
            isExam = false,
            state = QuizState(buildQuiz("trening", TRAINING_SIZE, pool)),
        )
    }
}
