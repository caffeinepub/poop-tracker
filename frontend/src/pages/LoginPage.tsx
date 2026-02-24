import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function LoginPage() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950 dark:via-orange-950 dark:to-yellow-950">
      <Card className="w-full max-w-md border-2 shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="text-8xl animate-bounce">💩</div>
          <CardTitle className="text-4xl font-black tracking-tight">
            Poop Tracker
          </CardTitle>
          <CardDescription className="text-lg">
            Track your poops and wipes with friends. Because why not? 🧻
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={login}
            disabled={isLoggingIn}
            size="lg"
            className="w-full text-lg font-bold"
          >
            {isLoggingIn ? 'Logging in...' : 'Login to Start Tracking'}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Secure login powered by Internet Identity
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
