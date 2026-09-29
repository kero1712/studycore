import Link from "next/link";
import Icon from "./Icon";
export default function Crumb({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} className="crumb"><Icon name="back" /> {children}</Link>;
}
