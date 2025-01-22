"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"; // To get the current active path
import styles from "./Navbar.module.css"; // Import CSS module for custom styles
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"; // For the reopen modal button
import InfoIcon from "@mui/icons-material/Info";
import Tooltip from "@mui/material/Tooltip";

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className={styles.navbar}>
      <div className={styles.links}>
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
    </nav>
  );
};

export default Navbar;
