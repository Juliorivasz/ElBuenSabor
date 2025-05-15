import React, { useRef } from "react";

type HorizontalScrollProps = {
  children: React.ReactNode;
};

export const HorizontalScroll: React.FC<HorizontalScrollProps> = ({ children }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative w-full min-w-[52vw] group">
      <button
        onClick={() => scroll("left")}
        className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black shadow p-3 rounded-md hover:bg-orange-500">
        ‹
      </button>

      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide sm:px-10 py-4">
        {children}
      </div>

      <button
        onClick={() => scroll("right")}
        className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black shadow p-3 rounded-md hover:bg-orange-500">
        ›
      </button>
    </div>
  );
};
