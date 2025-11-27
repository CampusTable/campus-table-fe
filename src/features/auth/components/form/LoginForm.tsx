'use client';

import { ChangeEvent, FormEvent, useState } from "react";
import UsernameInput from "@/features/auth/components/input/UsernameInput";
import PasswordInput from "@/features/auth/components/input/PasswordInput";
import styles from "./LoginForm.module.css";
import LoginButton from "@/features/auth/components/button/LoginButton";
import { isDisabled, isValidSubmit } from "@/features/auth/utils/form/loginFormUtils";
import LoginFormErrorLabel from "@/features/auth/components/label/LoginFormErrorLabel";
import { login, LoginRequest } from "@/features/auth/api/loginApi";
import { useRouter } from "next/navigation";
import { CustomError } from "@/shared/lib/errors/customError";
import { ERROR_MESSAGE } from "@/shared/lib/errors/errorCodes";

export default function LoginForm() {
  const router = useRouter();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValidSubmit(username, password)) {
      setErrorMessage(ERROR_MESSAGE.AUTH_FAILED);
      setError(true);
      return;
    }

    setError(false);
    setLoading(true);
    try {
      const request: LoginRequest = {
        sejongPortalId: username,
        sejongPortalPw: password
      };
      await login(request);

      router.replace("/");
    } catch (error) {
      if (error instanceof CustomError) {
        setErrorMessage(error.errorMessage);
      }
      setError(true);
    } finally {
      setLoading(false);
    }
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
      <LoginFormErrorLabel
        visible={error}
        message={errorMessage}
      />
      <div className={styles.buttonContainer}>
        <LoginButton
          disabled={isDisabled(username, password, loading)}
          loading={loading}
        />
      </div>
    </form>
  );
};