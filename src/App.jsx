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
  const notes = ["F4", "Eb4", "C4", "Bb3", "Ab3", "F3"]; // TODO: replace this later
  const [synthType, setSynthType] = useState("sine");
  const [grid, setGrid] = useState(makeGrid(notes));
  const [synths, setSynths] = useState(makeSynths(6, synthType));
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioCtxStarted, setIsAudioCtxStarted] = useState(false);
  // const [bpm, setBpm] = useState(100);

  let beat = 0;

  const configLoop = () => {
    const repeat = (time) => {
      grid.forEach((row, index) => {
        let synth = synths[index];
        let note = row[beat];
        if (note.isActive) {
          console.log(note.note);
          synth.triggerAttackRelease(note.note, "8n", time);
        }
      });
      beat = (beat + 1) % NUM_STEPS;

      console.log(beat);
    };

    Tone.Transport.bpm.value = 120;
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

  // TODO: Add BPM control
  // TODO: Add metronome?
  // TODO: Add Stop Button
  // TODO: Allow for more synths/samplers
  // TODO: Allow for more steps in the grid
  // TODO: Add current beat indicator
  // TODO: use Transport.position to make those buttons clickable (or just update beat)

  return (
    <>
      <div className="sequencer">
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
        <button
          id="play-pause-button"
          onClick={() => {
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
            if (!isAudioCtxStarted) {
              Tone.start();
              Tone.getDestination().volume.rampTo(-10, 0.001);
              configLoop();
              setIsAudioCtxStarted(true);
            }
            // loop into using Tone.Transport.state
            if (isPlaying) {
              Tone.Transport.stop();
              setIsPlaying(false);
            } else {
              Tone.Transport.start();
              setIsPlaying(true);
            }
          }}
        >
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

        <div className="right">
          <label htmlFor="bpm-input" id="bpm-text">
            BPM:
          </label>
          <input
            id="bpm-input"
            name="bpm-input"
            type="number"
            min="1"
            max="300"
            value={Tone.Transport.bpm.value}
            onChange={(e) => {
              Tone.Transport.bpm.value = e.target.value;
            }}
          />
          <label htmlFor="synth-type-input" id="synth-type-text">
            Synth Type:
          </label>
          <select
            id="synth-type-input"
            name="synth-type-input"
            value={synthType}
            onChange={(e) => setSynthType(e.target.value)}
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
