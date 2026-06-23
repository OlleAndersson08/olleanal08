import JobbFlode from "@/components/JobbFlode";
import { jobb } from "@/data/jobb";

/*
  Jobbflödet – hjärtat i appen.
  Sidan hämtar jobben och låter klientkomponenten sköta svep + progress.
*/

export default function JobbFlodeSida() {
  return (
    <main className="flex-1 bg-bg">
      <JobbFlode jobb={jobb} />
    </main>
  );
}
