
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { History, MousePointerClick, Crosshair, TrendingUp } from 'lucide-react';
import type { Metadata } from 'next';

// This is a client component, so we can't export metadata directly.
// However, we can create a similar structure for reference or for parent layouts.
const metadata: Metadata = {
  title: 'Aim Trainer - Test & Improve Your Aiming Skills',
  description: 'Sharpen your mouse accuracy and reaction time with our free Aim Trainer game. Click targets, track your score, and improve your FPS gaming skills.',
  keywords: ['aim trainer', 'aim test', 'FPS trainer', 'mouse accuracy', 'reaction time game'],
};

type GameState = 'idle' | 'running' | 'finished';

interface TargetPosition {
  top: string;
  left: string;
}

export default function AimTrainerPage() {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [targetPosition, setTargetPosition] = useState<TargetPosition>({ top: '50%', left: '50%' });
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const moveTarget = useCallback(() => {
    if (gameAreaRef.current) {
      const { width, height } = gameAreaRef.current.getBoundingClientRect();
      // Ensure target doesn't go off-screen. Target size is 40px.
      const newTop = Math.random() * (height - 40);
      const newLeft = Math.random() * (width - 40);
      setTargetPosition({ top: `${newTop}px`, left: `${newLeft}px` });
    }
  }, []);
  
  const startGame = () => {
    setScore(0);
    setMisses(0);
    setTimeLeft(30);
    setGameState('running');
    moveTarget();
  };

  const endGame = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setGameState('finished');
  }, []);

  useEffect(() => {
    if (gameState === 'running') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState, endGame]);

  const handleTargetClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent miss click from firing
    if (gameState === 'running') {
      setScore(prev => prev + 1);
      moveTarget();
    }
  };

  const handleMissClick = () => {
    if (gameState === 'running') {
      setMisses(prev => prev + 1);
    }
  };
  
  const accuracy = score + misses > 0 ? ((score / (score + misses)) * 100).toFixed(1) : '0.0';

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-8 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-primary tracking-tighter drop-shadow-lg">
          Aim Trainer
        </h1>
        <p className="text-muted-foreground text-lg mt-2">
          Test your precision and speed. Click the targets as fast as you can in 30 seconds!
        </p>
      </header>
      
      <div className="max-w-4xl mx-auto text-center">
        <Card className="bg-card/80 backdrop-blur-sm shadow-lg rounded-2xl border overflow-hidden">
          <CardHeader>
            <div className="grid grid-cols-3 items-center text-center">
              <div className="text-left">
                <div className="text-2xl md:text-4xl font-bold text-primary">{score}</div>
                <div className="text-sm text-muted-foreground">Hits</div>
              </div>
              <div>
                <div className="text-2xl md:text-4xl font-bold">{timeLeft}</div>
                <div className="text-sm text-muted-foreground">Seconds</div>
              </div>
              <div className="text-right">
                <div className="text-2xl md:text-4xl font-bold text-destructive">{misses}</div>
                <div className="text-sm text-muted-foreground">Misses</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div
              ref={gameAreaRef}
              className={cn(
                "relative w-full h-64 sm:h-80 md:h-[500px] bg-muted/30 overflow-hidden",
                gameState === 'running' ? 'cursor-crosshair' : 'cursor-default'
              )}
              onClick={handleMissClick}
            >
              {gameState === 'idle' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-10">
                   <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                    <MousePointerClick className="h-12 w-12 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Improve Your Aim</h2>
                  <Button onClick={startGame} size="lg">Start Game</Button>
                </div>
              )}

              {gameState === 'running' && (
                <div
                  className="absolute w-10 h-10 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-75"
                  style={{ top: targetPosition.top, left: targetPosition.left }}
                  onClick={handleTargetClick}
                >
                  <Crosshair className="w-6 h-6 text-primary-foreground" />
                </div>
              )}
              
              {gameState === 'finished' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 z-10 p-4">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">Game Over!</h2>
                  <div className="flex justify-center items-stretch gap-2 md:gap-4 my-4">
                      <div className="text-center p-2 md:p-4 rounded-lg bg-muted w-28 md:w-36">
                          <div className="text-2xl md:text-5xl font-bold">{score}</div>
                          <div className="text-xs md:text-sm uppercase">Hits</div>
                      </div>
                      <div className="text-center p-2 md:p-4 rounded-lg bg-muted w-28 md:w-36">
                          <div className="text-2xl md:text-5xl font-bold">{misses}</div>
                          <div className="text-xs md:text-sm uppercase">Misses</div>
                      </div>
                      <div className="text-center p-2 md:p-4 rounded-lg bg-muted w-28 md:w-36">
                         <div className="text-2xl md:text-5xl font-bold">{accuracy}%</div>
                         <div className="text-xs md:text-sm uppercase">Accuracy</div>
                      </div>
                  </div>
                  <Button onClick={startGame} size="lg" className="mt-4">
                    <History className="mr-2 h-4 w-4" />
                    Play Again
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <section className="w-full max-w-4xl mx-auto mt-12 text-left">
          <Card className="bg-card/80 backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden border-2">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">About the Aim Trainer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                The Aim Trainer is designed to help you improve your mouse accuracy, precision, and reaction time. This skill is essential for competitive gaming, especially in First-Person Shooter (FPS) games like Valorant, Counter-Strike, and Call of Duty.
              </p>
              <p>
                Regular practice with this tool can lead to better muscle memory, faster target acquisition, and higher flick-shot accuracy. Challenge yourself to beat your high score and see your in-game performance soar!
              </p>
            </CardContent>
          </Card>
        </section>

      </div>
    </div>
  );
}

    