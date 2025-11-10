
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Target, Gamepad2, History, MousePointerClick, BrainCircuit, Type, Zap, Hash } from 'lucide-react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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

const BUTTON_COLORS = [
  'bg-sky-500 hover:bg-sky-600',
  'bg-teal-500 hover:bg-teal-600',
  'bg-emerald-500 hover:bg-emerald-600',
  'bg-amber-500 hover:bg-amber-600',
  'bg-orange-500 hover:bg-orange-600',
  'bg-red-500 hover:bg-red-600',
];

const otherGames = [
  {
    title: 'Aim Trainer',
    description: 'Improve your precision and speed by clicking on targets.',
    href: '/aim-trainer',
    icon: <MousePointerClick className="h-10 w-10 text-primary" />,
  },
  {
    title: 'Reaction Time Test',
    description: 'Test how fast you can react to on-screen changes.',
    href: '/reaction-time',
    icon: <Zap className="h-10 w-10 text-primary" />,
  },
  {
    title: 'Sequence Memory',
    description: 'Test your short-term memory by repeating sequences.',
    href: '/sequence-memory',
    icon: <BrainCircuit className="h-10 w-10 text-primary" />,
  },
  {
    title: 'Number Memory',
    description: 'Memorize the numbers that appear and recall them.',
    href: '/number-memory',
    icon: <Hash className="h-10 w-10 text-primary" />,
  },
  {
    title: 'Typing Test',
    description: 'Measure your typing speed and accuracy in WPM.',
    href: '/typing-test',
    icon: <Type className="h-10 w-10 text-primary" />,
  },
];


