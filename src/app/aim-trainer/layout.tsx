import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Aim Trainer - Test & Improve Your Aiming Skills',
  description: 'Sharpen your mouse accuracy and reaction time with our free Aim Trainer game. Click targets, track your score, and improve your FPS gaming skills across 5 difficulty levels.',
  keywords: ['aim trainer', 'aim test', 'FPS trainer', 'mouse accuracy', 'reaction time game', 'aiming levels'],
};

export default function AimTrainerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
