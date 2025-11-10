
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Link from 'next/link';
import { Gamepad2 } from 'lucide-react';

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
        {/* Replace ca-pub-XXXXXXXXXXXXXXXX with your own AdSense Publisher ID */}
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className="font-body antialiased">
        <div className="flex flex-col min-h-screen bg-grid-slate-100/[0.05] dark:bg-grid-slate-900/[0.2]">
          <nav className="w-full bg-card/80 backdrop-blur-sm p-4 text-center text-muted-foreground border-b">
              <div className="container mx-auto flex justify-between items-center">
                  <Link href="/" className="font-bold text-2xl text-primary inline-flex items-center gap-2">
                    <Gamepad2 className="h-8 w-8" />
                    <span>Click Games</span>
                  </Link>
                  <div className="flex space-x-4">
                    <Link href="/" className="hover:text-primary">CPS Test</Link>
                    <Link href="/about" className="hover:text-primary">About</Link>
                  </div>
              </div>
          </nav>
          <main className="flex-grow">
            {children}
          </main>
          <footer className="w-full bg-card/80 backdrop-blur-sm p-4 text-center text-muted-foreground border-t">
              <div className="container mx-auto flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <span>&copy; {new Date().getFullYear()} Click Games. All rights reserved.</span>
                  <div className="flex space-x-4">
                    <Link href="/privacy-policy" className="hover:text-primary">Privacy Policy</Link>
                    <Link href="/terms-and-conditions" className="hover:text-primary">Terms & Conditions</Link>
                  </div>
              </div>
          </footer>
        </div>
        <Toaster />
      </body>
    </html>
  );
}

    