import React from "react";
import "./App.css";
import Sequencer from "./components/Sequencer";

export default function App() {
  return (
    <div className="App">
      <header>
        <h1>Step Sequencer</h1>
      </header>
      <main>
        <Sequencer />
      </main>
    </div>
  );
}
