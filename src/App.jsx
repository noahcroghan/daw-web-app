import React, { useState, useEffect } from "react";
import * as Tone from "tone";
import "./App.css";

const pauseIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="currentColor"
    class="bi bi-pause-fill"
    viewBox="0 0 16 16"
  >
    <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5m5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5" />
  </svg>
);

const playIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="currentColor"
    class="bi bi-play-fill"
    viewBox="0 0 16 16"
  >
    <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393" />
  </svg>
);

function BPMSlider() {
  const [beatsPerMinute, setBeatsPerMinute] = useState(140);

  return (
    <>
      <input
        className="slider"
        value={beatsPerMinute}
        onChange={(e) => setBeatsPerMinute(e.target.value)}
        type="range"
        min="1"
        max="200"
      />
      <span className="bpm-display">{beatsPerMinute} BPM</span>
    </>
  );
}

function Sequencer() {
  const [grid, setGrid] = useState(() => {
    // Initialize grid based on user-defined rows (default: 4)
    const rows = 4; // Replace with user input
    const newGrid = Array.from({ length: rows }, () =>
      Array.from({ length: 16 }, () => false)
    );
    return newGrid;
  });

  const toggleStep = (rowIndex, colIndex) => {
    setGrid((prevGrid) => {
      const newGrid = [...prevGrid]; // Create a copy to avoid mutation
      newGrid[rowIndex][colIndex] = !prevGrid[rowIndex][colIndex]; // Toggle active state
      return newGrid;
    });
  };

  return (
    <div className="sequencer-grid">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="sequencer-row">
          {row.map((isActive, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              className={`sequencer-step ${isActive ? "active" : ""}`}
              onClick={() => toggleStep(rowIndex, colIndex)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  // const [isAudioReady, setIsAudioReady] = useState(false);

  return (
    <div className="container">
      <div className="controls">
        <button onClick={setIsPlaying} className="playPause">
          {isPlaying ? pauseIcon : playIcon}
        </button>
        <BPMSlider />
      </div>
      <div className="sequencer">{/* <Sequencer /> */}</div>
    </div>
  );
}
