import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable, InertiaPlugin } from "gsap/all";
import { useRef, type RefObject } from "react";
import { useOutletContext } from "react-router";

gsap.registerPlugin(Draggable, InertiaPlugin);

export default function Dragtesting() {
  const { pageRef } = useOutletContext<{ pageRef: RefObject<HTMLDivElement> }>();
  const boxRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const winX = window.innerWidth;
  const winY = window.innerHeight;
  const COLS = 5;
  const ROWS = 5;

  const items = [
    { client: "Andy & Cindy", type: "Wedding", url: "/Artboard 12.png" },
    { client: "Kevin & Yenny", type: "Pre-wedding", url: "/test1.png" },
    {
      client: "Ishak & Neysa",
      type: "Wedding",
      url: "/Artboard 2 copy 18.png",
    },
    {
      client: "Reginald & Liz",
      type: "Wedding",
      url: "/Artboard 2 copy 31.png",
    },
    {
      client: "Joseph & Maria",
      type: "Japan Prewedding",
      url: "/Artboard 2.png",
    },
    {
      client: "Jonathan & Irene",
      type: "Prewedding",
      url: "/Artboard 2 copy 12.png",
    },
  ];


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

  useGSAP(
    () => {
      const wrapX = gsap.utils.wrap(-winX, 0);
      const wrapY = gsap.utils.wrap(-winY, 0);

      Draggable.create(boxRef.current, {
        trigger: containerRef.current,
        type: "x,y",
        inertia: { x: { min: -winX, max: 0 }, y: { min: -winY, max: 0 } },
        liveSnap: false,
        onDrag() {
          gsap.set(boxRef.current, {
            x: wrapX(this.x),
            y: wrapY(this.y),
          });
        },
        onThrowUpdate() {
          gsap.set(boxRef.current, {
            x: wrapX(this.x),
            y: wrapY(this.y),
          });
        },
      });
    },
    { scope: containerRef },
  );

  useGSAP(
    () => {
      const frames = gsap.utils.toArray(".layer");
      const speed = 0.05;

      const setters = frames.map((frame: any) => ({
        x: gsap.quickTo(frame, "x", { duration: 0.6, ease: "power3.out" }),
        y: gsap.quickTo(frame, "y", { duration: 0.6, ease: "power3.out" }),
      }));

      const onMouseMove = (e: any) => {
        const dx = e.clientX - window.innerWidth / 2;
        const dy = e.clientY - window.innerHeight / 2;
        setters.forEach(({ x, y }) => {
          x(dx * speed);
          y(dy * speed);
        });
      };

      window.addEventListener("mousemove", onMouseMove);
      return () => window.removeEventListener("mousemove", onMouseMove);
    },
    { scope: containerRef },
  );
  return (
    <div className="w-screen h-screen bg-black">
      <div
        ref={pageRef}
        className="w-screen h-screen flex items-center justify-center "
      >
        <img
          src="/Solune-Logo-White-.png"
          alt=""
          className="absolute z-30 w-40 bottom-0 left-0 pointer-event-none"
        />
        <div
          ref={containerRef}
          className="w-screen h-screen absolute inset-0 z-10 overflow-hidden gap-5 bg-black text-white cursor-grab active:cursor-grabbing"
        >
          <div
            ref={boxRef}
            style={{ width: `${winX * COLS}px`, height: `${winY * ROWS}px` }}
            className="absolute top-0 left-0 flex flex-col"
          >
            {Array.from({ length: ROWS }).map((_, r) => (
              <div key={r} className="flex shrink-0">
                {Array.from({ length: COLS }).map((_, c) => (
                  <div
                    key={c}
                    style={{ width: `${winX}px`, height: `${winY}px` }}
                    className="shrink-0 grid grid-cols-2 lg:grid-cols-3 relative"
                  >
                    {items.map((it, idx) => (
                      <div className="group  h-fit w-fit">
                        <div
                          key={idx}
                          className={`${idx % 2 === 0 ? "w-30 lg:w-60 lg:h-80 " : "w-40 lg:w-80"} layer bg-neutral-200  text-black flex justify-center overflow-hidden items-center`}
                        >
                          <img
                            src={it.url}
                            alt=""
                            className="w-full h-full object-cover scale-110"
                          />
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 flex flex-col transition-all ease-in">
                          <p className=" mt-3 font-inter text-[12px] tracking-[2px] text-neutral-400  uppercase">
                            {it.client}
                          </p>
                          <p className="text-[8px] text-sm tracking-[2px] text-neutral-400  uppercase">
                            {it.type}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
