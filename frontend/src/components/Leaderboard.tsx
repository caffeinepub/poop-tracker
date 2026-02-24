import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Scroll } from 'lucide-react';
import { useRankedUserStats } from '../hooks/useQueries';
import ProfilePreview from './ProfilePreview';
import { Skeleton } from '@/components/ui/skeleton';

export default function Leaderboard() {
  const { data: userStats, isLoading } = useRankedUserStats();

  if (isLoading) {
    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Lifetime Leaderboard
          </CardTitle>
          <CardDescription>Loading rankings...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!userStats || userStats.length === 0) {
    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Lifetime Leaderboard
          </CardTitle>
          <CardDescription>The throne awaits its first champion</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No entries yet. Be the first to log a poop and claim the crown! 👑
          </p>
        </CardContent>
      </Card>
    );
  }

  // Find King Pooper (highest totalPoops)
  const kingPooper = userStats.reduce((max, user) =>
    Number(user.totalPoops) > Number(max.totalPoops) ? user : max
  , userStats[0]);

  // Find King Wiper (highest totalWipes)
  const kingWiper = userStats.reduce((max, user) =>
    Number(user.totalWipes) > Number(max.totalWipes) ? user : max
  , userStats[0]);

  // MVP: the same person holds BOTH King Pooper AND King Wiper titles
  const isMVP =
    kingPooper.principal.toString() === kingWiper.principal.toString();

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-amber-500" />
          Lifetime Leaderboard
        </CardTitle>
        <CardDescription>
          Bow down to the champions of the throne
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {/* King Pooper */}
          <div className="relative rounded-lg border-2 border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 p-4">
            <div className="absolute -top-3 left-4">
              <Badge className="bg-amber-500 text-white font-black">
                <Crown className="h-3 w-3 mr-1" />
                King Pooper
              </Badge>
            </div>
            <div className="flex flex-col items-center gap-3 pt-2">
              <ProfilePreview profile={kingPooper.profile} size="lg" showName={true} />
              <div className="text-center">
                <p className="text-3xl font-black text-amber-600 dark:text-amber-400">
                  {kingPooper.totalPoops.toString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  Total Poops
                </p>
              </div>
              {isMVP && (
                <Badge variant="secondary" className="font-bold">
                  🏆 MVP
                </Badge>
              )}
            </div>
          </div>

          {/* King Wiper */}
          <div className="relative rounded-lg border-2 border-orange-500 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 p-4">
            <div className="absolute -top-3 left-4">
              <Badge className="bg-orange-500 text-white font-black">
                <Scroll className="h-3 w-3 mr-1" />
                King Wiper
              </Badge>
            </div>
            <div className="flex flex-col items-center gap-3 pt-2">
              <ProfilePreview profile={kingWiper.profile} size="lg" showName={true} />
              <div className="text-center">
                <p className="text-3xl font-black text-orange-600 dark:text-orange-400">
                  {kingWiper.totalWipes.toString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  Total Wipes
                </p>
              </div>
              {isMVP && (
                <Badge variant="secondary" className="font-bold">
                  🏆 MVP
                </Badge>
              )}
            </div>
          </div>
        </div>

        {isMVP && (
          <div className="mt-4 text-center">
            <p className="text-sm font-bold text-amber-600 dark:text-amber-400">
              👑 {kingPooper.profile.displayName} holds both titles — the ultimate MVP! 🏆
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
