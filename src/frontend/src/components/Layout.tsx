import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { LogOut, Home } from 'lucide-react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { SiCoffeescript } from 'react-icons/si';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { clear, identity } = useInternetIdentity();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const isHome = routerState.location.pathname === '/';

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950 dark:via-orange-950 dark:to-yellow-950">
      {/* Header */}
      <header className="border-b-2 border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">💩</span>
              <h1 className="text-2xl font-black tracking-tight">Poop Tracker</h1>
            </div>
            <div className="flex items-center gap-2">
              {!isHome && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate({ to: '/' })}
                >
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={clear}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-border bg-background/80 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>
              Built with <span className="text-red-500">❤️</span> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'poop-tracker'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:underline"
              >
                caffeine.ai
              </a>
            </p>
            <p className="text-xs">
              © {new Date().getFullYear()} Poop Tracker. Track responsibly. 🧻
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
