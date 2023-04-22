import { SignInProps } from "@/utils/client";
import useAuth from "@/utils/hooks/useAuth";
import { ApiError } from "@/utils/types";
import Link from "next/link";
import { useRouter } from "next/router";
import { BaseSyntheticEvent, useState } from "react";

export default function SignIn() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<ApiError | null>(null);

  const onSubmit = async (e: BaseSyntheticEvent) => {
    // Prevent the browser from reloading the page
    e.preventDefault();
    const signInData: SignInProps = {
      email: email,
      password: password,
    };
    if (await signIn(signInData)) {
      console.log("Sign in successful");
      router.push("/");
    } else {
      setError(ApiError.InvalidCredentials);
    }
  };

  return (
    <main>
      {error && <div>Error: {error}</div>}
      <form onSubmit={onSubmit}>
        <label htmlFor="email">
          Email:{" "}
          <input
            type="text"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-black"
            required
          />
        </label>
        <label htmlFor="lastName">
          Password:{" "}
          <input
            type="text"
            name="lastName"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-black"
            required
          />
        </label>
        <button type="submit">Sign in</button>
      </form>
      <div>Don&apos;t have an acccount?</div>
      <button>
        <Link href="/signup">Sign Up</Link>
      </button>
    </main>
  );
}
