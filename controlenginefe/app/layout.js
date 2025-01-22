// /app/layout.js
import Navbar from './components/Navbar';
export const metadata = {
  title: 'AI Engine',
  description: 'AI tools to Make Your Life Easier',
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
