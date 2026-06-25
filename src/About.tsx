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
        <p className="w-100">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum facere
          quasi maxime officia labore sit tempore recusandae dolorem doloribus?
          A ab mollitia consectetur rerum adipisci porro quam inventore iure.
          Harum dicta asperiores tempore, eos, accusamus molestias quisquam
          impedit amet, consectetur magni sequi explicabo autem! Excepturi
          doloribus sint voluptate repudiandae obcaecati quae quisquam provident
          aliquid sed error in dignissimos sapiente sit quasi autem itaque
          necessitatibus possimus laboriosam odio, fuga neque, saepe veniam
          facilis vero? Obcaecati eius sed, laudantium amet quisquam similique!
          Laudantium perspiciatis maxime delectus nam non labore veritatis,
          exercitationem nulla aliquam quam soluta unde reprehenderit quisquam
          velit aut aliquid praesentium.
        </p>
      </div>
    </div>
  );
}
