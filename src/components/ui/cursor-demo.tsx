"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SmoothCursor } from "@/components/ui/smooth-cursor";

interface CursorDemoProps {
  className?: string;
}

export function CursorDemo({ className }: CursorDemoProps) {
  const [currentDemo, setCurrentDemo] = useState<string>("default");

  const demos = {
    default: {
      name: "Default Gaming Cursor",
      props: {
        size: 24,
        color: "#ef4444",
        springConfig: { damping: 20, stiffness: 400, mass: 0.8 },
        showTrail: false,
        glowEffect: true,
        magneticEffect: true,
      },
    },
    trail: {
      name: "Trail Effect",
      props: {
        size: 20,
        color: "#8b5cf6",
        springConfig: { damping: 15, stiffness: 300, mass: 0.6 },
        showTrail: true,
        trailLength: 8,
        glowEffect: true,
        magneticEffect: false,
      },
    },
    magnetic: {
      name: "Magnetic Attraction",
      props: {
        size: 28,
        color: "#06b6d4",
        springConfig: { damping: 25, stiffness: 500, mass: 1.0 },
        showTrail: false,
        glowEffect: true,
        magneticEffect: true,
      },
    },
    glow: {
      name: "Intense Glow",
      props: {
        size: 32,
        color: "#f59e0b",
        springConfig: { damping: 30, stiffness: 600, mass: 0.4 },
        showTrail: true,
        trailLength: 4,
        glowEffect: true,
        magneticEffect: true,
      },
    },
  };

  return (
    <div className={className}>
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Smooth Cursor Demos</h2>
          <p className="text-gray-400 mb-6">
            Click the buttons below to experience different cursor effects
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(demos).map(([key, demo]) => (
            <Button
              key={key}
              variant={currentDemo === key ? "default" : "outline"}
              onClick={() => setCurrentDemo(key)}
              className="h-auto p-4 flex flex-col items-center space-y-2"
            >
              <div
                className="w-6 h-6 rounded-full border-2"
                style={{
                  borderColor: demo.props.color,
                  backgroundColor: `${demo.props.color}20`,
                }}
              />
              <span className="text-sm font-medium">{demo.name}</span>
            </Button>
          ))}
        </div>

        <div className="bg-gray-800/50 rounded-lg p-8 min-h-[300px] flex items-center justify-center">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">
              {demos[currentDemo as keyof typeof demos].name}
            </h3>
            <p className="text-gray-400">
              Move your cursor around this area to see the effect
            </p>
            <div className="flex flex-wrap gap-4 justify-center mt-8">
              <Button size="lg">Hover Me</Button>
              <Button variant="outline" size="lg">
                Interactive Button
              </Button>
              <Button variant="ghost" size="lg">
                Another Button
              </Button>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-500 space-y-2">
          <h4 className="font-semibold">Current Configuration:</h4>
          <pre className="bg-gray-900 p-3 rounded text-xs overflow-x-auto">
            {JSON.stringify(
              demos[currentDemo as keyof typeof demos].props,
              null,
              2
            )}
          </pre>
        </div>
      </div>

      {/* Render the current cursor demo */}
      <SmoothCursor
        key={currentDemo}
        {...demos[currentDemo as keyof typeof demos].props}
      />
    </div>
  );
}
