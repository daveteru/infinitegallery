import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable, InertiaPlugin, Observer } from "gsap/all";
import { useRef, type RefObject } from "react";
import { useOutletContext } from "react-router";

gsap.registerPlugin(Draggable, InertiaPlugin, Observer);

export default function Dragtesting() {
  const { pageRef } = useOutletContext<{
    pageRef: RefObject<HTMLDivElement>;
  }>();
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

  const pos = useRef({ x: 0, y: 0 });

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

      // Applies the current pos to the DOM through the wrap. Everything that
      // moves the grid funnels through here so drag + scroll never fight.
      const render = () => {
        gsap.set(boxRef.current, {
          x: wrapX(pos.current.x),
          y: wrapY(pos.current.y),
        });
      };

      // --- DRAG ---------------------------------------------------------
      const draggable = Draggable.create(boxRef.current, {
        trigger: containerRef.current,
        type: "x,y",
        inertia: true,
        // Keep Draggable's internal x/y in sync with our pos so a new drag
        // picks up exactly where scroll (or the previous throw) left off.
        onPress() {
          gsap.set(this.target, { x: pos.current.x, y: pos.current.y });
          this.update();
        },
        onDrag() {
          pos.current.x = this.x;
          pos.current.y = this.y;
          render();
        },
        onThrowUpdate() {
          pos.current.x = this.x;
          pos.current.y = this.y;
          render();
        },
      })[0];

      // --- SCROLL (momentum nudge) -------------------------------------
      // A tiny tween object we animate toward the target offset, so wheel
      // ticks feel like inertia rather than a hard jump.
      const scrollProxy = { x: 0, y: 0 };
      let scrollTween: gsap.core.Tween | null = null;

      const scrollObserver = Observer.create({
        target: containerRef.current,
        type: "wheel,touch",
        // Don't hijack touch-drag — Draggable already owns pointer drags.
        // Observer here is mainly for wheel / trackpad.
        onChangeY(self) {
          // If a throw is mid-flight, stop it so scroll takes over cleanly.
          draggable.tween?.kill();

          scrollProxy.x = pos.current.x;
          scrollProxy.y = pos.current.y;

          // deltaY: scroll down -> grid moves up (negative y), like natural scroll
          const targetY = pos.current.y - self.deltaY;

          scrollTween?.kill();
          scrollTween = gsap.to(scrollProxy, {
            y: targetY,
            duration: 0.8,
            ease: "power3.out",
            onUpdate() {
              pos.current.y = scrollProxy.y;
              render();
            },
          });
        },
        // Optional: horizontal wheel / shift-scroll feeds x
        onChangeX(self) {
          draggable.tween?.kill();
          scrollProxy.x = pos.current.x;
          scrollProxy.y = pos.current.y;
          const targetX = pos.current.x - self.deltaX;
          scrollTween?.kill();
          scrollTween = gsap.to(scrollProxy, {
            x: targetX,
            duration: 0.8,
            ease: "power3.out",
            onUpdate() {
              pos.current.x = scrollProxy.x;
              render();
            },
          });
        },
      });

      render();

      return () => {
        draggable.kill();
        scrollObserver.kill();
        scrollTween?.kill();
      };
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
