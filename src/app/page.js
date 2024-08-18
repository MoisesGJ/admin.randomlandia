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
    <main className="overflow-hidden fix-h-screen w-screen bg-oldwhite/30 flex flex-col justify-center items-center gap-12">
      <h1 className="text-5xl text-orange font-semibold underline">
        Repositorio
      </h1>
      <ul className="flex flex-col justify-center items-center gap-2 w-full px-3 mx-3 max-w-96">
        {links.map(({ icon, path, name }, index) => {
          return (
            <li
              key={`link-${index}`}
              className="w-full bg-blue rounded-xl text-white text-xl font-bold overflow-hidden shadow-xl shadow-blue-text/50 hover:scale-110 hover:bg-orange hover:border-blue"
            >
              <Link
                href={path}
                className="flex items-center gap-5 p-3"
              >
                <Image
                  src={`${pathName}${icon}.webp`}
                  width={40}
                  height={40}
                  alt={name}
                  className="ms-5"
                />
                {name}
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
