
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MousePointerClick } from 'lucide-react';

export default function AimTrainerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto text-center">
        <Card className="bg-card/80 backdrop-blur-sm shadow-lg rounded-2xl border">
          <CardHeader>
            <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
              <MousePointerClick className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-3xl md:text-4xl font-bold text-primary mt-4">
              Aim Trainer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-muted-foreground text-lg">
            <p className="text-2xl font-semibold text-foreground">
              Coming Soon!
            </p>
            <p>
              This exciting new game to test and improve your aiming skills is currently under development. Get ready to click targets and set new high scores!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    