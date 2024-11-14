import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import CharacterList from "./CharacterList";
import like_off from "./../assets/icons/like_off.png";
import like_on from "./../assets/icons/like_on.png";
import "./../App.css";

export default function ComicDetail({ toggleFavorite, favorites }) {
  const location = useLocation();
  const { comic } = location.state;

  const [characters, setCharacters] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);

  const fetchCharacters = async (comicID, limit = 20, offset = 0) => {
    const publicKey = "02b99a8d0327ececdcfd954443ab9da8";
    const privateKey = "7841f6cf0855fc40eab8f906d524e610773b0a49";
    const ts = "1";
    const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();

    try {
      const response = await fetch(
        `https://gateway.marvel.com/v1/public/comics/${comicID}/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=${limit}&offset=${offset}`
      );
      const json = await response.json();
      return json.data.results;
    } catch (error) {
      console.error("Error fetching characters:", error);
      return [];
    }
  };

  useEffect(() => {
    const getCharacters = async () => {
      const charactersData = await fetchCharacters(comic.id);
      setCharacters(charactersData);
    };

    getCharacters();
  }, [comic.id]);

  useEffect(() => {
    setIsFavorite(favorites.some((fav) => fav.id === comic.id));
  }, [comic.id, favorites]);

  const handleLikeClick = () => {
    toggleFavorite(comic);
    setIsFavorite(!isFavorite);
  };

  return (
    <>
      <span>
        <img
          className="detailed-img"
          src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
          alt={comic.title}
        />
      </span>
      <span>
        <h2>{comic.title}</h2>
        <img
          onClick={handleLikeClick}
          src={isFavorite ? like_on : like_off}
          className="favIcon"
          alt={isFavorite ? "Favorite" : "Not Favorite"}
        />
      </span>
      <p>{comic.description}</p>
      <CharacterList characters={characters} />
    </>
  );
}
