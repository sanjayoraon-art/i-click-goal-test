
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { History, MousePointerClick, Crosshair, Target } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type GameState = 'idle' | 'running' | 'finished';

interface TargetPosition {
  top: string;
  left: string;
}

const levels = [
  { id: 1, name: 'Easy', duration: 30, targets: 20, size: 'w-16 h-16' },
  { id: 2, name: 'Medium', duration: 25, targets: 25, size: 'w-14 h-14' },
  { id: 3, name: 'Hard', duration: 20, targets: 30, size: 'w-12 h-12' },
  { id: 4, name: 'Expert', duration: 15, targets: 35, size: 'w-10 h-10' },
  { id: 5, name: 'Insane', duration: 10, targets: 30, size: 'w-8 h-8' },
];

const BUTTON_COLORS = [
    'bg-sky-500 hover:bg-sky-600',
    'bg-teal-500 hover:bg-teal-600',
    'bg-emerald-500 hover:bg-emerald-600',
    'bg-amber-500 hover:bg-amber-600',
    'bg-orange-500 hover:bg-orange-600',
];

export default function AimTrainerPage() {
  const [selectedLevel, setSelectedLevel] = useState(levels[0]);
  const [gameState, setGameState] = useState<GameState>('idle');
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [timeLeft, setTimeLeft] = useState(selectedLevel.duration);
  const [targetPosition, setTargetPosition] = useState<TargetPosition>({ top: '50%', left: '50%' });
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const moveTarget = useCallback(() => {
    if (gameAreaRef.current) {
      const { width, height } = gameAreaRef.current.getBoundingClientRect();
      const targetSize = parseInt(selectedLevel.size.split('-')[1]) * 4; // approx px value from tailwind class
      const newTop = Math.random() * (height - targetSize);
      const newLeft = Math.random() * (width - targetSize);
      setTargetPosition({ top: `${newTop}px`, left: `${newLeft}px` });
    }
  }, [selectedLevel.size]);
  
  const startGame = () => {
    setScore(0);
    setMisses(0);
    setTimeLeft(selectedLevel.duration);
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
          if (prev <= 0.01) {
            endGame();
            return 0;
          }
          return prev - 0.01;
        });
      }, 10);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState, endGame]);
  
  useEffect(() => {
    setTimeLeft(selectedLevel.duration);
    // Reset game state when level changes
    setGameState('idle');
    setScore(0);
    setMisses(0);
  }, [selectedLevel]);


  const handleTargetClick = (e: React.MouseEvent) => {
    e.stopPropagation();
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
          Aim Trainer - {selectedLevel.name}
        </h1>
        <p className="text-muted-foreground text-lg mt-2">
          Choose a level, hit the targets as fast as you can, and improve your aim!
        </p>
      </header>
      
      <div className="max-w-4xl mx-auto text-center">
        <Card className="bg-card/80 backdrop-blur-sm shadow-lg rounded-2xl border mb-8">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Select a Level</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
                <div className="flex flex-wrap justify-center gap-2">
                    {levels.map((level, index) => (
                        <Button
                            key={level.id}
                            variant={selectedLevel.id === level.id ? 'outline' : 'default'}
                            className={cn(
                                'font-semibold text-white',
                                selectedLevel.id !== level.id && BUTTON_COLORS[index % BUTTON_COLORS.length],
                                selectedLevel.id === level.id && 'border-4 border-primary'
                            )}
                            onClick={() => setSelectedLevel(level)}
                            disabled={gameState === 'running'}
                        >
                            {level.name}
                        </Button>
                    ))}
                </div>
                <div className="flex items-center gap-2 text-lg text-muted-foreground">
                    <Target className="h-5 w-5" />
                    <span>Time: <strong>{selectedLevel.duration}s</strong></span>
                </div>
            </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm shadow-lg rounded-2xl border overflow-hidden">
          <CardHeader>
            <div className="grid grid-cols-3 items-center text-center">
              <div className="text-left">
                <div className="text-2xl md:text-4xl font-bold text-primary">{score}</div>
                <div className="text-sm text-muted-foreground">Hits</div>
              </div>
              <div>
                <div className="text-2xl md:text-4xl font-bold tabular-nums">{timeLeft.toFixed(2)}</div>
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
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-10 p-4">
                   <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                    <MousePointerClick className="h-12 w-12 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Ready to Start?</h2>
                  <Button onClick={startGame} size="lg">Start Game</Button>
                </div>
              )}

              {gameState === 'running' && (
                <>
                  <div
                    className={cn("absolute bg-primary rounded-full flex items-center justify-center transition-all duration-75", selectedLevel.size)}
                    style={{ top: targetPosition.top, left: targetPosition.left }}
                    onClick={handleTargetClick}
                  >
                    <Crosshair className="w-1/2 h-1/2 text-primary-foreground" />
                  </div>
                </>
              )}
              
              {gameState === 'finished' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 z-10 p-4">
                  <h2 className="text-xl font-bold text-primary mb-2">Finished!</h2>
                  <h3 className="text-base text-muted-foreground mb-4">Level {selectedLevel.name} Complete</h3>
                  <div className="grid grid-cols-2 gap-2 text-center mb-4">
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50">
                      <div className="text-xl font-bold">{score}</div>
                      <div className="text-xs uppercase">Hits</div>
                    </div>
                    <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/50">
                      <div className="text-xl font-bold">{misses}</div>
                      <div className="text-xs uppercase">Misses</div>
                    </div>
                    <div className="p-2 rounded-lg bg-sky-100 dark:bg-sky-900/50">
                      <div className="text-xl font-bold text-sky-500">{selectedLevel.duration}s</div>
                      <div className="text-xs uppercase">Time</div>
                    </div>
                    <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/50">
                      <div className="text-xl font-bold text-amber-500">{accuracy}%</div>
                      <div className="text-xs uppercase">Accuracy</div>
                    </div>
                  </div>
                  <Button onClick={() => setGameState('idle')} size="lg" className="mt-4 w-full max-w-xs">
                    <History className="mr-2 h-5 w-5" />
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
              <CardTitle className="text-2xl font-bold">How to Play & Benefits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-muted-foreground">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">How to Play</h3>
                <ol className="list-decimal list-inside space-y-2">
                  <li><strong>Select a Level:</strong> Choose a difficulty level from 'Easy' to 'Insane'. Each level has a different time limit and target size.</li>
                  <li><strong>Start the Game:</strong> Click the "Start Game" button to begin the challenge.</li>
                  <li><strong>Click the Targets:</strong> As soon as the game starts, targets will appear on the screen. Click on them as quickly and accurately as you can.</li>
                  <li><strong>Track Your Score:</strong> Each successful hit increases your score. Missing a target increases the miss count.</li>
                  <li><strong>Beat the Clock:</strong> The game ends when the timer runs out. Your final score, misses, and accuracy will be displayed.</li>
                  <li><strong>Play Again:</strong> Challenge yourself to beat your high score by playing again!</li>
                </ol>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Benefits of Aim Training</h3>
                <p>
                  Regular practice with an aim trainer is one of the most effective ways to improve your performance in FPS games. It helps build crucial skills that directly translate to in-game success. Consistent training helps develop muscle memory, allowing your hand to instinctively move the mouse to the correct position without conscious thought. This leads to faster reaction times and more accurate shots under pressure.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="w-full max-w-4xl mx-auto mt-12 text-left">
            <h2 className="text-3xl font-bold text-center mb-6">Aim Training Skill Breakdown</h2>
            <Card className="bg-card/80 backdrop-blur-sm shadow-lg rounded-2xl border">
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="font-semibold text-base text-foreground/80">Skill</TableHead>
                      <TableHead className="font-semibold text-base text-foreground/80">Description</TableHead>
                      <TableHead className="text-right font-semibold text-base text-foreground/80">Impact</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="even:bg-muted/20">
                      <TableCell className="font-medium">Accuracy</TableCell>
                      <TableCell>The ability to hit your target precisely. Our trainer helps you fine-tune your mouse movements.</TableCell>
                      <TableCell className="text-right font-bold text-green-500">High</TableCell>
                    </TableRow>
                    <TableRow className="even:bg-muted/20">
                      <TableCell className="font-medium">Speed</TableCell>
                      <TableCell>How quickly you can acquire and engage targets. The time pressure improves your overall speed.</TableCell>
                      <TableCell className="text-right font-bold text-green-500">High</TableCell>
                    </TableRow>
                    <TableRow className="even:bg-muted/20">
                      <TableCell className="font-medium">Reaction Time</TableCell>
                      <TableCell>The delay between seeing a target and making your first move. Training reduces this delay significantly.</TableCell>
                      <TableCell className="text-right font-bold text-amber-500">Medium</TableCell>
                    </TableRow>
                     <TableRow className="even:bg-muted/20">
                      <TableCell className="font-medium">Flicking</TableCell>
                      <TableCell>Rapidly and accurately moving your crosshair from one point to another. Targets appearing randomly helps practice this.</TableCell>
                      <TableCell className="text-right font-bold text-green-500">High</TableCell>
                    </TableRow>
                    <TableRow className="even:bg-muted/20">
                      <TableCell className="font-medium">Tracking</TableCell>
                      <TableCell>Keeping your crosshair on a moving target. While our targets are static, practicing speed helps in tracking.</TableCell>
                      <TableCell className="text-right font-bold text-amber-500">Medium</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </section>

          <section className="w-full max-w-4xl mx-auto mt-12 text-left">
            <h2 className="text-3xl font-bold text-center mb-6">Level Details</h2>
            <Card className="bg-card/80 backdrop-blur-sm shadow-lg rounded-2xl border">
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="font-semibold text-base text-foreground/80">Level</TableHead>
                      <TableHead className="font-semibold text-base text-foreground/80">Time</TableHead>
                      <TableHead className="text-right font-semibold text-base text-foreground/80">Total Targets</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {levels.map((level) => (
                      <TableRow key={level.id} className="even:bg-muted/20">
                        <TableCell className="font-medium">{level.name}</TableCell>
                        <TableCell>{level.duration} seconds</TableCell>
                        <TableCell className="text-right font-bold">{level.targets}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </section>

      </div>
    </div>
  );
}
