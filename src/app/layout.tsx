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
                backgroundImage: `url(/Tsunami_by_hokusai_19th_century.jpg)`,
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
