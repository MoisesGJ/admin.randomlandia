"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const pathName = "https://cdn.randomlandia.com/links";
  const links = [
    { icon: "/sandia", path: "/dashboard/sandias", name: "Administrador" },
    { icon: "/tools", path: "/sharing/tools", name: "Tecnologías" },
  ];

  return (
    <main className="overflow-hidden fix-h-screen w-screen bg-orange/80 flex flex-col justify-center items-center gap-12">
      <h1 className="text-5xl text-white font-semibold underline">
        Repositorio
      </h1>
      <ul className="flex flex-col justify-center items-center gap-2 w-full px-3 mx-3 max-w-96">
        {links.map(({ icon, path, name }, index) => {
          return (
            <li
              key={`link-${index}`}
              className="flex items-center gap-5 w-full bg-blue rounded-xl p-3 text-white text-xl font-bold overflow-hidden shadow-xl shadow-blue-text/50 hover:scale-110 hover:bg-orange hover:border-blue"
            >
              <Image
                src={`${pathName}${icon}.webp`}
                width={40}
                height={40}
                alt={name}
                className="ms-5"
              />
              <Link href={path}>{name}</Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
