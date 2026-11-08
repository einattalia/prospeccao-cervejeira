import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hoplink | Prospecção cervejeira",
  description: "Encontre e acompanhe novos pontos de venda para cervejarias artesanais.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
