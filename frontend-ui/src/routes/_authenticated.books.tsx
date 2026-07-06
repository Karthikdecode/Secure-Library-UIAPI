import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Pencil, Trash2, Eye, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { useAuthors, useBooks, uid, type Book } from "@/lib/mock-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/_authenticated/books")({
  component: BooksPage,
});

const PAGE = 5;

function BooksPage() {
  const [authors] = useAuthors();
  const [books, setBooks] = useBooks();
  const [q, setQ] = useState("");
  const [authorFilter, setAuthorFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<{ open: boolean; edit?: Book; view?: Book }>({ open: false });
  const [del, setDel] = useState<Book | null>(null);
  const [form, setForm] = useState({ title: "", description: "", authorId: "", price: "" });
  const [err, setErr] = useState<Record<string, string>>({});

  const authorName = (id: string) => authors.find((a) => a.id === id)?.name || "—";

  const filtered = useMemo(
    () =>
      books.filter(
        (b) =>
          b.title.toLowerCase().includes(q.toLowerCase()) &&
          (authorFilter === "all" || b.authorId === authorFilter),
      ),
    [books, q, authorFilter],
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const pageData = filtered.slice((page - 1) * PAGE, page * PAGE);

  const openAdd = () => {
    setForm({ title: "", description: "", authorId: "", price: "" });
    setErr({});
    setModal({ open: true });
  };
  const openEdit = (b: Book) => {
    setForm({ title: b.title, description: b.description, authorId: b.authorId, price: String(b.price) });
    setErr({});
    setModal({ open: true, edit: b });
  };
  const save = () => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = "Title required";
    if (!form.authorId) errs.authorId = "Author required";
    const p = parseFloat(form.price);
    if (isNaN(p) || p < 0) errs.price = "Valid price required";
    setErr(errs);
    if (Object.keys(errs).length) return;
    if (modal.edit) {
      setBooks(books.map((b) => (b.id === modal.edit!.id ? { ...b, ...form, price: p } : b)));
      toast.success("Book updated");
    } else {
      setBooks([
        { id: uid(), ...form, price: p, createdAt: new Date().toISOString().slice(0, 10) },
        ...books,
      ]);
      toast.success("Book created");
    }
    setModal({ open: false });
  };
  const confirmDelete = () => {
    if (!del) return;
    setBooks(books.filter((b) => b.id !== del.id));
    toast.success("Book deleted");
    setDel(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Books</h1>
        <Button onClick={openAdd}>
          <Plus size={14} /> Add Book
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 border-b sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="Search books…"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select value={authorFilter} onValueChange={(v) => { setAuthorFilter(v); setPage(1); }}>
            <SelectTrigger className="sm:w-56">
              <SelectValue placeholder="Filter by author" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All authors</SelectItem>
              {authors.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead className="w-24">Price</TableHead>
                  <TableHead className="w-32">Created</TableHead>
                  <TableHead className="w-32 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageData.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">{b.title}</TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">{b.description}</TableCell>
                    <TableCell>{authorName(b.authorId)}</TableCell>
                    <TableCell>${b.price.toFixed(2)}</TableCell>
                    <TableCell className="text-muted-foreground">{b.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => setModal({ open: true, view: b })}>
                          <Eye size={14} />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => openEdit(b)}>
                          <Pencil size={14} />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => setDel(b)}>
                          <Trash2 size={14} className="text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {pageData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                      No books found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between border-t p-3 text-sm">
            <span className="text-muted-foreground">{filtered.length} records</span>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>
                Previous
              </Button>
              <span>
                Page {page} of {totalPages}
              </span>
              <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={modal.open} onOpenChange={(o) => setModal({ open: o })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {modal.view ? "Book Details" : modal.edit ? "Edit Book" : "Add Book"}
            </DialogTitle>
          </DialogHeader>
          {modal.view ? (
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Title:</span> {modal.view.title}</p>
              <p><span className="font-medium">Author:</span> {authorName(modal.view.authorId)}</p>
              <p><span className="font-medium">Price:</span> ${modal.view.price.toFixed(2)}</p>
              <p><span className="font-medium">Created:</span> {modal.view.createdAt}</p>
              <p><span className="font-medium">Description:</span> {modal.view.description || "—"}</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="bt">Title</Label>
                <Input id="bt" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                {err.title && <p className="text-xs text-destructive">{err.title}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="bd">Description</Label>
                <Textarea id="bd" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Author</Label>
                <Select value={form.authorId} onValueChange={(v) => setForm({ ...form, authorId: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select author" />
                  </SelectTrigger>
                  <SelectContent>
                    {authors.map((a) => (
                      <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {err.authorId && <p className="text-xs text-destructive">{err.authorId}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="bp">Price (USD)</Label>
                <Input id="bp" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                {err.price && <p className="text-xs text-destructive">{err.price}</p>}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setModal({ open: false })}>
              {modal.view ? "Close" : "Cancel"}
            </Button>
            {!modal.view && <Button onClick={save}>Save</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!del} onOpenChange={(o) => !o && setDel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete book?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove <span className="font-medium">{del?.title}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}