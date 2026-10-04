import { ProblemPage } from "@/components/ProblemPage";
import { getContent } from "@/lib/content";
import { localeMetadata } from "@/lib/metadata";

export const metadata = localeMetadata("en", "problem", getContent("en").problem.meta);

export default function Page() {
  return <ProblemPage locale="en" />;
}
