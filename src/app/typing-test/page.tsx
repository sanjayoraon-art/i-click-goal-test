
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Type } from 'lucide-react';

export default function TypingTestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto text-center">
        <Card className="bg-card/80 backdrop-blur-sm shadow-lg rounded-2xl border">
          <CardHeader>
            <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
              <Type className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-3xl md:text-4xl font-bold text-primary mt-4">
              Typing Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-muted-foreground text-lg">
            <p className="text-2xl font-semibold text-foreground">
              Coming Soon!
            </p>
            <p>
              Ready to find out how fast you can type? We are building a comprehensive typing test to measure your Words Per Minute (WPM) and accuracy.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    