// import * as Tone from "tone";
// import React, { useState, useEffect, useRef } from "react";
// import playIcon from "/icons/play.svg";
// import pauseIcon from "/icons/pause.svg";
// import "./App.css";

// const makeSynths = (count) => {
//   const synths = [];

//   for (let i = 0; i < count; i++) {
//     let synth = new Tone.Synth({
//       oscillator: { type: "sine" },
//     }).toDestination();
//     synths.push(synth);
//   }
//   return synths;
// };

// const makeGrid = (notes) => {
//   const rows = [];

//   for (const note of notes) {
//     const row = [];

//     for (let i = 0; i < 8; i++) {
//       row.push({
//         note: note,
//         isActive: false,
//       });
//     }
//     rows.push(row);
//   }
//   return rows;
// };

// const Sequencer = () => {
//   const [grid, setGrid] = useState([]);
//   const [synths, setSynths] = useState([]);
//   const [beat, setBeat] = useState(0);
//   const [playing, setPlaying] = useState(false);
//   const [started, setStarted] = useState(false);

//   useEffect(() => {
//     const newSynths = makeSynths(6);
//     setSynths(newSynths);
//     const newGrid = makeGrid(["F4", "Eb4", "C4", "Bb3", "Ab3", "F3"]);
//     setGrid(newGrid);
//   }, []);

//   useEffect(() => {
//     if (playing && started) {
//       const repeat = (time) => {
//         grid.forEach((row, index) => {
//           let synth = synths[index];
//           let note = row[beat];
//           if (note.isActive) {
//             console.log(`Playing note: ${note.note}`);
//             synth.triggerAttackRelease(note.note, "8n", time);
//           }
//         });
//         setBeat((beat + 1) % 8);
//       };
//       Tone.Transport.bpm.value = 120;
//       Tone.Transport.scheduleRepeat(repeat, "8n");
//     } else {
//       Tone.Transport.stop();
//     }
//     return () => Tone.Transport.clear();
//   }, [playing, started, grid, synths]);

//   const handleNoteClick = (rowIndex, noteIndex, e) => {
//     const { note } = grid[rowIndex][noteIndex];

//     setGrid((prevGrid) => {
//       const newGrid = [...prevGrid];
//       newGrid[rowIndex][noteIndex].isActive =
//         !newGrid[rowIndex][noteIndex].isActive;
//       console.log(
//         `Note at [${rowIndex}, ${noteIndex}] is now active: ${note.isActive}`
//       );
//       return newGrid;
//     });
//     e.target.classList.toggle("note-is-active");
//   };

//   const startAudio = () => {
//     Tone.start();
//     Tone.getDestination().volume.rampTo(-10, 0.001);
//     console.log(Tone.getDestination().volume.value);
//     setStarted(true);
//   };

//   const handlePlayClick = () => {
//     if (playing) {
//       setPlaying(false);
//     } else {
//       setPlaying(true);
//       startAudio();
//     }
//   };

//   return (
//     <div id="sequencer">
//       {grid.map((row, rowIndex) => (
//         <div key={rowIndex} className="sequencer-row">
//           {row.map((note, noteIndex) => (
//             <button
//               key={noteIndex}
//               className={`note ${note.isActive ? "note-is-active" : ""}`}
//               onClick={(e) => handleNoteClick(rowIndex, noteIndex, e)}
//             />
//           ))}
//         </div>
//       ))}
//       <button id="play-button" onClick={handlePlayClick}>
//         {playing ? (
//           <img src={pauseIcon} alt="Pause" />
//         ) : (
//           <img src={playIcon} alt="Play" />
//         )}
//       </button>
//     </div>
//   );
// };

// const App = () => {
//   return (
//     <div className="container">
//       <header>
//         <h1>Step Sequencer</h1>
//         {/* <PlayButton /> */}
//       </header>
//       <main>
//         <Sequencer />
//       </main>
//     </div>
//   );
// };

// export default App;

// import React, { useState, useEffect } from "react";
// import * as Tone from "tone";
// import "./App.css";
// import playIcon from "/icons/play.svg";
// import pauseIcon from "/icons/pause.svg";

// function Sequencer() {
//   const [grid, setGrid] = useState([]);
//   const [synths, setSynths] = useState([]);
//   const [beat, setBeat] = useState(0);
//   const [playing, setPlaying] = useState(false);
//   const [started, setStarted] = useState(false);

//   const makeSynths = (count) => {
//     const synths = [];

//     for (let i = 0; i < count; i++) {
//       let synth = new Tone.Synth({
//         oscillator: { type: "square8" },
//       }).toDestination();
//       synths.push(synth);
//     }

//     return synths;
//   };

//   const makeGrid = (notes) => {
//     const rows = [];

//     for (const note of notes) {
//       const row = [];
//       for (let i = 0; i < 8; i++) {
//         row.push({
//           note: note,
//           isActive: false,
//         });
//       }
//       rows.push(row);
//     }

//     return rows;
//   };

//   useEffect(() => {
//     const newSynths = makeSynths(6);
//     setSynths(newSynths);
//     const newGrid = makeGrid(["F4", "Eb4", "C4", "Bb3", "Ab3", "F3"]);
//     setGrid(newGrid);
//   }, []);

//   useEffect(() => {
//     const synths = grid.map(() => new Tone.Synth().toDestination());

//     const configLoop = () => {
//       grid.forEach((row, index) => {
//         const synth = synths[index];
//         const note = row[beat];

//         if (note.isActive) {
//           synth.triggerAttackRelease(note.note, "8n", Tone.Transport.seconds);
//         }
//       });

