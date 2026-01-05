export default function HomePage() {
  return (
    <main className="min-h-screen">
      <iframe
        title="Progress LMS"
        src="/presentation.html"
        className="h-screen w-full border-0"
      />
    </main>
  );
}
export default function Home() {
  // This page is unused because / is rewritten to /presentation.html by middleware.
  return null;
}
