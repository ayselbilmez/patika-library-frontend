import { useEffect, useState } from "react";
import {
  getBorrowings,
  createBorrowing,
  updateBorrowing,
  deleteBorrowing,
  getBooks,
} from "../services/api";
import { toast } from "react-toastify";

function Borrowings() {
  const [borrowings, setBorrowings] = useState([]);
  const [books, setBooks] = useState([]);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newBorrowing, setNewBorrowing] = useState({
    borrowerName: "",
    borrowerMail: "",
    borrowingDate: "",
    returnDate: "",
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
        console.error("Failed to fetch borrowings:", err);
        toast.error("An error occurred while fetching borrowings.");
      });
  };

  const fetchBooks = () => {
    getBooks()
      .then((res) => setBooks(res.data))
      .catch((err) => {
        console.error("Failed to fetch books:", err);
        toast.error("An error occurred while fetching books.");
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
      returnDate: borrowing.returnDate || "",
      bookId: borrowing.bookForBorrowingRequest?.id || "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { borrowerName, borrowerMail, borrowingDate, returnDate, bookId } =
      newBorrowing;

    if (
      !borrowerName.trim() ||
      !borrowerMail.trim() ||
      !borrowingDate ||
      !returnDate ||
      !bookId
    ) {
      toast.warn("Please fill in all fields.");
      return;
    }

    const selectedBook = books.find((b) => b.id === Number(bookId));

    if (!selectedBook) {
      toast.error("Selected book not found.");
      return;
    }

    const payload = {
      borrowerName,
      borrowerMail,
      borrowingDate,
      returnDate,
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
        toast.success(
          editId
            ? "Borrowing record updated successfully!"
            : "Book borrowed successfully!"
        );
      })
      .catch((err) => {
        console.error("Failed to save borrowing:", err);
        toast.error("An error occurred while saving the borrowing.");
      });
  };

  const handleDelete = (id) => {
    if (
      !window.confirm("Are you sure you want to delete this borrowing record?")
    )
      return;

    deleteBorrowing(id)
      .then(() => {
        fetchBorrowings();
        toast.success("Borrowing record deleted successfully.");
      })
      .catch((err) => {
        console.error("Deletion error:", err);
        toast.error("Failed to delete the record.");
      });
  };

  const resetForm = () => {
    setEditId(null);
    setNewBorrowing({
      borrowerName: "",
      borrowerMail: "",
      borrowingDate: "",
      returnDate: "",
      bookId: "",
    });
  };

  return (
    <div>
      <h2>📦 Borrowing Transactions</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-2">
          <label>Name:</label>
          <input
            type="text"
            name="borrowerName"
            value={newBorrowing.borrowerName}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-2">
          <label>Email:</label>
          <input
            type="email"
            name="borrowerMail"
            value={newBorrowing.borrowerMail}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-2">
          <label>Borrowing Date:</label>
          <input
            type="date"
            name="borrowingDate"
            value={newBorrowing.borrowingDate}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-2">
          <label>Return Date:</label>
          <input
            type="date"
            name="returnDate"
            value={newBorrowing.returnDate}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-2">
          <label>Select Book:</label>
          <select
            name="bookId"
            value={newBorrowing.bookId}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">Select a book</option>
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-success">
          {editId ? "Update" : "Borrow Book"}
        </button>
      </form>

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name..."
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
                Book: {item.bookForBorrowingRequest?.name}
                <br />
                Return Date: {item.returnDate}
              </div>
              <div>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(item.id)}
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

export default Borrowings;
