import styles from "./page-view.module.css";

export default function PageView({
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