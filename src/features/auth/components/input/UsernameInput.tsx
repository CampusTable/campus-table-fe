'use client';

import { ChangeEvent } from "react";
import styles from "./username-input.module.css";

interface UsernameInputProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export default function UsernameInput({
  value,
  onChange,
  disabled = false,
}: UsernameInputProps) {
  return (
    <div className={styles.container}>
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