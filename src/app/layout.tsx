import { Fraunces, Outfit } from "next/font/google";
import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ChatBody, UnlessChat } from "@/components/RouteChrome";
import { Header, Footer } from "@/components/SiteChrome";
import { currentUser } from "@/lib/auth";
import { trackVisit } from "@/lib/track";
import "./globals.css";

const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Parcourstudent en France",
  description:
    "Parcourstudent en France guide les étudiants de la candidature jusqu'aux démarches en France. Aucun document n'est déposé sur le site.",
  verification: {
    google: "wedXmW5Q5IKoGtr-yLKF2xMzQZQ-FexUwXOGu38bo-c",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  await trackVisit();
  const path = (await headers()).get("x-pathname") ?? "";
  const user = await currentUser();
  if (user?.role === "accompagnateur" && (path === "/accompagnement" || path.startsWith("/admin/groupes") || path.startsWith("/admin/liens") || path.startsWith("/admin/videos") || path.startsWith("/admin/courrier"))) {
    redirect("/admin");
  }
  const chat = path === "/messages";
  return (
    <html lang="fr" className={`${outfit.variable} ${fraunces.variable} h-full scroll-smooth antialiased`}>
      <body className={chat ? "flex h-dvh flex-col overflow-hidden pb-[calc(4.25rem+env(safe-area-inset-bottom))] md:pb-0" : "flex min-h-full flex-col pb-[calc(4.25rem+env(safe-area-inset-bottom))] md:pb-0"}>
        <ChatBody />
        <Header />
        <main id="contenu" className={chat ? "flex min-h-0 flex-1 flex-col" : "flex-1"}>{children}</main>
        <UnlessChat>
          <Footer />
        </UnlessChat>
      </body>
    </html>
  );
}
