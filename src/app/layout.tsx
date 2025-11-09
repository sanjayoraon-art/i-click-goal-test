import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Gamepad2, MousePointerClick } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Click Speed Test - Challenge Your Clicks Per Second (CPS)',
  description: 'How fast can you click? Take our free CPS test to measure your click speed, test your aim, and compete with others. Perfect for gamers looking to improve their performance.',
  keywords: ['CPS test', 'click speed test', 'clicks per second', 'aim trainer', 'aim test', 'reaction time'],
  openGraph: {
    title: 'Click Speed Test & Aim Trainer - Challenge Your Skills',
    description: 'How fast can you click? Take our free CPS test to measure your click speed and test your aim. Perfect for gamers looking to improve their performance.',
    url: 'https://your-website-url.com', // Replace with your actual domain
    type: 'website',
    images: [
      {
        url: 'https://picsum.photos/seed/cps-test/1200/630', // Replace with a link to an image for social sharing
        width: 1200,
        height: 630,
        alt: 'Click Speed Test and Aim Trainer Game Interface',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Click Speed Test & Aim Trainer - Challenge Your Skills',
    description: 'Measure your click speed and aim with our interactive tests and see how you rank. Improve your gaming skills today!',
    images: ['https://picsum.photos/seed/cps-test-twitter/1200/630'], // Replace with a link to an image for Twitter sharing
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className="font-body antialiased">
        <nav className="bg-card/80 backdrop-blur-sm sticky top-0 z-50 border-b">
          <div className="container mx-auto flex justify-between items-center p-4">
            <Link href="/" className="font-bold text-xl text-primary">
              <Gamepad2 className="inline-block mr-2" />
              Click Games
            </Link>
            <div className="flex gap-2">
              <Link href="/" passHref>
                <Button variant="ghost">
                  <MousePointerClick className="mr-2 h-4 w-4" />
                  CPS Test
                </Button>
              </Link>
              <Link href="/aim-trainer" passHref>
                <Button variant="ghost">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-goal mr-2 h-4 w-4"><path d="M12 13V2l8 4-8 4"/><path d="M12 22v-9"/><path d="M20 13.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0Z"/><path d="M12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/></svg>
                  Aim Trainer
                </Button>
              </Link>
            </div>
          </div>
        </nav>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
