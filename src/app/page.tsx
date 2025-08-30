"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const [count, setCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stopTimeoutRef = useRef<number | null>(null);

  const waitForEvent = (el: HTMLMediaElement, event: string) =>
    new Promise<void>((resolve) => el.addEventListener(event, () => resolve(), { once: true }));

  const playLast10Seconds = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.duration || isNaN(audio.duration) || audio.duration === Infinity || audio.duration === 0) {
      try {
        await waitForEvent(audio, "loadedmetadata");
      } catch (e) {
        // ignore
      }
    }

    if ((audio.seekable && audio.seekable.length === 0) || audio.readyState < 2) {
      try {
        await waitForEvent(audio, "canplay");
      } catch (e) {
        // ignore
      }
    }

    const duration = audio.duration || 0;
    const start = Math.max(0, duration - 10);

    if (stopTimeoutRef.current) {
      clearTimeout(stopTimeoutRef.current);
      stopTimeoutRef.current = null;
    }

    try {
      audio.pause();
      audio.currentTime = start;
    } catch (e) {
      // ignore seek errors
    }

    const p = audio.play();
    if (p && typeof p.then === "function") {
      p.catch(() => {
        // ignore play rejection
      });
    }

    const playLen = Math.max(0, Math.min(10, duration - start));
    if (playLen > 0) {
      stopTimeoutRef.current = window.setTimeout(() => {
        try {
          audio.pause();
        } catch (e) {
          // ignore
        }
        stopTimeoutRef.current = null;
      }, playLen * 1000);
    }
  };

  const stopAudio = () => {
    const audio = audioRef.current;
    if (stopTimeoutRef.current) {
      clearTimeout(stopTimeoutRef.current);
      stopTimeoutRef.current = null;
    }
    if (audio) {
      try {
        audio.pause();
      } catch (e) {
        // ignore
      }
    }
  };

  useEffect(() => {
    // try to preload metadata on mount so mobile browsers don't block the user gesture
    const audio = audioRef.current;
    if (audio) {
      const onLoaded = () => {
        // nothing else — start time will be computed in playLast10Seconds from duration
      };
      audio.addEventListener("loadedmetadata", onLoaded);
      try {
        // preload metadata
        audio.load();
      } catch (e) {
        // ignore
      }

      return () => {
        audio.removeEventListener("loadedmetadata", onLoaded);
        if (stopTimeoutRef.current) {
          clearTimeout(stopTimeoutRef.current);
          stopTimeoutRef.current = null;
        }
        try {
          audio.pause();
        } catch (e) {
          // ignore
        }
      };
    }
    return () => {
      if (stopTimeoutRef.current) {
        clearTimeout(stopTimeoutRef.current);
        stopTimeoutRef.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-[var(--background)] text-[var(--foreground)]">
      <main className="flex flex-col items-center gap-6">
        <p className="text-center font-mono text-sm">Clique no Chevette para acelerá‑lo!</p>

        <audio
          ref={(el) => {
            if (el) audioRef.current = el;
          }}
          preload="auto"
          playsInline
          style={{ display: "none" }}
        >
          <source src="/chevette-turbo.mp3" type="audio/mpeg" />
          <source src="/chevette-turbo.ogg" type="audio/ogg" />
        </audio>

        <button
          onPointerDown={() => audioRef.current?.load()}
          onTouchStart={() => audioRef.current?.load()}
          onClick={() => {
            setCount((c) => c + 1);
            void playLast10Seconds();
          }}
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
              onClick={() => {
                setCount(0);
                stopAudio();
              }}
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
