import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/api";
import { toast } from "react-toastify";

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
        console.error("Failed to fetch categories:", error);
        toast.error("An error occurred while fetching categories.");
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
      toast.warn("Please fill in all fields.");
      return;
    }

    createCategory({
      ...newCategory,
      id: 0,
    })
      .then(() => {
        fetchCategories();
        setNewCategory({ name: "", description: "" });
        toast.success("Category added successfully!");
      })
      .catch((error) => {
        console.error("Failed to add category:", error);
        toast.error("An error occurred while adding the category.");
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
      toast.warn("No data found to update.");
      return;
    }

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
        toast.success("Category updated successfully!");
      })
      .catch((error) => {
        console.error("Failed to update category:", error);
        toast.error("An error occurred while updating the category.");
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    deleteCategory(id)
      .then(() => {
        fetchCategories();
        toast.success("Category deleted successfully.");
      })
      .catch((error) => {
        console.error("Failed to delete category:", error);
        toast.error("An error occurred while deleting the category.");
      });
  };

  return (
    <div>
      <h2>📁 Categories</h2>

      <form onSubmit={editId ? handleUpdate : handleSubmit} className="mb-4">
        <div className="mb-2">
          <label>Category Name:</label>
          <input
            type="text"
            name="name"
            value={newCategory.name}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="mb-2">
          <label>Description:</label>
          <textarea
            name="description"
            value={newCategory.description}
            onChange={handleChange}
            className="form-control"
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary">
          {editId ? "Update Category" : "Add Category"}
        </button>
      </form>

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by category name..."
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
                  Update
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(category.id)}
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

export default Categories;
