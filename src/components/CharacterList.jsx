import React from "react";
import "./../App.css";

export default function CharacterList({ characters }) {
  return (
    <>
      <ul className="character-list">
        {characters.map((character) => (
          <li key={character.id} className="character-item">
            <img
              src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
              alt={character.name}
            />
            <span>{character.name}</span>
          </li>
        ))}
      </ul>
    </>
  );
}
