"use client";

import { cn } from "@/lib/utils";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface SmoothCursorProps {
  className?: string;
  size?: number;
  color?: string;
  springConfig?: {
    damping: number;
    stiffness: number;
    mass: number;
  };
  children?: React.ReactNode;
  showTrail?: boolean;
  trailLength?: number;
  glowEffect?: boolean;
  magneticEffect?: boolean;
}

export function SmoothCursor({
  className,
  size = 20,
  color = "#ff0000",
  springConfig = { damping: 25, stiffness: 700, mass: 0.5 },
  children,
  showTrail = false,
  trailLength = 8,
  glowEffect = true,
  magneticEffect = true,
}: SmoothCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [trail, setTrail] = useState<
    Array<{ x: number; y: number; id: number }>
  >([]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    let trailId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX;
      const newY = e.clientY;

      mouseX.set(newX);
      mouseY.set(newY);
      setIsVisible(true);

      // Add trail effect
      if (showTrail) {
        setTrail((prev) => {
          const newTrail = [
            { x: newX, y: newY, id: trailId++ },
            ...prev.slice(0, trailLength - 1),
          ];
          return newTrail;
        });
      }
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Handle hover states for interactive elements with magnetic effect
    const handleElementHover = (e: Event) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.getAttribute("role") === "button" ||
        target.style.cursor === "pointer" ||
        target.closest("button") ||
        target.closest("a") ||
        target.closest('[role="button"]');

      if (isInteractive) {
        setIsHovering(true);

        // Magnetic effect
        if (magneticEffect && target instanceof HTMLElement) {
          const rect = target.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          // Slightly pull cursor towards element center
          const pullStrength = 0.3;
          const adjustedX =
            mouseX.get() + (centerX - mouseX.get()) * pullStrength;
          const adjustedY =
            mouseY.get() + (centerY - mouseY.get()) * pullStrength;

          mouseX.set(adjustedX);
          mouseY.set(adjustedY);
        }
      } else {
        setIsHovering(false);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseover", handleElementHover);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseover", handleElementHover);
    };
  }, [mouseX, mouseY, showTrail, trailLength, magneticEffect]);

  return (
    <>
      <style jsx global>{`
        * {
          cursor: none !important;
        }
      `}</style>

      {/* Trail Effect */}
      {showTrail &&
        trail.map((point, index) => (
          <motion.div
            key={point.id}
            className="pointer-events-none fixed top-0 left-0 z-[9998] rounded-full"
            style={{
              x: point.x,
              y: point.y,
              translateX: "-50%",
              translateY: "-50%",
              width: size * (1 - index * 0.1),
              height: size * (1 - index * 0.1),
              backgroundColor: color,
              opacity: (1 - index * 0.15) * 0.6,
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.1 }}
          />
        ))}

      {/* Main Cursor */}
      <motion.div
        ref={cursorRef}
        className={cn(
          "pointer-events-none fixed top-0 left-0 z-[9999] mix-blend-difference",
          glowEffect && "drop-shadow-lg",
          className
        )}
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isVisible ? (isHovering ? 1.5 : 1) : 0,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          scale: { duration: 0.2, ease: "easeOut" },
          opacity: { duration: 0.2 },
        }}
      >
        {children || (
          <div
            className={cn(
              "rounded-full border-2 border-white bg-white/20 backdrop-blur-sm",
              glowEffect && "shadow-lg",
              isHovering && "animate-pulse"
            )}
            style={{
              width: size,
              height: size,
              borderColor: color,
              backgroundColor: `${color}20`,
              boxShadow: glowEffect ? `0 0 20px ${color}40` : undefined,
            }}
          />
        )}
      </motion.div>
    </>
  );
}
