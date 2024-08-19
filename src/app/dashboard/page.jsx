"use client";

import { useContextSession } from "@/components/dashboard/Context";

import Title from "@/components/dashboard/title.jsx";

export default function Dashboard() {
  const session = useContextSession();

  return (
    <>
      <Title text={`¡Hola, ${session.displayName}!`} />
    </>
  );
}
