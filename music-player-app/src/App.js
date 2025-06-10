import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react"; 
import "./App.css";
import PlayerPage from "./components/PlayerPage";
import SearchBar from "./components/SearchBar";
import Playlist from "./components/Playlist";
import Player from "./components/Player";
import songs from "./components/songs";
import FavoritesPage from "./components/FavoritesPage";

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

const App = () => {
  const [selectedTab, setSelectedTab] = useState("Playlists");
  const [query, setQuery] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffledSongs, setShuffledSongs] = useState([]);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isShufflePlaying, setIsShufflePlaying] = useState(false);


  const handleShufflePlayback = () => {
    if (isShufflePlaying) {
    setIsPlaying(false);
    setIsShufflePlaying(false);
  } else {
    const shuffled = [...filteredSongs].sort(() => Math.random() - 0.5);
    setShuffledSongs(shuffled);
    setIsShuffled(true);
    setCurrentIndex(0);
    setIsPlaying(true);
    setIsShufflePlaying(true);
  }
};
  
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const [recentPlays, setRecentPlays] = useState(() => {
    const saved = localStorage.getItem("recentPlays");
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    const cutoff = Date.now() - TWO_DAYS_MS;
    return parsed.filter((play) => play.playedAt > cutoff);
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

   useEffect(() => {
    localStorage.setItem("recentPlays", JSON.stringify(recentPlays));
  }, [recentPlays]);

  useEffect(() => {
    if (!songs[currentIndex]) return;

    const now = Date.now();
    const songId = songs[currentIndex].id;

    setRecentPlays((prev) => {
      const cutoff = now - TWO_DAYS_MS;
      const filtered = prev.filter((play) => play.playedAt > cutoff);
      const withoutCurrent = filtered.filter((play) => play.songId !== songId);
      return [{ songId, playedAt: now }, ...withoutCurrent];
    });
  }, [currentIndex]);

  const toggleFavorite = (songId) => {
    setFavorites((prev) =>
      prev.includes(songId)
        ? prev.filter((id) => id !== songId)
        : [...prev, songId]
    );
  };

  const filteredSongs = songs.filter((song) =>
    song.title.toLowerCase().includes(query.toLowerCase())
  );

  const recentSongs = recentPlays
    .map(({ songId }) => songs.find((s) => s.id === songId))
    .filter(Boolean);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="app">
              <SearchBar query={query} setQuery={setQuery} />

              <div className="top-tabs">
                <button
                  className={selectedTab === "Favourites" ? "active" : ""}
                  onClick={() => setSelectedTab("Favourites")}
                >
                  ⭐ Favourites
                </button>
                <button
                  className={selectedTab === "Playlists" ? "active" : ""}
                  onClick={() => setSelectedTab("Playlists")}
                >
                  🎵 Playlists
                </button>
                <button
                  className={selectedTab === "Recent" ? "active" : ""}
                  onClick={() => setSelectedTab("Recent")}
                >
                  🕒 Recent
                </button>
              </div>

              <div className="bottom-tabs">
                <span className="active-tab">Songs</span>
              </div>

              <div className="content">
                {selectedTab === "Playlists" && (
                  <Playlist
                    songs={isShuffled ? shuffledSongs :filteredSongs}
                    setCurrentIndex={setCurrentIndex}
                    setIsPlaying={setIsPlaying}
                    toggleFavorite={toggleFavorite}
                    favorites={favorites}
                    handleShufflePlayback={handleShufflePlayback}
                    isShufflePlaying={isShufflePlaying}
                  />
                )}
                
                 {selectedTab === "Favourites" && (
                  <FavoritesPage
                    favorites={favorites}
                    songs={songs}
                    setCurrentIndex={setCurrentIndex}
                    setIsPlaying={setIsPlaying}
                    toggleFavorite={toggleFavorite}
                  />
                )}

                 {selectedTab === "Recent" && (
                  <Playlist
                    songs={recentSongs}
                    setCurrentIndex={setCurrentIndex}
                    setIsPlaying={setIsPlaying}
                    toggleFavorite={toggleFavorite}
                    favorites={favorites}
                  />
                )}

              </div>

              <Player
              song={(isShuffled ? shuffledSongs : songs)[currentIndex]}
              songs={isShuffled ? shuffledSongs :songs}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              />

            </div>
          }
        />

        <Route
        path="/player/:id"
        element={
        <PlayerPage
        songs={songs}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        />
        }
        />

      </Routes>
    </Router>
  );
};

export default App;