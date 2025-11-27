'use client';

import { ChangeEvent } from "react";
import styles from "./UsernameInput.module.css";

interface UsernameInputProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  hasError?: boolean;
}

export default function UsernameInput({
  value,
  onChange,
  disabled = false,
  hasError = false,
}: UsernameInputProps) {

  const containerClassName: string = hasError
    ? `${styles.container} ${styles.containerError}`
    : styles.container;

  return (
    <div className={containerClassName}>
      <div className={styles.inputWrapper}>
        <input
          id="username"
          name="username"
          type="text"
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder="학번"
          autoComplete="off"
          inputMode="numeric"
          className={styles.input}
          maxLength={10}
        />
      </div>
      <div className={styles.underlineWrapper}>
        <div className={styles.underline} />
      </div>
    </div>
  );
};