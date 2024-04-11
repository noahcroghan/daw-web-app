import React, { useState, useEffect } from "react";
import styles from "./App.module.css";
import * as Tone from "tone";

const NUM_STEPS = 16;

export default function App() {
  const [sequence, setSequence] = useState(new Array(NUM_STEPS).fill(false));
  const [isPlaying, setIsPlaying] = useState(false);

  const synth = new Tone.Synth().toDestination();

  useEffect(() => {
    Tone.Transport.bpm.value = 120;
  }, []);

  const toggleStep = (index) => {
    setSequence((prevSequence) => {
      const newSequence = [...prevSequence];
      newSequence[index] = !newSequence[index];
      return newSequence;
    });
  };

  const playStop = () => {
    setIsPlaying(!isPlaying);
    if (isPlaying) {
      Tone.Transport.stop();
    } else {
      Tone.Transport.start();
    }
  };

  const loop = (time) => {
    const step = Tone.Transport.position % NUM_STEPS;
    if (sequence[step]) {
      synth.triggerAttackRelease("C4", "8n", time);
    }
  };

  return (
    <>
      <div className="sequencer">
        <button onClick={playStop}>
          {isPlaying ? (
            <img src="./assets/pause.svg" alt="Pause Icon" />
          ) : (
            <img src="./assets/play.svg" alt="Play Icon" />
          )}
        </button>
        <div className="steps">
          {sequence.map((isActive, index) => (
            <button
              key={index}
              className={`step ${isActive ? "active" : ""}`}
              onClick={() => toggleStep(index)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
