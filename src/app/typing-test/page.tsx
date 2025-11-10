
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Type, Timer, Target, RefreshCw } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const paragraphs = [
  "The quick brown fox jumps over the lazy dog. This sentence contains all the letters of the alphabet. Practice it to improve your typing speed and accuracy. The journey of a thousand miles begins with a single step. Keyboarding is a skill that improves with consistent effort. Don't be discouraged by mistakes; they are part of the learning process. Focus on accuracy first, and speed will follow naturally.",
  "Technology has revolutionized the way we live and work. From smartphones to artificial intelligence, the digital age has connected the world in unprecedented ways. Understanding how to navigate this landscape is essential for modern life. The internet provides access to a vast amount of information, but it's important to be a discerning consumer. Critical thinking and digital literacy are more important than ever before. Always verify sources and be mindful of your digital footprint.",
  "The world of finance can seem complex, with its own language of stocks, bonds, and cryptocurrencies. However, understanding the basics of personal finance is crucial for long-term security. Creating a budget, saving regularly, and investing wisely are the cornerstones of a healthy financial future. It's never too late to start learning about money management. Small, consistent habits can lead to significant financial growth over time. Seek out reliable resources to guide you on your financial journey.",
  "Creativity is not just for artists and musicians; it is a valuable skill in all aspects of life. It is the ability to see things from a different perspective and to come up with new solutions to old problems. Whether you're a programmer, a chef, or an entrepreneur, a creative mindset can help you innovate and excel. You can cultivate creativity by trying new things, stepping out of your comfort zone, and allowing yourself to experiment without fear of failure. The more you use your creativity, the stronger it will become.",
  "History is not just a collection of dates and events; it is the story of humanity. By studying the past, we can better understand the present and make more informed decisions about the future. From the rise and fall of empires to the scientific discoveries that changed the world, history offers countless lessons. It teaches us about the complexities of human nature, the consequences of our actions, and the enduring power of ideas. Engaging with history helps us become more informed and empathetic global citizens."
];

const GAME_DURATION = 60; // 60 seconds

type GameState = 'idle' | 'running' | 'finished';