//       setBeat((prevBeat) => (prevBeat + 1) % 8);
//     };

//     Tone.Transport.bpm.value = 120;
//     Tone.Transport.scheduleRepeat(configLoop, "8n");

//     return () => {
//       Tone.Transport.clear();
//       synths.forEach(() => synth.dispose());
//     };
//   }, [grid]);

//   return (
//     <div>
//       {grid.map((row, rowIndex) => (
//         <div key={rowIndex}>
//           {row.map((note, noteIndex) => (
//             <button
//               key={`${rowIndex}-${noteIndex}`}
//               onClick={() => {
//                 const updatedGrid = [...grid];
//                 updatedGrid[rowIndex][noteIndex].isActive = !note.isActive;
//                 setGrid(updatedGrid);
//               }}
//               style={{ backgroundColor: note.isActive ? "green" : "gray" }}
//             />
//           ))}
//         </div>
//       ))}
//     </div>
//   );
// }

// export default function App() {
//   return (
//     <div className="container">
//       <header>
//         <h1>Step Sequencer</h1>
//       </header>
//       <main>
//         <Sequencer />
//       </main>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import * as Tone from "tone";

const makeSynths = (count) => {
  // declare array to store synths
  const synths = [];

  // each synth can only play one note at a time.
  // for simplicity, we'll create one synth for each note available
  // this allows for easy polyphony (multiple notes playing at the same time)

  // I'll be using a one octive F minor pentatonic scale
  // so I'll need 6 synths
  for (let i = 0; i < count; i++) {
    // Documentation for Tone.Synth can be found here:
    // https://tonejs.github.io/docs/r13/Synth

    // I'm using an oscillator with a square wave and 8 partials
    // because I like how it sounds.
    //
    // You could simply declare new Tone.Synth().toDestination()
    //
    // This would work just as well, but sound slightly different.
    // Demo different oscillator settings here:
    // https://tonejs.github.io/examples/oscillator
    let synth = new Tone.Synth({
      oscillator: {
        type: "square8",
      },
    }).toDestination();

    synths.push(synth);
  }

  return synths;
};

const makeGrid = (notes) => {
  // our "notation" will consist of an array with 6 sub arrays
  // each sub array corresponds to one row in our sequencer grid

  // parent array to hold each row subarray
  const rows = [];

  for (const note of notes) {
    // declare the subarray
    const row = [];
    // each subarray contains multiple objects that have an assigned note
    // and a boolean to flag whether they are "activated"
    // each element in the subarray corresponds to one eigth note
    for (let i = 0; i < 8; i++) {
      row.push({
        note: note,
        isActive: false,
      });
    }
    rows.push(row);
  }

  // we now have 6 rows each containing 16 eighth notes
  return rows;
};

const notes = ["F4", "Eb4", "C4", "Bb3", "Ab3", "F3"];
const synths = makeSynths(6);

const Sequencer = () => {
  const [grid, setGrid] = useState(makeGrid(notes));
  const [beat, setBeat] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);

  const configLoop = () => {
    const repeat = (time) => {
      grid.forEach((row, index) => {
        let synth = synths[index];
        let note = row[beat];
        if (note.isActive) {
          synth.triggerAttackRelease(note.note, "8n", time);
        }
      });

      setBeat((prevBeat) => (prevBeat + 1) % 8);
    };

    Tone.Transport.bpm.value = 120;
    Tone.Transport.scheduleRepeat(repeat, "8n");
  };

  const makeSequencer = () => {
    return (
      <div id="sequencer" className="container sequencer">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="sequencer-row">
            {row.map((note, noteIndex) => (
              <button
                key={`${rowIndex}-${noteIndex}`}
                className={`note ${
                  note.isActive ? "note-is-active" : "note-not-active"
                }`}
                onClick={() => handleNoteClick(rowIndex, noteIndex)}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

  const handleNoteClick = (clickedRowIndex, clickedNoteIndex, e) => {
    setGrid((prevGrid) => {
      const newGrid = prevGrid.slice();
      newGrid[clickedRowIndex][clickedNoteIndex].isActive =
        !newGrid[clickedRowIndex][clickedNoteIndex].isActive;
      return newGrid;
    });
  };

  const configPlayButton = () => {
    const button = document.getElementById("play-button");
    button.addEventListener("click", (e) => {
      if (!started) {
        Tone.start();
        Tone.getDestination().volume.rampTo(-10, 0.001);
        configLoop();
        setStarted(true);
      }

      if (playing) {
        setPlaying(false);
        Tone.Transport.stop();
      } else {
        setPlaying(true);
        Tone.Transport.start();
      }
    });
  };

  useEffect(() => {
    if (playing) {
      // Function to trigger notes based on grid and beat
      const triggerNotes = () => {
        grid.forEach((row, rowIndex) => {
          let synth = synths[rowIndex];
          let note = row[beat];
          if (note.isActive) {
            synth.triggerAttackRelease(note.note, "8n"); // Adjust duration as needed
          }
        });
        // Update beat for next iteration
        setBeat((prevBeat) => (prevBeat + 1) % 8);
      };

      // Schedule the triggerNotes function using Tone.Transport
      Tone.Transport.scheduleRepeat(triggerNotes, "8n");

      // Cleanup function to stop scheduling when playing stops
      return () => Tone.Transport.clear(triggerNotes);
    }
  }, [playing, grid]);

  useEffect(() => {
    configPlayButton();
  }, []);

  return (
    <div>
      {makeSequencer()}
      <div className="toggle-play">
        <button id="play-button" className="play-button">
          Play
        </button>
      </div>
    </div>
  );
};

const App = () => {
  return <Sequencer />;
};

export default App;
