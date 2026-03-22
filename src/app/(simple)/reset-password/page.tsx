"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const email = useMemo(() => searchParams.get("email") || "", [searchParams]);
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);
  const invalidLink = !email || !token;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (invalidLink) {
      toast.error("Lien de réinitialisation invalide.");
      return;
    }

    if (!password || !confirmPassword) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }

    if (password.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/password-reset/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || "Impossible de réinitialiser le mot de passe.");
        return;
      }

      toast.success("Mot de passe mis à jour. Vous pouvez vous connecter.");
      setDone(true);
    } catch (error) {
      console.error(error);
      toast.error("Erreur réseau. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-sm px-6 py-10">
      <h1 className="text-headline-small text-dvianeutral-10 mb-2">
        Réinitialiser le mot de passe
      </h1>

      {invalidLink ? (
        <div className="mt-4 flex flex-col gap-4">
          <p className="text-body-medium text-dvianeutralvariant-60">
            Ce lien est invalide ou expiré. Demandez un nouveau lien depuis la
            page de connexion.
          </p>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="w-full rounded-8px bg-dviaprimary-40 px-4 py-2.5 text-label-large text-white"
          >
            Retour à l&apos;accueil
          </button>
        </div>
      ) : done ? (
        <div className="mt-4 flex flex-col gap-4">
          <p className="text-body-medium text-dvianeutralvariant-60">
            Votre mot de passe a été modifié avec succès.
          </p>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="w-full rounded-8px bg-dviaprimary-40 px-4 py-2.5 text-label-large text-white"
          >
            Aller à la connexion
          </button>
        </div>
      ) : (
        <form className="mt-6 flex flex-col gap-5" onSubmit={handleSubmit}>
          <p className="text-body-small text-dvianeutralvariant-30 -mt-2">
            Choisissez un nouveau mot de passe pour votre compte.
          </p>

          {/* Nouveau mot de passe */}
          <div className="relative">
            <input
              id="new-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              placeholder="••••••••"
              className="w-full rounded-md border-1 border-dvianeutral-50 bg-transparent px-4 py-3 pr-12 focus:border-dvianeutral-60 focus:outline-none"
              required
            />
            <label
              htmlFor="new-password"
              className={`pointer-events-none absolute left-4 -top-2.5 z-10 bg-[var(--background)] px-1 text-xs transition-colors duration-200 ${
                focusedField === "password"
                  ? "text-dvianeutral-60"
                  : "text-dvianeutral-50"
              }`}
            >
              Nouveau mot de passe
            </label>
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-dvianeutralvariant-30 hover:text-dvianeutral-10 transition-colors duration-200"
              aria-label={showPassword ? "Masquer" : "Afficher"}
            >
              {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
            </button>
          </div>

          {/* Confirmer le mot de passe */}
          <div className="relative">
            <input
              id="confirm-password"
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              onFocus={() => setFocusedField("confirm")}
              onBlur={() => setFocusedField(null)}
              placeholder="••••••••"
              className="w-full rounded-md border-1 border-dvianeutral-50 bg-transparent px-4 py-3 pr-12 focus:border-dvianeutral-60 focus:outline-none"
              required
            />
            <label
              htmlFor="confirm-password"
              className={`pointer-events-none absolute left-4 -top-2.5 z-10 bg-[var(--background)] px-1 text-xs transition-colors duration-200 ${
                focusedField === "confirm"
                  ? "text-dvianeutral-60"
                  : "text-dvianeutral-50"
              }`}
            >
              Confirmer le mot de passe
            </label>
            <button
              type="button"
              onClick={() => setShowConfirm((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-dvianeutralvariant-30 hover:text-dvianeutral-10 transition-colors duration-200"
              aria-label={showConfirm ? "Masquer" : "Afficher"}
            >
              {showConfirm ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-1 w-full rounded-8px bg-dviaprimary-40 py-2.5 text-label-large text-white transition-shadow duration-300 hover:shadow-sm ${
              loading ? "cursor-not-allowed opacity-70" : ""
            }`}
          >
            {loading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
          </button>
        </form>
      )}
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-sm px-6 py-10">
          <p className="text-body-medium text-dvianeutralvariant-30">
            Chargement...
          </p>
        </main>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
