import React, { useEffect, useRef } from "react";
import "./Player.css";

const Player = ({
  song,
  songs,
  isPlaying,
  setIsPlaying,
  currentIndex,
  setCurrentIndex,
}) => {
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio();
    return () => {
      audioRef.current.pause();
    };
  }, []);

  useEffect(() => {
    if (!song?.url || !audioRef.current) return;
    audioRef.current.src = song.url;
    audioRef.current.load(); 
    if (isPlaying) {
      audioRef.current.play().catch((err) => console.warn("Play error:", err));
    }
  }, [song]);

  useEffect(() => {
  const songData = JSON.parse(localStorage.getItem("currentSong"));
  const shouldPlay = localStorage.getItem("isPlaying") === "true";

  if (songData) {
     const savedIndex = songs.findIndex(s => s.id === songData.id);
    if (savedIndex !== -1) {
      setCurrentIndex(savedIndex);
    }
    if (shouldPlay) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }
}, []);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch((err) => console.warn("Play error:", err));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const handleNext = () => {
    if (!songs || songs.length === 0) return;
    const nextIndex = (currentIndex + 1) % songs.length;
    setCurrentIndex(nextIndex);
    setIsPlaying(true);
  };

  const handlePrevious = () => {
    if (!songs || songs.length === 0) return;
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    setCurrentIndex(prevIndex);
    setIsPlaying(true);
  };

  return (
    <div className="player">
      {(!songs || songs.length === 0 || !song) ? (
        <p>Loading songs...</p>
      ) : (
        <>
          <img src={song.cover} alt="cover" />
          <div className="text">
            <h4>{song.title}</h4>
            <p>{song.artist}</p>
          </div>
          <div className="controls">
            <button onClick={handlePrevious}>⏮️</button>
            <button onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? "⏸" : "▶️"}
            </button>
            <button onClick={handleNext}>⏭️</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Player;
