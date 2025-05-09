import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/api";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  });
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    getCategories()
      .then((response) => setCategories(response.data))
      .catch((error) => {
        console.error("Kategoriler alınamadı:", error);
        alert("Kategori listesi alınırken bir hata oluştu.");
      });
  };

  const handleChange = (e) => {
    setNewCategory({
      ...newCategory,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newCategory.name.trim() || !newCategory.description.trim()) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    createCategory({
      ...newCategory,
      id: 0,
    })
      .then(() => {
        fetchCategories();
        setNewCategory({ name: "", description: "" });
      })
      .catch((error) => {
        console.error("Kategori eklenemedi:", error);
        alert("Kategori eklenirken bir hata oluştu.");
      });
  };

  const handleEdit = (category) => {
    setEditId(category.id);
    setNewCategory({
      name: category.name,
      description: category.description,
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    const currentCategory = categories.find((c) => c.id === editId);

    if (!currentCategory) {
      alert("Kategori bulunamadı.");
      return;
    }

    // Final name ve description'ı eski veriyle doldur
    const finalName = newCategory.name.trim() || currentCategory.name;
    const finalDescription =
      newCategory.description.trim() || currentCategory.description;

    const formData = {
      id: editId,
      name: finalName,
      description: finalDescription,
    };

    updateCategory(editId, formData)
      .then(() => {
        setEditId(null);
        setNewCategory({ name: "", description: "" });
        fetchCategories();
      })
      .catch((error) => {
        console.error("Güncelleme başarısız:", error);
        alert("Kategori güncellenemedi.");
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Bu kategoriyi silmek istediğinizden emin misiniz?"))
      return;

    deleteCategory(id)
      .then(() => {
        fetchCategories();
      })
      .catch((error) => {
        console.error("Silme işlemi başarısız:", error);
        alert("Kategori silinemedi.");
      });
  };

  return (
    <div>
      <h2>📁 Kategoriler</h2>

      <form onSubmit={editId ? handleUpdate : handleSubmit} className="mb-4">
        <div className="mb-2">
          <label>Kategori Adı:</label>
          <input
            type="text"
            name="name"
            value={newCategory.name}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="mb-2">
          <label>Açıklama:</label>
          <textarea
            name="description"
            value={newCategory.description}
            onChange={handleChange}
            className="form-control"
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary">
          {editId ? "Kategori Güncelle" : "Kategori Ekle"}
        </button>
      </form>

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Kategori adına göre ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <ul className="list-group">
        {categories
          .filter(
            (c) =>
              c.name !== "string" &&
              c.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((category) => (
            <li
              key={category.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{category.name}</strong>
                <div className="text-muted small">{category.description}</div>
              </div>
              <div>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(category)}
                >
                  Düzenle
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(category.id)}
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

export default Categories;
