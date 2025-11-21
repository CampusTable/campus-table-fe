import React from "react";
import styles from "./auth-page-view.module.css";

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