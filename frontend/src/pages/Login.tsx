import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const BASE = "http://localhost:8000";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const body =
        mode === "login"
          ? { email, password }
          : { username, email, password };

      const res = await fetch(`${BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail ?? "Something went wrong");

      login(data.user);
      navigate("/");
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-display uppercase tracking-wider text-center mb-2">
          ★ 3-2-1 Radio ★
        </h1>
        <p className="text-xs font-body text-muted-foreground text-center mb-8">
          {mode === "login" ? "Sign in to your library" : "Create your account"}
        </p>

        <form onSubmit={handleSubmit} className="y2k-border y2k-shadow bg-card p-6 flex flex-col gap-4">
          {mode === "register" && (
            <div>
              <label className="block text-[10px] font-display uppercase tracking-wider mb-1">
                Username
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. djjohn"
                required
                className="w-full px-3 py-2 text-sm font-body y2k-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-display uppercase tracking-wider mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              required
              className="w-full px-3 py-2 text-sm font-body y2k-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-[10px] font-display uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3 py-2 text-sm font-body y2k-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {error && <p className="text-xs font-body text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 font-display text-xs uppercase tracking-wider y2k-border y2k-shadow bg-foreground text-primary-foreground hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "..." : mode === "login" ? "Sign In ★" : "Create Account ★"}
          </button>

          <button
            type="button"
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(null); }}
            className="text-[10px] font-display uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
          >
            {mode === "login" ? "No account? Sign up" : "Already have an account? Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
