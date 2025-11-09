
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function AboutPage() {
  return (
    <>
      <div className="flex flex-col min-h-screen bg-grid-slate-100/[0.05] dark:bg-grid-slate-900/[0.2]">
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <Card className="bg-card/80 backdrop-blur-sm shadow-lg rounded-2xl border">
              <CardHeader>
                <CardTitle className="text-3xl md:text-4xl font-bold text-primary text-center">
                  About Our Click Speed Test
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-muted-foreground text-lg">
                <p>
                  Welcome to our Click Speed Test (CPS) website! We are passionate about helping people improve their digital skills in a fun and engaging way. Our primary goal is to provide a simple, accurate, and free tool for anyone looking to measure and improve their mouse-clicking speed.
                </p>
                <p>
                  Whether you're a competitive gamer trying to gain an edge, a professional looking to boost your productivity, or just someone curious about your clicking abilities, our tool is designed for you. We believe that improving reaction time and mouse dexterity can have significant benefits, not just in gaming but in everyday computer use as well.
                </p>
                <p>
                  This project was created with the latest web technologies to ensure a smooth, responsive, and enjoyable experience for our users. We are committed to keeping this tool free and accessible to everyone.
                </p>
                <p className="text-center font-semibold pt-4">
                  Thank you for using our website. Now, let's get clicking!
                </p>
              </CardContent>
            </Card>
            <div className="text-center mt-8">
              <Link href="/">
                <Button>
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
      <footer className="w-full bg-card/80 backdrop-blur-sm p-4 text-center text-muted-foreground">
          <div className="container mx-auto flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <span>&copy; {new Date().getFullYear()} Click Speed Test. All rights reserved.</span>
              <div className="flex space-x-4">
                <Link href="/about" className="hover:text-primary">About Us</Link>
                <Link href="/privacy-policy" className="hover:text-primary">Privacy Policy</Link>
                <Link href="/terms-and-conditions" className="hover:text-primary">Terms & Conditions</Link>
              </div>
          </div>
      </footer>
    </>
  );
}
