import styles from "./page-frame.module.css";

export default function PageFrame({
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