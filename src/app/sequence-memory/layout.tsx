import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Sequence Memory Test - Challenge Your Short-Term Memory',
  description: 'Test and improve your short-term visual memory with our free Sequence Memory game. Memorize the pattern of flashing squares and see how high you can score. A great brain training exercise!',
  keywords: ['sequence memory test', 'memory game', 'brain training', 'cognitive skills', 'short-term memory', 'visual memory'],
};

export default function SequenceMemoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
