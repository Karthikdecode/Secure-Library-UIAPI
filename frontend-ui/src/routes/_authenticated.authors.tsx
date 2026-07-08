// import { createFileRoute } from "@tanstack/react-router";
// import { useMemo, useState } from "react";
// import { Pencil, Trash2, Eye, Plus, Search } from "lucide-react";
// import { toast } from "sonner";
// import { useAuthors, uid, type Author } from "@/lib/mock-store";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// export const Route = createFileRoute("/_authenticated/authors")({
//   component: AuthorsPage,
// });

// const PAGE = 5;

// function AuthorsPage() {
//   const [authors, setAuthors] = useAuthors();
//   const [q, setQ] = useState("");
//   const [page, setPage] = useState(1);
//   const [modal, setModal] = useState<{ open: boolean; edit?: Author; view?: Author }>({ open: false });
//   const [del, setDel] = useState<Author | null>(null);
//   const [form, setForm] = useState({ name: "", biography: "" });
//   const [err, setErr] = useState<Record<string, string>>({});

//   const filtered = useMemo(
//     () => authors.filter((a) => a.name.toLowerCase().includes(q.toLowerCase())),
//     [authors, q],
//   );
//   const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE));
//   const pageData = filtered.slice((page - 1) * PAGE, page * PAGE);

//   const openAdd = () => {
//     setForm({ name: "", biography: "" });
//     setErr({});
//     setModal({ open: true });
//   };
//   const openEdit = (a: Author) => {
//     setForm({ name: a.name, biography: a.biography });
//     setErr({});
//     setModal({ open: true, edit: a });
//   };
//   const save = () => {
//     const errs: Record<string, string> = {};
//     if (!form.name.trim()) errs.name = "Name required";
//     if (form.biography.length > 500) errs.biography = "Max 500 chars";
//     setErr(errs);
//     if (Object.keys(errs).length) return;
//     if (modal.edit) {
//       setAuthors(authors.map((a) => (a.id === modal.edit!.id ? { ...a, ...form } : a)));
//       toast.success("Author updated");
//     } else {
//       setAuthors([
//         { id: uid(), ...form, books: 0, createdAt: new Date().toISOString().slice(0, 10) },
//         ...authors,
//       ]);
//       toast.success("Author created");
//     }
//     setModal({ open: false });
//   };
//   const confirmDelete = () => {
//     if (!del) return;
//     setAuthors(authors.filter((a) => a.id !== del.id));
//     toast.success("Author deleted");
//     setDel(null);
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-semibold">Authors</h1>
//         <Button onClick={openAdd}>
//           <Plus size={14} /> Add Author
//         </Button>
//       </div>

