import styles from "./PageView.module.css";

export type PageViewVariant = "plain" | "header-only" | "header-nav";

interface PageViewProps {
  children: React.ReactNode;
  variant?: PageViewVariant;
  className?: string;
}

export default function PageView({
  children,
  variant = "plain",
  className,
}: Readonly<PageViewProps>) {
  let containerClassName: string = styles.container;

  if (variant === "plain") {
    containerClassName = `${styles.container} ${styles.containerPlain}`;
  } else if (variant === "header-only") {
    containerClassName = `${styles.container} ${styles.containerHeaderOnly}`;
  } else if (variant === "header-nav") {
    containerClassName = `${styles.container} ${styles.containerHeaderNav}`;
  }

  if (className) {
    containerClassName = `${containerClassName} ${className}`;
  }

  return (
    <main className={containerClassName}>
      {children}
    </main>
  );
}