import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'Click Speed Test - Challenge Your Clicks Per Second (CPS)',
  description: 'How fast can you click? Take our free CPS test to measure your click speed and compete with others. Perfect for gamers looking to improve their performance.',
  keywords: ['CPS test', 'click speed test', 'clicks per second', 'click test', 'online clicker', 'gaming skills', 'reaction time'],
  openGraph: {
    title: 'Click Speed Test - Challenge Your Clicks Per Second (CPS)',
    description: 'How fast can you click? Take our free CPS test to measure your click speed and compete with others. Perfect for gamers looking to improve their performance.',
    url: 'https://your-website-url.com', // Replace with your actual domain
    type: 'website',
    images: [
      {
        url: 'https://picsum.photos/seed/cps-test/1200/630', // Replace with a link to an image for social sharing
        width: 1200,
        height: 630,
        alt: 'Click Speed Test Game Interface',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Click Speed Test - Challenge Your Clicks Per Second (CPS)',
    description: 'Measure your click speed with our interactive CPS test and see how you rank. Improve your gaming skills today!',
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
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
