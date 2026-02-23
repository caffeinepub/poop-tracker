import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { EMOJI_OPTIONS, COLOR_OPTIONS, BACKGROUND_OPTIONS } from '../constants/profileOptions';
import ProfilePreview from '../components/ProfilePreview';
import { toast } from 'sonner';

export default function ProfileSetup() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const [displayName, setDisplayName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(EMOJI_OPTIONS[0]);
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
  const [selectedBackground, setSelectedBackground] = useState(BACKGROUND_OPTIONS[0]);

  const registerMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.register({
        displayName,
        emoji: selectedEmoji,
        color: selectedColor,
        background: selectedBackground,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      toast.success('Profile created! 🎉');
    },
    onError: (error) => {
      toast.error('Failed to create profile: ' + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      toast.error('Please enter a display name');
      return;
    }
    registerMutation.mutate();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950 dark:via-orange-950 dark:to-yellow-950">
      <Card className="w-full max-w-2xl border-2 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-black">Create Your Profile</CardTitle>
          <CardDescription className="text-base">
            Customize your poop tracking persona
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Preview */}
            <div className="flex justify-center">
              <ProfilePreview
                profile={{
                  displayName: displayName || 'Your Name',
                  emoji: selectedEmoji,
                  color: selectedColor,
                  background: selectedBackground,
                }}
                size="lg"
              />
            </div>

            {/* Display Name */}
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your name"
                maxLength={30}
              />
            </div>

            {/* Emoji Selection */}
            <div className="space-y-2">
              <Label>Choose Your Emoji</Label>
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`flex items-center justify-center text-3xl p-3 rounded-lg border-2 transition-all hover:scale-110 ${
                      selectedEmoji === emoji
                        ? 'border-primary bg-primary/10 scale-110'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="space-y-2">
              <Label>Choose Your Color</Label>
              <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`h-12 rounded-lg border-2 transition-all hover:scale-110 ${
                      selectedColor === color
                        ? 'border-foreground scale-110 ring-2 ring-offset-2 ring-foreground'
                        : 'border-border'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Background Selection */}
            <div className="space-y-2">
              <Label>Choose Your Background Style</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {BACKGROUND_OPTIONS.map((bg) => (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => setSelectedBackground(bg)}
                    className={`h-20 rounded-lg border-2 transition-all hover:scale-105 ${
                      selectedBackground === bg
                        ? 'border-primary ring-2 ring-offset-2 ring-primary scale-105'
                        : 'border-border'
                    }`}
                    style={{
                      background: bg,
                    }}
                  />
                ))}
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full text-lg font-bold"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? 'Creating Profile...' : 'Create Profile 🚀'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
