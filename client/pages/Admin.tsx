import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/context/i18n";

export default function Admin() {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();
  const isAdmin = !!profile && (profile.role === "admin" || profile.isAdmin === true);

  useEffect(() => {
    // Only redirect after we've finished loading auth/profile
    if (!loading && !isAdmin) navigate("/");
  }, [isAdmin, loading, navigate]);

  const { t } = useI18n();
  if (loading) return <div>{t('loadingPayments')}</div>;

  if (!isAdmin) return null;

  // PaymentsReview uses translations internally
  return (
    <main className="container py-16">
  <h1 className="text-3xl font-extrabold mb-4">{t('adminDashboard')}</h1>
  <p className="text-lg mb-6">{t('paymentsReview')}</p>
      <PaymentsReview />
    </main>
  );
}

export function PaymentsReview({ initialPayments }: { initialPayments?: any[] } = {}) {
  const { profile, session } = useAuth();
  const [payments, setPayments] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    const fetchPayments = async () => {
      setLoading(true);
      setError(null);
      // If test provided initialPayments, use them and skip network fetch
      if (initialPayments) {
        setPayments(initialPayments)
        setLoading(false)
        return
      }
      try {
        const headers: Record<string,string> = { 'Content-Type': 'application/json' };
        if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`;
        const res = await fetch('/api/admin/payments?status=pending', { headers });
        if (!res.ok) throw new Error(`Server ${res.status}`);
        const body = await res.json();
        if (mounted) setPayments(body.payments || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPayments();
    return () => { mounted = false };
  }, [session]);

  const doAction = async (id: string, action: 'approve' | 'reject') => {
    setError(null);
    try {
      const headers: Record<string,string> = { 'Content-Type': 'application/json' };
      if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`;
      const res = await fetch(`/api/admin/payments/${encodeURIComponent(id)}/${action}`, { method: 'POST', headers });
      if (!res.ok) throw new Error(`Server ${res.status}`);
      // remove from local list
      setPayments((p) => p.filter((x:any) => x.id !== id));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  if (loading) return <div>Loading payments...</div>;
  return (
    <div className="space-y-4">
      {error && <div className="text-red-600">Error: {error}</div>}
      {payments.length === 0 && <div className="text-sm text-gray-600">No pending payments</div>}
      {payments.map((p) => (
        <div key={p.id} className="border p-3 rounded flex items-start gap-4">
          <div className="flex-1">
            <div className="font-medium">Payment: {p.id}</div>
            <div className="text-sm text-gray-600">Plan: {p.plan_id || p.planId}</div>
            <div className="text-sm text-gray-600">Status: {p.status}</div>
            <div className="mt-2">
              {p.receipt_url ? (
                // Show image preview for common image extensions, otherwise show link
                (p.receipt_url.endsWith('.png') || p.receipt_url.endsWith('.jpg') || p.receipt_url.endsWith('.jpeg') || p.receipt_url.endsWith('.svg')) ? (
                  // Use absolute if starts with http
                  <img src={p.receipt_url} alt="receipt" className="max-w-xs border" />
                ) : (
                  <a className="text-blue-600 underline" href={p.receipt_url} target="_blank" rel="noreferrer">View receipt</a>
                )
              ) : null}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button onClick={() => doAction(p.id, 'approve')} className="bg-green-600 text-white px-3 py-1 rounded">Approve</button>
            <button onClick={() => doAction(p.id, 'reject')} className="bg-red-600 text-white px-3 py-1 rounded">Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
}
