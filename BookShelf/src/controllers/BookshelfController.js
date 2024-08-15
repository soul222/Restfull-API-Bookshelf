const { nanoid } = require("nanoid");
let bookshelf = require("../models/bookshelf");

class BookshelfController {
  async store(req, res) {
    const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    } = req.body;

    if (name === undefined) {
      return res.status(400).json({
        status: "fail",
        message: "Gagal menambahkan buku. Mohon isi nama buku",
      });
    }

    if (readPage > pageCount) {
      return res.status(400).json({
        status: "fail",
        message:
          "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
      });
    }

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;

    const newBook = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      insertedAt,
      updatedAt,
    };

    bookshelf.push(newBook);

    const isSuccess = bookshelf.filter((b) => b.id === id).length > 0;

    if (isSuccess) {
      return res.status(201).json({
        status: "success",
        message: "Buku berhasil ditambahkan",
        data: {
          bookId: id,
        },
      });
    } else {
      return res.status(500).json({
        status: "fail",
        message: "Buku gagal ditambahkan",
      });
    }
  }

  async getAll(req, res) {
    const { name, reading, finished } = req.query;
  
    let filteredBooks = [...bookshelf];
  
    if (name) {
      filteredBooks = filteredBooks.filter((book) =>
        book.name.toLowerCase().includes(name.toLowerCase())
      );
    }
  
    if (reading !== undefined) {
      filteredBooks = filteredBooks.filter(
        (book) => book.reading === (reading === '1')
      );
    }
  
    if (finished !== undefined) {
      filteredBooks = filteredBooks.filter(
        (book) => book.finished === (finished === '1')
      );
    }
  
    const books = filteredBooks.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));
  
    return res.status(200).json({
      status: 'success',
      data: {
        books,
      },
    });
  }
  
  async getBookById(req, res) {
    const { bookId } = req.params;
    const book = bookshelf.find((b) => b.id === bookId);

    if (book !== undefined) {
      return res.status(200).json({
        status: "success",
        data: {
          book,
        },
      });
    } else {
      return res.status(404).json({
        status: "fail",
        message: "Buku tidak ditemukan",
      });
    }
  }

  async editBookById(req, res) {
    const { bookId } = req.params;
    const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    } = req.body;

    const index = bookshelf.findIndex((b) => b.id === bookId);

    if (index !== -1) {
      if (name === undefined) {
        return res.status(400).json({
          status: "fail",
          message: "Gagal memperbarui buku. Mohon isi nama buku",
        });
      }

      if (readPage > pageCount) {
        return res.status(400).json({
          status: "fail",
          message:
            "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
        });
      }

      const updatedAt = new Date().toISOString();
      const finished = pageCount === readPage;

      bookshelf[index] = {
        ...bookshelf[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        updatedAt,
      };

      return res.status(200).json({
        status: "success",
        message: "Buku berhasil diperbarui",
      });
    }

    return res.status(404).json({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan",
    });
  }

  async deleteBookById(req, res) {
    const { bookId } = req.params;
    const index = bookshelf.findIndex((b) => b.id === bookId);
    if (index !== -1) {
      bookshelf.splice(index, 1);
      return res.status(200).json({
        status: "success",
        message: "Buku berhasil dihapus",
      });
    } else {
      return res.status(404).json({
        status: "fail",
        message: "Buku gagal dihapus. Id tidak ditemukan",
      });
    }
  }
}

const object = new BookshelfController();
module.exports = object;