export default function Home() {
  const [selectedTime, setSelectedTime] = useState(5);
  const [gameState, setGameState] = useState<GameState>('idle');
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(selectedTime);
  const [isPulsing, setIsPulsing] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const selectedTimeRef = useRef(selectedTime);

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
  }, []);

  const resetGame = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setGameState('idle');
    setClicks(0);
    setTimeLeft(selectedTime);
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
  
  const cps = clicks > 0 && (selectedTime - timeLeft) > 0 ? (clicks / (selectedTime - timeLeft)).toFixed(2) : '0.00';
  
  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-8 font-headline text-foreground">
        <header className="text-center mb-8 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-primary tracking-tighter drop-shadow-lg">
            Click Speed Test (CPS)
          </h1>
          <p className="text-muted-foreground text-lg mt-2">
            How fast can you click? Test your clicks per second (CPS) and challenge your limits to improve your gaming reaction time!
          </p>
        </header>

          <Card className="w-full max-w-2xl bg-card/80 backdrop-blur-sm shadow-2xl rounded-2xl overflow-hidden border-2 mx-auto">
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
                    "relative rounded-2xl p-4 sm:p-6 text-center overflow-hidden select-none transition-transform duration-100 ease-in-out h-64 sm:h-72 md:h-80 flex flex-col justify-between bg-gradient-to-br from-blue-500 to-blue-700",
                    gameState !== 'finished' && 'cursor-pointer hover:scale-[1.02]',
                    isPulsing && 'animate-pulse-click'
                )}
                onClick={handleAreaClick}
                onMouseDown={(e) => e.preventDefault()}
              >
                 {gameState === 'finished' ? (
                  <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
                    <h2 className="text-2xl md:text-4xl font-bold">Time's Up!</h2>
                    <div className="flex justify-center items-center gap-2 md:gap-4 my-2 md:my-4">
                        <div className="text-center p-2 md:p-4 rounded-lg bg-white/20">
                            <div className="text-2xl md:text-5xl font-bold">{cps}</div>
                            <div className="text-xs md:text-sm">CPS</div>
                        </div>
                        <div className="text-center p-2 md:p-4 rounded-lg bg-white/20">
                            <div className="text-2xl md:text-5xl font-bold">{clicks}</div>
                            <div className="text-xs md:text-sm">Clicks</div>
                        </div>
                        <div className="text-center p-2 md:p-4 rounded-lg bg-white/20">
                           <div className="text-2xl md:text-5xl font-bold">{TARGETS[selectedTime]}</div>
                           <div className="text-xs md:text-sm">Target</div>
                        </div>
                    </div>
                    <Button onClick={resetGame} className="mt-2" size="lg">
                      <History className="mr-2 h-4 w-4" />
                      Play Again
                    </Button>
                  </div>
                ) : (
                  <>
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
                      {gameState === 'idle' && (
                        <Button
                          variant="default"
                          size="lg"
                          className="w-24 h-24 rounded-full text-2xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-lg"
                          onClick={(e) => { e.stopPropagation(); handleAreaClick(); }}
                        >
                          Click
                        </Button>
                      )}
                    </div>

                    <div className="relative z-10 flex flex-col items-center mt-auto">
                        <>
                          <div className="text-3xl sm:text-4xl md:text-5xl font-bold tabular-nums drop-shadow-lg text-white">{TARGETS[selectedTime]}</div>
                          <div className="flex items-center gap-1 text-xs sm:text-sm font-semibold opacity-80 text-white">
                              <Target className="h-4 w-4 sm:h-5 sm:w-5" />
                              <span>Target Goal</span>
                          </div>
                        </>
                    </div>
                  </>
                )}
              </div>
              
            </CardContent>
          </Card>
          
          <section className="w-full max-w-4xl mx-auto mt-12 text-left">
            <Card className="bg-card/80 backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden border-2">
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
          
          <section className="w-full max-w-4xl mx-auto mt-12">
            <h2 className="text-3xl font-bold text-center mb-6">Explore Other Games</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {otherGames.map((game) => (
                <Link href={game.href} key={game.href} className="group">
                  <Card className="bg-card/80 backdrop-blur-sm h-full flex flex-col justify-between transform transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl">
                    <CardHeader className="flex-row items-center gap-4">
                      {game.icon}
                      <CardTitle className="text-2xl font-bold text-primary">{game.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{game.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          <section className="w-full max-w-4xl mx-auto mt-12 text-left">
            <h2 className="text-3xl font-bold text-center mb-6">Time and Targets</h2>
            <Card className="bg-card/80 backdrop-blur-sm shadow-lg rounded-2xl border">
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="font-semibold text-base text-foreground/80">Time Duration</TableHead>
                      <TableHead className="text-right font-semibold text-base text-foreground/80">Target Clicks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(TARGETS).map(([time, target]) => (
                      <TableRow key={time} className="even:bg-muted/20">
                        <TableCell className="font-medium">{time} seconds</TableCell>
                        <TableCell className="text-right font-bold">{target} clicks</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </section>

        <section className="w-full max-w-4xl mx-auto mt-12 text-left">
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
                <p className="text-muted-foreground">Practice is key! Regularly using this test can help improve your muscle memory and reaction time. Additionally, using a good quality gaming mouse and find a comfortable clicking technique (like jitter clicking or butterfly clicking) can also boost your score.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="w-full max-w-4xl mx-auto mt-12 text-left">
          <h2 className="text-3xl font-bold text-center mb-6">Clicking Techniques Comparison</h2>
          <Card className="bg-card/80 backdrop-blur-sm shadow-lg rounded-2xl border">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-semibold text-base text-foreground/80">Technique</TableHead>
                    <TableHead className="font-semibold text-base text-foreground/80">Description</TableHead>
                    <TableHead className="text-right font-semibold text-base text-foreground/80">Potential CPS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="even:bg-muted/20">
                    <TableCell className="font-medium">Regular Clicking</TableCell>
                    <TableCell>Using one finger to click the mouse button normally. This is the most common method.</TableCell>
                    <TableCell className="text-right font-bold">4-8 CPS</TableCell>
                  </TableRow>
                  <TableRow className="even:bg-muted/20">
                    <TableCell className="font-medium">Jitter Clicking</TableCell>
                    <TableCell>Rapidly vibrating your hand or arm muscles to cause your finger to click the mouse button very quickly.</TableCell>
                    <TableCell className="text-right font-bold">10-15 CPS</TableCell>
                  </TableRow>
                  <TableRow className="even:bg-muted/20">
                    <TableCell className="font-medium">Butterfly Clicking</TableCell>
                    <TableCell>Using two fingers (usually index and middle) to alternately click the same mouse button. This can achieve a very high CPS.</TableCell>
                    <TableCell className="text-right font-bold">15-25 CPS</TableCell>
                  </TableRow>
                  <TableRow className="even:bg-muted/20">
                    <TableCell className="font-medium">Drag Clicking</TableCell>
                    <TableCell>Frictionally dragging your finger across the mouse button to register a large number of clicks in a short burst.</TableCell>
                    <TableCell className="text-right font-bold">30+ CPS</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </div>
  );
}

    
