import React, { useRef, useEffect, useState } from "react";
import { PIXELSIZE, WIDTH_HEIGHT, STARTING_SPEED } from "../Config/Config";
import { arr, nextGeneration, init } from "../Life/Life";
import { StartingLives } from "../Life/StartingGenerations";

// import WaitingPopUp from "./WaitingPopUp";
import GenerationCounter from "./GenerationCounter";
import Button from "../UI/Button";
import LivesList from "./LivesList";

import classes from "./Game.module.css";

const Game = () => {
  const canvasRef = useRef(null);
  const [currGeneration, setNextGeneration] = useState(arr);
  const [animationSwitch, setAnimationSwitch] = useState(true);
  const [counter, setCounter] = useState(0);
  // const [popUpSwitch, setPopUpSwitch] = useState(false);
  const [speed, setSpeed] = useState(STARTING_SPEED);
  const [currentGame, setGame] = useState("");

  const draw = (ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "#000000";

    currGeneration.forEach((a, i) => {
      const x = i % WIDTH_HEIGHT ** 0.5;
      const y = Math.floor(i / WIDTH_HEIGHT ** 0.5);

      if (a === 1) {
        ctx.fillRect(x * PIXELSIZE, y * PIXELSIZE, PIXELSIZE, PIXELSIZE);
      }
    });

    const newGeneration = () => {
      setNextGeneration(nextGeneration(currGeneration));
      setCounter((prevGen) => prevGen + 1);
    };

    currGeneration.includes(1) && animationSwitch && newGeneration();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    let timer;

    const render = () => {
      draw(context);
    };

    timer = setTimeout(() => {
      render();
    }, speed);

    return () => clearTimeout(timer);
  }, [draw]);

  const nextGenerationHandler = () => {
    setNextGeneration(nextGeneration(currGeneration));
    setCounter((prevGen) => prevGen + 1);
  };

  const animationHandler = () => {
    setAnimationSwitch(!animationSwitch);
  };

  // const toggle = () => {
  //   setPopUpSwitch(!popUpSwitch);
  // };

  const previousGenerationHandler = () => {
    if (counter === 0) return;
    init(currGeneration, StartingLives[currentGame]);

    for (let i = 1; i < counter; i++) {
      nextGeneration(currGeneration);
    }

    setCounter((prevGen) => prevGen - 1);
  };

  const speedUpHandler = () => {
    if (speed < 50) return;

    setSpeed((prevSpeed) => Math.round(prevSpeed / 1.2));
  };

  const speedDownHandler = () => {
    if (speed > 2000) return;

    setSpeed((prevSpeed) => Math.round(prevSpeed * 1.2));
  };

  const restartHandler = () => {
    init(currGeneration, StartingLives[currentGame]);
    setCounter(0);
  };

  const currentGameHandler = (game) => {
    setGame(game);
    init(currGeneration, StartingLives[game]);
    setCounter(0);
  };

  return (
    <center>
      <GenerationCounter>{`Generation: ${counter}`}</GenerationCounter>

      {/* to be invented: popup window while using "back" button */}
      {/* {popUpSwitch && <WaitingPopUp />} */}
      <LivesList listOfLives={StartingLives} onSelection={currentGameHandler} />
      <div>
        <Button onClick={animationHandler}>
          {animationSwitch ? "Stop" : "Start"}
        </Button>

        {/* due to the lack of backend, the back button can be quite slow after a while since going back here actually means calculating from 0 to the previous gen and then displaying that. For the time being it's going to disappear after 250 gens. */}
        {counter < 250 && (
          <Button onClick={previousGenerationHandler}>Back</Button>
        )}
        <Button onClick={nextGenerationHandler}>Next</Button>
        <Button onClick={speedDownHandler}>Slower</Button>
        <Button onClick={speedUpHandler}>Faster</Button>
        <Button onClick={restartHandler}>Restart</Button>
      </div>
      <canvas
        ref={canvasRef}
        className={classes.life}
        width={WIDTH_HEIGHT ** 0.5 * PIXELSIZE}
        height={WIDTH_HEIGHT ** 0.5 * PIXELSIZE}
      />
    </center>
  );
};

export default Game;
