import { useEffect, useState } from 'react';
import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useMyProfile } from './hooks/useQueries';
import { useActor } from './hooks/useActor';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import ProfileSetup from './pages/ProfileSetup';
import Dashboard from './pages/Dashboard';
import LogPoop from './pages/LogPoop';

const PROFILE_LOAD_TIMEOUT_MS = 10_000;

function RootComponent() {
  const { identity, isInitializing } = useInternetIdentity();
  const { actor, isFetching: isActorFetching } = useActor();
  const { data: profile, isLoading: isProfileLoading, isFetched: isProfileFetched } = useMyProfile();

  // Safety timeout: if after 10s we still haven't resolved, treat as no profile
  const [timedOut, setTimedOut] = useState(false);

  const isActorReady = !!actor && !isActorFetching && !!identity;

  // Phase 1: still initializing identity
  const waitingForIdentity = isInitializing;

  // Phase 2: identity ready, actor not yet ready
  const waitingForActor = !isInitializing && !!identity && !isActorReady;

  // Phase 3: actor ready, profile query in flight
  const waitingForProfile = isActorReady && isProfileLoading && !isProfileFetched;

  const isLoading = waitingForIdentity || waitingForActor || waitingForProfile;

  useEffect(() => {
    if (!isLoading) {
      setTimedOut(false);
      return;
    }

    const timer = setTimeout(() => {
      setTimedOut(true);
    }, PROFILE_LOAD_TIMEOUT_MS);

    return () => clearTimeout(timer);
  }, [isLoading]);

  // Show loading screen while we're waiting (unless timed out)
  if (isLoading && !timedOut) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">💩</div>
          <div className="text-muted-foreground text-lg font-medium">Loading your profile…</div>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!identity) {
    return <LoginPage />;
  }

  // Actor ready + query settled (or timed out): decide which screen to show
  // Only show ProfileSetup if the backend explicitly returned null (no profile)
  // OR if we timed out (safety fallback)
  const hasProfile = isProfileFetched && profile !== null && profile !== undefined;

  if (!hasProfile) {
    return <ProfileSetup />;
  }

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
