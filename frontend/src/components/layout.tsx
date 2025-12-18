import { Toaster } from "sonner";
import { Header } from "./header";

interface Layout {
  children: React.ReactNode;
}

export const Layout = ({ children }: Layout) => {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto p-12">{children}</main>
      <Toaster />
    </div>
  );
};
