import axios from "axios";
import db from "./db.js";

export async function addBook(isbn, rating, notes, genreInput) {
  try {
    const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`;
    const response = await axios.get(url);

    const bookData = response.data[`ISBN:${isbn}`];
    if (!bookData) {
      console.log("Book not found!");
      return;
    }

    const title = bookData.title || "Unknown";
    const author = bookData.authors ? bookData.authors[0].name : "Unknown";
    const number_of_pages = bookData.number_of_pages || null;
    const publish_date = bookData.publish_date || null;
    const language = bookData.languages
      ? bookData.languages[0].key.replace("/languages/", "")
      : null;
    const cover_url = bookData.cover ? bookData.cover.large : null;

    const genreFromApi =
      bookData.subjects && bookData.subjects.length > 0
        ? bookData.subjects[0].name || bookData.subjects[0]
        : null;

    const finalGenre = genreFromApi || genreInput || null;

    const query = `
      INSERT INTO books (title, author, isbn, cover_url, number_of_pages, publish_date, language, rating, notes, genre) 
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      ON CONFLICT (isbn) DO NOTHING RETURNING *;
    `;

    const values = [
      title,
      author,
      isbn,
      cover_url,
      number_of_pages,
      publish_date,
      language,
      rating,
      notes,
      finalGenre,
    ];

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      console.log("⚠️ Book with this ISBN already exists in DB.");
      return { duplicate: true };
    } else {
      console.log("✅ Added to DB:", result.rows[0]);
      return { duplicate: false };
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
}
