import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useMyProfile, useRankedUserStats } from '../hooks/useQueries';
import ProfilePreview from '../components/ProfilePreview';
import { Crown, Scroll, Trophy, Rocket } from 'lucide-react';
import type { UserStats } from '../backend';

type ViewMode = 'lifetime' | 'daily';

export default function Dashboard() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: profile } = useMyProfile();
  const { data: rankedStats, isLoading } = useRankedUserStats();

  const [viewMode, setViewMode] = useState<ViewMode>('lifetime');

  const stats: UserStats[] = viewMode === 'lifetime'
    ? (rankedStats?.allTime ?? [])
    : (rankedStats?.today ?? []);

  // Sort by totalPoops descending, then totalWipes descending
  const sortedStats = [...stats].sort((a, b) => {
    const poopDiff = Number(b.totalPoops) - Number(a.totalPoops);
    if (poopDiff !== 0) return poopDiff;
    return Number(b.totalWipes) - Number(a.totalWipes);
  });

  // Find current user's stats
  const myPrincipal = identity?.getPrincipal().toString();
  const myStats = sortedStats.find(u => u.principal.toString() === myPrincipal);

  // Find leaders (only if there are entries)
  const hasEntries = sortedStats.some(u => Number(u.totalPoops) > 0);
  const kingPooper = hasEntries
    ? sortedStats.reduce((max, u) => Number(u.totalPoops) > Number(max.totalPoops) ? u : max, sortedStats[0])
    : null;
  const kingWiper = hasEntries
    ? sortedStats.reduce((max, u) => Number(u.totalWipes) > Number(max.totalWipes) ? u : max, sortedStats[0])
    : null;

  const isMVP = kingPooper && kingWiper &&
    kingPooper.principal.toString() === kingWiper.principal.toString() &&
    Number(kingPooper.totalPoops) > 0;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Welcome + Personal Stats */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-black">
                Welcome back, {profile?.displayName}! 👋
              </CardTitle>
              <CardDescription>Ready to log some poops?</CardDescription>
            </div>
            {profile && <ProfilePreview profile={profile} size="md" />}
          </div>
        </CardHeader>
        <CardContent>
          {/* Personal stats mini-row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-muted/60 p-4 text-center">
              <p className="text-3xl font-black text-primary">
                {myStats ? myStats.totalPoops.toString() : '0'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {viewMode === 'lifetime' ? 'Lifetime Poops' : "Today's Poops"}
              </p>
            </div>
            <div className="rounded-lg bg-muted/60 p-4 text-center">
              <p className="text-3xl font-black text-primary">
                {myStats ? myStats.totalWipes.toString() : '0'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {viewMode === 'lifetime' ? 'Lifetime Wipes' : "Today's Wipes"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Log a Poop Button */}
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

      {/* Leaderboard + Standings with Toggle */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              Standings
            </CardTitle>
            {/* Lifetime / Daily Toggle */}
            <div className="flex rounded-lg border-2 border-border overflow-hidden">
              <button
                onClick={() => setViewMode('lifetime')}
                className={`px-4 py-2 text-sm font-bold transition-colors ${
                  viewMode === 'lifetime'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background text-muted-foreground hover:bg-muted'
                }`}
              >
                Lifetime
              </button>
              <button
                onClick={() => setViewMode('daily')}
                className={`px-4 py-2 text-sm font-bold transition-colors ${
                  viewMode === 'daily'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background text-muted-foreground hover:bg-muted'
                }`}
              >
                Today
              </button>
            </div>
          </div>
          <CardDescription>
            {viewMode === 'lifetime' ? 'All-time rankings' : "Today's rankings"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          ) : sortedStats.length === 0 || !hasEntries ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              {viewMode === 'daily'
                ? 'No poops logged today yet. Be the first! 💩'
                : 'No entries yet. Be the first to log a poop and claim the crown! 👑'}
            </p>
          ) : (
            <>
              {/* King Pooper / King Wiper Cards */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* King Pooper */}
                {kingPooper && Number(kingPooper.totalPoops) > 0 && (
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
                        <p className="text-xs text-muted-foreground">Total Poops</p>
                      </div>
                      {isMVP && (
                        <Badge variant="secondary" className="font-bold">🏆 MVP</Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* King Wiper */}
                {kingWiper && Number(kingWiper.totalWipes) > 0 && (
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
                        <p className="text-xs text-muted-foreground">Total Wipes</p>
                      </div>
                      {isMVP && (
                        <Badge variant="secondary" className="font-bold">🏆 MVP</Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {isMVP && kingPooper && (
                <div className="text-center">
                  <p className="text-sm font-bold text-amber-600 dark:text-amber-400">
                    👑 {kingPooper.profile.displayName} holds both titles — the ultimate MVP! 🏆
                  </p>
                </div>
              )}

              {/* Full Rankings Table */}
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Rank</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead className="text-center">Poops</TableHead>
                      <TableHead className="text-center">Wipes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedStats.map((user, index) => {
                      const isKingPooper = kingPooper && user.principal.toString() === kingPooper.principal.toString() && Number(kingPooper.totalPoops) > 0;
                      const isKingWiper = kingWiper && user.principal.toString() === kingWiper.principal.toString() && Number(kingWiper.totalWipes) > 0;
                      const isMe = user.principal.toString() === myPrincipal;

                      return (
                        <TableRow
                          key={user.principal.toString()}
                          className={isMe ? 'bg-primary/5' : ''}
                        >
                          <TableCell className="font-bold text-muted-foreground">
                            #{index + 1}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <ProfilePreview profile={user.profile} size="sm" showName={false} />
                              <div className="flex flex-col">
                                <span className="font-bold">
                                  {user.profile.displayName}
                                  {isMe && <span className="ml-1 text-xs text-muted-foreground">(you)</span>}
                                </span>
                                <div className="flex gap-1 mt-1 flex-wrap">
                                  {isKingPooper && (
                                    <Badge className="bg-amber-500 text-white text-xs px-1 py-0 h-5">
                                      <Crown className="h-2.5 w-2.5 mr-0.5" />
                                      King Pooper
                                    </Badge>
                                  )}
                                  {isKingWiper && (
                                    <Badge className="bg-orange-500 text-white text-xs px-1 py-0 h-5">
                                      <Scroll className="h-2.5 w-2.5 mr-0.5" />
                                      King Wiper
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center font-bold">
                            {user.totalPoops.toString()}
                          </TableCell>
                          <TableCell className="text-center font-bold">
                            {user.totalWipes.toString()}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
