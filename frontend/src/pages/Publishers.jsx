import { useEffect, useState } from "react";
import {
  getPublishers,
  createPublisher,
  updatePublisher,
  deletePublisher,
} from "../services/api";

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
        alert("An error occurred while fetching publishers.");
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
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    createPublisher({
      ...newPublisher,
      id: 0,
    })
      .then(() => {
        fetchPublishers();
        setNewPublisher({ name: "", address: "", establishmentYear: "" });
      })
      .catch((error) => {
        console.error("Failed to add publisher:", error);
        alert("An error occurred while adding publisher.");
      });
  };

  const handleEdit = (publisher) => {
    setEditId(publisher.id);
    setCurrentPublisher(publisher); // mevcut veriyi sakla
    setNewPublisher({ ...publisher }); // formu doldur
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    // Eski değerleri koruyarak boşluklara düşmeyelim
    const updatedPublisher = {
      id: editId,
      name:
        newPublisher.name.trim() !== ""
          ? newPublisher.name
          : currentPublisher.name,
      address:
        newPublisher.address.trim() !== ""
          ? newPublisher.address
          : currentPublisher.address,
      establishmentYear:
        newPublisher.establishmentYear !== ""
          ? Number(newPublisher.establishmentYear)
          : currentPublisher.establishmentYear,
    };

    updatePublisher(editId, updatedPublisher)
      .then(() => {
        setEditId(null);
        setCurrentPublisher(null);
        setNewPublisher({ name: "", address: "", establishmentYear: "" });
        fetchPublishers();
      })
      .catch((error) => {
        console.error("Güncelleme başarısız:", error);
        alert("Yayınevi güncellenemedi.");
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Bu yayınevini silmek istediğinizden emin misiniz?"))
      return;

    deletePublisher(id)
      .then(() => {
        fetchPublishers();
      })
      .catch((error) => {
        console.error("Silme işlemi başarısız:", error);
        alert("Yayınevi silinemedi.");
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
            value={newPublisher.name}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="mb-2">
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={newPublisher.address}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="mb-2">
          <label>Establishment Year:</label>
          <input
            type="number"
            name="establishmentYear"
            value={newPublisher.establishmentYear}
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
