import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { CheckCircle2, ArrowLeft } from 'lucide-react';

export default function LogPoop() {
  const navigate = useNavigate();
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const [step, setStep] = useState<'confirm' | 'wipes' | 'success'>('confirm');
  const [numberOfWipes, setNumberOfWipes] = useState('');

  const logPoopMutation = useMutation({
    mutationFn: async (wipes: number) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.createPoopEntry(BigInt(wipes));
    },
    onSuccess: () => {
      setStep('success');
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      toast.success('Poop logged successfully! 🎉');
    },
    onError: (error) => {
      toast.error('Failed to log poop: ' + error.message);
    },
  });

  const handleConfirmPoop = () => {
    setStep('wipes');
  };

  const handleSubmitWipes = (e: React.FormEvent) => {
    e.preventDefault();
    const wipes = parseInt(numberOfWipes);
    if (isNaN(wipes) || wipes < 0) {
      toast.error('Please enter a valid number of wipes');
      return;
    }
    if (wipes > 100) {
      toast.error('That seems like a lot of wipes! Please enter a reasonable number.');
      return;
    }
    logPoopMutation.mutate(wipes);
  };

  const handleReset = () => {
    setStep('confirm');
    setNumberOfWipes('');
  };

  const handleGoHome = () => {
    navigate({ to: '/' });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Button
        variant="ghost"
        onClick={handleGoHome}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>

      {step === 'confirm' && (
        <Card className="border-2 shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="text-9xl animate-bounce">💩</div>
            <CardTitle className="text-4xl font-black">
              Log a Poop?
            </CardTitle>
            <CardDescription className="text-lg">
              Tap the button below to confirm
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              size="lg"
              className="w-full text-2xl font-black py-8"
              onClick={handleConfirmPoop}
            >
              Yes, I Pooped! 🚽
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={handleGoHome}
            >
              Cancel
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 'wipes' && (
        <Card className="border-2 shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="text-9xl">🧻</div>
            <CardTitle className="text-4xl font-black">
              How Many Wipes?
            </CardTitle>
            <CardDescription className="text-lg">
              Enter the number of wipes you used
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitWipes} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="wipes" className="text-lg">Number of Wipes</Label>
                <Input
                  id="wipes"
                  type="number"
                  min="0"
                  max="100"
                  value={numberOfWipes}
                  onChange={(e) => setNumberOfWipes(e.target.value)}
                  placeholder="Enter number..."
                  className="text-2xl text-center h-16"
                  autoFocus
                />
              </div>

              <div className="space-y-3">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full text-xl font-black py-6"
                  disabled={logPoopMutation.isPending}
                >
                  {logPoopMutation.isPending ? 'Logging...' : 'Submit 🚀'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={handleReset}
                  disabled={logPoopMutation.isPending}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {step === 'success' && (
        <Card className="border-2 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle2 className="h-24 w-24 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-4xl font-black">
              Success! 🎉
            </CardTitle>
            <CardDescription className="text-lg">
              Your poop has been logged with {numberOfWipes} wipe{numberOfWipes !== '1' ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              size="lg"
              className="w-full text-xl font-black"
              onClick={handleReset}
            >
              Log Another Poop 💩
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={handleGoHome}
            >
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
