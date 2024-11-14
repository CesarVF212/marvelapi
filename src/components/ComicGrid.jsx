import { Link } from "react-router-dom";
import "./../App.css";

export default function ComicGrid({ comics }) {
  return (
    <div className="comics-grid">
      {comics.map((comic) => (
        <Link
          to="/comic-details"
          state={{ comic }}
          key={comic.id}
          className="comic-item"
        >
          <h2 className="comic-title">{comic.title}</h2>
          <img
            src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
            alt={comic.title}
            className="comic-image"
          />
        </Link>
      ))}
    </div>
  );
}
