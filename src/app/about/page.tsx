
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Card className="bg-card/80 backdrop-blur-sm shadow-lg rounded-2xl border">
          <CardHeader>
            <CardTitle className="text-3xl md:text-4xl font-bold text-primary text-center">
              About Click Games
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-muted-foreground text-lg">
            <p>
              Welcome to Click Games! We are passionate about helping people improve their digital skills in a fun and engaging way. Our primary goal is to provide simple, accurate, and free tools for anyone looking to measure and improve their mouse and keyboard skills.
            </p>
            <p>
              Whether you're a competitive gamer trying to gain an edge, a professional looking to boost your productivity, or just someone curious about your abilities, our tools are designed for you. We believe that improving reaction time, dexterity, and memory can have significant benefits, not just in gaming but in everyday computer use as well.
            </p>
            <p>
              This project was created with the latest web technologies to ensure a smooth, responsive, and enjoyable experience for our users. We are committed to keeping these tools free and accessible to everyone.
            </p>
            <p className="text-center font-semibold pt-4">
              Thank you for using our website. Now, let's get clicking!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    