import { WIDTH_HEIGHT } from "../Config/Config";

// starting with an empty array that keeps growing.
export const arr = [];

// middle of the x is WIDTH_HEIGHT / 2, middle of y is WIDTH_HEIGHT ** 0.5. These are the coords of 0, 0
const middleCoord = WIDTH_HEIGHT / 2 + WIDTH_HEIGHT ** 0.5 / 2;

export const init = (gen, game) => {
  // setting the generation back to 0 (to an [] array)
  gen.length = 0;

  const data = game
    .split("#P")
    .map((a) => a.split("\n"))
    .slice(1);

  data.forEach((a) => {
    const position = a[0].split(" ").filter((b) => b);
    const x = +position[0];
    const y = WIDTH_HEIGHT ** 0.5 * position[1];

    const startingCoords = middleCoord + x + y;

    a.slice(1).forEach((b, i) => {
      const rows = b.split("");

      rows.forEach((c, j) => {
        const x = j + 1;
        const y = (i + 1) * WIDTH_HEIGHT ** 0.5;
        if (c === "*") gen[startingCoords + x + y] = 1;
      });
    });
  });
};

export const nextGeneration = (life) => {
  const size = WIDTH_HEIGHT ** 0.5;

  const coorOfNewLives = [];
  const coorOfNewDeads = [];

  for (
    // only checking from the first living - 1 row and only cheking till last living + 1 row
    let i = Math.max(life.indexOf(1) - size, 0);
    i < life.lastIndexOf(1) + size;
    i++
  ) {
    let neighbors = (life[i + size] || 0) + (life[i - size] || 0);

    // if it's on the left edge
    if (i % size === 0) {
      neighbors +=
        (life[i + 1] || 0) +
        (life[i + size + 1] || 0) +
        (life[i - size + 1] || 0);

      // if it's on the right edge
    } else if (i % size === size - 1) {
      neighbors +=
        (life[i - 1] || 0) +
        (life[i + size - 1] || 0) +
        (life[i - size - 1] || 0);

      // if it's not on the edges
    } else {
      neighbors +=
        (life[i - 1] || 0) +
        (life[i + 1] || 0) +
        (life[i + size - 1] || 0) +
        (life[i + size + 1] || 0) +
        (life[i - size - 1] || 0) +
        (life[i - size + 1] || 0);
    }

    // rules of game of life
    // Any live cell with fewer than two live neighbours dies, as if by underpopulation.
    // Any live cell with two or three live neighbours lives on to the next generation.
    // Any live cell with more than three live neighbours dies, as if by overpopulation.
    // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
    if (neighbors < 2) coorOfNewDeads.push(i);
    if (neighbors === 3) coorOfNewLives.push(i);
    if (neighbors > 3) coorOfNewDeads.push(i);

    // if it's living and there are two neighbors, it stays alive. If it was dead it remains dead with two neighbors. Hence this IF is not necesarry.
    // if (life.flat()[i] === 1 && neighbors === 2)
    //   coorOfNewLives.push(i);
  }

  coorOfNewLives.forEach((a) => (life[a] = 1));
  coorOfNewDeads.forEach((a) => (life[a] = undefined));

  return life;
};
