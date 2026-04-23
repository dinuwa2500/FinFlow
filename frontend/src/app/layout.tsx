import "./globals.css";
import { Sidebar } from "@/widgets/sidebar"; 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className='bg-slate-100'>
        <main className='min-h-screen'>{children}</main>
      </body>
    </html>
  );
}
