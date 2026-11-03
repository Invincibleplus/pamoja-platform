import "./globals.css";
import Navbar from "../components/Navbar";
import { AuthProvider } from "../components/AuthProvider";
import AIAssistant from "../components/AIAssistant";
import Footer from "../components/Footer";

export const metadata = {
  title: "Pamoja Clinical Platform — Accredited CPD & Simulation Ecosystem",
  description: "Offline-first medical training, clinical curriculum, and simulation lab scheduling platform.",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#00b4d8",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&display=swap"
        />
      </head>
      <body className="min-h-screen flex flex-col pamoja-shell" suppressHydrationWarning>
        <AuthProvider>
          <Navbar />
          <main className="flex-1 w-full">
            {children}
          </main>
          <Footer />
          <AIAssistant />
        </AuthProvider>
      </body>
    </html>
  );
}
