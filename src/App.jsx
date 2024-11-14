import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import CryptoJS from "crypto-js";
import ComicGrid from "./components/ComicGrid";
import ComicDetail from "./components/ComicDetail";
import Favorites from "./components/Favorites";
import Logo from "./assets/icons/logo.webp";

const fetchComics = async (limit, offset) => {
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
  const [comics, setComics] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (comic) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.some((fav) => fav.id === comic.id)) {
        return prevFavorites.filter((fav) => fav.id !== comic.id);
      } else {
        return [...prevFavorites, comic];
      }
    });
  };

  useEffect(() => {
    const getComics = async () => {
      const results = await fetchComics(30, 0);
      setComics(results);
    };

    getComics();
  }, []);

  return (
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
