"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // To get the current active path
import styles from './Navbar.module.css'; // Import CSS module for custom styles

const Navbar = () => {
  const pathname = usePathname(); // Get the current route

  return (
    <nav className={styles.navbar}>
      <div className={styles.links}>
        <Link href="/" className={pathname === '/' ? `${styles.activeLink} ${styles.link}` : styles.link}>Home</Link>
        <Link href="/controlsAI" className={pathname === '/controlsAI' ? `${styles.activeLink} ${styles.link}` : styles.link}>Frameworks Mapper</Link>
        <Link href="/RAG" className={pathname === '/RAG' ? `${styles.activeLink} ${styles.link}` : styles.link}>RAG Engine </Link>
        
      </div>
      
      <a href="/">
  <img 
    src="/logo.svg" 
    alt="Logo" 
    style={{ width: '100px', height: '100px' }} 
  />
</a>

    </nav>
  );
};

export default Navbar;