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
import { toast } from "react-toastify";

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
        console.error("Failed to fetch books:", err);
        toast.error("Failed to fetch books.");
      });
  };

  const fetchAuthors = () => {
    getAuthors()
      .then((res) => setAuthors(res.data))
      .catch((err) => {
        console.error("Failed to fetch authors:", err);
        toast.error("Failed to fetch authors.");
      });
  };

  const fetchPublishers = () => {
    getPublishers()
      .then((res) => setPublishers(res.data))
      .catch((err) => {
        console.error("Failed to fetch publishers:", err);
        toast.error("Failed to fetch publishers.");
      });
  };

  const fetchCategories = () => {
    getCategories()
      .then((res) => setCategories(res.data))
      .catch((err) => {
        console.error("Failed to fetch categories:", err);
        toast.error("Failed to fetch categories.");
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
        toast.success(
          editId ? "Book updated successfully." : "Book added successfully."
        );
      })
      .catch((err) => {
        console.error("Operation failed:", err);
        toast.error("Failed to save the book.");
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
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    deleteBook(id)
      .then(() => {
        fetchBooks();
        toast.success("Book deleted successfully.");
      })
      .catch((err) => {
        console.error("Delete error:", err);
        toast.error("Failed to delete the book.");
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
      <h2>📚 Books</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-2">
          <label>Book Name:</label>
          <input
            type="text"
            name="name"
            value={newBook.name}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-2">
          <label>Publication Year:</label>
          <input
            type="number"
            name="publicationYear"
            value={newBook.publicationYear}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-2">
          <label>Stock:</label>
          <input
            type="number"
            name="stock"
            value={newBook.stock}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-2">
          <label>Author:</label>
          <select
            name="authorId"
            value={newBook.authorId}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">Select author</option>
            {authors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-2">
          <label>Publisher:</label>
          <select
            name="publisherId"
            value={newBook.publisherId}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">Select publisher</option>
            {publishers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-2">
          <label>Category:</label>
          <select
            name="categoryId"
            value={newBook.categoryId}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-success">
          {editId ? "Update Book" : "Add Book"}
        </button>
      </form>

      <ul className="list-group">
        {books.map((book) => (
          <li key={book.id} className="list-group-item">
            <strong>{book.name}</strong> – {book.publicationYear} – Stock:{" "}
            {book.stock}
            <div className="text-muted small">
              Author: {book.author?.name} | Publisher: {book.publisher?.name} |
              Category: {book.categories?.[0]?.name}
            </div>
            <div className="mt-2">
              <button
                className="btn btn-warning btn-sm me-2"
                onClick={() => handleEdit(book)}
              >
                Edit
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(book.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Books;
