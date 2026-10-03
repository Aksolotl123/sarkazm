package pl.sarkazm.core

import kotlinx.serialization.json.Json

/** Zamiana postępu na tekst i z powrotem. Odczyt nigdy nie rzuca: uszkodzone dane = pusty postęp. */
object ProgressCodec {
    private val json = Json { ignoreUnknownKeys = true }

    fun encode(progress: Progress): String = json.encodeToString(Progress.serializer(), progress)

    fun decode(text: String?): Progress {
        if (text.isNullOrBlank()) return Progress()
        val parsed = try {
            json.decodeFromString(Progress.serializer(), text)
        } catch (e: Exception) {
            // Uszkodzony JSON lub zła struktura: lepiej zacząć od zera niż działać na śmieciach.
            return Progress()
        }
        return if (isValid(parsed)) parsed else Progress()
    }

    private fun isValid(p: Progress): Boolean =
        p.version == 1 && p.modules.values.all { r ->
            r.bestCorrect >= 0 && r.bestTotal >= r.bestCorrect && r.attempts >= 0
        }
}
