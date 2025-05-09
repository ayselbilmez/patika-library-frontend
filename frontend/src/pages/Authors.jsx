import { useEffect, useState } from "react";
import {
  getAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} from "../services/api";

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
        console.error("Yazarlar alınamadı:", err);
        alert("Yazarlar alınamadı.");
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
      alert("Lütfen tüm alanları doldurun.");
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
      })
      .catch((err) => {
        console.error("Yazar kaydı başarısız:", err);
        alert("Yazar eklenemedi/güncellenemedi.");
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
    if (!window.confirm("Bu yazarı silmek istediğinizden emin misiniz?"))
      return;

    deleteAuthor(id)
      .then(() => fetchAuthors())
      .catch((err) => {
        console.error("Silme hatası:", err);
        alert("Yazar silinemedi.");
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
      <h2>✍️ Yazarlar</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-2">
          <label>Adı:</label>
          <input
            type="text"
            name="name"
            value={newAuthor.name}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-2">
          <label>Doğum Tarihi:</label>
          <input
            type="date"
            name="birthDate"
            value={newAuthor.birthDate}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-2">
          <label>Ülke:</label>
          <input
            type="text"
            name="country"
            value={newAuthor.country}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          {editId ? "Yazarı Güncelle" : "Yazar Ekle"}
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
                Düzenle
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(author.id)}
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

export default Authors;
