
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BrainCircuit, History, Lightbulb } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type GameState = 'idle' | 'showing' | 'waiting' | 'gameover';
type FeedbackType = 'correct' | 'incorrect' | null;

const GRID_SIZE = 9;

export default function SequenceMemoryPage() {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [level, setLevel] = useState(1);
  const [activeBlock, setActiveBlock] = useState<number | null>(null);
  const [feedbackBlock, setFeedbackBlock] = useState<{ index: number, type: FeedbackType } | null>(null);
  const [gameOverSequence, setGameOverSequence] = useState<number[]>([]);

  const generateNextInSequence = useCallback(() => {
    let nextBlock;
    const lastBlock = sequence.length > 0 ? sequence[sequence.length - 1] : -1;
    do {
      nextBlock = Math.floor(Math.random() * GRID_SIZE);
    } while (nextBlock === lastBlock);
    return [...sequence, nextBlock];
  }, [sequence]);

  const startGame = () => {
    setSequence([]);
    setUserSequence([]);
    setLevel(1);
    setFeedbackBlock(null);
    setGameOverSequence([]);
    setGameState('showing');
  };

  const showSequence = useCallback(async (seq: number[]) => {
    setGameState('showing');
    await new Promise(resolve => setTimeout(resolve, 500)); 
    for (const blockIndex of seq) {
      setActiveBlock(blockIndex);
      await new Promise(resolve => setTimeout(resolve, 400)); 
      setActiveBlock(null);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    setGameState('waiting');
  }, []);

  useEffect(() => {
    if (gameState === 'showing' && level > sequence.length) {
        const newSequence = generateNextInSequence();
        setSequence(newSequence);
        setUserSequence([]);
        showSequence(newSequence);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, gameState]);


  const handleBlockClick = (index: number) => {
    if (gameState !== 'waiting') return;

    const newPlayerSequence = [...userSequence, index];
    setUserSequence(newPlayerSequence);
    
    const isCorrect = newPlayerSequence[newPlayerSequence.length - 1] === sequence[newPlayerSequence.length - 1];

    if (isCorrect) {
        setFeedbackBlock({ index, type: 'correct' });
        setTimeout(() => setFeedbackBlock(null), 200);

        if (newPlayerSequence.length === sequence.length) {
            setTimeout(() => {
                setLevel(prevLevel => prevLevel + 1);
                setGameState('showing');
            }, 500);
        }
    } else {
        setFeedbackBlock({ index, type: 'incorrect' });
        setGameOverSequence(sequence);
        setGameState('gameover');
    }
  };
  
  const getStatusMessage = () => {
      switch(gameState) {
          case 'idle':
            return <span className="text-muted-foreground">Click "Start" to begin.</span>;
          case 'showing':
            return 'Watch carefully...';
          case 'waiting':
            return 'Your turn!';
          case 'gameover':
            return (
              <span>
                <span className="text-red-500">Game Over!</span> You reached level {level}.
              </span>
            );
          default:
            return '';
      }
  }

  const getBlockClass = (index: number) => {
    if (activeBlock === index) {
      return 'bg-primary scale-105 shadow-lg';
    }
    if (gameState === 'gameover') {
        if (feedbackBlock?.index === index) return 'bg-red-500';
    }
    if (feedbackBlock?.index === index && feedbackBlock.type === 'incorrect') {
        return 'bg-red-500';
    }
    if(gameState === 'waiting' && feedbackBlock?.index === index && feedbackBlock.type === 'correct') {
        return 'bg-sky-500';
    }
    if(gameState === 'waiting') {
        return 'cursor-pointer bg-muted/50 hover:bg-primary/20';
    }
    if (gameState === 'gameover') {
      if (gameOverSequence.includes(index)) return 'bg-sky-500/50';
    }
    return 'bg-muted/30';
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-8 max-w-4xl mx-auto">
        <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
          <BrainCircuit className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-primary tracking-tighter drop-shadow-lg">
          Sequence Memory Test
        </h1>
        <p className="text-muted-foreground text-lg mt-2">
          Memorize the flashing sequence and repeat it. How long can you last?
        </p>
      </header>

      <div className="max-w-4xl mx-auto">
        <Card className="bg-card/80 backdrop-blur-sm shadow-lg rounded-2xl border overflow-hidden">
          <CardHeader>
            <div className="flex justify-between items-center">
                 <h2 className="text-2xl font-bold text-center w-full">{getStatusMessage()}</h2>
            </div>
            <div className="text-center text-xl font-bold text-muted-foreground">
                Level: <span className="text-primary">{level}</span>
            </div>
          </CardHeader>
          <CardContent>
            {gameState === 'idle' ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
                    <Button onClick={startGame} size="lg">
                        Start Game
                        <History className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-sm mx-auto">
                {[...Array(GRID_SIZE)].map((_, i) => {
                  const sequenceIndices = gameOverSequence.reduce((acc: number[], val, idx) => {
                    if (val === i) acc.push(idx + 1);
                    return acc;
                  }, []);

                  return (
                    <div
                    key={i}
                    onClick={() => handleBlockClick(i)}
                    className={cn(
                        'w-full aspect-square rounded-lg transition-all duration-200 flex items-center justify-center text-xl sm:text-2xl font-bold text-white',
                        getBlockClass(i)
                    )}
                    >
                      {gameState === 'gameover' && sequenceIndices.length > 0 && (
                        <div className="flex flex-wrap gap-1 justify-center items-center">
                          {sequenceIndices.map(seqIdx => (
                            <span key={seqIdx} className="bg-sky-500 rounded-full h-8 w-8 flex items-center justify-center text-sm">{seqIdx}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
                </div>
            )}
             {gameState === 'gameover' && (
                <div className="flex justify-center mt-6">
                    <Button onClick={startGame} size="lg">
                        Play Again
                        <History className="ml-2 h-5 w-5" />
                    </Button>
                </div>
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
                  <li>The game will flash a sequence of squares. Watch and memorize the pattern.</li>
                  <li>Once the sequence is finished, it's your turn! Click the squares in the exact same order.</li>
                  <li>If you are correct, you will advance to the next level, and the sequence will get one step longer.</li>
                  <li>If you make a mistake, the game is over, and your score (the highest level you reached) is displayed.</li>
                  <li>Challenge yourself to beat your high score!</li>
                </ol>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Benefits of Sequence Memory Games</h3>
                <p>
                  This game is a great way to challenge and improve your short-term memory, also known as working memory. This type of memory is crucial for tasks that involve holding information temporarily to manipulate it, such as following instructions, mental arithmetic, and problem-solving. Regularly playing memory games can help enhance your focus, concentration, and cognitive flexibility.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

      </div>
    </div>
  );
}
