# 📚 AlcaLib

AlcaLib is a personal **book notes application** where you can save the books you read, write notes, rate them, and browse your collection.  
It fetches book details from the [Open Library API](https://openlibrary.org/dev/docs/api/covers) and stores them in a PostgreSQL database.  
The project was inspired by Derek Sivers’ [book notes website](https://sive.rs/book).

---

## 🚀 Features
- 📖 **Add books** → Enter an ISBN and the app automatically fetches book details (title, author, cover, genre, etc.).  
- 📝 **Take notes** → Attach personal notes to each book.  
- ⭐ **Rate books** → Rate books with 1–5 stars.  
- ✏️ **Edit books** → Update rating and notes anytime.  
- 🗑️ **Delete books** → Permanently remove books from the database.  
- 🔍 **Search & Sort** →  
  - Search by title  
  - Filter by genre  
  - Sort by newest, oldest, alphabetical, or rating  

---

## 🛠️ Tech Stack
- **Backend:** [Node.js](https://nodejs.org/) + [Express.js](https://expressjs.com/)  
- **Frontend:** [EJS](https://ejs.co/), HTML, CSS  
- **Database:** [PostgreSQL](https://www.postgresql.org/) + [pg](https://node-postgres.com/)  
- **API:** [Open Library](https://openlibrary.org/dev/docs/api/covers)  
- **HTTP Client:** [Axios](https://axios-http.com/)  

---

## 📂 Project Structure
```
project-root/
│── views/             # EJS templates (index, add, edit, detail, partials)
│── public/            # CSS, static assets
│── index.js           # Express.js main server
│── isbnTest.js        # Open Library API integration (addBook function)
│── db.js              # PostgreSQL connection (pg.Pool)
│── package.json       # Dependencies
```

---

## ⚙️ Setup

1. **Clone the project**
   ```bash
   git clone https://github.com/username/alcalib.git
   cd alcalib
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Prepare PostgreSQL database**
   ```sql
   CREATE DATABASE booknotes;

   \c booknotes

   CREATE TABLE books (
     id SERIAL PRIMARY KEY,
     title TEXT NOT NULL,
     author TEXT,
     isbn VARCHAR(20) UNIQUE,
     cover_url TEXT,
     number_of_pages INT,
     publish_date TEXT,
     language TEXT,
     rating INT,
     notes TEXT,
     genre TEXT,
     date_read TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

4. **Run the server**
   ```bash
   npm run dev
   ```
   or
   ```bash
   nodemon index.js
   ```

5. **Open the app**
   ```
   http://localhost:3000
   ```

---

## 📸 Screenshots
*(Add your own screenshots here)*  
Examples:  
- Book list page  
- Add book form  
- Book detail page  

---

## 🐛 Error Handling
- If the API cannot find a book, the app returns a user-friendly message.  
- When trying to add a duplicate ISBN, the book will **not** be added and a red warning message is displayed on the "Add Book" page:  
  > ⚠️ This ISBN already exists in your library.

