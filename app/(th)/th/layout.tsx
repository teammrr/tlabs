import "../../globals.css";
import { fontVariables } from "@/lib/fonts";
import { localeMetadata } from "@/lib/metadata";

export const metadata = localeMetadata("th");

export default function ThaiLayout({ children }: LayoutProps<"/th">) {
  return (
    <html lang="th" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
