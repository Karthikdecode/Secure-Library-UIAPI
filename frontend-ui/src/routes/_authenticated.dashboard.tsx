import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, BookOpen, Image as ImgIcon, Activity, Plus, Upload } from "lucide-react";
import { useAuthors, useBooks, useImages } from "@/lib/mock-store";
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
  const [authors] = useAuthors();
  const [books] = useBooks();
  const [images] = useImages();
  const { user } = useAuth();
  const displayName = user?.username || user?.name || "there";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Welcome back, {displayName} 👋</h1>
        <p className="text-sm text-muted-foreground">Here's what's happening in your library.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={Users} label="Total Authors" value={authors.length} />
        <Stat icon={BookOpen} label="Total Books" value={books.length} />
        <Stat icon={ImgIcon} label="Uploaded Images" value={images.length} />
        <Stat icon={Activity} label="API Requests Left" value={987} />
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