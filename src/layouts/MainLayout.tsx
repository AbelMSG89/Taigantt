function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-dvh-screen grid-rows-layout grid justify-center max-w-6xl bg-background mx-auto">
      {children}
    </main>
  );
}

export default MainLayout;
