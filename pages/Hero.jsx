import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function BibleApp() {
  const [activeTab, setActiveTab] = useState("home");
  const [darkMode, setDarkMode] = useState(false);
  const [verse, setVerse] = useState(null);
  const [book, setBook] = useState("Genesis");
  const [chapter, setChapter] = useState(1);
  const [bibleText, setBibleText] = useState("");
  const [loading, setLoading] = useState(false);

  const bookChapters = {
    Genesis: 50,
    Exodus: 40,
    Leviticus: 27,
    Numbers: 36,
    Deuteronomy: 34,
    Joshua: 24,
    Judges: 21,
    Ruth: 4,
    "1 Samuel": 31,
    "2 Samuel": 24,
    "1 Kings": 22,
    "2 Kings": 25,
    "1 Chronicles": 29,
    "2 Chronicles": 36,
    Ezra: 10,
    Nehemiah: 13,
    Esther: 10,
    Job: 42,
    Psalms: 150,
    Proverbs: 31,
    Ecclesiastes: 12,
    "Song of Solomon": 8,
    Isaiah: 66,
    Jeremiah: 52,
    Lamentations: 5,
    Ezekiel: 48,
    Daniel: 12,
    Hosea: 14,
    Joel: 3,
    Amos: 9,
    Obadiah: 1,
    Jonah: 4,
    Micah: 7,
    Nahum: 3,
    Habakkuk: 3,
    Zephaniah: 3,
    Haggai: 2,
    Zechariah: 14,
    Malachi: 4,
    Matthew: 28,
    Mark: 16,
    Luke: 24,
    John: 21,
    Acts: 28,
    Romans: 16,
    "1 Corinthians": 16,
    "2 Corinthians": 13,
    Galatians: 6,
    Ephesians: 6,
    Philippians: 4,
    Colossians: 4,
    "1 Thessalonians": 5,
    "2 Thessalonians": 3,
    "1 Timothy": 6,
    "2 Timothy": 4,
    Titus: 3,
    Philemon: 1,
    Hebrews: 13,
    James: 5,
    "1 Peter": 5,
    "2 Peter": 3,
    "1 John": 5,
    "2 John": 1,
    "3 John": 1,
    Jude: 1,
    Revelation: 22,
  };

  const books = Object.keys(bookChapters);

  // Load saved book & chapter once
  useEffect(() => {
    const savedBook = localStorage.getItem("bibleBook");
    const savedChapter = Number(localStorage.getItem("bibleChapter"));
    if (savedBook) setBook(savedBook);
    if (savedChapter) setChapter(savedChapter);

    // Load dark mode preference
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
  }, []);

  // Save book, chapter, and dark mode to localStorage
  useEffect(() => {
    localStorage.setItem("bibleBook", book);
    localStorage.setItem("bibleChapter", chapter);
    localStorage.setItem("darkMode", darkMode);
  }, [book, chapter, darkMode]);

  // Daily Verse
  useEffect(() => {
    fetch("https://beta.ourmanna.com/api/v1/get/?format=json")
      .then((res) => res.json())
      .then((data) =>
        setVerse({
          text: data.verse.details.text,
          reference: data.verse.details.reference,
          translation: "KJV",
        })
      )
      .catch(() => setVerse({ text: "Could not load verse", reference: "", translation: "" }));
  }, []);

  // Apply dark mode class to html
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  const fetchBible = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://bible-api.com/${book}+${chapter}`);
      const data = await res.json();
      setBibleText(data.text);
    } catch {
      setBibleText("Could not fetch passage");
    }
    setLoading(false);
  };

  const continueReading = () => {
    setActiveTab("bible");
    fetchBible();
  };

  return (
    <div className={`min-h-screen ${darkMode ? "dark bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}>
      {/* Tabs + Dark Mode */}
      <div className="flex justify-center gap-4 p-4 bg-gray-200 dark:bg-gray-800 shadow-md">
        {["home", "bible", "prayer"].map((tab) => (
          <button key={tab} className={`px-4 py-2 rounded transition ${activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-300 dark:bg-gray-700"}`} onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
        <span>{darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}</span>
        <div onClick={() => setDarkMode(!darkMode)} className={`w-12 h-6 rounded-full cursor-pointer flex items-center p-1 ${darkMode ? "bg-black" : "bg-gray-300"}`}>
          <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${darkMode ? "translate-x-6" : "translate-x-0"}`} />
        </div>
      </div>

      {/* Content */}
      <div>
        {/* Home */}
        {activeTab === "home" && (
          <section className={`min-h-screen flex flex-col justify-center items-center text-center px-6 ${darkMode ? "bg-gradient-to-r from-gray-800 via-gray-900 to-black text-gray-100" : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white"}`}>
            <h1 className="text-5xl font-bold mb-4">Daily Verse & Prayer Journal</h1>
            <p className="text-lg mb-6 max-w-xl mx-auto">Start your day with inspiration and record your prayers in one place.</p>

            {/* Daily Verse */}
            {verse && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                className="p-6 bg-white/20 backdrop-blur-lg border border-white/30 rounded-lg shadow-lg max-w-xl mx-auto hover:shadow-2xl transition-all duration-500"
              >
                <p className="text-lg">{verse.text}</p>
                <p className="flex items-center gap-2 text-sm mt-2">
                  {verse.reference} ({verse.translation})
                </p>
              </motion.div>
            )}

            {/* Recently Read */}
            <section className="mt-6 w-full max-w-md mx-auto">
              <h2 className="text-2xl font-semibold mb-2 text-white">📖 Recently Read</h2>
              <div onClick={continueReading} className="cursor-pointer bg-white/20 backdrop-blur-lg border border-white/30 rounded-lg p-4 shadow-md hover:shadow-xl transition">
                <p className="text-white text-lg">
                  Last read:{" "}
                  <span className="font-bold">
                    {book} {chapter}
                  </span>
                </p>
                <p className="text-sm text-gray-200">Click to continue reading</p>
              </div>
            </section>
          </section>
        )}

        {/* Bible Tab */}
        {activeTab === "bible" && (
          <section className={`min-h-screen px-6 py-12 ${darkMode ? "bg-gradient-to-r from-gray-800 via-gray-900 to-black" : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"}`}>
            <h1 className="text-4xl font-bold mb-6 text-center text-indigo-700 dark:text-indigo-300">Bible Reader</h1>

            {/* Input Controls */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center mb-6 items-center">
              <select
                value={book}
                onChange={(e) => {
                  setBook(e.target.value);
                  setChapter(1);
                }}
                className="p-3 border rounded shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                {books.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>

              <select value={chapter} onChange={(e) => setChapter(Number(e.target.value))} className="p-3 border rounded shadow w-24 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white">
                {Array.from({ length: bookChapters[book] }, (_, i) => i + 1).map((ch) => (
                  <option key={ch} value={ch}>
                    {ch}
                  </option>
                ))}
              </select>

              <button onClick={fetchBible} className="px-6 py-3 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700 transition">
                Read
              </button>
            </div>

            {/* Bible Text */}
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl text-gray-800 dark:text-gray-100 leading-loose text-lg overflow-y-auto max-h-[65vh] border border-gray-200 dark:border-gray-700">
              {loading ? (
                <p className="text-center text-gray-500 dark:text-gray-400">Loading passage...</p>
              ) : bibleText ? (
                <div className="space-y-2">
                  {bibleText.split("\n").map((verse, idx) => (
                    <div key={idx} className="flex items-start gap-3 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-md px-2 py-1 transition">
                      <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 min-w-[2ch]">{idx + 1}</span>
                      <p className="flex-1">{verse}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400">Select a book and chapter to start reading 📖</p>
              )}
            </div>
          </section>
        )}

        {/* Prayer */}
        {activeTab === "prayer" && (
          <section className="p-6 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-center dark:text-indigo-200">Prayer Journal</h1>
            <p className="text-center dark:text-gray-300">Here you can add and view your prayers.</p>
          </section>
        )}
      </div>
    </div>
  );
}
