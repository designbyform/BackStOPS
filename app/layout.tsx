import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "BackStOPS Compliance — Small Business Compliance Dashboard",
  description:
    "Track permits, renewals, insurance certs, licenses, tax deadlines, required filings, and documents in one simple dashboard.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
