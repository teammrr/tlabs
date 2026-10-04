import { ProblemPage } from "@/components/ProblemPage";
import { getContent } from "@/lib/content";
import { localeMetadata } from "@/lib/metadata";

export const metadata = localeMetadata("th", "problem", getContent("th").problem.meta);

export default function Page() {
  return <ProblemPage locale="th" />;
}
