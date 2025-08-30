"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-[var(--background)] text-[var(--foreground)]">
      <main className="flex flex-col items-center gap-6">
        <button
          onClick={() => setCount((c) => c + 1)}
          aria-label="Clique na foto da Chevette para aumentar o contador"
          className="rounded-lg overflow-hidden cursor-grab active:cursor-grabbing"
          style={{ background: "transparent", border: "none", padding: 0 }}
        >
          <Image
            src="/03-chevrolet-chevette.png"
            alt="Chevrolet Chevette"
            width={800}
            height={400}
            priority
            className="block w-full h-auto cursor-grab active:cursor-grabbing"
          />
        </button>

        <div className="text-center">
          <p className="font-mono text-sm">Aceleradas:</p>
          <p className="text-3xl font-semibold" aria-live="polite">{count}</p>
          <div className="mt-4 flex gap-3 justify-center">
            <button
              onClick={() => setCount(0)}
              aria-label="Redefinir contador"
              className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm hover:opacity-90 cursor-grab active:cursor-grabbing"
            >
              Reset
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
