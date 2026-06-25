import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable, InertiaPlugin } from "gsap/all";
import { useRef } from "react";
import { Outlet, useNavigate } from "react-router";

gsap.registerPlugin(Draggable, InertiaPlugin);

export default function Base() {
  const pageRef = useRef<HTMLDivElement>(null);
  const { contextSafe } = useGSAP({ scope: pageRef });
  const navigate = useNavigate();

  const handlePageChange = contextSafe((destination: string) => {
    gsap.to(pageRef.current, { opacity: 0, duration: 1, ease: "power2.inOut" });
    setTimeout(() => navigate(destination), 1000);
  });
  return (
    <div  className="w-screen h-screen bg-black relative flex items-center justify-center">
      <div className=" border-white w-full h-fit z-20 text-white fixed top-0 py-10 px-20 flex justify-end pointer-events-auto">
        <li className="list-none flex gap-10 font-inter cursor-pointer ">
          <ul
            onClick={() => handlePageChange("/about")}
            className="hover:underline"
          >
            About
          </ul>
          <ul 
          onClick={() => handlePageChange("/")}
          className="hover:underline">Portfolio</ul>
          <ul className="hover:underline">Contact</ul>
          <ul className="hover:underline">Packages</ul>
        </li>
      </div>
      <Outlet context={{ pageRef }} />
    </div>
  );
}
