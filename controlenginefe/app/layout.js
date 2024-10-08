// /app/layout.js
import Navbar from './components/Navbar';
export const metadata = {
  title: 'EY Cybersec Tools',
  description: 'AI tools for Cybersecuirty operations',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
