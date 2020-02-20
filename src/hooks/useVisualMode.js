import React, { useState, useEffect } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (secondTransition, replace = false) => {
    if (replace) {
      setHistory(history);
      setMode(secondTransition);
    } else {
      history.push(mode);
      setHistory(history);
      setMode(secondTransition);
    }
  };

  const back = backTransition => {
    setMode(history.pop());
  };

  return { mode, transition, back };
}
