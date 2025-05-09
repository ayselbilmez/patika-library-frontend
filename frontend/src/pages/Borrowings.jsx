import { useEffect, useState } from "react";
import {
  getBorrowings,
  createBorrowing,
  updateBorrowing,
  deleteBorrowing,
  getBooks,
} from "../services/api";

function Borrowings() {
  const [borrowings, setBorrowings] = useState([]);
  const [books, setBooks] = useState([]);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newBorrowing, setNewBorrowing] = useState({
    borrowerName: "",
    borrowerMail: "",
    borrowingDate: "",
    bookId: "",
  });

  useEffect(() => {
    fetchBorrowings();
    fetchBooks();
  }, []);

  const fetchBorrowings = () => {
    getBorrowings()
      .then((res) => setBorrowings(res.data))
      .catch((err) => {
        console.error("Veriler alınamadı:", err);
        alert("Borrowing verileri alınamadı.");
      });
  };

  const fetchBooks = () => {
    getBooks()
      .then((res) => setBooks(res.data))
      .catch((err) => {
        console.error("Kitaplar alınamadı:", err);
        alert("Kitaplar alınamadı.");
      });
  };

  const handleChange = (e) => {
    setNewBorrowing({
      ...newBorrowing,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = (borrowing) => {
    setEditId(borrowing.id);
    setNewBorrowing({
      borrowerName: borrowing.borrowerName,
      borrowerMail: borrowing.borrowerMail,
      borrowingDate: borrowing.borrowingDate,
      bookId: borrowing.bookForBorrowingRequest?.id,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !newBorrowing.borrowerName.trim() ||
      !newBorrowing.borrowerMail.trim() ||
      !newBorrowing.borrowingDate ||
      !newBorrowing.bookId
    ) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    const selectedBook = books.find(
      (b) => b.id === Number(newBorrowing.bookId)
    );

    if (!selectedBook) {
      alert("Seçilen kitap bulunamadı.");
      return;
    }

    const payload = {
      borrowerName: newBorrowing.borrowerName,
      borrowerMail: newBorrowing.borrowerMail,
      borrowingDate: newBorrowing.borrowingDate,
      bookForBorrowingRequest: {
        id: selectedBook.id,
        name: selectedBook.name,
        publicationYear: selectedBook.publicationYear,
        stock: selectedBook.stock,
      },
    };

    const action = editId
      ? updateBorrowing(editId, payload)
      : createBorrowing(payload);

    action
      .then(() => {
        fetchBorrowings();
        resetForm();
      })
      .catch((err) => {
        console.error("Borrowing kaydedilemedi:", err);
        alert("Borrowing kaydedilemedi.");
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Bu borrowing kaydını silmek istiyor musunuz?")) return;

    deleteBorrowing(id)
      .then(() => fetchBorrowings())
      .catch((err) => {
        console.error("Silme hatası:", err);
        alert("Kayıt silinemedi.");
      });
  };

  const resetForm = () => {
    setEditId(null);
    setNewBorrowing({
      borrowerName: "",
      borrowerMail: "",
      borrowingDate: "",
      bookId: "",
    });
  };

  return (
    <div>
      <h2>📦 Kitap Alma İşlemleri</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-2">
          <label>İsim:</label>
          <input
            type="text"
            name="borrowerName"
            value={newBorrowing.borrowerName}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-2">
          <label>Mail:</label>
          <input
            type="email"
            name="borrowerMail"
            value={newBorrowing.borrowerMail}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-2">
          <label>Alım Tarihi:</label>
          <input
            type="date"
            name="borrowingDate"
            value={newBorrowing.borrowingDate}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-2">
          <label>Kitap Seç:</label>
          <select
            name="bookId"
            value={newBorrowing.bookId}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">Kitap seçin</option>
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-success">
          {editId ? "Güncelle" : "Kitap Ödünç Ver"}
        </button>
      </form>

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="İsimle ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <ul className="list-group">
        {borrowings
          .filter((item) =>
            item.borrowerName.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((item) => (
            <li
              key={item.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{item.borrowerName}</strong> – {item.borrowerMail} (
                {item.borrowingDate})<br />
                Kitap: {item.bookForBorrowingRequest?.name}
              </div>
              <div>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(item)}
                >
                  Düzenle
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(item.id)}
                >
                  Sil
                </button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default Borrowings;
