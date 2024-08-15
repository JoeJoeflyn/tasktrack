import Header from "@/app/components/header";
import Providers from "@/provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Sidebar from "./components/sidebar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to the home page!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Providers>
            <Header />
            <main
              className="flex-grow flex"
              style={{
                backgroundImage: `url(https://trello-backgrounds.s3.amazonaws.com/SharedBackground/2400x1600/3f343f9a4eb77945b907a5f6dc9a5d88/photo-1712672162815-c4cca99b27f1.jpg)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <Sidebar />
              {children}
            </main>
          </Providers>
        </div>
      </body>
    </html>
  );
}
