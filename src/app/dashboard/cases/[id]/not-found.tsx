import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CaseNotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <h2 className="text-xl font-bold">Case Not Found</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        The case you are looking for does not exist.
      </p>
      <Button asChild className="mt-6">
        <Link href="/dashboard">Back to Board</Link>
      </Button>
    </div>
  );
}
