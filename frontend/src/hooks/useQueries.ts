import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { Profile, UserStats } from '../backend';

export function useMyProfile() {
  const { actor, isFetching: isActorFetching } = useActor();
  const { identity, isInitializing } = useInternetIdentity();

  const identityPrincipal = identity?.getPrincipal().toString();

  return useQuery<Profile | null>({
    queryKey: ['myProfile', identityPrincipal],
    queryFn: async () => {
      if (!actor || !identity) return null;
      try {
        return await actor.getMyProfile();
      } catch {
        // Backend traps when user is not registered — treat as no profile
        return null;
      }
    },
    // Only run when:
    // - identity initialization is complete
    // - identity is present (authenticated user)
    // - actor exists and is not being recreated
    enabled: !isInitializing && !!identity && !!actor && !isActorFetching,
    // Never serve stale profile data
    staleTime: 0,
    retry: 1,
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
