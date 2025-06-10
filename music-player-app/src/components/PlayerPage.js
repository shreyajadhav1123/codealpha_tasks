import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import songs from "./songs";
import "./PlayerPage.css";

const PlayerPage = () => {
  const { id } = useParams();
  const songIndex = songs.findIndex((s) => s.id === parseInt(id));
  const [currentIndex, setCurrentIndex] = useState(songIndex);
  const song = songs[currentIndex];
  const audioRef = useRef(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [loopMode, setLoopMode] = useState("playlist");

  const toggleFavorite = () => {
    let favs = JSON.parse(localStorage.getItem("favorites")) || [];
    if (isFavorite) {
      favs = favs.filter((s) => s.id !== song.id);
    } else {
      favs.push(song);
    }
    localStorage.setItem("favorites", JSON.stringify(favs));
    setIsFavorite(!isFavorite);
  };

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favorites")) || [];
    const found = favs.find((s) => s.id === song.id);
    setIsFavorite(!!found);
  }, [song]);

  useEffect(() => {
  return () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; 
    }
  };
}, []);

useEffect(() => {
  if (audioRef.current) {
    audioRef.current.currentTime = 0;
    audioRef.current.play().then(() => {
      setIsPlaying(true);
    }).catch((err) => {
      console.log("Autoplay blocked:", err);
    });
  }
}, [currentIndex]);


  useEffect(() => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.play() : audioRef.current.pause();
    }
  }, [isPlaying, currentIndex]);

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleEnded = () => {
    if (loopMode === "single") {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else if (loopMode === "playlist") {
      handleNext();
    } else if (loopMode === "shuffle") {
      const randomIndex = Math.floor(Math.random() * songs.length);
      setCurrentIndex(randomIndex);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % songs.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? songs.length - 1 : prevIndex - 1
    );
  };

  const cycleLoopMode = () => {
    if (loopMode === "playlist") setLoopMode("single");
    else if (loopMode === "single") setLoopMode("shuffle");
    else setLoopMode("playlist");
  };

  return (
    <div className="player-page">
      <img className="song-cover" src={song.cover} alt="cover" />
      <h2 className="song-title">{song.title}</h2>

      <span
      className={`star-icon ${isFavorite ? "active" : ""}`}
      onClick={toggleFavorite}
      title="Add to Favorites"
      >
      ⭐
      </span>

      <audio
        src={song.url}
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={handleEnded}
        
      ></audio>

      <div className="controls">
        <button onClick={cycleLoopMode} title="Loop Mode">
          {loopMode === "playlist" && "🔁"}
          {loopMode === "single" && "🔂"}
          {loopMode === "shuffle" && "🔀"}
        </button>

        <button onClick={handlePrev}>⏮</button>

        <button onClick={togglePlayPause}>
          {isPlaying ? "⏸ Pause" : "▶ Play"}
        </button>

        <button onClick={handleNext}>⏭</button>
      </div>

      <div className="time-bar">
        <span>{formatTime(currentTime)}</span>
        <input
          type="range"
          min={0}
          max={audioRef.current?.duration || 0}
          value={currentTime}
          onChange={(e) => {
            audioRef.current.currentTime = parseFloat(e.target.value);
            setCurrentTime(parseFloat(e.target.value));
          }}
        />
        <span>{formatTime(audioRef.current?.duration || 0)}</span>
      </div>

      <div className="volume-control">
        <span>🔊</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={handleVolumeChange}
        />
      </div>
    </div>
  );
};

export default PlayerPage;
