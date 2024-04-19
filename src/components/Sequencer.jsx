import * as Tone from "tone";
import React, { useState, useEffect } from "react";

export default function Sequencer() {
  const [pattern, setPattern] = useState(Array(16).fill(false));
  const [isPlaying, setIsPlaying] = useState(false);
  const [sampler, setSampler] = useState(null);

  //   const synth = new Tone.Synth().toDestination();

  useEffect(() => {
    const initalizeTone = async () => {
      await Tone.start();
    };

    initalizeTone();
  }, []);

  const toggleStep = (index) => {
    const newPattern = [...pattern];
    newPattern[index] = !newPattern[index];
    setPattern(newPattern);
  };

  const initalizeSampler = () => {
    if (!sampler) {
      const newSampler = new Tone.Sampler({
        urls: {
          C4: "audio/Kick.ogg",
        },
      }).toDestination();

      setSampler(newSampler);
    }
  };

  const playSequence = () => {
    initalizeSampler();

    setIsPlaying(true);
    Tone.Transport.cancel();
    Tone.Transport.scheduleRepeat((time) => {
      pattern.forEach((step, index) => {
        if (step) {
          sampler.triggerAttackRelease("C4", "8n", time);
        }
      });
    }, "8n");
    Tone.Transport.start();
  };

  const stopSequence = () => {
    setIsPlaying(false);
    Tone.Transport.stop();
    Tone.Transport.cancel();
  };

  return (
    <>
      <div className="step-sequencer">
        {pattern.map((step, index) => (
          <div
            key={index}
            className={`step ${step ? "active" : ""}`}
            onClick={() => toggleStep(index)}
          ></div>
        ))}
      </div>
      <div>
        {isPlaying ? (
          <button onClick={stopSequence}>Stop</button>
        ) : (
          <button onClick={playSequence}>Play</button>
        )}
      </div>
    </>
  );
}