//       <Card>
//         <CardHeader className="border-b">
//           <div className="relative max-w-sm">
//             <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
//             <Input
//               className="pl-8"
//               placeholder="Search authors…"
//               value={q}
//               onChange={(e) => {
//                 setQ(e.target.value);
//                 setPage(1);
//               }}
//             />
//           </div>
//         </CardHeader>
//         <CardContent className="p-0">
//           <div className="overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead className="w-16">ID</TableHead>
//                   <TableHead>Name</TableHead>
//                   <TableHead>Biography</TableHead>
//                   <TableHead className="w-20"># Books</TableHead>
//                   <TableHead className="w-32">Created</TableHead>
//                   <TableHead className="w-32 text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {pageData.map((a) => (
//                   <TableRow key={a.id}>
//                     <TableCell className="font-mono text-xs">{a.id}</TableCell>
//                     <TableCell className="font-medium">{a.name}</TableCell>
//                     <TableCell className="max-w-xs truncate text-muted-foreground">
//                       {a.biography}
//                     </TableCell>
//                     <TableCell>{a.books}</TableCell>
//                     <TableCell className="text-muted-foreground">{a.createdAt}</TableCell>
//                     <TableCell className="text-right">
//                       <div className="flex justify-end gap-1">
//                         <Button size="icon" variant="ghost" onClick={() => setModal({ open: true, view: a })}>
//                           <Eye size={14} />
//                         </Button>
//                         <Button size="icon" variant="ghost" onClick={() => openEdit(a)}>
//                           <Pencil size={14} />
//                         </Button>
//                         <Button size="icon" variant="ghost" onClick={() => setDel(a)}>
//                           <Trash2 size={14} className="text-destructive" />
//                         </Button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//                 {pageData.length === 0 && (
//                   <TableRow>
//                     <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
//                       No authors found
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//           <div className="flex items-center justify-between border-t p-3 text-sm">
//             <span className="text-muted-foreground">{filtered.length} records</span>
//             <div className="flex items-center gap-2">
//               <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>
//                 Previous
//               </Button>
//               <span>
//                 Page {page} of {totalPages}
//               </span>
//               <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
//                 Next
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       <Dialog open={modal.open} onOpenChange={(o) => setModal({ open: o })}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>
//               {modal.view ? "Author Details" : modal.edit ? "Edit Author" : "Add Author"}
//             </DialogTitle>
//           </DialogHeader>
//           {modal.view ? (
//             <div className="space-y-2 text-sm">
//               <p><span className="font-medium">Name:</span> {modal.view.name}</p>
//               <p><span className="font-medium">Books:</span> {modal.view.books}</p>
//               <p><span className="font-medium">Created:</span> {modal.view.createdAt}</p>
//               <p><span className="font-medium">Biography:</span> {modal.view.biography || "—"}</p>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               <div className="space-y-1">
//                 <Label htmlFor="an">Author Name</Label>
//                 <Input id="an" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
//                 {err.name && <p className="text-xs text-destructive">{err.name}</p>}
//               </div>
//               <div className="space-y-1">
//                 <Label htmlFor="bio">Biography</Label>
//                 <Textarea id="bio" rows={4} value={form.biography} onChange={(e) => setForm({ ...form, biography: e.target.value })} />
//                 {err.biography && <p className="text-xs text-destructive">{err.biography}</p>}
//               </div>
//             </div>
//           )}
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setModal({ open: false })}>
//               {modal.view ? "Close" : "Cancel"}
//             </Button>
//             {!modal.view && <Button onClick={save}>Save</Button>}
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <AlertDialog open={!!del} onOpenChange={(o) => !o && setDel(null)}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Delete author?</AlertDialogTitle>
//             <AlertDialogDescription>
//               This will permanently remove <span className="font-medium">{del?.name}</span>.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }

// routes/_authenticated/authors.tsx
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2, Eye, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/_authenticated/authors")({
  component: AuthorsPage,
});

// ─── types ────────────────────────────────────────────────────────────────────
interface Author {
  id: number;
  name: string;
  bio: string | null;
  books: number;
  created_at: string;
}

// ─── constants ────────────────────────────────────────────────────────────────
const PAGE = 5;
const API = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

