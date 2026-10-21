export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-bg px-4 py-12">
      <div className="w-full max-w-sm rounded-3xl bg-surface p-8 shadow-sm">
        <h1 className="mb-1 text-2xl font-bold text-text">Revision Guide</h1>
        <p className="mb-6 text-sm text-muted">Your GCSE revision, in one place.</p>
        {children}
      </div>
    </div>
  );
}
