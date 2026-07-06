import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, type DragEvent } from "react";
import { Upload, ImageIcon, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useImages, uid, type UploadedImage } from "@/lib/mock-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/upload")({
  component: UploadPage,
});

const MAX = 5 * 1024 * 1024;
const OK = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

function fmt(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(2)} MB`;
}

function UploadPage() {
  const [images, setImages] = useImages();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [last, setLast] = useState<UploadedImage | null>(null);
  const [drag, setDrag] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const pick = (f: File | null) => {
    if (!f) return;
    if (!OK.includes(f.type)) return toast.error("Unsupported format");
    if (f.size > MAX) return toast.error("File exceeds 5 MB");
    setFile(f);
    const r = new FileReader();
    r.onload = () => setPreview(r.result as string);
    r.readAsDataURL(f);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDrag(false);
    pick(e.dataTransfer.files?.[0] ?? null);
  };

  const upload = async () => {
    if (!file || !preview) return;
    setBusy(true);
    await new Promise((r) => setTimeout(r, 800));
    const compressed = Math.round(file.size * 0.65);
    const rec: UploadedImage = {
      id: uid(),
      name: file.name,
      dataUrl: preview,
      originalSize: file.size,
      compressedSize: compressed,
      uploadedAt: new Date().toISOString(),
      status: "success",
    };
    setImages([rec, ...images]);
    setLast(rec);
    toast.success("Upload complete");
    setBusy(false);
    setFile(null);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Upload Image</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upload a book cover</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={onDrop}
            onClick={() => input.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
              drag ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
            }`}
          >
            <Upload className="text-muted-foreground" />
            <p className="text-sm">Drag & drop or click to browse</p>
            <p className="text-xs text-muted-foreground">JPG, PNG, WEBP · up to 5 MB</p>
            <input
              ref={input}
              type="file"
              accept={OK.join(",")}
              className="hidden"
              onChange={(e) => pick(e.target.files?.[0] ?? null)}
            />
          </div>

          {preview && (
            <div className="flex flex-col gap-3 rounded border bg-muted/30 p-3 sm:flex-row sm:items-center">
              <img src={preview} alt="preview" className="h-24 w-24 rounded object-cover" />
              <div className="flex-1 text-sm">
                <p className="font-medium">{file?.name}</p>
                <p className="text-muted-foreground">{file ? fmt(file.size) : ""}</p>
              </div>
              <Button onClick={upload} disabled={busy}>
                {busy ? "Uploading…" : "Upload"}
              </Button>
            </div>
          )}

          {last && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
              <div className="flex items-center gap-2 font-medium text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 size={16} /> Upload success
              </div>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                <img src={last.dataUrl} alt={last.name} className="h-24 w-24 rounded object-cover" />
                <div className="text-sm">
                  <p><span className="font-medium">Original:</span> {fmt(last.originalSize)}</p>
                  <p><span className="font-medium">Compressed:</span> {fmt(last.compressedSize)}</p>
                  <p className="text-muted-foreground">Saved {Math.round((1 - last.compressedSize / last.originalSize) * 100)}%</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upload History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Preview</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {images.map((i) => (
                <TableRow key={i.id}>
                  <TableCell>
                    <img src={i.dataUrl} alt={i.name} className="h-10 w-10 rounded object-cover" />
                  </TableCell>
                  <TableCell className="font-medium">{i.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(i.uploadedAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={i.status === "success" ? "default" : "destructive"}>
                      {i.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {images.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                    <ImageIcon className="mx-auto mb-2 opacity-50" /> No uploads yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}