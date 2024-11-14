import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import CryptoJS from "crypto-js";
import ComicGrid from "./components/ComicGrid";
import ComicDetail from "./components/ComicDetail";
import Favorites from "./components/Favorites";
import Logo from "./assets/icons/logo.webp";

const fetchComics = async (limit, offset) => {
  // Función encargada de obtener los comics.
  const publicKey = "02b99a8d0327ececdcfd954443ab9da8";
  const privateKey = "7841f6cf0855fc40eab8f906d524e610773b0a49";
  const ts = "1";
  const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();

  try {
    const response = await fetch(
      `http://gateway.marvel.com/v1/public/comics?ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=${limit}&offset=${offset}&orderBy=modified`
    );
    const json = await response.json();
    return json.data.results;
  } catch (error) {
    console.error("Error fetching comics:", error);
    return [];
  }
};

export default function App() {
  // Se usan dos States principales, el que guarda los comics y el que guarda los favoritos.
  const [comics, setComics] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem("favorites"); // Los favoritos se obtienen de LocalStorage al cargar la página.
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  const toggleFavorite = (comic) => {
    // Función llamada al alterar los favoritos (y la funcionalidad del corazón).
    setFavorites((prevFavorites) => {
      const updatedFavorites = prevFavorites.some((fav) => fav.id === comic.id) // Revisa que no haya coincidencias.
        ? prevFavorites.filter((fav) => fav.id !== comic.id)
        : [...prevFavorites, comic];
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // En el caso de que ya no esté, lo añade al LocalStorage.
      return updatedFavorites;
    });
  };

  useEffect(() => {
    const getComics = async () => {
      // Obtiene los comics de forma asincrona.
      const results = await fetchComics(30, 0);
      setComics(results);
    };

    getComics();
  }, []);

  return (
    // Sistema artificial de páginas para poder usar elementos React como páginas independientes.
    <Router>
      <img src={Logo} className="logo" alt="" />
      <header>
        <Link to="/">
          <h3>HOME</h3>
        </Link>
        <Link to="/favorites">
          <h3>FAVORITES</h3>
        </Link>
      </header>
      <Routes>
        <Route path="/" element={<ComicGrid comics={comics} />} />
        <Route
          path="/comic-details"
          element={
            <ComicDetail
              toggleFavorite={toggleFavorite}
              favorites={favorites}
            />
          }
        />
        <Route
          path="/favorites"
          element={<Favorites favorites={favorites} />}
        />
      </Routes>
    </Router>
  );
}
