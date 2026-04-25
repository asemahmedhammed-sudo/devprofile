// This file is required by Next.js App Router.
// When [locale] layout wraps multiple route groups ((public) and (admin)),
// the router needs a default export to fall back to when no specific
// parallel route slot matches the current segment.
// Without this, the router throws "No default component" and renders NotFound.
export default function DefaultPage() {
  return null;
}
