import { useEffect, useState } from "react";
import {
  getAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} from "../services/api";
import { toast } from "react-toastify";

function Authors() {
  const [authors, setAuthors] = useState([]);
  const [editId, setEditId] = useState(null);
  const [newAuthor, setNewAuthor] = useState({
    name: "",
    birthDate: "",
    country: "",
  });

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = () => {
    getAuthors()
      .then((res) => setAuthors(res.data))
      .catch((err) => {
        console.error("Failed to fetch authors:", err);
        toast.error("An error occurred while fetching authors.");
      });
  };

  const handleChange = (e) => {
    setNewAuthor({
      ...newAuthor,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !newAuthor.name.trim() ||
      !newAuthor.birthDate ||
      !newAuthor.country.trim()
    ) {
      toast.warn("Please fill in all fields.");
      return;
    }

    const payload = {
      id: editId || 0,
      name: newAuthor.name,
      birthDate: newAuthor.birthDate,
      country: newAuthor.country,
    };

    const action = editId
      ? updateAuthor(editId, payload)
      : createAuthor(payload);

    action
      .then(() => {
        fetchAuthors();
        resetForm();
        toast.success(
          editId ? "Author updated successfully." : "Author added successfully."
        );
      })
      .catch((err) => {
        console.error("Failed to save author:", err);
        toast.error("An error occurred while saving the author.");
      });
  };

  const handleEdit = (author) => {
    setEditId(author.id);
    setNewAuthor({
      name: author.name,
      birthDate: author.birthDate,
      country: author.country,
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this author?")) return;

    deleteAuthor(id)
      .then(() => {
        fetchAuthors();
        toast.success("Author deleted successfully.");
      })
      .catch((err) => {
        console.error("Failed to delete author:", err);
        toast.error("An error occurred while deleting the author.");
      });
  };

  const resetForm = () => {
    setEditId(null);
    setNewAuthor({
      name: "",
      birthDate: "",
      country: "",
    });
  };

  return (
    <div>
      <h2>✍️ Authors</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-2">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={newAuthor.name}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-2">
          <label>Birth Date:</label>
          <input
            type="date"
            name="birthDate"
            value={newAuthor.birthDate}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-2">
          <label>Country:</label>
          <input
            type="text"
            name="country"
            value={newAuthor.country}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          {editId ? "Update Author" : "Add Author"}
        </button>
      </form>

      <ul className="list-group">
        {authors.map((author) => (
          <li
            key={author.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{author.name}</strong> – {author.country} (
              {author.birthDate})
            </div>
            <div>
              <button
                className="btn btn-warning btn-sm me-2"
                onClick={() => handleEdit(author)}
              >
                Edit
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(author.id)}
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

export default Authors;
