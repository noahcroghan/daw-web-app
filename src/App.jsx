import * as Tone from "tone";
import React, { useState, useEffect, useRef } from "react";
import playIcon from "/icons/play.svg";
import pauseIcon from "/icons/pause.svg";
import "./App.css";

const makeSynths = (count) => {
  const synths = [];

  for (let i = 0; i < count; i++) {
    let synth = new Tone.Synth({
      oscillator: { type: "square8" },
    }).toDestination();
    synths.push(synth);
  }
  return synths;
};

const makeGrid = (notes) => {
  const rows = [];

  for (const note of notes) {
    const row = [];

    for (let i = 0; i < 8; i++) {
      row.push({
        note: note,
        isActive: false,
      });
    }
    rows.push(row);
  }
  return rows;
};

const Sequencer = () => {
  const [grid, setGrid] = useState([]);
  const [synths, setSynths] = useState([]);
  const [beat, setBeat] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const newSynths = makeSynths(6);
    setSynths(newSynths);
    const newGrid = makeGrid(["F4", "Eb4", "C4", "Bb3", "Ab3", "F3"]);
    setGrid(newGrid);
  }, []);

  useEffect(() => {
    if (playing && started) {
      const repeat = (time) => {
        grid.forEach((row, index) => {
          let synth = synths[index];
          let note = row[beat];
          if (note.isActive) {
            synth.triggerAttackRelease(note.note, "8n", time);
          }
        });
        setBeat((beat + 1) % 8);
      };
      Tone.Transport.bpm.value = 120;
      Tone.Transport.scheduleRepeat(repeat, "8n");
    } else {
      Tone.Transport.stop();
    }
    return () => Tone.Transport.clear();
  }, [playing, started, grid, synths]);

  const handleNoteClick = (rowIndex, noteIndex, e) => {
    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      newGrid[rowIndex][noteIndex].isActive =
        !newGrid[rowIndex][noteIndex].isActive;
      return newGrid;
    });
    e.target.classList.toggle("note-is-active");
  };

  const handlePlayClick = () => {
    if (!started) {
      Tone.start();
      setStarted(true);
      Tone.getDestination().volume.rampTo(-10, 0.001);
    }
    if (playing) {
      setPlaying(false);
    } else {
      setPlaying(true);
    }
  };

  return (
    <div id="sequencer">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="sequencer-row">
          {row.map((note, noteIndex) => (
            <button
              key={noteIndex}
              className={`note ${note.isActive ? "note-is-active" : ""}`}
              onClick={(e) => handleNoteClick(rowIndex, noteIndex, e)}
            />
          ))}
        </div>
      ))}
      <button id="play-button" onClick={handlePlayClick}>
        {playing ? "Stop" : "Play"}
      </button>
    </div>
  );
};

const App = () => {
  return (
    <div className="container">
      <header>
        <h1>Step Sequencer</h1>
        {/* <PlayButton /> */}
      </header>
      <main>
        <Sequencer />
      </main>
    </div>
  );
};

export default App;
