import { useEffect, useState } from "react";
import {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
  getAuthors,
  getPublishers,
  getCategories,
} from "../services/api";

function Books() {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);
  const [newBook, setNewBook] = useState({
    name: "",
    publicationYear: "",
    stock: "",
    authorId: "",
    publisherId: "",
    categoryId: "",
  });

  useEffect(() => {
    fetchBooks();
    fetchAuthors();
    fetchPublishers();
    fetchCategories();
  }, []);

  const fetchBooks = () => {
    getBooks()
      .then((res) => setBooks(res.data))
      .catch((err) => {
        console.error("Kitaplar alınamadı:", err);
        alert("Kitaplar alınamadı.");
      });
  };

  const fetchAuthors = () => {
    getAuthors()
      .then((res) => setAuthors(res.data))
      .catch((err) => {
        console.error("Yazarlar alınamadı:", err);
        alert("Yazarlar alınamadı.");
      });
  };

  const fetchPublishers = () => {
    getPublishers()
      .then((res) => setPublishers(res.data))
      .catch((err) => {
        console.error("Yayınevleri alınamadı:", err);
        alert("Yayınevleri alınamadı.");
      });
  };

  const fetchCategories = () => {
    getCategories()
      .then((res) => setCategories(res.data))
      .catch((err) => {
        console.error("Kategoriler alınamadı:", err);
        alert("Kategoriler alınamadı.");
      });
  };

  const handleChange = (e) => {
    setNewBook({
      ...newBook,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      id: editId || 0,
      name: newBook.name,
      publicationYear: Number(newBook.publicationYear),
      stock: Number(newBook.stock),
      author: { id: Number(newBook.authorId) },
      publisher: { id: Number(newBook.publisherId) },
      categories: [{ id: Number(newBook.categoryId) }],
    };

    const action = editId ? updateBook(editId, payload) : createBook(payload);

    action
      .then(() => {
        fetchBooks();
        resetForm();
      })
      .catch((err) => {
        console.error("İşlem başarısız:", err);
        alert("Kitap kaydedilemedi.");
      });
  };

  const handleEdit = (book) => {
    setEditId(book.id);
    setNewBook({
      name: book.name,
      publicationYear: book.publicationYear,
      stock: book.stock,
      authorId: book.author?.id,
      publisherId: book.publisher?.id,
      categoryId: book.categories?.[0]?.id,
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Bu kitabı silmek istediğinizden emin misiniz?"))
      return;

    deleteBook(id)
      .then(() => fetchBooks())
      .catch((err) => {
        console.error("Silme hatası:", err);
        alert("Kitap silinemedi.");
      });
  };

  const resetForm = () => {
    setEditId(null);
    setNewBook({
      name: "",
      publicationYear: "",
      stock: "",
      authorId: "",
      publisherId: "",
      categoryId: "",
    });
  };

  return (
    <div>
      <h2>📚 Kitaplar</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-2">
          <label>Kitap Adı:</label>
          <input
            type="text"
            name="name"
            value={newBook.name}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-2">
          <label>Yayın Yılı:</label>
          <input
            type="number"
            name="publicationYear"
            value={newBook.publicationYear}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-2">
          <label>Stok:</label>
          <input
            type="number"
            name="stock"
            value={newBook.stock}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-2">
          <label>Yazar:</label>
          <select
            name="authorId"
            value={newBook.authorId}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">Yazar seçin</option>
            {authors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-2">
          <label>Yayınevi:</label>
          <select
            name="publisherId"
            value={newBook.publisherId}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">Yayınevi seçin</option>
            {publishers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-2">
          <label>Kategori:</label>
          <select
            name="categoryId"
            value={newBook.categoryId}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">Kategori seçin</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-success">
          {editId ? "Kitabı Güncelle" : "Kitap Ekle"}
        </button>
      </form>

      <ul className="list-group">
        {books.map((book) => (
          <li key={book.id} className="list-group-item">
            <strong>{book.name}</strong> – {book.publicationYear} – Stok:{" "}
            {book.stock}
            <div className="text-muted small">
              Yazar: {book.author?.name} | Yayınevi: {book.publisher?.name} |{" "}
              Kategori: {book.categories?.[0]?.name}
            </div>
            <div className="mt-2">
              <button
                className="btn btn-warning btn-sm me-2"
                onClick={() => handleEdit(book)}
              >
                Düzenle
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(book.id)}
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

export default Books;
