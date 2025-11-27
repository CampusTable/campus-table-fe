'use client';

import { ChangeEvent, FormEvent, useState } from "react";
import UsernameInput from "@/features/auth/components/input/UsernameInput";
import PasswordInput from "@/features/auth/components/input/PasswordInput";
import styles from "./LoginForm.module.css";
import LoginButton from "@/features/auth/components/button/LoginButton";
import { isDisabled, isValidSubmit } from "@/features/auth/utils/form/loginFormUtils";
import LoginFormErrorLabel from "@/features/auth/components/label/LoginFormErrorLabel";
import { login, LoginRequest } from "@/features/auth/api/loginApi";
import { useRouter, useSearchParams } from "next/navigation";
import { CustomError } from "@/shared/lib/errors/customError";
import { ErrorCode } from "@/shared/lib/errors/errorCodes";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValidSubmit(username, password)) {
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

      const fallbackUrl: string = "/";

      const callbackUrlParam: string | null = searchParams.get("callbackUrl");
      const nextUrl: string = callbackUrlParam && callbackUrlParam.length > 0
        ? callbackUrlParam
        : fallbackUrl;
      router.replace(nextUrl);
    } catch (error) {
      if (error instanceof CustomError) {
        if (error.errorCode === ErrorCode.UNAUTHORIZED) {
          // 엑세스 토큰 재발급
        }
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
      <LoginFormErrorLabel visible={error} />
      <div className={styles.buttonContainer}>
        <LoginButton
          disabled={isDisabled(username, password, loading)}
          loading={loading}
        />
      </div>
    </form>
  );
};