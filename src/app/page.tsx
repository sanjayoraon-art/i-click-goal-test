
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Goal, Target } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const TIME_OPTIONS = [5, 10, 15, 30, 60, 100];

const TARGETS: { [key: number]: number } = {
  5: 30,
  10: 60,
  15: 80,
  30: 165,
  60: 300,
  100: 600,
};

type GameState = 'idle' | 'running' | 'finished';

type Result = {
  cps: number;
  totalClicks: number;
  timeUsed: number;
  targetMet: boolean;
  target: number;
  imageId: string;
};

const BUTTON_COLORS = [
  'bg-sky-500 hover:bg-sky-600',
  'bg-teal-500 hover:bg-teal-600',
  'bg-emerald-500 hover:bg-emerald-600',
  'bg-amber-500 hover:bg-amber-600',
  'bg-orange-500 hover:bg-orange-600',
  'bg-red-500 hover:bg-red-600',
];

const FAIL_IMAGE_MAP: { [key: number]: string } = {
    5: 'resultFailImage5s',
    10: 'resultFailImage10s',
    15: 'resultFailImage15s',
    30: 'resultFailImage30s',
    60: 'resultFailImage60s',
    100: 'resultFailImage100s',
};

export default function Home() {
  const [selectedTime, setSelectedTime] = useState(5);
  const [gameState, setGameState] = useState<GameState>('idle');
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(selectedTime);
  const [result, setResult] = useState<Result | null>(null);
  const [isPulsing, setIsPulsing] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const clicksRef = useRef(clicks);
  const selectedTimeRef = useRef(selectedTime);

  useEffect(() => {
    clicksRef.current = clicks;
  }, [clicks]);

  useEffect(() => {
    selectedTimeRef.current = selectedTime;
    setTimeLeft(selectedTime);
  }, [selectedTime]);
  
  const endGame = useCallback(() => {
    if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
    }
    setGameState('finished');

    const timeUsed = selectedTimeRef.current;
    const finalClicks = clicksRef.current;
    const cps = parseFloat((finalClicks / timeUsed).toFixed(2));
    const target = TARGETS[timeUsed];
    const targetMet = finalClicks >= target;

    let fallbackImageId: string;
    if (targetMet) {
        fallbackImageId = timeUsed === 100 ? 'resultWorldCupImage' : 'resultSuccessImage';
    } else {
        fallbackImageId = FAIL_IMAGE_MAP[timeUsed] || 'resultFailImage';
    }

    const newResult: Result = {
        cps,
        totalClicks: finalClicks,
        timeUsed,
        target: target,
        targetMet,
        imageId: fallbackImageId,
    };
    setResult(newResult);
    setShowResultDialog(true);
  }, []);

  const resetGame = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setGameState('idle');
    setClicks(0);
    setTimeLeft(selectedTime);
    setResult(null);
    setShowResultDialog(false);
    setIsLoading(false);
  }, [selectedTime]);

  const handleTimeChange = (time: number) => {
    if (gameState === 'running') return;
    setSelectedTime(time);
    resetGame();
  };

  useEffect(() => {
    if (gameState === 'running') {
      const startTime = Date.now();
      intervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        const remaining = selectedTimeRef.current - elapsed;
        
        if (remaining <= 0) {
          setTimeLeft(0);
          endGame();
        } else {
          setTimeLeft(remaining);
        }
      }, 10);
    } else if (gameState === 'idle') {
       if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setTimeLeft(selectedTime);
      setClicks(0);
    }
  
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [gameState, endGame, selectedTime]);


  const handleAreaClick = () => {
    if (isLoading || gameState === 'finished') return;

    if (gameState === 'idle') {
      setGameState('running');
    }
    
    if (gameState !== 'finished') {
        setClicks((prev) => prev + 1);
        setIsPulsing(true);
        setTimeout(() => setIsPulsing(false), 100);
    }
  };

  const handleDialogChange = (open: boolean) => {
    if (!open) {
        resetGame();
    }
    setShowResultDialog(open);
  };


  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 md:p-8 font-headline text-foreground bg-grid-slate-100/[0.05] dark:bg-grid-slate-900/[0.2]">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold text-primary tracking-tighter drop-shadow-lg">
          Click Goal Test
        </h1>
        <p className="text-muted-foreground text-lg mt-2">
          Click as Fast as You Can!
        </p>
      </header>

      <Card className="w-full max-w-2xl bg-card/80 backdrop-blur-sm shadow-2xl rounded-2xl overflow-hidden border-2">
        <CardContent className="p-6 md:p-8">
          <div className="flex justify-center gap-2 flex-wrap mb-8">
            {TIME_OPTIONS.map((time, index) => (
              <Button
                key={time}
                variant={selectedTime === time ? 'outline' : 'default'}
                className={cn(
                  'rounded-full font-semibold text-white',
                  selectedTime !== time && BUTTON_COLORS[index % BUTTON_COLORS.length],
                  selectedTime === time && 'border-4 border-primary'
                )}
                onClick={() => handleTimeChange(time)}
                disabled={gameState === 'running'}
              >
                {time}s
              </Button>
            ))}
          </div>

          <div
            className={cn(
                "relative rounded-2xl p-4 sm:p-6 text-center overflow-hidden select-none cursor-pointer transition-transform duration-100 ease-in-out h-64 sm:h-72 md:h-80 flex flex-col justify-between bg-gradient-to-br from-blue-500 to-blue-700",
                'hover:scale-[1.02]',
                isPulsing && 'animate-pulse-click'
            )}
            onClick={handleAreaClick}
            onMouseDown={(e) => e.preventDefault()}
          >
            <div className="relative z-10 flex flex-col items-center">
              
              <div className="grid grid-cols-2 items-center justify-center gap-2 sm:gap-4 w-full text-center text-white">
                <div>
                    <div className="text-3xl sm:text-4xl md:text-5xl font-bold tabular-nums drop-shadow-lg">{timeLeft.toFixed(2)}</div>
                    <div className="text-xs sm:text-sm font-semibold opacity-80">Second</div>
                </div>
                <div>
                    <div className="text-3xl smtext-4xl md:text-5xl font-bold tabular-nums drop-shadow-lg">{clicks}</div>
                    <div className="text-xs sm:text-sm font-semibold opacity-80">Clicks</div>
                </div>
              </div>
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                variant="default"
                size="lg"
                className="w-24 h-24 rounded-full text-2xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground border-0"
                onClick={(e) => { e.stopPropagation(); handleAreaClick(); }}
              >
                Click
              </Button>
            </div>
            <div className="relative z-10 flex flex-col items-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold tabular-nums drop-shadow-lg text-white">{TARGETS[selectedTime]}</div>
                <div className="flex items-center gap-1 text-xs sm:text-sm font-semibold opacity-80 text-white">
                    <Target className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Target</span>
                </div>
            </div>
          </div>
          
        </CardContent>
      </Card>

      {result && (
        <Dialog open={showResultDialog} onOpenChange={handleDialogChange}>
          <DialogContent className="sm:max-w-md text-center">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold text-center">
                {result.targetMet ? '🎉 SIUUU! Target Met! 🎉' : '😢 So Close!'}
              </DialogTitle>
              <DialogDescription className="text-center">
                {result.imageId === 'resultWorldCupImage' ? "You're a true legend!" : "Here are your results."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4 text-center p-4 rounded-lg bg-muted/50 my-4">
              <div>
                <div className="text-4xl font-bold text-accent">{result.cps}</div>
                <div className="text-sm text-muted-foreground">Clicks/Second</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary">{result.totalClicks}</div>
                <div className="text-sm text-muted-foreground">Total Clicks</div>
              </div>
              <div className="col-span-2">
                <div className="text-2xl font-bold">{result.target}</div>
                <div className="text-sm text-muted-foreground">target goal</div>
              </div>
            </div>
            <DialogFooter className="sm:justify-center mt-4">
              <Button onClick={() => handleDialogChange(false)}>
                <Goal className="mr-2" /> Try Again
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
}
