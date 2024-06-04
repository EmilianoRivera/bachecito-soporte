
import "./globals.css";
 
export const metadata = {
  title: "Bachecito Soporte",
  description: "App Soporte Web Bachecito",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
