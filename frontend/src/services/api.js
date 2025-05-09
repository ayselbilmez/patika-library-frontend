import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/publishers";

// Yayımcıları listele (GET)
export const getPublishers = () => {
  return axios.get(API_URL);
};

// Yayımcıyı id getir (GETBYID)
export const getPublisherById = (id) => {
  return axios.get(`http://localhost:8080/api/v1/publishers/${id}`);
};

// Yayımcı ekle (POST)
export const createPublisher = (publisher) => {
  return axios.post(API_URL, publisher);
};

//Yayımcı güncelle (PUT)
export const updatePublisher = (id, publisher) => {
  return axios.put(`http://localhost:8080/api/v1/publishers/${id}`, publisher);
};

//Yayimci sil (DELETE)
export const deletePublisher = (id) => {
  return axios.delete(`http://localhost:8080/api/v1/publishers/${id}`);
};

// Kategorileri listele (GET)
export const getCategories = () => {
  return axios.get("http://localhost:8080/api/v1/categories");
};

// Kategoriyi id getir (GETBYID)
export const getCategoryById = (id) => {
  return axios.get(`http://localhost:8080/api/v1/categories/${id}`);
};

// Kategori ekle (POST)
export const createCategory = (category) => {
  return axios.post("http://localhost:8080/api/v1/categories", category);
};

// Kategori güncelle (PUT)
export const updateCategory = (id, category) => {
  return axios.put(`http://localhost:8080/api/v1/categories/${id}`, category);
};

// Kategori sil (DELETE)
export const deleteCategory = (id) => {
  return axios.delete(`http://localhost:8080/api/v1/categories/${id}`);
};

// Kitapları listele (GET)
export const getBooks = () => {
  return axios.get("http://localhost:8080/api/v1/books");
};

// Tek kitap getir (GET by ID)
export const getBookById = (id) => {
  return axios.get(`http://localhost:8080/api/v1/books/${id}`);
};

// Kitap ekle (POST)
export const createBook = (book) => {
  return axios.post("http://localhost:8080/api/v1/books", book);
};

// Kitap güncelle (PUT)
export const updateBook = (id, book) => {
  return axios.put(`http://localhost:8080/api/v1/books/${id}`, book);
};

// Kitap sil (DELETE)
export const deleteBook = (id) => {
  return axios.delete(`http://localhost:8080/api/v1/books/${id}`);
};

// Yazarları getir
export const getAuthors = () => {
  return axios.get("http://localhost:8080/api/v1/authors");
};

// Yazar ekle
export const createAuthor = (author) => {
  return axios.post("http://localhost:8080/api/v1/authors", author);
};

// Yazar güncelle
export const updateAuthor = (id, author) => {
  return axios.put(`http://localhost:8080/api/v1/authors/${id}`, author);
};

// Yazar sil
export const deleteAuthor = (id) => {
  return axios.delete(`http://localhost:8080/api/v1/authors/${id}`);
};

// Borrowing kayıtlarını getir (listele)
export const getBorrowings = () => {
  return axios.get("http://localhost:8080/api/v1/borrows");
};

// Borrowing kayıtlarını id ile getir
export const getBorrowingById = (id) => {
  return axios.get(`http://localhost:8080/api/v1/borrows/${id}`);
};

// Yeni borrowing oluştur
export const createBorrowing = (borrowing) => {
  return axios.post("http://localhost:8080/api/v1/borrows", borrowing);
};

// Borrowing sil (isteğe bağlı)
export const deleteBorrowing = (id) => {
  return axios.delete(`http://localhost:8080/api/v1/borrows/${id}`);
};

// (Opsiyonel) güncelleme varsa
export const updateBorrowing = (id, borrowing) => {
  return axios.put(`http://localhost:8080/api/v1/borrows/${id}`, borrowing);
};
