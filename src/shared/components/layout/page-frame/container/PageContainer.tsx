import React from "react";
import styles from "./page-container.module.css"

export default function PageContainer({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className={styles.container}>
      {children}
    </div>
  );
}