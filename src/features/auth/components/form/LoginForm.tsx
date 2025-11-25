'use client';

import { ChangeEvent, FormEvent, useState } from "react";
import UsernameInput from "@/features/auth/components/input/UsernameInput";
import PasswordInput from "@/features/auth/components/input/PasswordInput";
import styles from "./LoginForm.module.css";
import LoginButton from "@/features/auth/components/button/LoginButton";
import { isDisabled, isValidSubmit } from "@/features/auth/utils/form/loginFormUtils";
import LoginFormErrorLabel from "@/features/auth/components/label/LoginFormErrorLabel";

export default function LoginForm() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChangeUsername = (event: ChangeEvent<HTMLInputElement>): void => {
    const value: string = event.target.value;
    setUsername(value);

    if (error && value.trim() !== "") {
      setError(false);
    }
  };
  const handleChangePassword = (event: ChangeEvent<HTMLInputElement>): void => {
    const value: string = event.target.value;
    setPassword(value);

    if (error && value.trim() !== "") {
      setError(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (!isValidSubmit(username, password)) {
      setError(true);
      return;
    }

    setError(false);
    // TODO: 로그인 API 연결
    // 임시로 버튼 클릭시 3초동안 로딩 상태
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };

  return (
    <form
      className={styles.loginForm}
      onSubmit={handleSubmit}
    >
      <div className={styles.formContainer}>
        <div className={styles.inputContainer}>
          <UsernameInput
            value={username}
            onChange={handleChangeUsername}
            disabled={loading}
            hasError={error}
          />
          <PasswordInput
            value={password}
            onChange={handleChangePassword}
            disabled={loading}
            hasError={error}
          />
        </div>
      </div>
      <LoginFormErrorLabel visible={error}/>
      <div className={styles.buttonContainer}>
        <LoginButton
          disabled={isDisabled(username, password, loading)}
          loading={loading}
        />
      </div>
    </form>
  );
};