import "./globals.css";
export const metadata = { title: "Khulafa Owner", manifest: "/manifest.json" };
export default function RootLayout({ children }) {
  return (
    <html lang="ms">
      <body>{children}</body>
    </html>
  );
}
