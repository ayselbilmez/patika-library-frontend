import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Publishers from "./pages/Publishers";
import Categories from "./pages/Categories";
import Books from "./pages/Books";
import Authors from "./pages/Authors";
import Borrowings from "./pages/Borrowings";

function App() {
  return (
    <Router>
      <div className="container mt-4">
        <h1 className="mb-4">📚 Patika Library App</h1>

        {/* Basit navigation menüsü */}
        <nav className="mb-4">
          <Link className="me-3" to="/">
            Home
          </Link>
          <Link className="me-3" to="/publishers">
            Publishers
          </Link>
          <Link className="me-3" to="/categories">
            Categories
          </Link>
          <Link className="me-3" to="/books">
            Books
          </Link>
          <Link className="me-3" to="/authors">
            Authors
          </Link>
          <Link className="me-3" to="/borrowings">
            Borrowings
          </Link>
        </nav>

        {/* Sayfa yönlendirmeleri */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/publishers" element={<Publishers />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/books" element={<Books />} />
          <Route path="/authors" element={<Authors />} />
          <Route path="/borrowings" element={<Borrowings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
