// Passthrough layout for the (admin) route group.
// Required so Next.js App Router resolves the [locale]/(admin)/dashboard
// and [locale]/(admin)/login routes without triggering the parallel route
// NotFound fallback.
export default function AdminGroupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
