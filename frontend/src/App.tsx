import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useMyProfile } from './hooks/useQueries';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import ProfileSetup from './pages/ProfileSetup';
import Dashboard from './pages/Dashboard';
import LogPoop from './pages/LogPoop';

function RootComponent() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: profile, isLoading: isProfileLoading } = useMyProfile();

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">💩</div>
          <div className="text-muted-foreground text-lg font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  if (!identity) {
    return <LoginPage />;
  }

  if (isProfileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">💩</div>
          <div className="text-muted-foreground text-lg font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
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
