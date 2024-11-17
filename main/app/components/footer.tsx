import React from "react";
import Link from "next/link";
const Footer = () => {
  return (
      <footer className="footer footer-center bg-base-200 text-base-content rounded p-10">
        <nav className="grid grid-flow-col gap-4">
          <Link href="/#about" className="link link-hover">About us</Link>
          <Link href="/contact" className="link link-hover">Contact</Link>
          <Link href="/#pricing" className="link link-hover">Pricing</Link>
          <Link href="/help" className="link link-hover">Help</Link>
        </nav>
        <aside>
          <p>
            Copyright © {new Date().getFullYear()} - All right reserved by Shimage Cloud
          </p>
        </aside>
      </footer>
  );
};

export default Footer;
