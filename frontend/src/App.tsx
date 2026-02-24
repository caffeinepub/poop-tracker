import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useMyProfile } from './hooks/useQueries';
import { useActor } from './hooks/useActor';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import ProfileSetup from './pages/ProfileSetup';
import Dashboard from './pages/Dashboard';
import LogPoop from './pages/LogPoop';

function RootComponent() {
  const { identity, isInitializing } = useInternetIdentity();
  const { actor, isFetching: isActorFetching } = useActor();
  const { data: profile, isLoading: isProfileLoading } = useMyProfile();

  // Phase 1: still initializing identity or actor
  const isLoading = isInitializing || (!!identity && (isActorFetching || !actor)) || (!!actor && !!identity && isProfileLoading);

  if (isLoading) {
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

  // Logged in but no profile
  if (!profile) {
    return <ProfileSetup />;
  }

  // Logged in with profile — show the app
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
