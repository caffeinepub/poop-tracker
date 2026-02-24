import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Crown, Scroll, Trophy } from 'lucide-react';
import { useRankedUserStats } from '../hooks/useQueries';
import ProfilePreview from './ProfilePreview';
import { Skeleton } from '@/components/ui/skeleton';

export default function AllTimeStandings() {
  const { data: userStats, isLoading } = useRankedUserStats();

  if (isLoading) {
    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            All-Time Standings
          </CardTitle>
          <CardDescription>Loading complete rankings...</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!userStats || userStats.length === 0) {
    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            All-Time Standings
          </CardTitle>
          <CardDescription>Complete rankings and statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No data yet. Start logging to see the standings! 📊
          </p>
        </CardContent>
      </Card>
    );
  }

  // Sort by totalPoops descending, then by totalWipes descending
  const sortedStats = [...userStats].sort((a, b) => {
    const poopDiff = Number(b.totalPoops) - Number(a.totalPoops);
    if (poopDiff !== 0) return poopDiff;
    return Number(b.totalWipes) - Number(a.totalWipes);
  });

  // Find leaders
  const kingPooper = sortedStats.reduce((max, user) =>
    Number(user.totalPoops) > Number(max.totalPoops) ? user : max
  , sortedStats[0]);

  const kingWiper = sortedStats.reduce((max, user) =>
    Number(user.totalWipes) > Number(max.totalWipes) ? user : max
  , sortedStats[0]);

  const calculateTPRolls = (totalWipes: bigint): string => {
    const sheetsPerWipe = 3;
    const sheetsPerRoll = 200;
    const rolls = (Number(totalWipes) * sheetsPerWipe) / sheetsPerRoll;
    return rolls.toFixed(1);
  };

  const calculateAvgWipes = (totalWipes: bigint, totalPoops: bigint): string => {
    if (Number(totalPoops) === 0) return '--';
    const avg = Number(totalWipes) / Number(totalPoops);
    return avg.toFixed(1);
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          All-Time Standings
        </CardTitle>
        <CardDescription>
          Complete rankings with detailed statistics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">Rank</TableHead>
                <TableHead>User</TableHead>
                <TableHead className="text-center">Poops</TableHead>
                <TableHead className="text-center">Wipes</TableHead>
                <TableHead className="text-center">TP Rolls</TableHead>
                <TableHead className="text-center">Avg Wipes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedStats.map((user, index) => {
                const isKingPooper = user.principal.toString() === kingPooper.principal.toString();
                const isKingWiper = user.principal.toString() === kingWiper.principal.toString();

                return (
                  <TableRow key={user.principal.toString()}>
                    <TableCell className="font-bold text-muted-foreground">
                      #{index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <ProfilePreview profile={user.profile} size="sm" showName={false} />
                        <div className="flex flex-col">
                          <span className="font-bold">{user.profile.displayName}</span>
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
                    <TableCell className="text-center text-muted-foreground">
                      {calculateTPRolls(user.totalWipes)}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {calculateAvgWipes(user.totalWipes, user.totalPoops)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