export default function TypingTestPage() {
  const [textToType, setTextToType] = useState('');
  const [userInput, setUserInput] = useState('');
  const [gameState, setGameState] = useState<GameState>('idle');
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [errors, setErrors] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const resetGame = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    const newText = paragraphs[Math.floor(Math.random() * paragraphs.length)];
    setTextToType(newText);
    setUserInput('');
    setGameState('idle');
    setTimeLeft(GAME_DURATION);
    setErrors(0);
    setTotalChars(0);
    setCorrectChars(0);
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  useEffect(() => {
    if (gameState === 'running' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      setGameState('finished');
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState, timeLeft]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (gameState === 'finished') return;

    if (gameState === 'idle') {
      setGameState('running');
    }

    let currentErrors = 0;
    let currentCorrectChars = 0;

    const textToCompare = textToType.substring(0, value.length);
    for(let i=0; i<value.length; i++) {
        if(value[i] === textToCompare[i]) {
            currentCorrectChars++;
        } else {
            currentErrors++;
        }
    }
    
    setUserInput(value);
    setErrors(currentErrors);
    setTotalChars(value.length);
    setCorrectChars(currentCorrectChars);
  };
  
  const wpm = gameState === 'finished' ? Math.round((correctChars / 5) / (GAME_DURATION / 60)) : 0;
  const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-8 max-w-4xl mx-auto">
        <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
          <Type className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-primary tracking-tighter drop-shadow-lg">
          Typing Test
        </h1>
        <p className="text-muted-foreground text-lg mt-2">
          Measure your typing speed and accuracy. How many words per minute can you type?
        </p>
      </header>

      <div className="max-w-4xl mx-auto">
        <Card className="bg-card/80 backdrop-blur-sm shadow-lg rounded-2xl border overflow-hidden">
          <CardHeader>
            <div className="grid grid-cols-3 items-center text-center">
              <div className="text-left">
                <div className="text-2xl md:text-4xl font-bold text-primary tabular-nums">{timeLeft}</div>
                <div className="text-sm text-muted-foreground">Seconds</div>
              </div>
              <div>
                <div className="text-2xl md:text-4xl font-bold text-sky-500 tabular-nums">{gameState === 'finished' ? wpm : 0}</div>
                <div className="text-sm text-muted-foreground">WPM</div>
              </div>
              <div className="text-right">
                <div className="text-2xl md:text-4xl font-bold text-green-500 tabular-nums">{gameState === 'finished' ? accuracy : 100}%</div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </div>
            </div>
          </CardHeader>
          <CardContent onClick={() => inputRef.current?.focus()}>
            <div className="relative rounded-lg bg-muted/50 p-4 sm:p-6 text-xl sm:text-2xl tracking-wider leading-relaxed font-code select-none cursor-text h-64 overflow-hidden">
              {textToType.split('').map((char, index) => {
                let color = 'text-muted-foreground';
                if (index < userInput.length) {
                  color = char === userInput[index] ? 'text-foreground' : 'text-red-500 bg-red-500/20';
                }
                return (
                  <span key={index} className={cn('transition-colors', color)}>
                    {index === userInput.length && (
                        <span className="absolute animate-pulse">|</span>
                    )}
                    {char}
                  </span>
                );
              })}
            </div>
            <input
              ref={inputRef}
              type="text"
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-text"
              value={userInput}
              onChange={handleInputChange}
              onPaste={(e) => e.preventDefault()}
              disabled={gameState === 'finished'}
            />
             {gameState === 'finished' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 z-10 p-4 text-center">
                  <h2 className="text-2xl md:text-3xl font-bold text-primary">Test Finished!</h2>
                  <div className="flex justify-center items-stretch gap-2 md:gap-4 my-4">
                      <div className="text-center p-2 md:p-4 rounded-lg bg-sky-100 dark:bg-sky-900/50 min-w-[5rem]">
                          <div className="text-2xl md:text-4xl font-bold text-sky-500">{wpm}</div>
                          <div className="text-xs uppercase">WPM</div>
                      </div>
                      <div className="text-center p-2 md:p-4 rounded-lg bg-green-100 dark:bg-green-900/50 min-w-[5rem]">
                         <div className="text-2xl md:text-4xl font-bold text-green-500">{accuracy}%</div>
                         <div className="text-xs uppercase">Accuracy</div>
                      </div>
                      <div className="text-center p-2 md:p-4 rounded-lg bg-amber-100 dark:bg-amber-900/50 min-w-[5rem]">
                          <div className="text-2xl md:text-4xl font-bold">{correctChars}</div>
                          <div className="text-xs uppercase">Correct</div>
                      </div>
                      <div className="text-center p-2 md:p-4 rounded-lg bg-red-100 dark:bg-red-900/50 min-w-[5rem]">
                         <div className="text-2xl md:text-4xl font-bold text-red-500">{errors}</div>
                         <div className="text-xs uppercase">Errors</div>
                      </div>
                  </div>
                  <Button onClick={resetGame} size="lg">
                    <RefreshCw className="mr-2 h-5 w-5" />
                    Restart
                  </Button>
                </div>
              )}
          </CardContent>
        </Card>

        <section className="w-full max-w-4xl mx-auto mt-12 text-left">
          <Card className="bg-card/80 backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden border-2">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">How to Play & Improve</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-muted-foreground">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">How to Play</h3>
                <ol className="list-decimal list-inside space-y-2">
                  <li>The test will start automatically as soon as you begin typing in the text box.</li>
                  <li>A 60-second timer will start counting down.</li>
                  <li>Type the provided text as quickly and accurately as you can.</li>
                  <li>Correctly typed characters will appear in a dark color, while mistakes will be highlighted in red.</li>
                  <li>When the time is up, your results for WPM (Words Per Minute) and accuracy will be displayed.</li>
                  <li>Click "Restart" to try again with a new text.</li>
                </ol>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Tips to Improve Typing Speed</h3>
                 <ul className="list-disc list-inside space-y-2">
                    <li>**Focus on Accuracy:** Speed is important, but accuracy is the foundation. Slow down and focus on hitting the right keys. Speed will naturally increase as your accuracy improves.</li>
                    <li>**Proper Posture:** Sit up straight with your feet flat on the floor. Keep your wrists straight and avoid resting them on the keyboard or desk.</li>
                    <li>**Learn Touch Typing:** Avoid looking at the keyboard. Memorize the key positions and trust your muscle memory. This is the single most effective way to become a faster typist.</li>
                    <li>**Practice Consistently:** Like any skill, typing improves with regular practice. Dedicate a small amount of time each day to practice, and you'll see significant improvement over time.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="w-full max-w-4xl mx-auto mt-12 text-left">
            <h2 className="text-3xl font-bold text-center mb-6">Typing Speed Ranking (WPM)</h2>
            <Card className="bg-card/80 backdrop-blur-sm shadow-lg rounded-2xl border">
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="font-semibold text-base text-foreground/80">Words Per Minute (WPM)</TableHead>
                      <TableHead className="text-right font-semibold text-base text-foreground/80">Rank</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="even:bg-muted/20">
                      <TableCell className="font-medium">0 - 40 WPM</TableCell>
                      <TableCell className="text-right font-bold text-red-500">Below Average</TableCell>
                    </TableRow>
                    <TableRow className="even:bg-muted/20">
                      <TableCell className="font-medium">40 - 60 WPM</TableCell>
                      <TableCell className="text-right font-bold text-amber-500">Average</TableCell>
                    </TableRow>
                     <TableRow className="even:bg-muted/20">
                      <TableCell className="font-medium">60 - 80 WPM</TableCell>
                      <TableCell className="text-right font-bold text-sky-500">Above Average</TableCell>
                    </TableRow>
                    <TableRow className="even:bg-muted/20">
                      <TableCell className="font-medium">80 - 100 WPM</TableCell>
                      <TableCell className="text-right font-bold text-green-500">Productive</TableCell>
                    </TableRow>
                    <TableRow className="even:bg-muted/20">
                      <TableCell className="font-medium">100+ WPM</TableCell>
                      <TableCell className="text-right font-bold text-emerald-500">Professional</TableCell>
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

    