import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AlertCircle, ArrowRight, Lock, UserRound } from "lucide-react";
import api from "../services/api";
import useAuthStore from "../store/authStore";
import FinkisonLogo from "../components/shared/FinkisonLogo";

export default function AcceptInvitationPage(): React.ReactElement {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [token, setToken] = useState(searchParams.get("token") || "");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAccept = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await api.post("/auth/invitations/accept/", {
        token: token.trim(),
        name: name.trim() || undefined,
        password,
      });
      const data = response.data?.data || response.data;
      const accessToken = data?.access_token || data?.accessToken || data?.token;
      if (!data?.teacher || !accessToken) {
        throw new Error(data?.message || "The invitation response is incomplete. Contact your school administrator.");
      }
      login(data.teacher, "TEACHER", accessToken);
      navigate("/teacher", { replace: true });
    } catch (requestError: any) {
      setError(
        requestError?.userMessage ||
          requestError?.response?.data?.error ||
          requestError?.response?.data?.message ||
          requestError?.message ||
          "We could not accept this invitation. Check the link and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="public-dark-page flex min-h-screen items-center justify-center bg-[#FAF8F5] px-4 py-12 text-[#1C1512] dark:bg-[#1C1512]">
      <section aria-labelledby="invitation-title" className="w-full max-w-lg space-y-6">
        <header className="space-y-4 text-center">
          <div className="flex justify-center">
            <FinkisonLogo variant="horizontal" size="lg" to="/" />
          </div>
          <div className="space-y-2">
            <h1 id="invitation-title" className="text-2xl font-bold tracking-tight">Join your school workspace</h1>
            <p className="text-sm leading-6 text-[#574C43] dark:text-[#E7E0D6]">
              Accept the secure invitation from your school administrator and create your educator password.
            </p>
          </div>
        </header>

        <form
          onSubmit={handleAccept}
          className="space-y-5 rounded-2xl border border-[#E8E2D9] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#261E1A] sm:p-8"
        >
          {error && (
            <div role="alert" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="invitation-token" className="block text-sm font-medium">Invitation code</label>
            <input
              id="invitation-token"
              name="token"
              type="text"
              autoComplete="off"
              required
              value={token}
              onChange={(event) => setToken(event.target.value)}
              className="min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm outline-none transition focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 dark:border-white/20 dark:bg-[#201815] dark:text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="educator-name" className="block text-sm font-medium">Your name</label>
            <div className="relative">
              <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" aria-hidden="true" />
              <input
                id="educator-name"
                name="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="min-h-11 w-full rounded-lg border border-stone-300 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 dark:border-white/20 dark:bg-[#201815] dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="educator-password" className="block text-sm font-medium">Create a password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" aria-hidden="true" />
              <input
                id="educator-password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={10}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="min-h-11 w-full rounded-lg border border-stone-300 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 dark:border-white/20 dark:bg-[#201815] dark:text-white"
              />
            </div>
            <p className="text-xs text-stone-500 dark:text-[#A89C90]">Use at least 10 characters.</p>
          </div>

          <button
            type="submit"
            disabled={loading || !token.trim()}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#881337] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#9F1239] focus:outline-none focus:ring-2 focus:ring-[#881337] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Accepting invitation…" : "Accept invitation"}
            {!loading && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
          </button>
        </form>

        <p className="text-center text-sm text-[#574C43] dark:text-[#E7E0D6]">
          Need a school workspace? <Link className="font-semibold text-[#881337] underline-offset-4 hover:underline dark:text-[#FBBF24]" to="/contact?topic=School%20setup">Contact Finkison</Link>
        </p>
      </section>
    </div>
  );
}
