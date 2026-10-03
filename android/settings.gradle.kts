pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "sarkazm-android"

// Logika i treść w czystym Kotlinie; osobny build, więc da się go testować bez Android SDK:
//   ./gradlew -p core test
includeBuild("core")
include(":app")
