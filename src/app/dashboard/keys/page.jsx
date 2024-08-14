"use client";

import Title from "@/components/dashboard/title.jsx";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Keys() {
  const pathname = "https://cdn.randomlandia.com/icons/";
  const keys = [
    {
      path: "https://auth.linktr.ee/login",
      image: "linktree",
      user: null,
      email: process.env.NEXT_PUBLIC_EMAIL_KEYS,
      password: process.env.NEXT_PUBLIC_PASSWORD_KEYS,
    },
    {
      path: "https://www.namecheap.com/myaccount/login/",
      image: "namecheap",
      user: process.env.NEXT_PUBLIC_USER_KEYS,
      email: null,
      password: process.env.NEXT_PUBLIC_PASSWORD_KEYS,
    },
    {
      path: "https://accounts.spotify.com/en/login",
      image: "spotify",
      user: null,
      email: process.env.NEXT_PUBLIC_EMAIL_KEYS,
      password: process.env.NEXT_PUBLIC_PASSWORD_KEYS,
    },
    {
      path: "https://www.tiktok.com/login/phone-or-email/email",
      image: "tiktok",
      user: null,
      email: process.env.NEXT_PUBLIC_EMAIL_KEYS,
      password: process.env.NEXT_PUBLIC_PASSWORD_KEYS,
    },
    {
      path: "https://www.instagram.com/accounts/login/",
      image: "instagram",
      user: null,
      email: process.env.NEXT_PUBLIC_EMAIL_KEYS,
      password: process.env.NEXT_PUBLIC_PASSWORD_KEYS,
    },
    {
      path: "https://github.com/login",
      image: "github",
      user: "",
      email: process.env.NEXT_PUBLIC_EMAIL_KEYS,
      password: process.env.NEXT_PUBLIC_PASSWORD_KEYS,
    },
    {
      path: "https://gmail.com",
      image: "gmail",
      user: null,
      email: process.env.NEXT_PUBLIC_EMAIL_KEYS,
      password: process.env.NEXT_PUBLIC_PASSWORD_KEYS,
    },
    {
      path: "https://www.facebook.com/login",
      image: "facebook",
      user: null,
      email: process.env.NEXT_PUBLIC_EMAIL_KEYS,
      password: process.env.NEXT_PUBLIC_PASSWORD_KEYS,
    },
  ];

  return (
    <>
      <Title text="Keys" />

      <section className="pt-10 md:p-10 space-y-3">
        <div className="grid grid-cols-6 font-semibold text-center mx-auto bg-gray-400/30 [&>div]:overflow-hidden">
          <div className="col-span-1">Social</div>
          <div className="col-span-2">Usuario</div>
          <div className="col-span-3">Contraseña</div>
        </div>

        {keys.map(({ path, image, user, email, password }, index) => {
          return (
            <div
              key={index}
              className="grid grid-cols-6 text-center mx-auto bg-gray-400/05"
            >
              <Key span="1">
                <Link
                  href={"/dashboard/keys/"}
                  legacyBehavior
                >
                  <a
                    href={path}
                    target="_blank"
                  >
                    <Image
                      src={`${pathname}${image}.webp`}
                      width={40}
                      height={40}
                      alt={image}
                      className="m-auto"
                    />
                  </a>
                </Link>
              </Key>
              <Key span="2">{user || email}</Key>
              <Key
                span="3"
                password={true}
              >
                {password}
              </Key>
            </div>
          );
        })}
      </section>
    </>
  );
}

function Key({ children, password, span }) {
  const [viewPass, setViewPass] = useState(false);
  const [content, setContent] = useState("************");

  return (
    <div
      className={`col-span-${span} overflow-x-scroll relative ${
        password ? "flex items-center space-x-3" : ""
      }`}
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <span
        className="mx-auto overflow-scroll"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {password ? content : children}
      </span>

      {password && (
        <button
          type="button"
          className=" text-blue-text"
          onClick={() => {
            if (viewPass) setContent("************");
            else setContent(children);
            setViewPass((prev) => !prev);
          }}
        >
          {viewPass ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              className="fill-blue-text"
            >
              <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              className="fill-blue-text"
            >
              <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}
