"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
export default function SplashLoader() {
  const [fadeOut, setFadeOut] = useState(false);
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Inicia fade out del fondo a los 1.5s
    const fadeTimer = setTimeout(() => setFadeOut(true), 1500);
    // Remueve el splash después de 2s
    const hideTimer = setTimeout(() => setShow(false), 2000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!show) return null;

  return (
     <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100 bg-white"
      }`}
    >
      <Image
        src="/img/logo_2.png"
        alt="Logo"
        width={200}
        height={200}
        className="animate-blink"
      />
    </div>
  );
}