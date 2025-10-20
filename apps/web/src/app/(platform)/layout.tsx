import { Suspense } from "react";
import { Footer } from "@/components/footer";
import { Header } from "./_components/header";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <Suspense>
        <Header />
        {children}
        <Footer />
      </Suspense>
    </section>
  );
}
