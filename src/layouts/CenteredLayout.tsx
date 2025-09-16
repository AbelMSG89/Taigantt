function CenteredLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-dvh-screen grid items-center justify-center bg-background">
      {children}
    </main>
  );
}

export default CenteredLayout;
