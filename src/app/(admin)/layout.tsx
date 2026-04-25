// Passthrough — admin shares locale layout via html/body served by [locale]/layout.tsx
export default function AdminGroupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
