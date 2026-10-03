package pl.sarkazm.data

import android.content.Context
import pl.sarkazm.core.Progress
import pl.sarkazm.core.ProgressCodec

interface ProgressStore {
    fun load(): Progress
    fun save(progress: Progress)
    fun clear()
}

/** Postęp w SharedPreferences jako JSON (ten sam format co w wersji webowej). */
class SharedPrefsProgressStore(context: Context) : ProgressStore {
    private val prefs = context.applicationContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    override fun load(): Progress = ProgressCodec.decode(prefs.getString(KEY, null))

    // apply() zapisuje asynchronicznie; stan w pamięci jest źródłem prawdy, więc UI nie czeka na dysk.
    override fun save(progress: Progress) {
        prefs.edit().putString(KEY, ProgressCodec.encode(progress)).apply()
    }

    override fun clear() {
        prefs.edit().remove(KEY).apply()
    }

    companion object {
        const val PREFS_NAME = "sarkazm"
        const val KEY = "progress.v1"
    }
}
