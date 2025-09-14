"use client";

import { SmoothCursor } from "@/components/ui/smooth-cursor";

// Gaming-themed cursor variants
export const GamingCursor = () => (
  <SmoothCursor
    size={4}
    color="#ef4444"
    springConfig={{ damping: 20, stiffness: 400, mass: 0.8 }}
    showTrail={true}
    trailLength={6}
    glowEffect={true}
    magneticEffect={true}
  />
);

export const NeonCursor = () => (
  <SmoothCursor
    size={20}
    color="#00ff88"
    springConfig={{ damping: 15, stiffness: 300, mass: 0.6 }}
    showTrail={true}
    trailLength={10}
    glowEffect={true}
    magneticEffect={false}
  />
);

export const MinimalCursor = () => (
  <SmoothCursor
    size={16}
    color="#ffffff"
    springConfig={{ damping: 30, stiffness: 600, mass: 0.4 }}
    showTrail={false}
    glowEffect={false}
    magneticEffect={true}
  />
);

export const CyberCursor = () => (
  <SmoothCursor
    size={28}
    color="#00d4ff"
    springConfig={{ damping: 25, stiffness: 500, mass: 1.0 }}
    showTrail={true}
    trailLength={8}
    glowEffect={true}
    magneticEffect={true}
  />
);

export const RetroGamingCursor = () => (
  <SmoothCursor
    size={32}
    color="#ff6b35"
    springConfig={{ damping: 35, stiffness: 700, mass: 0.3 }}
    showTrail={true}
    trailLength={5}
    glowEffect={true}
    magneticEffect={true}
  />
);

// Dota 2 themed cursors
export const RadiantCursor = () => (
  <SmoothCursor
    size={26}
    color="#92c5f7"
    springConfig={{ damping: 22, stiffness: 450, mass: 0.7 }}
    showTrail={true}
    trailLength={7}
    glowEffect={true}
    magneticEffect={true}
  />
);

export const DireCursor = () => (
  <SmoothCursor
    size={26}
    color="#c23c2a"
    showTrail={true}
    trailLength={6}
    glowEffect={true}
    magneticEffect={true}
  />
);

export const NeutralCursor = () => (
  <SmoothCursor
    size={22}
    color="#f4d03f"
    springConfig={{ damping: 25, stiffness: 500, mass: 0.6 }}
    showTrail={true}
    trailLength={4}
    glowEffect={true}
    magneticEffect={true}
  />
);
