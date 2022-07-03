import React, { useState } from "react";

import classes from "./LivesList.module.css";

const LivesList = (props) => {
  const [selected, setSelected] = useState("");

  const inputHandler = (e) => {
    setSelected(e.target.value);
    props.onSelection(e.target.value);
  };

  return (
    <div className={classes.list}>
      <label>Choose game: </label>
      <select value={selected} onInput={inputHandler}>
        {selected || <option>---Choose one---</option>}
        {Object.keys(props.listOfLives).map((a) => (
          <option key={Math.random().toString()} value={a}>
            {a}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LivesList;
