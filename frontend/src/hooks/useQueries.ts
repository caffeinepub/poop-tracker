import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { Profile, UserStats } from '../backend';

export function useMyProfile() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  const isActorReady = !!actor && !isFetching && !!identity;

  return useQuery<Profile | null>({
    queryKey: ['myProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not ready');
      const profile = await actor.getCallerUserProfile();
      return profile;
    },
    enabled: isActorReady,
    staleTime: 0,
    retry: 1,
    retryDelay: 1000,
  });
}

export function useRegisterProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: Profile) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.register(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
    },
  });
}

export function useCreatePoopEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (numberOfWipes: number) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.createPoopEntry(BigInt(numberOfWipes));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rankedUserStats'] });
    },
  });
}

export function useRankedUserStats() {
  const { actor, isFetching } = useActor();

  return useQuery<{ allTime: UserStats[]; today: UserStats[] }>({
    queryKey: ['rankedUserStats'],
    queryFn: async () => {
      if (!actor) return { allTime: [], today: [] };
      return await actor.getRankedUserStats();
    },
    enabled: !!actor && !isFetching,
  });
}
