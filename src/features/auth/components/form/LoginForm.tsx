'use client';

import { ChangeEvent, useState } from "react";
import UsernameInput from "@/features/auth/components/input/UsernameInput";
import PasswordInput from "@/features/auth/components/input/PasswordInput";

export default function LoginForm() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleChangeUsername = (event: ChangeEvent<HTMLInputElement>): void => {
    setUsername(event.target.value);
  }
  const handleChangePassword = (event: ChangeEvent<HTMLInputElement>): void => {
    setPassword(event.target.value);
  }

  return (
    <form className="flex flex-col">
      <UsernameInput
        value={username}
        onChange={handleChangeUsername}
      />
      <PasswordInput
        value={password}
        onChange={handleChangePassword}
      />
    </form>
  );
};