const BookshelfController = require("../controllers/BookshelfController");

const express = require("express");
const router = express.Router();

// Menyimpan buku baru
router.post("/books", (req, res) => {
  BookshelfController.store(req, res);
});

// Mendapatkan semua buku
router.get("/books", (req, res) => {
  BookshelfController.getAll(req, res);
});

// Mendapatkan detail buku berdasarkan ID
router.get("/books/:bookId", (req, res) => {
  BookshelfController.getBookById(req, res);
});

// Mengubah buku berdasarkan ID
router.put("/books/:bookId", (req, res) => {
  BookshelfController.editBookById(req, res);
});

// Menghapus buku berdasarkan ID
router.delete("/books/:bookId", (req, res) => {
  BookshelfController.deleteBookById(req, res);
});

module.exports = router;