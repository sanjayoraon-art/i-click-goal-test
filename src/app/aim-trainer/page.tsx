// @/app/aim-trainer/page.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { RefreshCw, Gamepad2, Home } from 'lucide-react';
import Link from 'next/link';

const GAME_DURATION = 30; // 30 seconds
const TARGET_SIZE = 40; // in pixels

type GameState = 'idle' | 'running' | 'finished';

type Result = {
  hits: number;
  misses: number;
  accuracy: number;
};

export default function AimTrainerPage() {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [targetPosition, setTargetPosition] = useState({ top: '50%', left: '50%' });
  const [result, setResult] = useState<Result | null>(null);
  const [showResultDialog, setShowResultDialog] = useState(false);

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const moveTarget = useCallback(() => {
    if (!gameAreaRef.current) return;
    const gameArea = gameAreaRef.current.getBoundingClientRect();
    const newTop = Math.random() * (gameArea.height - TARGET_SIZE);
    const newLeft = Math.random() * (gameArea.width - TARGET_SIZE);
    setTargetPosition({ top: `${newTop}px`, left: `${newLeft}px` });
  }, []);
  
  const endGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState('finished');
    
    // Use a function for setting state to ensure we have the latest values
    setHits(currentHits => {
        setMisses(currentMisses => {
            const totalClicks = currentHits + currentMisses;
            const accuracy = totalClicks > 0 ? parseFloat(((currentHits / totalClicks) * 100).toFixed(2)) : 0;
            
            const newResult = {
                hits: currentHits,
                misses: currentMisses,
                accuracy: accuracy,
            };

            setResult(newResult);
            setShowResultDialog(true);
            return currentMisses;
        });
        return currentHits;
    });
  }, []);

  useEffect(() => {
    if (gameState === 'running') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            endGame();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, endGame]);

  const startGame = () => {
    setGameState('running');
    setTimeLeft(GAME_DURATION);
    setHits(0);
    setMisses(0);
    setResult(null);
    setShowResultDialog(false);
    moveTarget();
  };
  
  const resetGame = () => {
    setGameState('idle');
    setTimeLeft(GAME_DURATION);
    setHits(0);
    setMisses(0);
    setResult(null);
    setShowResultDialog(false);
    setTargetPosition({ top: '50%', left: '50%' });
  }

  const handleTargetClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (gameState !== 'running') return;
    setHits((prev) => prev + 1);
    moveTarget();
  };

  const handleMissClick = () => {
    if (gameState !== 'running') return;
    setMisses((prev) => prev + 1);
  };
  
  const handleDialogChange = (open: boolean) => {
    if (!open) {
      resetGame();
    }
    setShowResultDialog(open);
  };

  return (
    <>
      <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 md:p-8 font-headline text-foreground bg-grid-slate-100/[0.05] dark:bg-grid-slate-900/[0.2]">
        <header className="text-center mb-8 max-w-4xl mx-auto">
           <Link href="/" className="font-bold text-2xl text-primary inline-flex items-center gap-2 mb-4">
            <Gamepad2 className="h-8 w-8" />
            Click Games
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold text-primary tracking-tighter drop-shadow-lg">
            Aim Trainer
          </h1>
          <p className="text-muted-foreground text-lg mt-2">
            Test and improve your aiming skills! Click as many targets as you can in 30 seconds.
          </p>
        </header>

        <Card className="w-full max-w-2xl bg-card/80 backdrop-blur-sm shadow-2xl rounded-2xl overflow-hidden border-2">
          <CardHeader className="border-b-2">
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">Time Left: <span className="text-primary tabular-nums">{timeLeft}s</span></div>
              <div className="text-2xl font-bold">Score: <span className="text-primary tabular-nums">{hits}</span></div>
              <div className="text-2xl font-bold">Misses: <span className="text-red-500 tabular-nums">{misses}</span></div>
            </div>
          </CardHeader>
          <CardContent className="p-2">
            <div
              ref={gameAreaRef}
              className="relative w-full h-80 md:h-96 rounded-lg bg-slate-200 dark:bg-slate-800 cursor-crosshair overflow-hidden"
              onClick={handleMissClick}
            >
              {gameState === 'idle' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                  <h2 className="text-3xl font-bold text-white mb-4">Start Training</h2>
                  <Button size="lg" onClick={startGame}>Start Game</Button>
                </div>
              )}
              {gameState === 'running' && (
                <div
                  className="absolute rounded-full bg-red-500 flex items-center justify-center cursor-pointer transition-all duration-100 ease-out"
                  style={{ 
                    top: targetPosition.top, 
                    left: targetPosition.left, 
                    width: `${TARGET_SIZE}px`, 
                    height: `${TARGET_SIZE}px`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  onClick={handleTargetClick}
                >
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-goal text-white"><path d="M12 13V2l8 4-8 4"/><path d="M12 22v-9"/><path d="M20 13.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0Z"/><path d="M12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/></svg>
                </div>
              )}
               {gameState === 'finished' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                  <h2 className="text-4xl font-bold text-white mb-4">Game Over!</h2>
                  <Button size="lg" onClick={resetGame}>
                    <RefreshCw className="mr-2" />
                    Play Again
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
         <div className="text-center mt-8">
            <Link href="/">
              <Button>
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
      </main>

      {result && (
        <Dialog open={showResultDialog} onOpenChange={handleDialogChange}>
          <DialogContent className={cn(
              'max-w-xs sm:max-w-md text-center border rounded-lg',
              result.accuracy > 75 ? 'bg-green-100 dark:bg-green-900/50' : result.accuracy > 50 ? 'bg-amber-100 dark:bg-amber-900/50' : 'bg-red-100 dark:bg-red-900/50'
            )}>
            <DialogHeader className="p-4 items-center">
              <DialogTitle className="text-2xl sm:text-3xl font-bold text-center">
                Your Results!
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-4 text-center p-4">
              <div>
                <div className="text-4xl font-bold text-teal-500">{result.hits}</div>
                <div className="text-sm text-muted-foreground">Targets Hit</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-red-500">{result.misses}</div>
                <div className="text-sm text-muted-foreground">Missed Clicks</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-amber-500">{result.accuracy}%</div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </div>
            </div>
            <DialogFooter className="sm:justify-center p-4">
              <Button onClick={() => handleDialogChange(false)}>
                <RefreshCw className="mr-2" /> Try Again
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
       <footer className="w-full bg-card/80 backdrop-blur-sm p-4 text-center text-muted-foreground mt-auto">
        <div className="container mx-auto flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <span>&copy; {new Date().getFullYear()} Click Speed Test. All rights reserved.</span>
            <div className="flex space-x-4">
              <Link href="/aim-trainer" className="hover:text-primary">Aim Trainer</Link>
              <Link href="/about" className="hover:text-primary">About Us</Link>
              <Link href="/privacy-policy" className="hover:text-primary">Privacy Policy</Link>
              <Link href="/terms-and-conditions" className="hover:text-primary">Terms & Conditions</Link>
            </div>
        </div>
      </footer>
    </>
  );
}
