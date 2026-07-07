import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useRef, type DragEvent } from "react";
import { Pencil, Trash2, Eye, Plus, Search, Upload, Image as ImageIcon, X, ChevronLeft, ChevronRight } from "lucide-react";
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

// Extended Book type to include cover image
type BookWithCover = Book & { coverUrls?: string[] };

const PAGE = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function BooksPage() {
  const [authors] = useAuthors();
  const [books, setBooks] = useBooks() as [BookWithCover[], (books: BookWithCover[]) => void];
  const [q, setQ] = useState("");
  const [authorFilter, setAuthorFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<{ open: boolean; edit?: BookWithCover; view?: BookWithCover }>({
    open: false,
  });
  const [del, setDel] = useState<BookWithCover | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    authorId: "",
    price: "",
    coverUrls: [] as string[],
  });
  const [err, setErr] = useState<Record<string, string>>({});
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
    setForm({ title: "", description: "", authorId: "", price: "", coverUrls: [] });
    setErr({});
    setModal({ open: true });
  };
  const openEdit = (b: BookWithCover) => {
    setForm({
      title: b.title,
      description: b.description,
      authorId: b.authorId,
      price: String(b.price),
      coverUrls: b.coverUrls || [],
    });
    setErr({});
    setModal({ open: true, edit: b });
  };
  const openView = (b: BookWithCover) => {
    setCurrentImageIndex(0);
    setModal({ open: true, view: b });
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
        { id: uid(), ...form, price: p, createdAt: new Date().toISOString().slice(0, 10) } as BookWithCover,
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

  const handleFilePick = (files: FileList | null) => {
    if (!files) return;

    const newUrls: string[] = [];
    const fileReaders: FileReader[] = [];

    Array.from(files).forEach(file => {
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast.error(`Unsupported format for ${file.name}`);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} exceeds 5 MB`);
        return;
      }

      const reader = new FileReader();
      fileReaders.push(reader);
      reader.onload = () => {
        newUrls.push(reader.result as string);
        if (newUrls.length === fileReaders.length) {
          setForm(prevForm => ({ ...prevForm, coverUrls: [...prevForm.coverUrls, ...newUrls] }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDrag(false);
    handleFilePick(e.dataTransfer.files);
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
                  <TableHead className="w-20">Cover</TableHead>
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
                    <TableCell>
                      {b.coverUrls && b.coverUrls.length > 0 ? (
                        <img src={b.coverUrls[0]} alt={b.title} className="h-12 w-12 rounded object-cover" />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded bg-muted text-muted-foreground"><ImageIcon size={20} /></div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{b.title}</TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">{b.description}</TableCell>
                    <TableCell>{authorName(b.authorId)}</TableCell>
                    <TableCell>${b.price.toFixed(2)}</TableCell>
                    <TableCell className="text-muted-foreground">{b.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => openView(b)}>
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
                    <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
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
              {modal.view.coverUrls && modal.view.coverUrls.length > 0 && (
                <div className="relative mb-2">
                  <img src={modal.view.coverUrls[currentImageIndex]} alt={`${modal.view.title} - ${currentImageIndex + 1}`} className="h-48 w-full rounded-md object-cover" />
                  {modal.view.coverUrls.length > 1 && (
                    <>
                      <Button size="icon" variant="secondary" className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full" onClick={() => setCurrentImageIndex(p => (p - 1 + modal.view.coverUrls!.length) % modal.view.coverUrls!.length)}>
                        <ChevronLeft size={16} />
                      </Button>
                      <Button size="icon" variant="secondary" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full" onClick={() => setCurrentImageIndex(p => (p + 1) % modal.view.coverUrls!.length)}>
                        <ChevronRight size={16} />
                      </Button>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-2 py-1 text-xs text-white">
                        {currentImageIndex + 1} / {modal.view.coverUrls.length}
                      </div>
                    </>
                  )}
                </div>
              )}
              <p><span className="font-medium">Title:</span> {modal.view.title}</p>
              <p><span className="font-medium">Author:</span> {authorName(modal.view.authorId)}</p>
              <p><span className="font-medium">Price:</span> ${modal.view.price.toFixed(2)}</p>
              <p><span className="font-medium">Created:</span> {modal.view.createdAt}</p>
              <p><span className="font-medium">Description:</span> {modal.view.description || "—"}</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-1">
                <Label>Cover Image</Label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                  onDragLeave={() => setDrag(false)}
                  onDrop={onDrop}
                  onClick={() => inputRef.current?.click()}
                  className={`relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition-colors ${drag ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"}`}
                >
                  <Upload className="text-muted-foreground" />
                  <p className="text-sm">Drag & drop or click to browse</p>
                  <p className="text-xs text-muted-foreground">JPG, PNG, WEBP · up to 5 MB</p>
                  <input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept={ACCEPTED_IMAGE_TYPES.join(",")}
                    className="hidden"
                    onChange={(e) => handleFilePick(e.target.files)}
                  />
                </div>
                {form.coverUrls.length > 0 && (
                  <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {form.coverUrls.map((url, i) => (
                      <div key={i} className="relative">
                        <img src={url} alt={`Preview ${i + 1}`} className="h-20 w-20 rounded-md object-cover" />
                        <Button
                          size="icon"
                          variant="destructive"
                          className="absolute -right-1 -top-1 h-5 w-5 rounded-full"
                          onClick={() => setForm(f => ({ ...f, coverUrls: f.coverUrls.filter((_, idx) => idx !== i) }))}
                        ><X size={12} /></Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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