function getStoredUser() {
  try {
    const raw = localStorage.getItem("lms_user");
    if (raw) return JSON.parse(raw) as { token?: string } | null;
  } catch {
    // ignore
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

// ─── component ────────────────────────────────────────────────────────────────
function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading]  = useState(true);
  const [saving, setSaving]    = useState(false);

  const [q, setQ]       = useState("");
  const [page, setPage] = useState(1);

  const [modal, setModal] = useState<{
    open: boolean; edit?: Author; view?: Author;
  }>({ open: false });
  const [del, setDel] = useState<Author | null>(null);

  const [form, setForm] = useState({ name: "", bio: "" });
  const [err,  setErr]  = useState<Record<string, string>>({});

  // ── fetch on mount ──
  useEffect(() => {
    fetch(`${API}/authors`)
      .then(r => r.json())
      .then(setAuthors)
      .catch(() => toast.error("Failed to load authors"))
      .finally(() => setLoading(false));
  }, []);

  // ── filter + paginate ──
  const filtered   = useMemo(() =>
    authors.filter(a => a.name.toLowerCase().includes(q.toLowerCase())),
    [authors, q],
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const pageData   = filtered.slice((page - 1) * PAGE, page * PAGE);

  // ── modal helpers ──
  const openAdd = () => {
    setForm({ name: "", bio: "" });
    setErr({});
    setModal({ open: true });
  };
  const openEdit = (a: Author) => {
    setForm({ name: a.name, bio: a.bio ?? "" });
    setErr({});
    setModal({ open: true, edit: a });
  };

  // ── save ──
  const save = async () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim())      errs.name = "Name required";
    if (form.bio.length > 500)  errs.bio  = "Max 500 chars";
    setErr(errs);
    if (Object.keys(errs).length) return;

    setSaving(true);
    try {
      if (modal.edit) {
        // UPDATE
        const res = await fetch(`${API}/authors/${modal.edit.id}`, {
          method: "PUT",
          headers: authHeaders(),
          body: JSON.stringify({ name: form.name.trim(), bio: form.bio }),
        });
        if (!res.ok) throw new Error((await res.json()).message);
        const updated: Author = await res.json();
        // preserve local books count since PUT doesn't JOIN
        setAuthors(prev =>
          prev.map(a => a.id === updated.id
            ? { ...updated, books: a.books }
            : a
          )
        );
        toast.success("Author updated");
      } else {
        // CREATE
        const res = await fetch(`${API}/authors`, {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({ name: form.name.trim(), bio: form.bio }),
        });
        if (!res.ok) throw new Error((await res.json()).message);
        const created: Author = await res.json();
        setAuthors(prev => [{ ...created, books: 0 }, ...prev]);
        toast.success("Author created");
      }
      setModal({ open: false });
    } catch (e: any) {
      toast.error(e.message ?? "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  // ── delete ──
  const confirmDelete = async () => {
    if (!del) return;
    try {
      const res = await fetch(`${API}/authors/${del.id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error();
      setAuthors(prev => prev.filter(a => a.id !== del.id));
      toast.success("Author deleted");
    } catch {
      toast.error("Failed to delete author");
    } finally {
      setDel(null);
    }
  };

  // ─── render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Authors</h1>
        <Button onClick={openAdd}><Plus size={14} /> Add Author</Button>
      </div>

      <Card>
        <CardHeader className="border-b">
          <div className="relative max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-8" placeholder="Search authors…" value={q}
              onChange={e => { setQ(e.target.value); setPage(1); }}
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {/* <TableHead className="w-16">ID</TableHead> */}
                  <TableHead>Name</TableHead>
                  <TableHead>Biography</TableHead>
                  <TableHead className="w-20"># Books</TableHead>
                  <TableHead className="w-32">Created</TableHead>
                  <TableHead className="w-32 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                      Loading…
                    </TableCell>
                  </TableRow>
                ) : pageData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                      No authors found
                    </TableCell>
                  </TableRow>
                ) : pageData.map(a => (
                  <TableRow key={a.id}>
                    {/* <TableCell className="font-mono text-xs">{a.id}</TableCell> */}
                    <TableCell className="font-medium">{a.name}</TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">
                      {a.bio ?? "—"}
                    </TableCell>
                    <TableCell>{a.books}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {a.created_at?.slice(0, 10)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost"
                          onClick={() => setModal({ open: true, view: a })}>
                          <Eye size={14} />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => openEdit(a)}>
                          <Pencil size={14} />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => setDel(a)}>
                          <Trash2 size={14} className="text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between border-t p-3 text-sm">
            <span className="text-muted-foreground">{filtered.length} records</span>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline"
                disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                Previous
              </Button>
              <span>Page {page} of {totalPages}</span>
              <Button size="sm" variant="outline"
                disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Add / Edit / View dialog ── */}
      <Dialog open={modal.open} onOpenChange={o => setModal({ open: o })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {modal.view ? "Author Details" : modal.edit ? "Edit Author" : "Add Author"}
            </DialogTitle>
          </DialogHeader>

          {modal.view ? (
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Name:</span> {modal.view.name}</p>
              <p><span className="font-medium">Books:</span> {modal.view.books}</p>
              <p><span className="font-medium">Created:</span> {modal.view.created_at?.slice(0, 10)}</p>
              <p><span className="font-medium">Biography:</span> {modal.view.bio || "—"}</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="an">Author Name</Label>
                <Input id="an" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} />
                {err.name && <p className="text-xs text-destructive">{err.name}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="bio">
                  Biography
                  <span className="ml-2 text-xs text-muted-foreground">
                    {form.bio.length}/500
                  </span>
                </Label>
                <Textarea id="bio" rows={4} value={form.bio}
                  onChange={e => setForm({ ...form, bio: e.target.value })} />
                {err.bio && <p className="text-xs text-destructive">{err.bio}</p>}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setModal({ open: false })}>
              {modal.view ? "Close" : "Cancel"}
            </Button>
            {!modal.view && (
              <Button onClick={save} disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete confirm ── */}
      <AlertDialog open={!!del} onOpenChange={o => !o && setDel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete author?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove{" "}
              <span className="font-medium">{del?.name}</span> and all their books.
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