"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

const fruits = ["apple", "banana", "cherry", "lemon"] as const;
type Fruit = typeof fruits[number];

function randomFruit(): Fruit {
  return fruits[Math.floor(Math.random() * fruits.length)];
}

export default function SlotMachine() {
  const [grid, setGrid] = useState<Fruit[][]>(
    Array.from({ length: 3 }, () => Array.from({ length: 3 }, randomFruit))
  );
  const [spinning, setSpinning] = useState(false);
  const [winMessage, setWinMessage] = useState<string | null>(null);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setWinMessage(null);
    const interval = setInterval(() => {
      setGrid((prev) =>
        prev.map((row) => row.map(() => randomFruit()))
      );
    }, 100);
    setTimeout(() => {
      clearInterval(interval);
      setSpinning(false);
      checkWin();
    }, 2000);
  };

  const checkWin = () => {
    // Check rows
    for (const row of grid) {
      if (row.every((f) => f === row[0])) {
        setWinMessage(`You won with ${row[0]}!`);
        return;
      }
    }
    // Check columns
    for (let col = 0; col < 3; col++) {
      const colValues = grid.map((row) => row[col]);
      if (colValues.every((f) => f === colValues[0])) {
        setWinMessage(`You won with ${colValues[0]}!`);
        return;
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-2">
        {grid.flat().map((fruit, idx) => (
          <img
            key={idx}
            src={`/${fruit}.png`}
            alt={fruit}
            width={80}
            height={80}
            className="rounded-md"
          />
        ))}
      </div>
      <Button onClick={spin} disabled={spinning}>
        {spinning ? "Spinning..." : "Spin"}
      </Button>
      {winMessage && (
        <div className="mt-4 text-lg font-semibold">
          {winMessage}
          <Share text={`${winMessage} ${url}`} className="ml-2" />
        </div>
      )}
    </div>
  );
}
