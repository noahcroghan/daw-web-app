import * as Tone from "tone";
import React, { useState, useEffect } from "react";
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

function Sequencer() {
  const notes = ["F4", "Eb4", "C4", "Bb3", "Ab3", "F3"];
  const [grid, setGrid] = useState(makeGrid(notes));
  const [synths, setSynths] = useState(makeSynths(6));
  const [beat, setBeat] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

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

      setBeat((prevBeat) => (prevBeat + 1) % 8); // always 0; shouldn't be

      console.log(beat);
    };

    Tone.Transport.bpm.value = 100; //abstract to a slider with a state variable later
    Tone.Transport.scheduleRepeat(repeat, "8n"); // this might be problematic
  };

  // const configLoop = () => {
  //   const scheduleEvents = () => {
  //     grid.forEach((row, index) => {
  //       let synth = synths[index];
  //       for (let i = 0; i < 8; i++) {
  //         let note = row[i];
  //         if (note.isActive) {
  //           Tone.Transport.schedule((time) => {
  //             synth.triggerAttackRelease(note.note, "8n", time);
  //           }, `0:${i}:0`);
  //         }
  //       }
  //     });
  //   };

  //   Tone.Transport.bpm.value = 120;
  //   scheduleEvents();
  // };

  // const handleNoteClick = (clickedRowIndex, clickedNoteIndex, e) => {
  //   grid.forEach((row, rowIndex) => {
  //     row.forEach((note, noteIndex) => {
  //       if (clickedRowIndex === rowIndex && clickedNoteIndex === noteIndex) {
  //         note.isActive = !note.isActive;
  //         e.target.className = classNames(
  //           "note",
  //           { "note-is-active": !!note.isActive },
  //           { "not-not-active": !note.isActive }
  //         );
  //       }
  //     });
  //   });
  // };

  // const handleNoteClick = (clickedRowIndex, clickedNoteIndex, e) => {
  //   setGrid((prevGrid) => {
  //     const newGrid = prevGrid.map((row) => row.map((note) => ({ ...note })));
  //     newGrid[clickedRowIndex][clickedNoteIndex].isActive =
  //       !newGrid[clickedRowIndex][clickedNoteIndex].isActive;

  //     e.target.classList.toggle(
  //       "note-is-active",
  //       newGrid[clickedRowIndex][clickedNoteIndex].isActive
  //     );
  //     e.target.classList.toggle(
  //       "note-not-active",
  //       !newGrid[clickedRowIndex][clickedNoteIndex].isActive
  //     );

  //     return newGrid;
  //   });
  // };

  // const handleNoteClick = (clickedRowIndex, clickedNoteIndex, e) => {
  //   // Update the CSS classes
  //   const clickedElement = e.target;
  //   const activeClass = "note-is-active";
  //   const inactiveClass = "note-not-active";
  //   clickedElement.classList.toggle(activeClass);
  //   clickedElement.classList.toggle(inactiveClass);

  //   // Update the state variables
  //   const updatedGrid = [...grid];
  //   const clickedRow = updatedGrid[clickedRowIndex];
  //   const clickedNote = clickedRow[clickedNoteIndex];
  //   clickedNote.isActive = !clickedNote.isActive;

  //   // Update the sequence
  //   const updatedSequence = [...sequence];
  //   const updatedNote = { ...clickedNote };
  //   updatedNote.isActive = !clickedNote.isActive;
  //   updatedSequence[clickedNoteIndex] = updatedNote;

  //   setGrid(updatedGrid);
  //   setSequence(updatedSequence);
  // };

  const handleNoteClick = (clickedRowIndex, clickedNoteIndex, e) => {
    // Update the CSS classes
    const clickedElement = e.target;
    const activeClass = "note-is-active";
    const inactiveClass = "note-not-active";
    clickedElement.classList.toggle(activeClass);
    clickedElement.classList.toggle(inactiveClass);

    // Update the grid
    const updatedGrid = [...grid];
    const clickedRow = updatedGrid[clickedRowIndex];
    const clickedNote = clickedRow[clickedNoteIndex];
    clickedNote.isActive = !clickedNote.isActive;

    // Update the sequence using ToneJS
    // const updatedSequence = updatedGrid.map((row, rowIndex) => {
    //   return row.map((note, noteIndex) => {
    //     if (rowIndex === clickedRowIndex && noteIndex === clickedNoteIndex) {
    //       return { ...note, isActive: !note.isActive };
    //     } else {
    //       return note;
    //     }
    //   });
    // });

    setGrid(updatedGrid);
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
        <button
          id="play-button"
          onClick={() => {
            if (!isStarted) {
              Tone.start();
              Tone.getDestination().volume.rampTo(-10, 0.001);
              configLoop();
              setIsStarted(true);
            }

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

// import React, { useState, useEffect } from "react";
// import * as Tone from "tone";
// import "./App.css";

// const F_MINOR_PENTATONIC = ["F4", "Eb4", "C4", "Bb3", "Ab3", "F3"];

// function Sequencer() {
//   const [synths, setSynths] = useState([]);
//   const [grid, setGrid] = useState([]);
//   const [beat, setBeat] = useState(0);
//   const [playing, setPlaying] = useState(false);
//   const [started, setStarted] = useState(false);

//   useEffect(() => {
//     const newSynths = makeSynths(F_MINOR_PENTATONIC.length);
//     setSynths(newSynths);
//     setGrid(makeGrid(F_MINOR_PENTATONIC));
//   }, []);

//   useEffect(() => {
//     if (playing && started) {
//       configLoop();
//     } else {
//       Tone.Transport.stop();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [playing, started]);

//   const makeSynths = (count) => {
//     const newSynths = [];
//     for (let i = 0; i < count; i++) {
//       const synth = new Tone.Synth({
//         oscillator: {
//           type: "square8",
//         },
//       }).toDestination();
//       newSynths.push(synth);
//     }
//     return newSynths;
//   };

//   const makeGrid = (notes) => {
//     const rows = [];
//     notes.forEach((note) => {
//       const row = [];
//       for (let i = 0; i < 8; i++) {
//         row.push({
//           note,
//           isActive: false,
//         });
//       }
//       rows.push(row);
//     });
//     return rows;
//   };

//   const configLoop = () => {
//     const repeat = (time) => {
//       grid.forEach((row, index) => {
//         const synth = synths[index];
//         const note = row[beat];
//         if (note.isActive) {
//           synth.triggerAttackRelease(note.note, "8n", time);
//         }
//       });
//       setBeat((beat + 1) % 8);
//     };

//     Tone.Transport.bpm.value = 120;
//     Tone.Transport.scheduleRepeat(repeat, "8n");
//   };

//   const handleNoteClick = (rowIndex, noteIndex) => {
//     setGrid((prevGrid) =>
//       prevGrid.map((row, i) =>
//         i === rowIndex
//           ? row.map((note, j) =>
//               j === noteIndex ? { ...note, isActive: !note.isActive } : note
//             )
//           : row
//       )
//     );
//   };

//   const handlePlayClick = () => {
//     if (!started) {
//       Tone.start();
//       Tone.getDestination().volume.rampTo(-10, 0.001);
//       configLoop();
//       setStarted(true);
//     }

//     if (playing) {
//       Tone.Transport.stop();
//       setPlaying(false);
//     } else {
//       Tone.Transport.start();
//       setPlaying(true);
//     }
//   };

//   return (
//     <div id="sequencer">
//       {grid.map((row, rowIndex) => (
//         <div key={rowIndex} className="sequencer-row">
//           {row.map((note, noteIndex) => (
//             <button
//               key={`${rowIndex}-${noteIndex}`}
//               className={`note ${
//                 note.isActive ? "note-is-active" : "note-not-active"
//               }`}
//               onClick={() => handleNoteClick(rowIndex, noteIndex)}
//             />
//           ))}
//         </div>
//       ))}
//       <button id="play-button" onClick={handlePlayClick}>
//         {playing ? "Stop" : "Play"}
//       </button>
//     </div>
//   );
// }

// export default Sequencer;
