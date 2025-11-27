import React from "react";
import styles from "./AuthPageView.module.css";

export default function AuthPageView({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className={styles.container}>
      {children}
    </main>
  );
}