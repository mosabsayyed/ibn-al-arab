import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useI18n } from "@/context/i18n";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const returnTo = searchParams.get('returnTo') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await login(email, password);
    setLoading(false);
    if (res?.error) setError(res.error as string);
    else navigate(returnTo);
  };

  return (
    <main className="container py-16 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">{t("signIn")}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">{t("emailAddress")}</label>
          <Input // Use the Input component
            className="mt-1 block w-full" // Remove 'input' class, rely on Input component's styling
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">{t("password")}</label>
          <Input // Use the Input component
            className="mt-1 block w-full" // Remove 'input' class
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <div>
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? t("signingIn") : t("signIn")}
          </Button>
        </div>
        <div className="text-center pt-4 border-t">
          <p className="text-sm text-gray-600">
            {t("noAccount")} <Link to={`/register${returnTo !== '/' ? `?returnTo=${returnTo}` : ''}`} className="text-blue-600 hover:text-blue-800 underline">{t("clickToRegister")}</Link>
          </p>
        </div>
      </form>
    </main>
  );
}
