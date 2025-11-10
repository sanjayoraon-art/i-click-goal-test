import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Number Memory Test - Challenge Your Short-Term Memory',
  description: 'Test and improve your short-term memory with our free Number Memory game. How many digits can you remember? A great brain training exercise to improve your number recall skills.',
  keywords: ['number memory test', 'memory game', 'brain training', 'cognitive skills', 'short-term memory', 'digit span'],
};

export default function NumberMemoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
