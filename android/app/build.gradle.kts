plugins {
    // AGP 9 ma wbudowaną obsługę Kotlina, więc osobny plugin kotlin-android nie jest potrzebny.
    alias(libs.plugins.android.application)
    alias(libs.plugins.compose)
}

android {
    namespace = "pl.sarkazm"
    compileSdk = 36

    defaultConfig {
        applicationId = "pl.sarkazm"
        minSdk = 26
        targetSdk = 36
        versionCode = 1
        versionName = "1.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    buildFeatures {
        compose = true
    }

    testOptions {
        unitTests {
            // Robolectric potrzebuje zasobów aplikacji (strings.xml) w testach JVM.
            isIncludeAndroidResources = true
        }
    }
}

dependencies {
    // Logika i treść kursu z dołączonego buildu ../core.
    implementation("pl.sarkazm:core")

    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.ui.tooling.preview)
    implementation(libs.androidx.activity.compose)
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.androidx.lifecycle.runtime.compose)
    debugImplementation(libs.androidx.compose.ui.tooling)
    debugImplementation(libs.androidx.compose.ui.test.manifest)

    testImplementation(libs.junit4)
    testImplementation(libs.robolectric)
    testImplementation(platform(libs.androidx.compose.bom))
    testImplementation(libs.androidx.compose.ui.test.junit4)
}
