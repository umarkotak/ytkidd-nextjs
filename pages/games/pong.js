import React, { useState, useEffect, useRef } from 'react';

const GAME_WIDTH = 600;
const GAME_HEIGHT = 400;
const PADDLE_HEIGHT = 80;
const PADDLE_WIDTH = 15;
const BALL_SIZE = 12;
const INITIAL_BALL_SPEED = 3;

const PongGame = () => {
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [ballPos, setBallPos] = useState({ x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 });
  const [ballSpeed, setBallSpeed] = useState({ x: INITIAL_BALL_SPEED, y: INITIAL_BALL_SPEED });
  const [playerPaddleY, setPlayerPaddleY] = useState(GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2);
  const [computerPaddleY, setComputerPaddleY] = useState(GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2);
  const [gameStarted, setGameStarted] = useState(false);
  const [winner, setWinner] = useState(null);
  const [baseSpeed, setBaseSpeed] = useState(INITIAL_BALL_SPEED);
  
  const gameRef = useRef(null);
  const animationFrameRef = useRef();
  const lastTimeRef = useRef(0);

  const resetBall = () => {
    setBallPos({ x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 });
    const direction = Math.random() > 0.5 ? 1 : -1;
    setBallSpeed({ 
      x: direction * baseSpeed, 
      y: (Math.random() * 2 - 1) * baseSpeed 
    });
  };

  const resetGame = () => {
    setPlayerScore(0);
    setComputerScore(0);
    setPlayerPaddleY(GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2);
    setComputerPaddleY(GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2);
    setBaseSpeed(INITIAL_BALL_SPEED);
    setWinner(null);
    resetBall();
    setGameStarted(true);
  };

  const handleMouseMove = (e) => {
    if (!gameRef.current) return;
    const rect = gameRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top - PADDLE_HEIGHT / 2;
    setPlayerPaddleY(Math.max(0, Math.min(y, GAME_HEIGHT - PADDLE_HEIGHT)));
  };

  const handleTouchMove = (e) => {
    if (!gameRef.current) return;
    const rect = gameRef.current.getBoundingClientRect();
    const y = e.touches[0].clientY - rect.top - PADDLE_HEIGHT / 2;
    setPlayerPaddleY(Math.max(0, Math.min(y, GAME_HEIGHT - PADDLE_HEIGHT)));
  };

  useEffect(() => {
    const updateGame = (timestamp) => {
      if (!gameStarted || winner) return;

      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      // Update ball position
      const newBallPos = {
        x: ballPos.x + ballSpeed.x,
        y: ballPos.y + ballSpeed.y
      };

      // Ball collision with top and bottom walls
      if (newBallPos.y <= 0 || newBallPos.y >= GAME_HEIGHT - BALL_SIZE) {
        setBallSpeed(prev => ({ ...prev, y: -prev.y }));
      }

      // Ball collision with paddles
      const ballInPlayerPaddleRange = 
        newBallPos.y >= playerPaddleY && 
        newBallPos.y <= playerPaddleY + PADDLE_HEIGHT;
      
      const ballInComputerPaddleRange = 
        newBallPos.y >= computerPaddleY && 
        newBallPos.y <= computerPaddleY + PADDLE_HEIGHT;

      if (
        newBallPos.x <= PADDLE_WIDTH &&
        ballInPlayerPaddleRange
      ) {
        setBallSpeed(prev => ({ 
          x: -(prev.x * 1.1), // Increase speed by 10%
          y: prev.y
        }));
        setBaseSpeed(prev => prev * 1.1);
      } else if (
        newBallPos.x >= GAME_WIDTH - PADDLE_WIDTH - BALL_SIZE &&
        ballInComputerPaddleRange
      ) {
        setBallSpeed(prev => ({ 
          x: -(prev.x * 1.1), // Increase speed by 10%
          y: prev.y
        }));
        setBaseSpeed(prev => prev * 1.1);
      }

      // Scoring
      if (newBallPos.x <= 0) {
        setComputerScore(prev => {
          const newScore = prev + 1;
          if (newScore >= 10) {
            setWinner('Computer');
            setGameStarted(false);
          }
          return newScore;
        });
        resetBall();
      } else if (newBallPos.x >= GAME_WIDTH - BALL_SIZE) {
        setPlayerScore(prev => {
          const newScore = prev + 1;
          if (newScore >= 10) {
            setWinner('Player');
            setGameStarted(false);
          }
          return newScore;
        });
        resetBall();
      }

      setBallPos(newBallPos);

      // Simple AI for computer paddle
      const paddleCenter = computerPaddleY + PADDLE_HEIGHT / 2;
      const ballCenter = newBallPos.y + BALL_SIZE / 2;
      if (paddleCenter < ballCenter - 10) {
        setComputerPaddleY(prev => Math.min(prev + 4, GAME_HEIGHT - PADDLE_HEIGHT));
      } else if (paddleCenter > ballCenter + 10) {
        setComputerPaddleY(prev => Math.max(prev - 4, 0));
      }

      animationFrameRef.current = requestAnimationFrame(updateGame);
    };

    if (gameStarted && !winner) {
      animationFrameRef.current = requestAnimationFrame(updateGame);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameStarted, ballPos, ballSpeed, playerPaddleY, computerPaddleY, winner]);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="text-2xl font-bold mb-4">
        Player {playerScore} - {computerScore} Computer
      </div>

      <div 
        ref={gameRef}
        className="relative bg-gray-800 rounded-lg overflow-hidden cursor-move"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        {/* Player Paddle */}
        <div 
          className="absolute bg-white rounded"
          style={{
            left: 0,
            top: playerPaddleY,
            width: PADDLE_WIDTH,
            height: PADDLE_HEIGHT
          }}
        />

        {/* Computer Paddle */}
        <div 
          className="absolute bg-white rounded"
          style={{
            right: 0,
            top: computerPaddleY,
            width: PADDLE_WIDTH,
            height: PADDLE_HEIGHT
          }}
        />

        {/* Ball */}
        <div 
          className="absolute bg-white rounded-full"
          style={{
            left: ballPos.x,
            top: ballPos.y,
            width: BALL_SIZE,
            height: BALL_SIZE
          }}
        />

        {/* Center Line */}
        <div 
          className="absolute left-1/2 top-0 bottom-0 border-dashed border-l-2 border-white opacity-30"
        />
      </div>

      {(!gameStarted || winner) && (
        <div className="text-center">
          {winner && (
            <div className="text-xl font-bold mb-4">
              {winner} wins!
            </div>
          )}
          <button 
            onClick={resetGame}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {winner ? 'Play Again' : 'Start Game'}
          </button>
        </div>
      )}
    </div>
  );
};

export default PongGame;