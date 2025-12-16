import { Suspense } from "react";
import QuizClient from "./QuizClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Caricamento…</div>}>
      <QuizClient />
    </Suspense>
  );
}