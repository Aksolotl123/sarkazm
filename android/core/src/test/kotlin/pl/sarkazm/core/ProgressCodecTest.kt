package pl.sarkazm.core

import java.time.Instant
import kotlin.test.Test
import kotlin.test.assertEquals

class ProgressCodecTest {
    @Test
    fun `zapis i odczyt zachowują dane`() {
        val p = Progress().record("czym-jest", 8, 10, Instant.parse("2026-10-03T12:00:00Z"))
        assertEquals(p, ProgressCodec.decode(ProgressCodec.encode(p)))
    }

    @Test
    fun `format jest zgodny z wersją webową`() {
        val web = """{"version":1,"modules":{"czym-jest":{"bestCorrect":10,"bestTotal":10,"attempts":2,"lastAt":"2026-09-30T12:00:00.000Z"}}}"""
        assertEquals(ModuleResult(10, 10, 2, "2026-09-30T12:00:00.000Z"), ProgressCodec.decode(web).modules["czym-jest"])
    }

    @Test
    fun `brak danych, śmieci i zła struktura dają pusty postęp`() {
        val empty = Progress()
        listOf(
            null,
            "",
            "   ",
            "{nie json",
            "\"string\"",
            """{"version":2,"modules":{}}""",
            """{"version":1,"modules":[]}""",
            """{"version":1,"modules":{"x":{"bestCorrect":11,"bestTotal":10,"attempts":1,"lastAt":"x"}}}""",
            """{"version":1,"modules":{"x":{"bestCorrect":-1,"bestTotal":10,"attempts":1,"lastAt":"x"}}}""",
            """{"version":1,"modules":{"x":{"bestCorrect":1}}}""",
        ).forEach { assertEquals(empty, ProgressCodec.decode(it), "wejście: $it") }
    }

    @Test
    fun `nadmiarowe pola są ignorowane`() {
        val text = """{"version":1,"junk":true,"modules":{"a":{"bestCorrect":1,"bestTotal":2,"attempts":1,"lastAt":"t","extra":1}}}"""
        assertEquals(ModuleResult(1, 2, 1, "t"), ProgressCodec.decode(text).modules["a"])
    }
}
