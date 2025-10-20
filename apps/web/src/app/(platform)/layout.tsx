import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <Header />
      {children}
      <Footer />
    </section>
  );
}
