import type { Metadata } from "next";
import "@/app/globals.css";
import NavBar from "@/app/components/nav-bar";
import AuthCheck from "../components/auth-check";
import { HostProvider } from "@/app/components/host-context";
import { unstable_noStore } from "next/cache";
import { BACKEND_HOST } from "../settings";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  unstable_noStore();

  return (
    <HostProvider host={BACKEND_HOST(process.env)}>
      <html lang="en">
        <body>
          <AuthCheck>
            <main>
              {children}
              <NavBar />
            </main>
          </AuthCheck>
        </body>
      </html>
    </HostProvider>
  );
}
