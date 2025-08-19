export async function fetchVerse() {
  try {
    const res = await fetch("https://beta.ourmanna.com/api/v1/get/?format=json");
    if (!res.ok) throw new Error("Failed to fetch verse");
    const data = await res.json();
    return {
      reference: data.verse.details.reference,
      text: data.verse.details.text,
      translation: "KJV", // default translation
    };
  } catch (err) {
    console.error(err);
    return { reference: "", text: "Could not load verse", translation: "" };
  }
}
