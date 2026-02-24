import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import { EMOJI_OPTIONS, COLOR_OPTIONS, BACKGROUND_OPTIONS } from '../constants/profileOptions';
import ProfilePreview from '../components/ProfilePreview';
import { toast } from 'sonner';

export default function ProfileSetup() {
  const { actor } = useActor();
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

  const previewProfile = {
    displayName: displayName || 'Your Name',
    emoji: selectedEmoji,
    color: selectedColor,
    background: selectedBackground,
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950 dark:via-orange-950 dark:to-yellow-950">
      <Card className="w-full max-w-lg border-2 shadow-xl">
        <CardHeader className="text-center space-y-2">
          <div className="text-5xl">🎨</div>
          <CardTitle className="text-3xl font-black">Create Your Profile</CardTitle>
          <CardDescription className="text-base">
            Customize your poop tracker identity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Live Preview */}
            <div className="flex justify-center py-2">
              <ProfilePreview profile={previewProfile} size="lg" showName={true} />
            </div>

            {/* Display Name */}
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-sm font-bold">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your name..."
                maxLength={30}
                className="text-lg"
              />
            </div>

            {/* Emoji Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-bold">Choose Your Emoji</Label>
              <div className="grid grid-cols-8 gap-1.5">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`w-full aspect-square flex items-center justify-center text-xl rounded-md border-2 transition-all hover:scale-110 ${
                      selectedEmoji === emoji
                        ? 'border-primary bg-primary/10 scale-110'
                        : 'border-border bg-background hover:border-primary/50'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-bold">Choose Your Color</Label>
              <div className="grid grid-cols-10 gap-1.5">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`w-full aspect-square rounded-full border-2 transition-all hover:scale-110 ${
                      selectedColor === color
                        ? 'border-foreground scale-110 ring-2 ring-offset-2 ring-foreground'
                        : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Background Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-bold">Choose Your Background</Label>
              <div className="grid grid-cols-6 gap-1.5">
                {BACKGROUND_OPTIONS.map((bg) => (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => setSelectedBackground(bg)}
                    className={`w-full aspect-square rounded-md border-2 transition-all hover:scale-110 ${
                      selectedBackground === bg
                        ? 'border-foreground scale-110 ring-2 ring-offset-2 ring-foreground'
                        : 'border-transparent'
                    }`}
                    style={{ background: bg }}
                    title="Background option"
                  />
                ))}
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full text-lg font-black"
              disabled={registerMutation.isPending || !displayName.trim()}
            >
              {registerMutation.isPending ? 'Creating Profile...' : 'Create Profile 🚀'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
