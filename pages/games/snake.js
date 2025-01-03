import React, { useState, useEffect } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 15, y: 15 };
const INITIAL_DIRECTION = 'right';

const SnakeGame = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(200); // milliseconds between moves

  const generateFood = () => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  };

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setScore(0);
    setSpeed(200);
    setIsPlaying(true);
  };

  const changeDirection = (newDirection) => {
    const opposites = {
      up: 'down',
      down: 'up',
      left: 'right',
      right: 'left'
    };

    if (opposites[newDirection] !== direction) {
      setDirection(newDirection);
    }
  };

  const moveSnake = () => {
    if (!isPlaying || gameOver) return;

    const moves = {
      up: { x: 0, y: -1 },
      down: { x: 0, y: 1 },
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 }
    };

    const newHead = {
      x: (snake[0].x + moves[direction].x + GRID_SIZE) % GRID_SIZE,
      y: (snake[0].y + moves[direction].y + GRID_SIZE) % GRID_SIZE
    };

    // Check for collision with self
    if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
      setGameOver(true);
      setIsPlaying(false);
      return;
    }

    const newSnake = [newHead, ...snake];

    // Check if food is eaten
    if (newHead.x === food.x && newHead.y === food.y) {
      setFood(generateFood());
      setScore(score + 1);
      setSpeed(Math.max(50, speed - 10)); // Increase speed
    } else {
      newSnake.pop(); // Remove tail if no food eaten
    }

    setSnake(newSnake);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      const keyMap = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right'
      };

      if (keyMap[e.key]) {
        changeDirection(keyMap[e.key]);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, speed);
    return () => clearInterval(gameLoop);
  }, [snake, food, direction, isPlaying, gameOver, speed]);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex gap-4 items-center">
        <div className="text-xl font-bold">Score: {score}</div>
        <button
          onClick={resetGame}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          New Game
        </button>
      </div>

      <div className="grid gap-px bg-gray-200 p-px rounded-lg overflow-hidden"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1.5rem)`
        }}
      >
        {Array(GRID_SIZE).fill().map((_, y) =>
          Array(GRID_SIZE).fill().map((_, x) => {
            const isSnake = snake.some(segment => segment.x === x && segment.y === y);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={`${x}-${y}`}
                className={`w-6 h-6 flex items-center justify-center ${
                  isSnake ? (isHead ? 'bg-green-600' : 'bg-green-500') :
                  isFood ? 'bg-red-500' :
                  'bg-white'
                }`}
              />
            );
          })
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 w-48 mx-auto">
        <div />
        <button
          onClick={() => changeDirection('up')}
          className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          ↑
        </button>
        <div />
        <button
          onClick={() => changeDirection('left')}
          className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          ←
        </button>
        <button
          onClick={() => changeDirection('down')}
          className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          ↓
        </button>
        <button
          onClick={() => changeDirection('right')}
          className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          →
        </button>
      </div>

      {gameOver && (
        <div className="text-xl font-bold text-red-600 mt-4">
          Game Over! Final Score: {score}
        </div>
      )}
    </div>
  );
};

export default SnakeGame;