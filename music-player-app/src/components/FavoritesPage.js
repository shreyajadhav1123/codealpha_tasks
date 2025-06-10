import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FavoritesPage.css";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(favs);
  }, []);

  const handleSongClick = (songId) => {
    navigate(`/player/${songId}`); 
  };

  if (favorites.length === 0) {
    return <div className="no-favorites">No favorite songs yet.</div>;
  }

  return (
    <div className="favorites-song">
      <h2>Favorite Songs</h2>
      <div className="favorites-page">
        <ul className="favorites-list">
          {favorites.map((song) => (
            <li
              key={song.id}
              onClick={() => handleSongClick(song.id)}
              className="favorite-item"
            >
              <img
                src={song.cover}
                alt={song.title}
                className="favorite-cover"
              />
              <div className="favorite-details">
                <div className="favorite-title">{song.title}</div>
                <div className="favorite-artist">{song.artist}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FavoritesPage;
