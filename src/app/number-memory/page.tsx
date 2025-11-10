
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Hash, History, Trophy } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type GameState = 'idle' | 'showing' | 'waiting' | 'gameover';

export default function NumberMemoryPage() {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [level, setLevel] = useState(1);
  const [currentNumber, setCurrentNumber] = useState('');
  const [userInput, setUserInput] = useState('');
  const [highScore, setHighScore] = useState(1);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedHighScore = localStorage.getItem('numberMemoryHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  const generateNumber = (length: number) => {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 10);
    }
    return result;
  };

  const nextLevel = useCallback(() => {
    setGameState('showing');
    setUserInput('');
    const newNumber = generateNumber(level);
    setCurrentNumber(newNumber);
    const showTime = Math.max(1000, level * 250); 
    setTimeout(() => {
      setGameState('waiting');
      inputRef.current?.focus();
    }, showTime);
  }, [level]);

  const startGame = () => {
    setLevel(1);
    setGameState('showing');
    setIsNewHighScore(false);
  };
  
  useEffect(() => {
      if (gameState === 'showing') {
          nextLevel();
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, level]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameState !== 'waiting') return;

    if (userInput === currentNumber) {
      setLevel(prevLevel => prevLevel + 1);
      setGameState('showing');
    } else {
      if (level > highScore) {
        setHighScore(level);
        localStorage.setItem('numberMemoryHighScore', level.toString());
        setIsNewHighScore(true);
      }
      setGameState('gameover');
    }
  };

  const getStatusMessage = () => {
    switch (gameState) {
      case 'idle':
        return <span className="text-sky-800 dark:text-sky-200">Click "Start" to begin.</span>;
      case 'showing':
        return 'Memorize the number...';
      case 'waiting':
        return 'What was the number?';
      case 'gameover':
        return (
          <div className="flex flex-col items-center">
            <span className="text-red-500 font-bold">Game Over!</span>
            <div className="text-base text-muted-foreground">The correct number was <span className="font-bold text-foreground">{currentNumber}</span>.</div>
            {isNewHighScore && (
              <span className="text-lg font-bold text-amber-500 mt-2 flex items-center gap-2">
                <Trophy className="h-5 w-5" /> New High Score!
              </span>
            )}
          </div>
        );
      default:
        return '';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-8 max-w-4xl mx-auto">
        <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
          <Hash className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-primary tracking-tighter drop-shadow-lg">
          Number Memory Test
        </h1>
        <p className="text-muted-foreground text-lg mt-2">
          A number will flash on screen. Memorize it and type it back.
        </p>
      </header>

      <div className="max-w-4xl mx-auto">
        <Card className="bg-card/80 backdrop-blur-sm shadow-lg rounded-2xl border overflow-hidden">
          <CardHeader className="bg-sky-100 dark:bg-sky-900/50 p-4 rounded-lg">
            <div className={cn("flex flex-col items-center justify-center")}>
                 <h2 className={cn("text-2xl font-bold text-center w-full text-sky-800 dark:text-sky-200")}>{getStatusMessage()}</h2>
            </div>
            {gameState !== 'idle' && (
              <div className="flex justify-around items-center text-center text-xl font-bold text-muted-foreground mt-4 border-t pt-4">
                  <div className="flex flex-col items-center">
                    <span>Level</span>
                    <span className="text-primary text-3xl">{level}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span>Digits</span>
                    <span className="text-primary text-3xl">{level}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span>High Score</span>
                    <span className="text-amber-500 text-3xl">{highScore}</span>
                  </div>
              </div>
            )}
          </CardHeader>
          <CardContent className="min-h-[250px] flex items-center justify-center">
            {gameState === 'idle' && (
                <Button onClick={startGame} size="lg">
                    Start Game
                    <History className="ml-2 h-5 w-5" />
                </Button>
            )}
            {gameState === 'showing' && (
                <div className="text-5xl md:text-7xl font-bold tracking-widest animate-pulse">
                    {currentNumber}
                </div>
            )}
            {(gameState === 'waiting' || gameState === 'gameover') && (
                <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full max-w-xs">
                    <Input 
                        ref={inputRef}
                        type="text"
                        pattern="\d*"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        className="text-center text-2xl h-14"
                        placeholder="Enter the number"
                        disabled={gameState === 'gameover'}
                    />
                    {gameState === 'waiting' ? (
                      <Button type="submit" size="lg" className="w-full">Submit</Button>
                    ) : (
                      <Button onClick={startGame} size="lg" className="w-full">
                          Play Again
                          <History className="ml-2 h-5 w-5" />
                      </Button>
                    )}
                </form>
            )}
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
                  <li>Click "Start Game" to begin.</li>
                  <li>A number will flash on the screen for a short period. Memorize it.</li>
                  <li>Once the number disappears, type it into the input box and click "Submit".</li>
                  <li>If you are correct, you advance to the next level with a longer number.</li>
                  <li>If you make a mistake, the game is over. Your score is the number of digits in the last correct sequence.</li>
                </ol>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Benefits of Number Memory Games</h3>
                <p>
                  This game directly targets your "digit span," which is a measure of short-term memory capacity. Improving your digit span can enhance your ability to remember phone numbers, codes, and other numerical information in daily life. It's a powerful brain training exercise that can boost concentration and mental agility.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="w-full max-w-4xl mx-auto mt-12 text-left">
            <h2 className="text-3xl font-bold text-center mb-6">Number Memory Ranking</h2>
            <Card className="bg-card/80 backdrop-blur-sm shadow-lg rounded-2xl border">
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="font-semibold text-base text-foreground/80">Digits Remembered</TableHead>
                      <TableHead className="text-right font-semibold text-base text-foreground/80">Cognitive Skill</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="even:bg-muted/20">
                      <TableCell className="font-medium">1 - 4</TableCell>
                      <TableCell className="text-right font-bold text-red-500">Novice</TableCell>
                    </TableRow>
                    <TableRow className="even:bg-muted/20">
                      <TableCell className="font-medium">5 - 7</TableCell>
                      <TableCell className="text-right font-bold text-amber-500">Average</TableCell>
                    </TableRow>
                     <TableRow className="even:bg-muted/20">
                      <TableCell className="font-medium">8 - 10</TableCell>
                      <TableCell className="text-right font-bold text-sky-500">Sharp</TableCell>
                    </TableRow>
                    <TableRow className="even:bg-muted/20">
                      <TableCell className="font-medium">11 - 14</TableCell>
                      <TableCell className="text-right font-bold text-green-500">Exceptional</TableCell>
                    </TableRow>
                    <TableRow className="even:bg-muted/20">
                      <TableCell className="font-medium">15+</TableCell>
                      <TableCell className="text-right font-bold text-emerald-500">Genius</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </section>
      </div>
    </div>
  );
}
