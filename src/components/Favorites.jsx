import ComicGrid from "./ComicGrid";

export default function Favorites({ favorites }) {
  return (
    <div>
      {favorites.length === 0 ? (
        <p>Todavía no has añadido favoritos</p>
      ) : (
        <ComicGrid comics={favorites} />
      )}
    </div>
  );
}
