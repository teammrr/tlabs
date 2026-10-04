import "../globals.css";
import { fontVariables } from "@/lib/fonts";
import { localeMetadata } from "@/lib/metadata";

export const metadata = localeMetadata("en");

export default function EnglishLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
