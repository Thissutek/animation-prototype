"use client";

import dynamic from "next/dynamic";

// Import the BuildingAnimation component with no SSR since Three.js needs browser environment
const BuildingAnimation = dynamic(
  () => import("@/components/BuildingAnimation"),
  { ssr: false },
);

export default function Home() {
  return (
    <main>
      <BuildingAnimation />
    </main>
  );
}
