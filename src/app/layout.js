import "./globals.css";

export const metadata = {
  title: "3D Building Animation",
  description: "Building that disassembles on scroll",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
