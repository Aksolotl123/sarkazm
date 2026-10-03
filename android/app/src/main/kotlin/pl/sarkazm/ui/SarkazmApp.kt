package pl.sarkazm.ui

import androidx.activity.compose.BackHandler
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import pl.sarkazm.R
import pl.sarkazm.core.isUnlocked
import pl.sarkazm.ui.screens.HomeScreen
import pl.sarkazm.ui.screens.LessonScreen
import pl.sarkazm.ui.screens.LockedScreen
import pl.sarkazm.ui.screens.QuizScreen

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SarkazmApp(vm: AppViewModel = viewModel()) {
    val stack by vm.backStack.collectAsStateWithLifecycle()
    val progress by vm.progress.collectAsStateWithLifecycle()
    val quiz by vm.quiz.collectAsStateWithLifecycle()
    val screen = stack.last()
    val canGoBack = stack.size > 1

    BackHandler(enabled = canGoBack) { vm.back() }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(stringResource(R.string.app_name)) },
                navigationIcon = {
                    if (canGoBack) {
                        IconButton(onClick = { vm.back() }) {
                            Icon(painterResource(R.drawable.ic_arrow_back), contentDescription = stringResource(R.string.back))
                        }
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.background),
            )
        },
        containerColor = MaterialTheme.colorScheme.background,
    ) { padding ->
        val modifier = Modifier.padding(padding)
        val content = vm.content
        when (screen) {
            Screen.Home -> HomeScreen(
                content = content,
                progress = progress,
                onOpen = { vm.push(it) },
                onReset = { vm.resetProgress() },
                modifier = modifier,
            )

            is Screen.Lesson -> {
                val module = content.module(screen.moduleId)
                val lesson = content.lesson(screen.moduleId)
                if (module == null || lesson == null || !progress.isUnlocked(content.modules, module.id)) {
                    LockedScreen(onBack = { vm.home() }, modifier = modifier)
                } else {
                    LessonScreen(
                        module = module,
                        lesson = lesson,
                        onStartQuiz = { vm.push(Screen.Quiz(module.id)) },
                        modifier = modifier,
                    )
                }
            }

            is Screen.Quiz, Screen.Training -> {
                val moduleId = (screen as? Screen.Quiz)?.moduleId
                val locked = moduleId != null && !progress.isUnlocked(content.modules, moduleId)
                val current = quiz
                if (locked || current == null) {
                    LockedScreen(onBack = { vm.home() }, modifier = modifier)
                } else {
                    val next = moduleId?.let { content.nextLessonAfter(it) }
                    QuizScreen(
                        quiz = current,
                        nextLesson = next,
                        onChoose = vm::choose,
                        onNext = vm::next,
                        onRetry = vm::retry,
                        onExit = { vm.home() },
                        onNextLesson = { id -> vm.openFromHome(Screen.Lesson(id)) },
                        modifier = modifier,
                    )
                }
            }
        }
    }
}
