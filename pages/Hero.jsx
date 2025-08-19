import { useState, useEffect } from "react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("home");
  const [verse, setVerse] = useState(null);

  // Bible reader states
  const [book, setBook] = useState("Genesis");
  const [chapter, setChapter] = useState(1);
  const [bibleText, setBibleText] = useState("");
  const [loading, setLoading] = useState(false);

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

  const fetchBible = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://bible-api.com/${book} ${chapter}`);
      const data = await res.json();
      setBibleText(data.text);
    } catch {
      setBibleText("Could not fetch passage");
    }
    setLoading(false);
  };

  const books = ["Genesis", "Exodus", "Leviticus", "John", "Matthew"]; // start small

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100">
      {/* Tabs */}
      <div className="flex justify-center gap-4 p-4 bg-gray-200 dark:bg-gray-800">
        {["home", "bible", "prayer"].map((tab) => (
          <button key={tab} className={`px-4 py-2 rounded ${activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-300 dark:bg-gray-700"}`} onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {/* Home */}
        {activeTab === "home" && (
          <section className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-6 text-center">
            <h1 className="text-5xl font-bold mb-4">Daily Verse & Prayer Journal</h1>
            <p className="text-lg mb-6 max-w-xl mx-auto">Start your day with inspiration and record your prayers in one place.</p>
            <a href="#verse" className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded shadow-lg hover:bg-gray-100 transition">
              See Today’s Verse
            </a>

            <section id="verse" className="mt-10">
              {!verse ? (
                <p>Loading verse...</p>
              ) : (
                <>
                  <p className="text-lg">{verse.text}</p>
                  <p className="mt-2 text-sm">
                    {verse.reference} ({verse.translation})
                  </p>
                </>
              )}
            </section>
          </section>
        )}

        {/* Bible */}
        {activeTab === "bible" && (
          <section className="min-h-screen px-6 py-12 bg-gradient-to-b from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
            <h1 className="text-4xl font-bold mb-6 text-center text-indigo-700 dark:text-indigo-300">Bible Reader</h1>

            {/* Input controls */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center mb-6 items-center">
              <select value={book} onChange={(e) => setBook(e.target.value)} className="p-3 border rounded shadow focus:outline-none focus:ring-2 focus:ring-indigo-500">
                {books.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>

              <input type="number" value={chapter} onChange={(e) => setChapter(e.target.value)} className="p-3 border rounded shadow w-24 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500" min="1" />

              <button onClick={fetchBible} className="px-6 py-3 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700 transition">
                Fetch
              </button>
            </div>

            {/* Bible text display */}
            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-gray-800 dark:text-gray-100 leading-relaxed text-lg whitespace-pre-wrap">
              {loading ? <p className="text-center text-gray-500 dark:text-gray-400">Loading passage...</p> : bibleText ? bibleText : <p className="text-center text-gray-500 dark:text-gray-400">Select a book and chapter to start reading</p>}
            </div>
          </section>
        )}

        {/* Prayer */}
        {activeTab === "prayer" && (
          <section className="p-6 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-center">Prayer Journal</h1>
            <p className="text-center">Here you can add and view your prayers.</p>
          </section>
        )}
      </div>
    </div>
  );
}
