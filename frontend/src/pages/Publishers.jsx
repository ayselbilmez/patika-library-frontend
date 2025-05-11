import { useEffect, useState } from "react";
import {
  getPublishers,
  createPublisher,
  updatePublisher,
  deletePublisher,
} from "../services/api";
import { toast } from "react-toastify";

function Publishers() {
  const [publishers, setPublishers] = useState([]);
  const [newPublisher, setNewPublisher] = useState({
    name: "",
    address: "",
    establishmentYear: "",
  });
  const [editId, setEditId] = useState(null);
  const [currentPublisher, setCurrentPublisher] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPublishers();
  }, []);

  const fetchPublishers = () => {
    getPublishers()
      .then((response) => setPublishers(response.data))
      .catch((error) => {
        console.error("Failed to fetch publishers:", error);
        toast.error("Failed to fetch publishers.");
      });
  };

  const handleChange = (e) => {
    setNewPublisher({
      ...newPublisher,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !newPublisher.name.trim() ||
      !newPublisher.address.trim() ||
      !newPublisher.establishmentYear
    ) {
      toast.warn("Lütfen tüm alanları doldurun.");
      return;
    }

    createPublisher({
      ...newPublisher,
      id: 0,
    })
      .then(() => {
        fetchPublishers();
        setNewPublisher({ name: "", address: "", establishmentYear: "" });
        toast.success("Yayınevi başarıyla eklendi!");
      })
      .catch((error) => {
        console.error("Failed to add publisher:", error);
        toast.error("Yayınevi eklenirken bir hata oluştu.");
      });
  };

  const handleEdit = (publisher) => {
    setEditId(publisher.id);
    setCurrentPublisher(publisher);
    setNewPublisher({ ...publisher });
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    if (!currentPublisher) {
      toast.error("Güncellenecek veri bulunamadı.");
      return;
    }

    const updatedPublisher = {
      id: editId,
      name:
        newPublisher.name.trim() !== "" &&
        newPublisher.name.trim() !== currentPublisher.name
          ? newPublisher.name.trim()
          : currentPublisher.name,

      address:
        newPublisher.address.trim() !== ""
          ? newPublisher.address.trim()
          : currentPublisher.address,

      establishmentYear:
        newPublisher.establishmentYear !== "" &&
        Number(newPublisher.establishmentYear) !==
          currentPublisher.establishmentYear
          ? Number(newPublisher.establishmentYear)
          : currentPublisher.establishmentYear,
    };

    if (isNaN(updatedPublisher.establishmentYear)) {
      toast.warn("Yıl geçersiz.");
      return;
    }

    updatePublisher(editId, updatedPublisher)
      .then(() => {
        setEditId(null);
        setCurrentPublisher(null);
        setNewPublisher({ name: "", address: "", establishmentYear: "" });
        fetchPublishers();
        toast.success("Yayınevi başarıyla güncellendi!");
      })
      .catch((error) => {
        console.error("Güncelleme başarısız:", error);
        toast.error("Yayınevi güncellenemedi.");
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Bu yayınevini silmek istediğinizden emin misiniz?"))
      return;

    deletePublisher(id)
      .then(() => {
        fetchPublishers();
        toast.success("Yayınevi başarıyla silindi.");
      })
      .catch((error) => {
        console.error("Silme işlemi başarısız:", error);
        toast.error("Yayınevi silinemedi.");
      });
  };

  return (
    <div>
      <h2>🏢 Publishers</h2>

      <form onSubmit={editId ? handleUpdate : handleSubmit} className="mb-4">
        <div className="mb-2">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={
              newPublisher.name !== ""
                ? newPublisher.name
                : currentPublisher?.name || ""
            }
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="mb-2">
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={
              newPublisher.address !== ""
                ? newPublisher.address
                : currentPublisher?.address || ""
            }
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="mb-2">
          <label>Establishment Year:</label>
          <input
            type="number"
            name="establishmentYear"
            value={
              newPublisher.establishmentYear !== ""
                ? newPublisher.establishmentYear
                : currentPublisher?.establishmentYear || ""
            }
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          {editId ? "Yayınevini Güncelle" : "Yayınevi Ekle"}
        </button>
      </form>

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Yayınevi adına göre ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <ul className="list-group">
        {publishers
          .filter(
            (p) =>
              p.name !== "string" &&
              p.address !== "string" &&
              p.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((publisher) => (
            <li
              key={publisher.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{publisher.name}</strong> – {publisher.address} (
                {publisher.establishmentYear})
              </div>
              <div>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(publisher)}
                >
                  Düzenle
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(publisher.id)}
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

export default Publishers;
