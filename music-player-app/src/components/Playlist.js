import { useNavigate } from "react-router-dom";
import React from "react";
import "./Playlist.css";

const Playlist = ({ songs, setCurrentIndex, setIsPlaying, handleShufflePlayback, isShufflePlaying}) => {
  const navigate = useNavigate();

  const handleSongClick = (index, songId) => {
    setCurrentIndex(index);
    setIsPlaying(true);

    localStorage.setItem("currentIndex", index);
    localStorage.setItem("isPlaying", "true");
    
    navigate(`/player/${songId}`);
  };

  return (
    <div className="playlist">
      <div className="shuffle" onClick={handleShufflePlayback}>
        {isShufflePlaying ? "⏸ Stop Shuffle" : "▶ Start Shuffle"}
      </div>

      {songs.map((song, index) => (
        <div
          key={index}
          className="song-item"
          onClick={() => handleSongClick(index, song.id)}
        >
          <img src={song.cover} alt="cover" />
          <div className="info">
            <h4>{song.title}</h4>
            <p>{song.artist}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Playlist;
