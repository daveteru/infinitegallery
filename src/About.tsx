import { useGSAP } from "@gsap/react";
import React from "react";
import gsap from "gsap";

import { useOutletContext } from "react-router";

export default function About() {
  const { pageRef } = useOutletContext<{
    pageRef: React.RefObject<HTMLDivElement>;
  }>();
  useGSAP(
    () => {
      gsap.from(pageRef.current, {
        opacity: 0,
        duration: 1,
        ease: "power2.inOut",
      });
    },
    { scope: pageRef },
  );
  return (
    <div
      ref={pageRef}
      className="bg-black w-screen h-screen flex justify-center items-center text-white"
    >
      <div className="flex gap-10">
        <div className="w-100 h-100 bg-neutral-300"> test </div>
        <p className="w-100 flex flex-col gap-5">
          <h1 className="text-xl">
            Hello! this is a sample page on the infinite gallery
          </h1>{" "}
          <hr />
          developed by teru - 

          halaman ini menjadi contoh untuk efek transisi antar halaman saat berpindah
          halaman
    <hr />
          infinite gallery ini adalah sebuah example template design unutk website portfolio / gallery cocok untuk creative designer / photographer & multimedia artists
        <a href="https://www.github.com/daveteru" className="hover:underline">Contact : GitHub</a>
        <a href="mailto:daveteru@gmail.com" className="hover:underline">Email : daveteru@gmail.com</a>
        </p>
      </div>
    </div>
  );
}
