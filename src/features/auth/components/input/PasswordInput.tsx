'use client';

import { ChangeEvent, useState } from "react";
import styles from "./password-input.module.css";
import PasswordVisibleIcon from "@/features/auth/components/icon/PasswordVisibleIcon";

interface PasswordInputProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  hasError?: boolean;
}

export default function PasswordInput({
  value,
  onChange,
  disabled = false,
  hasError = false,
}: PasswordInputProps) {

  const [isVisible, setIsVisible] = useState<boolean>(false);

  const inputType: "password" | "text" = isVisible ? "text" : "password";

  const containerClassName: string = hasError
    ? `${styles.container} ${styles.containerError}`
    : styles.container;

  const handleToggleVisibility = (): void => {
    if (disabled) {
      return;
    }
    setIsVisible((prev: boolean) => !prev);
  }

  return (
    <div className={containerClassName}>
      <div className={styles.inputWrapper}>
        <input
          id="password"
          name="password"
          type={inputType}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder="비밀번호"
          autoComplete="off"
          className={styles.input}
          maxLength={20}
        />
        <PasswordVisibleIcon
          onClick={handleToggleVisibility}
          isVisible={isVisible}
          disabled={disabled}
        />
      </div>
      <div className={styles.underlineWrapper}>
        <div className={styles.underline} />
      </div>
    </div>
  );
}