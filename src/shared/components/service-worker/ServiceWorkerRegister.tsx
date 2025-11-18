'use client';

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .catch((error) => {
        console.error("Service Worker 파일 등록에 실패했습니다.", error);
      });
    }
  }, []);

  return null;
}