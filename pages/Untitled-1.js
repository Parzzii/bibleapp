import { useState, useEffect } from "react";

export default function HomePage() {
  const [book, setBook] = useState("Genesis");
  const [verse, setVerse] = useState(null);
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
      .catch(() =>
        setVerse({
          text: "could not load",
          reference: "",
          translation: "",
        })
      );
  }, []);

  return (
    <div>
      {verse === null ? (
        <p>Loading...</p>
      ) : (
        <>
          <p>{verse.text}</p>
          <p>{verse.reference}</p>
          <p>{verse.translation}</p>
        </>
      )}
    </div>
  );
}
