"use client";
import Link from "next/link";
import Icon from "./Icon";
import { LOGO_INNER } from "@/lib/svg";

export default function Header() {
  const toggle = () => {
    const r = document.documentElement;
    const dark = (r.dataset.theme || (matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light")) === "dark";
    r.dataset.theme = dark ? "light" : "dark";
  };
  return (
    <header>
      <Link href="/" className="logo">
        <svg width="36" height="36" viewBox="0 0 48 48" aria-hidden="true" dangerouslySetInnerHTML={{ __html: LOGO_INNER }} />
        <span className="wm">Study<b>Core</b></span>
      </Link>
      <div>
        <Link href="/search" className="ib" aria-label="بحث"><Icon name="search" /></Link>
        <button className="ib" onClick={toggle} aria-label="الوضع الداكن"><Icon name="moon" /></button>
      </div>
    </header>
  );
}
