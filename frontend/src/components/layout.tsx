import { Toaster } from "sonner";
import { Header } from "./header";

interface Layout {
  children: React.ReactNode;
}

export const Layout = ({ children }: Layout) => {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Header />
      <main className="mx-auto flex h-auto w-screen max-w-7xl flex-1 items-start justify-center p-12">
        {children}
      </main>
      <Toaster />
    </div>
  );
};
