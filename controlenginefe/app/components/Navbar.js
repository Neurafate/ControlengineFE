"use client";
<<<<<<< Updated upstream
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // To get the current active path
import styles from './Navbar.module.css'; // Import CSS module for custom styles
=======
import Link from "next/link";
import { usePathname } from "next/navigation"; 
import styles from "./Navbar.module.css";
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className={styles.navbar}>
      <div className={styles.links}>
<<<<<<< Updated upstream
        <Link href="/" className={pathname === '/' ? `${styles.activeLink} ${styles.link}` : styles.link}>Home</Link>
        <Link href="/frameworks" className={pathname === '/frameworks' ? `${styles.activeLink} ${styles.link}` : styles.link}>Frameworks Mapper</Link>
        <Link href="/SOC" className={pathname === '/SOC' ? `${styles.activeLink} ${styles.link}` : styles.link}>SOC Mapper </Link>
        
      </div>
      
      <a href="/">
  <img 
    src="/logo.svg" 
    alt="Logo" 
    style={{ width: '100px', height: '100px' }} 
  />
</a>

=======
        <Link
          href="/"
          className={
            pathname === "/"
              ? `${styles.activeLink} ${styles.link}`
              : styles.link
          }
        >
          Home
        </Link>
        <Link
          href="/frameworks"
          className={
            pathname === "/frameworks"
              ? `${styles.activeLink} ${styles.link}`
              : styles.link
          }
        >
          Controls Engine
        </Link>
        <Link
          href="/SOC"
          className={
            pathname === "/SOC"
              ? `${styles.activeLink} ${styles.link}`
              : styles.link
          }
        >
          SOC Engine
        </Link>
        <Link
          href="/Parser"
          className={
            pathname === "/Parser"
              ? `${styles.activeLink} ${styles.link}`
              : styles.link
          }
        >
          PDF Parser
        </Link>
        <Link
          href="/minutes"
          className={
            pathname === "/minutes"
              ? `${styles.activeLink} ${styles.link}`
              : styles.link
          }
        >
          Minutes Generator
        </Link>
        <Link
          href="/chat"
          className={
            pathname === "/chat"
              ? `${styles.activeLink} ${styles.link}`
              : styles.link
          }
        >
          Chat with Docs
        </Link>
      </div>

      <Link href="/">
        <div className={styles.logo}>
          <img
            src="/logo.svg"
            alt="Logo"
            style={{ width: "80px", height: "80px" }}
          />
        </div>
      </Link>
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    </nav>
  );
};

export default Navbar;
