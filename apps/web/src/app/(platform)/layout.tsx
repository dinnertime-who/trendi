import { Suspense, ViewTransition } from "react";
import { Footer } from "@/components/footer";
import { Header } from "./_components/header";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <ViewTransition>
        <Suspense>
          <Header />
          {children}
          <Footer />
        </Suspense>
      </ViewTransition>
    </section>
  );
}
