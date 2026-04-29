import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";

export default function CreatePlaylist() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [targetBpm, setTargetBpm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await api.playlists.create({
        name: name.trim(),
        description: description.trim(),
        target_bpm: targetBpm ? Number(targetBpm) : undefined,
      });
      navigate("/");
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 max-w-xl mx-auto">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-xs font-display uppercase tracking-wider hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Library
      </Link>

      <h1 className="text-2xl font-display uppercase tracking-wider mb-6">★ New Playlist ★</h1>

      <form onSubmit={handleSubmit} className="y2k-border y2k-shadow bg-card p-6">
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-[10px] font-display uppercase tracking-wider mb-1">
              Playlist Name <span className="text-destructive">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Late Night Drive"
              className="w-full px-3 py-2 text-sm font-body y2k-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-[10px] font-display uppercase tracking-wider mb-1">
              Description <span className="text-destructive">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Smooth tracks for the midnight shift"
              rows={3}
              className="w-full px-3 py-2 text-sm font-body y2k-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-display uppercase tracking-wider mb-1">
              Target BPM <span className="text-muted-foreground">(optional)</span>
            </label>
            <input
              type="number"
              min="40"
              max="220"
              value={targetBpm}
              onChange={(e) => setTargetBpm(e.target.value)}
              placeholder="e.g. 128"
              className="w-full px-3 py-2 text-sm font-body y2k-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-[10px] font-body text-muted-foreground mt-1">
              Songs added to this playlist will be recommended based on this tempo.
            </p>
          </div>

          {error && (
            <p className="text-xs font-body text-destructive">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="mt-2 px-4 py-2 font-display text-xs uppercase tracking-wider y2k-border y2k-shadow bg-foreground text-primary-foreground hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Playlist ★"}
          </button>
        </div>
      </form>
    </div>
  );
}
