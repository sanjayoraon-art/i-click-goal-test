
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Goal, Target } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

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
};

const BUTTON_COLORS = [
  'bg-sky-500 hover:bg-sky-600',
  'bg-teal-500 hover:bg-teal-600',
  'bg-emerald-500 hover:bg-emerald-600',
  'bg-amber-500 hover:bg-amber-600',
  'bg-orange-500 hover:bg-orange-600',
  'bg-red-500 hover:bg-red-600',
];

export default function Home() {
  const [selectedTime, setSelectedTime] = useState(5);
  const [gameState, setGameState] = useState<GameState>('idle');
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(selectedTime);
  const [result, setResult] = useState<Result | null>(null);
  const [isPulsing, setIsPulsing] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);

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

    const newResult: Result = {
      cps,
      totalClicks: finalClicks,
      timeUsed,
      targetMet,
      target,
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
    if (gameState === 'finished') return;

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
    <>
    <main className="flex min-h-screen w-full flex-col items-center p-4 md:p-8 font-headline text-foreground bg-grid-slate-100/[0.05] dark:bg-grid-slate-900/[0.2]">
      <header className="text-center mb-8 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-primary tracking-tighter drop-shadow-lg">
          Click Speed Test (CPS)
        </h1>
        <p className="text-muted-foreground text-lg mt-2">
          How fast can you click? Test your clicks per second (CPS) and challenge your limits to improve your gaming reaction time!
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
                    <div className="text-xs sm:text-sm font-semibold opacity-80">Seconds</div>
                </div>
                <div>
                    <div className="text-3xl sm:text-4xl md:text-5xl font-bold tabular-nums drop-shadow-lg">{clicks}</div>
                    <div className="text-xs sm:text-sm font-semibold opacity-80">Clicks</div>
                </div>
              </div>
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                variant="default"
                size="lg"
                className="w-24 h-24 rounded-full text-2xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-lg"
                onClick={(e) => { e.stopPropagation(); handleAreaClick(); }}
              >
                Click
              </Button>
            </div>
            <div className="relative z-10 flex flex-col items-center mt-auto">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold tabular-nums drop-shadow-lg text-white">{TARGETS[selectedTime]}</div>
                <div className="flex items-center gap-1 text-xs sm:text-sm font-semibold opacity-80 text-white">
                    <Target className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Target Goal</span>
                </div>
            </div>
          </div>
          
        </CardContent>
      </Card>
      
      <section className="w-full max-w-4xl mx-auto mt-12 text-left">
        <Card className="bg-card/80 backdrop-blur-sm shadow-lg rounded-2xl border">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">About the Click Speed Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              The Clicks Per Second (CPS) test is a simple yet effective way to measure your clicking speed. It's a fun tool used by gamers and professionals alike to test and improve their mouse-clicking abilities and reaction time. A higher CPS score is often crucial in games that require quick actions, such as first-person shooters (FPS) or real-time strategy (RTS) games.
            </p>
            <p>
              Our Click Goal Test allows you to challenge yourself against set targets in various time intervals, from a quick 5-second sprint to a 100-second marathon. Meeting the target proves your clicking prowess!
            </p>
          </CardContent>
        </Card>
      </section>
      
      <section className="w-full max-w-4xl mx-auto mt-8 text-left">
        <h2 className="text-3xl font-bold text-center mb-6">Frequently Asked Questions (FAQ)</h2>
        <div className="space-y-4">
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <div className="text-lg font-semibold">What is CPS?</div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">CPS stands for "Clicks Per Second." It is a measure of how many times you can click a mouse button in one second.</p>
            </CardContent>
          </Card>
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <div className="text-lg font-semibold">How is CPS calculated?</div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">The formula is simple: CPS = Total Clicks / Time in Seconds. Our tool calculates this for you automatically when the time runs out.</p>
            </CardContent>
          </Card>
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <div className="text-lg font-semibold">How can I improve my CPS score?</div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Practice is key! Regularly using this test can help improve your muscle memory and reaction time. Additionally, using a good quality gaming mouse and finding a comfortable clicking technique (like jitter clicking or butterfly clicking) can also boost your score.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {result && (
        <Dialog open={showResultDialog} onOpenChange={handleDialogChange}>
          <DialogContent
            className={cn(
              'max-w-xs sm:max-w-md text-center border rounded-lg max-h-[90vh] overflow-y-auto',
              result.targetMet ? 'bg-green-100' : 'bg-purple-100'
            )}
          >
            <DialogHeader className="p-4 items-center">
              <DialogTitle className="text-2xl sm:text-3xl font-bold text-center">
                  {result.targetMet ? 'Awesome! Target Met!' : 'So Close!'}
              </DialogTitle>
              <DialogDescription className="text-center text-sm sm:text-base">
                Here are your results.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4 text-center p-4 rounded-lg bg-muted/50 my-4 mx-4">
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-teal-500">{result.cps}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Clicks/Second</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-amber-500">{result.totalClicks}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Total Clicks</div>
              </div>
              <div className="col-span-2 mt-2">
                <div className="text-xl sm:text-2xl font-bold">{result.target}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Target goals</div>
              </div>
            </div>
            <DialogFooter className="sm:justify-center p-4">
              <Button onClick={() => handleDialogChange(false)}>
                <Goal className="mr-2" /> Try Again
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </main>
    <footer className="w-full bg-card/80 backdrop-blur-sm p-4 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Click Goal Test. All rights reserved.</p>
    </footer>
    </>
  );
}
