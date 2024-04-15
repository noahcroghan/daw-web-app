import React, { useState, useEffect } from "react";
import * as Tone from "tone";
import "./App.css";

const pauseIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="currentColor"
    // class="bi bi-pause-fill"
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
    // class="bi bi-play-fill"
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
  const [steps, setSteps] = useState([...Array(16)].map(() => false));
  const synth = new Tone.Synth().toDestination();

  useEffect(() => {
    const sequence = new Tone.Sequence(
      (time, step) => {
        if (steps[step]) {
          synth.triggerAttackRelease("C4", "8n", time);
        }
      },
      [...Array(16)].map((_, index) => index),
      "16n"
    ).start(0);
    return () => {
      sequence.dispose();
    };
  }, [steps, synth]);

  const toggleStep = (index) => {
    setSteps((prev) => {
      const newSteps = [...prev];
      newSteps[index] = !prev[index];
      return newSteps;
    });
  };

  return (
    <div className="sequencer">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`pad ${step ? "active" : ""}`}
          onClick={() => toggleStep(index)}
        ></div>
      ))}
    </div>
  );
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioReady, setIsAudioReady] = useState(false);

  useEffect(() => {
    const startAudio = async () => {
      await Tone.start();
      setIsAudioReady(true);
  );
    return () => {
      if (isAudioReady) {
        Tone.Transport.stop();
      }
    };
  }, [isAudioReady]);

  return (
    <div className="App">
      <div className="controls">
        <button onClick={setIsPlaying} className="playPause">
          {isPlaying ? pauseIcon : playIcon}
        </button>
        <BPMSlider />
      </div>
      <div className="main">
        <Sequencer />
      </div>
    </div>
  );
}
