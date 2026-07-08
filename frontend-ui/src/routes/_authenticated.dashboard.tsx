import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Users, BookOpen, Image as ImgIcon, Activity, Plus, Upload } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const API = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

function getStoredUser() {
  try {
    const raw = localStorage.getItem("lms_user");
    if (raw) return JSON.parse(raw) as { token?: string } | null;
  } catch {
    return null;
  }
  return null;
}

function authHeaders() {
  const user = getStoredUser();
  const token = user?.token || localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function getTokenExpiry(token: string) {
  try {
    const [, payload] = token.split('.');
    if (!payload) return null;
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return typeof decoded.exp === 'number' ? decoded.exp : null;
  } catch {
    return null;
  }
}

function formatSeconds(seconds: number) {
  if (seconds <= 0) return 'Expired';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
});

// const activity = [
//   { time: "Just now", event: "User logged in" },
//   { time: "2 min ago", event: "Author created: Isaac Asimov" },
//   { time: "10 min ago", event: "Book updated: The Hobbit" },
//   { time: "1 hr ago", event: "Image uploaded: cover-01.png" },
// ];

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className="rounded-lg bg-primary/10 p-3 text-primary">
          <Icon size={20} />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.username || user?.name || "there";
  const [authorsCount, setAuthorsCount] = useState<number>(0);
  const [booksCount, setBooksCount] = useState<number>(0);
  const [imagesCount, setImagesCount] = useState<number>(0);
  const [rateLimitLeft, setRateLimitLeft] = useState<number | null>(null);
  const [tokenSecondsLeft, setTokenSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    const token = getStoredUser()?.token;
    const expiry = token ? getTokenExpiry(token) : null;

    const logoutAndRedirect = () => {
      localStorage.removeItem('lms_user');
      navigate('/login');
    };

    if (!expiry) {
      logoutAndRedirect();
      return;
    }

    const updateRemaining = () => {
      const secondsLeft = expiry - Math.floor(Date.now() / 1000);
      setTokenSecondsLeft(secondsLeft);
      if (secondsLeft <= 0) {
        logoutAndRedirect();
      }
    };

    updateRemaining();
    const timer = window.setInterval(updateRemaining, 1000);
    return () => window.clearInterval(timer);
  }, [navigate]);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [authorsRes, booksRes, imagesRes] = await Promise.all([
          fetch(`${API}/authors`, { headers: authHeaders() }),
          fetch(`${API}/books`),
          fetch(`${API}/upload`, { headers: authHeaders() }),
        ]);

        if (authorsRes.ok) {
          const data = await authorsRes.json();
          setAuthorsCount(Array.isArray(data) ? data.length : 0);
          setRateLimitLeft(Number(authorsRes.headers.get('x-ratelimit-remaining') ?? '0'));
        }
        if (booksRes.ok) {
          const data = await booksRes.json();
          setBooksCount(Array.isArray(data) ? data.length : 0);
        }
        if (imagesRes.ok) {
          const data = await imagesRes.json();
          setImagesCount(Array.isArray(data) ? data.length : 0);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchCounts();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Welcome back, {displayName} 👋</h1>
        <p className="text-sm text-muted-foreground">Here's what's happening in your library.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={Users} label="Total Authors" value={authorsCount} />
        <Stat icon={BookOpen} label="Total Books" value={booksCount} />
        {/* <Stat icon={ImgIcon} label="Uploaded Images" value={imagesCount} /> */}
        <Stat icon={Activity} label="API Requests Left" value={rateLimitLeft ?? 'Unknown'} />
        <Stat icon={Upload} label="Token Expires In" value={tokenSecondsLeft !== null ? formatSeconds(tokenSecondsLeft) : 'Unknown'} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild>
            <Link to="/authors">
              <Plus size={14} /> Add Author
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/books">
              <Plus size={14} /> Add Book
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-40">Time</TableHead>
                <TableHead>Event</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activity.map((a, i) => (
                <TableRow key={i}>
                  <TableCell className="text-muted-foreground">{a.time}</TableCell>
                  <TableCell>{a.event}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card> */}
    </div>
  );
}