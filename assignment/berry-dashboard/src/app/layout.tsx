import { Roboto } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Berry Dashboard",
  description: "Dark Berry admin dashboard — Dashboard, Users, Products, Orders",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${roboto.variable} h-full`}>
      <body className={`${roboto.className} min-h-full bg-berry antialiased`}>{children}</body>
    </html>
  );
}
