import React, { JSX } from "react";

export default function AuthLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>): JSX.Element {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-full bg-zinc-50">
      <main className="flex flex-col justify-center w-full max-w-3xl min-h-screen px-gutter bg-white">
        {children}
      </main>
    </div>
  );
}