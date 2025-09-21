import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const isAdmin = !!profile && profile.role === "admin";

  useEffect(() => {
    if (!isAdmin) navigate("/");
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  return (
    <main className="container py-16">
      <h1 className="text-3xl font-extrabold mb-4">Admin Dashboard</h1>
      <p className="text-lg">Welcome, admin! (This is a placeholder page.)</p>
    </main>
  );
}
