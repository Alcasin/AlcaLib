import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

import db from "./db.js";
import { addBook } from "./isbnTest.js";
import methodOverride from "method-override";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use(methodOverride("_method"));

// 📌 Home page: book list
app.get("/", async (req, res) => {
  let sort = req.query.sort || "newest";
  let search = req.query.search || "";
  let genre = req.query.genre || "";

  let orderBy = "date_read DESC";
  if (sort === "oldest") orderBy = "date_read ASC";
  else if (sort === "rating") orderBy = "rating DESC";
  else if (sort === "alphabetical") orderBy = "title ASC";

  let query = "SELECT * FROM books";
  let values = [];
  let conditions = [];

  if (search) {
    conditions.push(`LOWER(title) LIKE $${conditions.length + 1}`);
    values.push(`%${search.toLowerCase()}%`);
  }

  if (genre) {
    conditions.push(`genre = $${conditions.length + 1}`);
    values.push(genre);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += ` ORDER BY ${orderBy}`;

  const booksResult = await db.query(query, values);
  const genresResult = await db.query(
    "SELECT DISTINCT genre FROM books WHERE genre IS NOT NULL ORDER BY genre ASC"
  );

  res.render("index", {
    books: booksResult.rows,
    sort,
    search,
    genre,
    genres: genresResult.rows.map((r) => r.genre),
    showSort: true,
  });
});

// 📌 Add new book form
app.get("/add", (req, res) => {
  const error = req.query.error || null;
  res.render("add", { showSort: false, error });
});

// 📌 Add new book handler
app.post("/add", async (req, res) => {
  const { isbn, rating, notes, genre } = req.body;
  const result = await addBook(isbn, rating, notes, genre);

  if (result && result.duplicate) {
    return res.redirect("/add?error=duplicate");
  }

  res.redirect("/");
});

// 📌 Book detail
app.get("/book/:id", async (req, res) => {
  const { id } = req.params;
  const result = await db.query("SELECT * FROM books WHERE id = $1", [id]);

  if (result.rows.length === 0) {
    return res.status(404).send("Book not found");
  }

  res.render("bookDetail", {
    book: result.rows[0],
    showSort: false,
    sort: null,
    search: "",
  });
});

// 📌 Edit book page
app.get("/book/:id/edit", async (req, res) => {
  const { id } = req.params;
  const result = await db.query("SELECT * FROM books WHERE id = $1", [id]);
  const book = result.rows[0];

  res.render("edit", { book, showSort: false });
});

// 📌 Update book
app.put("/book/:id", async (req, res) => {
  const { id } = req.params;
  const { rating, notes } = req.body;

  await db.query("UPDATE books SET rating = $1, notes = $2 WHERE id = $3", [
    rating,
    notes,
    id,
  ]);

  res.redirect("/");
});

// 📌 Delete book
app.delete("/book/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM books WHERE id = $1", [id]);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting book");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
