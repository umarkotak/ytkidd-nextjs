import React, { useState, useEffect } from 'react';

const generateMaze = (width, height) => {
  // Initialize the maze with walls
  const maze = Array(height).fill().map(() => Array(width).fill(1));

  // Create a recursive backtracker
  const stack = [];
  const startX = 1;
  const startY = 1;

  maze[startY][startX] = 0;
  stack.push([startX, startY]);

  while (stack.length > 0) {
    const [currentX, currentY] = stack[stack.length - 1];
    const neighbors = [
      [currentX + 2, currentY, currentX + 1, currentY],
      [currentX - 2, currentY, currentX - 1, currentY],
      [currentX, currentY + 2, currentX, currentY + 1],
      [currentX, currentY - 2, currentX, currentY - 1]
    ].filter(([x, y]) =>
      x > 0 && x < width - 1 && y > 0 && y < height - 1 && maze[y][x] === 1
    );

    if (neighbors.length > 0) {
      const [nextX, nextY, wallX, wallY] = neighbors[Math.floor(Math.random() * neighbors.length)];
      maze[wallY][wallX] = 0;
      maze[nextY][nextX] = 0;
      stack.push([nextX, nextY]);
    } else {
      stack.pop();
    }
  }

  // Set start and end points
  maze[1][1] = 2; // Start
  maze[height - 2][width - 2] = 3; // End

  return maze;
};

const MazeGame = () => {
  const difficulties = {
    easy: { width: 15, height: 15 },
    medium: { width: 21, height: 21 },
    hard: { width: 31, height: 31 }
  };

  const [difficulty, setDifficulty] = useState('easy');
  const [maze, setMaze] = useState([]);
  const [playerPos, setPlayerPos] = useState({ x: 1, y: 1 });
  const [gameWon, setGameWon] = useState(false);

  const resetGame = () => {
    const { width, height } = difficulties[difficulty];
    const newMaze = generateMaze(width, height);
    setMaze(newMaze);
    setPlayerPos({ x: 1, y: 1 });
    setGameWon(false);
  };

  useEffect(() => {
    resetGame();
  }, [difficulty]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameWon) return;

      const moves = {
        ArrowUp: [0, -1],
        ArrowDown: [0, 1],
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0]
      };

      const move = moves[e.key];
      if (!move) return;

      const newX = playerPos.x + move[0];
      const newY = playerPos.y + move[1];

      if (maze[newY]?.[newX] !== 1) {
        setPlayerPos({ x: newX, y: newY });
        if (maze[newY][newX] === 3) {
          setGameWon(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [playerPos, maze, gameWon]);

  const movePlayer = (direction) => {
    if (gameWon) return;

    const moves = {
      up: [0, -1],
      down: [0, 1],
      left: [-1, 0],
      right: [1, 0]
    };

    const [dx, dy] = moves[direction];
    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;

    if (maze[newY]?.[newX] !== 1) {
      setPlayerPos({ x: newX, y: newY });
      if (maze[newY][newX] === 3) {
        setGameWon(true);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex gap-4 items-center">
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="px-4 py-2 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <button
          onClick={resetGame}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          New Game
        </button>
      </div>

      <div className="grid gap-4">
        <div
          className="grid gap-px bg-gray-200 p-px rounded-lg overflow-hidden"
          style={{
            gridTemplateColumns: `repeat(${difficulties[difficulty].width}, 1.5rem)`
          }}
        >
          {maze.map((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${x}-${y}`}
                className={`w-6 h-6 flex items-center justify-center ${
                  cell === 1 ? 'bg-gray-800' :
                  cell === 3 ? 'bg-green-500' :
                  'bg-white'
                }`}
              >
                {playerPos.x === x && playerPos.y === y && (
                  <div className="w-4 h-4 rounded-full bg-blue-500 shadow-md" />
                )}
              </div>
            ))
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 w-48 mx-auto">
          <div />
          <button
            onClick={() => movePlayer('up')}
            className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            ↑
          </button>
          <div />
          <button
            onClick={() => movePlayer('left')}
            className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            ←
          </button>
          <button
            onClick={() => movePlayer('down')}
            className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            ↓
          </button>
          <button
            onClick={() => movePlayer('right')}
            className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            →
          </button>
        </div>
      </div>

      {gameWon && (
        <div className="text-xl font-bold text-green-600 mt-4">
          Congratulations! You won!
        </div>
      )}
    </div>
  );
};

export default MazeGame;