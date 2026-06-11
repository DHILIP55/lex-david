import { Suspense } from "react";
import HomeClient from "@/components/site/HomeClient";

export default function Page() {
  return (
    <Suspense>
      <HomeClient />
    </Suspense>
  );
}
