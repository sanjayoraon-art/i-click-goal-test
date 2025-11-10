
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Zap, History, MousePointerClick, Timer } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';


type GameState = 'idle' | 'waiting' | 'measuring' | 'finished' | 'too_soon';

const MAX_HISTORY = 5;

export default function ReactionTimePage() {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const averageTime = history.length > 0 ? (history.reduce((a, b) => a + b, 0) / history.length).toFixed(0) : '0';

  const resetGame = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setGameState('idle');
    setReactionTime(null);
  }, []);
  
  const startWait = () => {
    setGameState('waiting');
    const randomDelay = Math.random() * 3000 + 1000; // 1-4 seconds delay
    timerRef.current = setTimeout(() => {
      startTimeRef.current = Date.now();
      setGameState('measuring');
    }, randomDelay);
  };

  const handleGameClick = () => {
    switch (gameState) {
      case 'idle':
      case 'finished':
      case 'too_soon':
        startWait();
        break;
      case 'waiting':
        setGameState('too_soon');
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        break;
      case 'measuring':
        const endTime = Date.now();
        const measuredTime = endTime - startTimeRef.current;
        setReactionTime(measuredTime);
        setHistory(prev => [measuredTime, ...prev.slice(0, MAX_HISTORY - 1)]);
        setGameState('finished');
        break;
    }
  };
  
  useEffect(() => {
    // Cleanup timer on component unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const getBackgroundColor = () => {
    switch(gameState) {
      case 'waiting':
      case 'too_soon':
        return 'bg-red-500';
      case 'measuring':
        return 'bg-green-500';
      case 'finished':
        return 'bg-sky-500';
      default: // idle
        return 'bg-muted';
    }
  };

  const renderGameState = () => {
    switch (gameState) {
      case 'idle':
        return (
          <div className='text-center'>
            <MousePointerClick className="h-16 w-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold">Reaction Time Test</h2>
            <p className="mt-2 text-lg">Click anywhere to start</p>
          </div>
        );
      case 'waiting':
        return (
          <div className='text-center text-white'>
            <Timer className="h-16 w-16 mx-auto mb-4 animate-pulse" />
            <h2 className="text-3xl font-bold">Wait for Green...</h2>
          </div>
        );
      case 'measuring':
        return (
          <div className='text-center text-white'>
             <MousePointerClick className="h-16 w-16 mx-auto mb-4 animate-ping" />
            <h2 className="text-3xl font-bold">Click NOW!</h2>
          </div>
        );
      case 'too_soon':
        return (
          <div className='text-center text-white'>
            <h2 className="text-3xl font-bold">Too Soon!</h2>
            <p className="mt-2 text-lg">Click anywhere to try again.</p>
          </div>
        );
      case 'finished':
        return (
          <div className='text-center text-white'>
            <div className="text-6xl font-bold mb-4">{reactionTime}ms</div>
            <div className="text-xl mb-6">Average: {averageTime}ms</div>
            <Button onClick={resetGame} size="lg" className="bg-white/20 hover:bg-white/30 text-white">
              <History className="mr-2 h-5 w-5" />
              Try Again
            </Button>
          </div>
        );
      default:
        return null;
    }
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-8 max-w-4xl mx-auto">
        <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
          <Zap className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-primary tracking-tighter drop-shadow-lg">
          Reaction Time Test
        </h1>
        <p className="text-muted-foreground text-lg mt-2">
          Test your reflexes! Click the box as soon as it turns green.
        </p>
      </header>
      
      <div className="max-w-4xl mx-auto text-center">
        <Card className="bg-card/80 backdrop-blur-sm shadow-lg rounded-2xl border overflow-hidden">
          <CardContent className="p-0">
            <div
              className={cn(
                "w-full h-80 md:h-96 flex items-center justify-center transition-colors duration-200 cursor-pointer select-none",
                getBackgroundColor()
              )}
              onClick={handleGameClick}
            >
              {renderGameState()}
            </div>
          </CardContent>
           {history.length > 0 && (
            <CardHeader>
              <CardTitle className="text-xl">Last {history.length} attempts</CardTitle>
              <div className="flex justify-center gap-2 pt-2">
                {history.map((time, index) => (
                  <div key={index} className="p-2 bg-muted rounded-md text-sm font-semibold">
                    {time}ms
                  </div>
                ))}
              </div>
            </CardHeader>
           )}
        </Card>

        <section className="w-full max-w-4xl mx-auto mt-12 text-left">
          <Card className="bg-card/80 backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden border-2">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">How to Play & Why It Matters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-muted-foreground">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">How to Play</h3>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Click on the box to start the test. The box will turn red.</li>
                  <li>Wait for the box to turn green. This will happen after a random delay.</li>
                  <li>As soon as the box turns green, click it as fast as you can.</li>
                  <li>Your reaction time will be displayed in milliseconds (ms).</li>
                  <li>Click again to test your reflexes and try to beat your average score!</li>
                </ol>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Why Is Reaction Time Important?</h3>
                <p>
                  Reaction time is the measure of how quickly you can respond to a stimulus. In gaming, especially competitive FPS games, a faster reaction time can be the difference between winning and losing a duel. Training your reaction time helps improve your reflexes, allowing you to react faster to in-game events like an opponent appearing on your screen. While the average human reaction time is around 200-250ms, pro gamers often have reaction times of 100-150ms.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="w-full max-w-4xl mx-auto mt-12 text-left">
            <h2 className="text-3xl font-bold text-center mb-6">Reaction Time Ranking</h2>
            <Card className="bg-card/80 backdrop-blur-sm shadow-lg rounded-2xl border">
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="font-semibold text-base text-foreground/80">Time (ms)</TableHead>
                      <TableHead className="text-right font-semibold text-base text-foreground/80">Rank</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="even:bg-muted/20">
                      <TableCell className="font-medium">100 - 150 ms</TableCell>
                      <TableCell className="text-right font-bold text-emerald-500">God Tier</TableCell>
                    </TableRow>
                    <TableRow className="even:bg-muted/20">
                      <TableCell className="font-medium">150 - 200 ms</TableCell>
                      <TableCell className="text-right font-bold text-green-500">Pro Level</TableCell>
                    </TableRow>
                    <TableRow className="even:bg-muted/20">
                      <TableCell className="font-medium">200 - 250 ms</TableCell>
                      <TableCell className="text-right font-bold text-sky-500">Above Average</TableCell>
                    </TableRow>
                     <TableRow className="even:bg-muted/20">
                      <TableCell className="font-medium">250 - 300 ms</TableCell>
                      <TableCell className="text-right font-bold text-amber-500">Average</TableCell>
                    </TableRow>
                    <TableRow className="even:bg-muted/20">
                      <TableCell className="font-medium">300+ ms</TableCell>
                      <TableCell className="text-right font-bold text-red-500">Below Average</TableCell>
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

    