import React from "react";

import classes from "./GenerationCounter.module.css";

const GenerationCounter = (props) => {
  return <header className={classes.counter}>{props.children}</header>;
};

export default GenerationCounter;
