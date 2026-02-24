import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useActor } from './hooks/useActor';
import { useQuery } from '@tanstack/react-query';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import ProfileSetup from './pages/ProfileSetup';
import Dashboard from './pages/Dashboard';
import LogPoop from './pages/LogPoop';

type ProfileState = 'loading' | 'has-profile' | 'no-profile';

function RootComponent() {
  const { identity, isInitializing } = useInternetIdentity();
  const { actor, isFetching: isActorFetching } = useActor();

  const identityPrincipal = identity?.getPrincipal().toString();

  // The actor is only "ready for the current identity" when:
  // 1. Identity initialization is complete
  // 2. The actor is not currently being fetched/recreated
  // 3. If we have an identity, the actor must have been created with that identity
  //    (we detect this by checking that actor exists and is not fetching)
  const actorReadyForIdentity =
    !isInitializing &&
    !isActorFetching &&
    !!actor;

  // Profile query — only runs when actor is fully ready AND identity is present
  const {
    data: profile,
    isLoading: isProfileLoading,
    fetchStatus,
  } = useQuery({
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
    // - identity is present (we need an authenticated user)
    // - actor is ready and not fetching
    // - identity initialization is complete
    enabled: !!identity && actorReadyForIdentity,
    // Never use stale data from a previous identity
    staleTime: 0,
    // Retry once in case of transient errors
    retry: 1,
  });

  // Derive explicit tri-state for routing decisions
  const profileState: ProfileState = (() => {
    // Still initializing identity
    if (isInitializing) return 'loading';

    // Not logged in — handled separately below
    if (!identity) return 'loading';

    // Actor is being created/recreated for this identity
    if (isActorFetching || !actor) return 'loading';

    // Profile query is in flight (fetching, not yet resolved)
    if (isProfileLoading || fetchStatus === 'fetching') return 'loading';

    // Query has resolved — check result
    if (profile) return 'has-profile';

    // Query resolved with no profile
    return 'no-profile';
  })();

  // Not authenticated — show login page
  if (!identity && !isInitializing) {
    return <LoginPage />;
  }

  // Show loading while any initialization is in progress
  if (profileState === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">💩</div>
          <div className="text-muted-foreground text-lg font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  // Profile query resolved with no profile — show setup
  if (profileState === 'no-profile') {
    return <ProfileSetup />;
  }

  // Profile exists — show main app
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

const rootRoute = createRootRoute({
  component: RootComponent,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Dashboard,
});

const logPoopRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/log',
  component: LogPoop,
});

const routeTree = rootRoute.addChildren([indexRoute, logPoopRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
