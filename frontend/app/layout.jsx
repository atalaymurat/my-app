// These styles apply to every route in the application
import "./globals.css";
import Navbar from "@/components/Navbar";


export const metadata = {
  title: "Postiva by MATA",
  description: "Generated by MATA",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>
        <Navbar />
        <div className="flex justify-center p-8">{children}</div>
      </body>
    </html>
  );
}
