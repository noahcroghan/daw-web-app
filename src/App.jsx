import * as Tone from "tone";
import React, { useState, useEffect } from "react";
import playIcon from "/icons/play.svg";
import pauseIcon from "/icons/pause.svg";
import "./App.css";

const NUM_STEPS = 16; // this should be able to be changed via state

// TODO: add type of synth param, update via state
const makeSynths = (count, synthType) => {
  const synths = [];
  for (let i = 0; i < count; i++) {
    let synth = new Tone.Synth({
      oscillator: { type: synthType + "8" }, // 8 makes better harmonics (sounds better)
    }).toDestination();
    synths.push(synth);
  }
  return synths;
};

const sampler = new Tone.Sampler({
  urls: {
    C4: "audio/Kick.ogg",
    "C#4": "audio/Snare.ogg",
    D4: "audio/Clap.ogg",
    "D#4": "audio/HiHat.ogg",
  },
  release: 1,
}).toDestination();

const makeGrid = (notes) => {
  const rows = [];
  for (const note of notes) {
    const row = [];
    for (let i = 0; i < NUM_STEPS; i++) {
      row.push({
        note: note,
        isActive: false,
      });
    }
    rows.push(row);
  }
  return rows;
};

function Sequencer() {
  // const notes = ["C4", "C#4", "D4", "D#4"]; // TODO: replace this later
  const notes = ["C4", "D4", "E4", "G4", "A4", "B4"];
  const [synthType, setSynthType] = useState("sine");
  const [grid, setGrid] = useState(makeGrid(notes));
  const [synths, setSynths] = useState(makeSynths(notes.length, synthType));
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioCtxStarted, setIsAudioCtxStarted] = useState(false);
  const [bpm, setBpm] = useState();

  let beat = 0;

  //() => {
  // if (isPlaying) {
  //   Tone.Transport.stop();
  //   setIsPlaying(false);
  // } else {
  //   if (!Tone.Transport.state === "started") {
  //     Tone.start();
  //     Tone.getDestination().volume.rampTo(-10, 0.001);
  //   }
  //   configLoop();
  //   Tone.Transport.start();
  //   setIsPlaying(true);
  // }
  //   if (!isAudioCtxStarted) {
  //     Tone.start();
  //     Tone.getDestination().volume.rampTo(-10, 0.001);
  //     configLoop();
  //     setIsAudioCtxStarted(true);
  //   }
  //   // loop into using Tone.Transport.state
  //   if (isPlaying) {
  //     Tone.Transport.stop();
  //     setIsPlaying(false);
  //   } else {
  //     Tone.Transport.start();
  //     setIsPlaying(true);
  //   }
  // }}
  const handlePlayPause = () => {
    if (!isAudioCtxStarted) {
      Tone.start();
      Tone.getDestination().volume.rampTo(-10, 0.001);
      configLoop();
      setIsAudioCtxStarted(true);
    }
    if (isPlaying) {
      Tone.Transport.stop();
      setIsPlaying(false);
    } else {
      Tone.Transport.start();
      setIsPlaying(true);
    }
  };

  // Add Spacebar Event Listener on Component Load,
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === " ") {
        e.preventDefault();
        handlePlayPause();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPlaying, isAudioCtxStarted]);

  const configLoop = () => {
    const repeat = (time) => {
      grid.forEach((row, index) => {
        let synth = synths[index];
        let note = row[beat];
        if (note.isActive) {
          console.log(note.note);
          // sampler.triggerAttackRelease(note.note, "8n", time);
          synth.triggerAttackRelease(note.note, "8n", time);
        }
      });
      beat = (beat + 1) % NUM_STEPS;

      console.log(beat);
    };

    Tone.Transport.bpm.value = 120;
    setBpm(Tone.Transport.bpm.value);
    Tone.Transport.scheduleRepeat(repeat, "8n");
  };

  const handleNoteClick = (clickedRowIndex, clickedNoteIndex, e) => {
    e.target.classList.toggle("note-is-active");

    const updatedGrid = [...grid];
    const clickedRow = updatedGrid[clickedRowIndex];
    const clickedNote = clickedRow[clickedNoteIndex];
    clickedNote.isActive = !clickedNote.isActive;

    setGrid(updatedGrid);
  };

  // TODO: Add metronome?
  // TODO: Add Stop Button
  // TODO: Allow for more synths/samplers
  // TODO: Allow for more steps in the grid
  // TODO: Add current beat indicator
  // TODO: use Transport.position to make those buttons clickable (or just update beat)
  // TODO: add left and right buttons which move the viewport on mobile, should be display: none; by default. use fixed positioning
  const saveSequence = () => {
    const sequenceData = JSON.stringify(grid);
    const blob = new Blob([sequenceData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "sequence.json";
    link.click();

    URL.revokeObjectURL(url);
    console.log("Sequence saved!");
  };
  const loadSequence = (event) => {
    const file = event.target.files[0];

    if (!file) {
      console.error("No file selected.");
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const loadedGrid = JSON.parse(e.target.result);

        // Reset the sequence
        clearSequence();

        // Update the grid state
        setGrid(loadedGrid);

        console.log("Sequence loaded!");
      } catch (error) {
        console.error("Error loading sequence:", error);
      }
    };

    reader.readAsText(file);
  };

  const clearSequence = () => {
    // Clear the current sequence data
    setGrid([]);

    // Add any additional reset logic here
  };
  return (
    <>
      <div id="sequencer">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="sequencer-row">
            {row.map((note, noteIndex) => (
              <button
                key={`${rowIndex}-${noteIndex}`}
                className="note"
                onClick={(e) => handleNoteClick(rowIndex, noteIndex, e)}
              />
            ))}
          </div>
        ))}
      </div>
      <div id="controls">
        <button id="play-pause-button" onClick={handlePlayPause}>
          {isPlaying ? (
            <img src={pauseIcon} alt="Pause" />
          ) : (
            <img src={playIcon} alt="Play" />
          )}
        </button>
        {/* {isPlaying ? (
              <button
                id="stop-button"
                onClick={() => {
                  setIsPlaying(false);
                  Tone.Transport.stop();
                  beat = 0;
                }}
              >
                Stop
              </button>
            ) : null} */}
        <button onClick={saveSequence}>Save Sequence</button>
        {/* <button onClick={loadSequence}>Load Sequence</button> */}
        <input type="file" id="load-sequence" onChange={loadSequence} />

        <div id="right">
          <label htmlFor="bpm-input" id="bpm-text">
            BPM:
          </label>
          <input
            id="bpm-input"
            name="bpm-input"
            type="number"
            min={1}
            max={300}
            value={bpm}
            onChange={(e) => {
              setBpm(e.target.value);
              Tone.Transport.bpm = bpm;
            }}
          />
          <label htmlFor="synth-type-input" id="synth-type-text">
            Synth Type:
          </label>
          <select
            id="synth-type-input"
            name="synth-type-input"
            value={synthType}
            onChange={(e) => {
              setSynthType(e.target.value);
              setSynths(makeSynths(notes.length, synthType));
            }}
          >
            <option value="square">Square</option>
            <option value="sawtooth">Sawtooth</option>
            <option value="sine">Sine</option>
          </select>
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <div className="container">
      <Sequencer />
    </div>
  );
}
