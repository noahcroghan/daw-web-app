import "./App.css";
import * as Tone from "tone";
import React, { useState, useEffect, useRef } from "react";
import playIcon from "/icons/play.svg";
import pauseIcon from "/icons/pause.svg";

const sampler = new Tone.Sampler({
  urls: {
    C4: "audio/Kick.ogg",
    "C#4": "audio/Snare.ogg",
    D4: "audio/Clap.ogg",
    "D#4": "audio/HiHat.ogg",
    E4: "audio/OpenHat.ogg",
    F4: "audio/Cowbell.ogg",
  },
  release: 1,
}).toDestination();

function Sequencer() {
  const notes = ["F4", "E4", "D#4", "D4", "C#4", "C4"]; // make changeable
  // const [synthType, setSynthType] = useState("sampler");
  const synthType = useRef("sampler");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioCtxStarted, setIsAudioCtxStarted] = useState(false);
  const [numSteps, setNumSteps] = useState(16);

  // let sampler;
  // // TODO: add type of synth param, update via state
  // const makeSynths = (count, synthType) => {
  //   if (synthType === "sampler") {
  //     sampler = new Tone.Sampler({
  //       urls: {
  //         C4: "audio/Kick.ogg",
  //         "C#4": "audio/Snare.ogg",
  //         D4: "audio/Clap.ogg",
  //         "D#4": "audio/HiHat.ogg",
  //         E4: "audio/OpenHat.ogg",
  //         F4: "audio/Cowbell.ogg",
  //       },
  //       release: 1,
  //     }).toDestination();
  //   } else {
  //     const synths = [];
  //     for (let i = 0; i < count; i++) {
  //       let synth = new Tone.Synth({
  //         // oscillator: { type: synthType + "8" }, // 8 makes better harmonics (sounds better)
  //         oscillator: { type: synthType },
  //       }).toDestination();
  //       synths.push(synth);
  //     }
  //     return synths;
  //   }
  // };
  // const [synths, setSynths] = useState(makeSynths(notes.length, synthType));

  const makeGrid = (notes) => {
    const rows = [];
    for (const note of notes) {
      const row = [];
      for (let i = 0; i < numSteps; i++) {
        row.push({
          note: note,
          isActive: false,
        });
      }
      rows.push(row);
    }
    return rows;
  };
  const [grid, setGrid] = useState(makeGrid(notes));
  let beat = 0;

  const silentAudio = new Audio("/audio/silent.mp3");
  const handlePlayPause = () => {
    if (!isAudioCtxStarted) {
      Tone.start();
      // sampler.context.resume(); // safari fix - doesn't work
      silentAudio.play();
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
        // let synth = synths[index];
        let note = row[beat];
        if (note.isActive) {
          console.log(note.note);
          sampler.triggerAttackRelease(note.note, "8n", time);
          // synth.triggerAttackRelease(note.note, "8n", time);
        }
      });
      beat = (beat + 1) % numSteps;

      console.log(beat);
    };

    Tone.Transport.bpm.value = 140;
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
        {/* {Array.from({ length: numSteps }, (_, i) => i).map((index) => (
          <div key={index} className={beat} />
        ))} */}
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

        <div id="right">
          <label htmlFor="bpm-input" id="bpm-text">
            BPM:
          </label>
          <input
            id="bpm-input"
            name="bpm-input"
            type="number"
            min={50}
            max={200}
            defaultValue={140}
            onChange={(e) => {
              Tone.Transport.bpm.value = e.target.value;
            }}
          />
          {/* <label htmlFor="synth-type-input" id="synth-type-text">
            Instrument Type:
          </label>
          <select
            id="synth-type-input"
            name="synth-type-input"
            value={synthType}
            onChange={(e) => {
              // setSynthType(e.target.value);
              // setSynths(makeSynths(notes.length, synthType));
            }}
          >
            <option value="sampler">Drum Kit</option>
            <option value="sine">Sine</option>
            <option value="square">Square</option>
            <option value="sawtooth">Sawtooth</option>
          </select> */}
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
