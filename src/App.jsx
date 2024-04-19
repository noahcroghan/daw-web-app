import React, { useEffect, useState } from "react";
import * as Tone from "tone";
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

export default function App() {
  return (
    <div className="App">
      <header>
        <h1>Step Sequencer</h1>
      </header>
      <main>
        <p>Main Area</p>
      </main>
    </div>
  );
}
