"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { Goal } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { analyzeGameResult } from '@/ai/flows/intelligent-achievement-recognition';

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

const images = PlaceHolderImages.reduce((acc, img) => {
    acc[img.id] = img;
    return acc;
}, {} as Record<string, ImagePlaceholder>);

export default function Home() {
  const [selectedTime, setSelectedTime] = useState(5);
  const [gameState, setGameState] = useState<GameState>('idle');
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(selectedTime);
  const [result, setResult] = useState<Result | null>(null);
  const [isPulsing, setIsPulsing] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const resetGame = useCallback((time: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setGameState('idle');
    setClicks(0);
    setSelectedTime(time);
    setTimeLeft(time);
    setResult(null);
    setShowResultDialog(false);
    startTimeRef.current = null;
    setIsLoading(false);
  }, []);

  const handleTimeChange = (time: number) => {
    if (gameState === 'running') return;
    resetGame(time);
  };
  
  const endGame = useCallback(async () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!startTimeRef.current) return;

    setGameState('finished');
    setIsLoading(true);
    const timeUsed = (Date.now() - startTimeRef.current) / 1000;
    const cps = parseFloat((clicks / timeUsed).toFixed(2));
    const target = TARGETS[selectedTime];
    const targetMet = clicks >= target;

    try {
        const aiResult = await analyzeGameResult({
            cps,
            totalClicks: clicks,
            timeUsed,
            targetMet,
            selectedTime,
            target,
        });

        const newResult: Result = {
            cps,
            totalClicks: clicks,
            timeUsed,
            targetMet,
            target: target,
            imageId: aiResult.imageId,
        };
        setResult(newResult);
        setShowResultDialog(true);
    } catch (error) {
        console.error("AI analysis failed:", error);
        const fallbackImageId = targetMet ? (selectedTime === 100 ? 'resultWorldCupImage' : 'resultSuccessImage') : 'resultFailImage';
        const newResult: Result = {
            cps,
            totalClicks: clicks,
            timeUsed,
            targetMet,
            target: target,
            imageId: fallbackImageId,
        };
        setResult(newResult);
        setShowResultDialog(true);
    } finally {
        setIsLoading(false);
    }
  }, [clicks, selectedTime]);


  useEffect(() => {
    if (gameState === 'running' && startTimeRef.current) {
      intervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - (startTimeRef.current ?? 0)) / 1000;
        const remaining = selectedTime - elapsed;
        if (remaining <= 0) {
          setTimeLeft(0);
          endGame();
        } else {
          setTimeLeft(remaining);
        }
      }, 10);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [gameState, selectedTime, endGame]);


  const handleAreaClick = () => {
    if (gameState === 'finished' || isLoading) return;

    if (gameState === 'idle') {
      setGameState('running');
      startTimeRef.current = Date.now();
    }
    
    setClicks((prev) => prev + 1);

    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 100);
  };

  const resultImage = result ? images[result.imageId] : null;
  
  const clickAreaMessage = () => {
    if (gameState === 'idle') return 'Click on the image of Ronaldo!';
    if (gameState === 'running') return 'Keep Clicking! ⚽';
    if (gameState === 'finished') return isLoading ? 'Analyzing...' : 'Game Over!';
    return '';
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 md:p-8 font-headline text-foreground bg-grid-slate-100/[0.05] dark:bg-grid-slate-900/[0.2]">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold text-primary tracking-tighter drop-shadow-lg">
          ⚽ Ronaldo Goal Test
        </h1>
        <p className="text-muted-foreground text-lg mt-2">
          Click Ronaldo as Fast as You Can!
        </p>
      </header>

      <Card className="w-full max-w-2xl bg-card/80 backdrop-blur-sm shadow-2xl rounded-2xl overflow-hidden border-2">
        <CardContent className="p-6 md:p-8">
          <div className="flex justify-center gap-2 flex-wrap mb-8">
            {TIME_OPTIONS.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? 'default' : 'outline'}
                className="rounded-full font-semibold"
                onClick={() => handleTimeChange(time)}
                disabled={gameState === 'running'}
              >
                {time}s
              </Button>
            ))}
          </div>

          <div
            className={cn(
                "relative rounded-2xl p-6 text-center overflow-hidden select-none cursor-pointer transition-transform duration-100 ease-in-out",
                gameState !== 'finished' && 'hover:scale-[1.02]',
                isPulsing && 'animate-pulse-click',
                (gameState === 'finished' || isLoading) && 'cursor-not-allowed'
            )}
            onClick={handleAreaClick}
            onMouseDown={(e) => e.preventDefault()}
          >
            {images.clickAreaBgImage && <Image 
                src={images.clickAreaBgImage.imageUrl}
                alt="Stadium background"
                fill
                className="object-cover opacity-100"
                data-ai-hint={images.clickAreaBgImage.imageHint}
                priority
            />}
            <div className="relative z-10 flex flex-col items-center">
                {images.ronaldoClickableImage && <Image src={images.ronaldoClickableImage.imageUrl} alt="Cristiano Ronaldo" width={300} height={400} className="object-contain" data-ai-hint={images.ronaldoClickableImage.imageHint} />}
              <h2 className="text-2xl md:text-3xl font-bold mt-4">{clickAreaMessage()}</h2>
              <div className="mt-4 grid grid-cols-3 items-center justify-center gap-4 w-full text-center">
                <div>
                    <div className="text-4xl md:text-5xl font-bold tabular-nums drop-shadow-lg">{timeLeft.toFixed(2)}</div>
                    <div className="text-sm font-semibold opacity-80">Seconds Left</div>
                </div>
                <div>
                    <div className="text-4xl md:text-5xl font-bold tabular-nums drop-shadow-lg">{clicks}</div>
                    <div className="text-sm font-semibold opacity-80">Clicks</div>
                </div>
                 <div>
                    <div className="text-4xl md:text-5xl font-bold tabular-nums drop-shadow-lg">{TARGETS[selectedTime]}</div>
                    <div className="text-sm font-semibold opacity-80">Target</div>
                </div>
              </div>
            </div>
          </div>
          
          {gameState === 'finished' && !isLoading && (
            <div className="mt-6 text-center animate-in fade-in-50 slide-in-from-bottom-10 duration-500">
              <Button size="lg" className="rounded-full font-bold text-lg shadow-lg" onClick={() => resetGame(selectedTime)}>
                <Goal className="mr-2 h-5 w-5" />
                Play Again
              </Button>
            </div>
          )}

        </CardContent>
      </Card>

      {result && (
        <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
          <DialogContent className="sm:max-w-md text-center">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold text-center">
                {result.targetMet ? '🎉 SIUUU! Target Met! 🎉' : '😢 So Close!'}
              </DialogTitle>
              <DialogDescription className="text-center">
                {result.imageId === 'resultWorldCupImage' ? "You're a true legend!" : "Here are your results."}
              </DialogDescription>
            </DialogHeader>
            {resultImage && (
              <div className="flex justify-center my-4">
                <Image src={resultImage.imageUrl} alt={resultImage.description} width={120} height={160} className="drop-shadow-2xl rounded-lg" data-ai-hint={resultImage.imageHint} />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4 text-center p-4 rounded-lg bg-muted/50">
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
                <div className="text-sm text-muted-foreground">Target Clicks</div>
              </div>
            </div>
            <DialogFooter className="sm:justify-center mt-4">
              <Button onClick={() => resetGame(selectedTime)}>
                <Goal className="mr-2" /> Try Again
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      <footer className="text-center mt-8">
        <p className="text-muted-foreground text-sm">© 2024 Ronaldo Goal Test - SIUUU! 🔥</p>
      </footer>
    </main>
  );
}
