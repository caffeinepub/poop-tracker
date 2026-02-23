import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import ProfilePreview from '../components/ProfilePreview';
import Leaderboard from '../components/Leaderboard';
import AllTimeStandings from '../components/AllTimeStandings';
import { Rocket } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { actor } = useActor();
  const { identity } = useInternetIdentity();

  const { data: profile } = useQuery({
    queryKey: ['myProfile', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return null;
      return await actor.getMyProfile();
    },
    enabled: !!actor && !!identity,
  });

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-black">
                Welcome back, {profile?.displayName}! 👋
              </CardTitle>
              <CardDescription>Ready to log some poops?</CardDescription>
            </div>
            {profile && <ProfilePreview profile={profile} size="md" />}
          </div>
        </CardHeader>
      </Card>

      {/* Quick Log Button */}
      <Card className="border-2 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20">
        <CardContent className="pt-6">
          <Button
            size="lg"
            className="w-full text-xl font-black py-8"
            onClick={() => navigate({ to: '/log' })}
          >
            <Rocket className="mr-2 h-6 w-6" />
            Log a Poop Now! 💩
          </Button>
        </CardContent>
      </Card>

      {/* Lifetime Leaderboard */}
      <Leaderboard />

      {/* All-Time Standings */}
      <AllTimeStandings />

      {/* Info Card */}
      <Card className="border-2 bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">About This App</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            🎯 <strong>Quick Logging:</strong> Tap the button above to log a poop and enter your wipes.
          </p>
          <p>
            👑 <strong>Compete with Friends:</strong> Climb the leaderboard to become King Pooper or King Wiper!
          </p>
          <p>
            🏆 <strong>MVP Status:</strong> Hold both titles simultaneously to earn the ultimate MVP badge.
          </p>
          <p>
            📊 <strong>Track Stats:</strong> See toilet paper usage and efficiency metrics for all users.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
