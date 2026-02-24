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
      if (!actor) {
        // This should never be reached due to `enabled`, but guard anyway
        throw new Error('Actor not ready');
      }
      try {
        const profile = await actor.getMyProfile();
        return profile;
      } catch {
        // Backend throws when user is not registered — treat as no profile
        return null;
      }
    },
    // CRITICAL: only run the query when the actor is fully ready.
    // While enabled=false, isLoading stays false but data stays undefined.
    // We handle the "actor not ready" loading state in App.tsx by checking isActorReady.
    enabled: isActorReady,
    // Never use stale data for profile detection — always fetch fresh on mount
    staleTime: 0,
    // Retry once in case of transient network issues, but not more
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

  return useQuery<UserStats[]>({
    queryKey: ['rankedUserStats'],
    queryFn: async () => {
      if (!actor) return [];
      return await actor.getRankedUserStats();
    },
    enabled: !!actor && !isFetching,
  });
}
