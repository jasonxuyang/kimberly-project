import { SignInProps } from "@/utils/client";
import useAuth from "@/utils/hooks/useAuth";
import { ApiError } from "@/utils/types";
import Link from "next/link";
import { useRouter } from "next/router";
import { BaseSyntheticEvent, useState } from "react";

export default function SignIn() {
  const router = useRouter();
  const backUrl = router.query?.backUrl as string;
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
      console.log(backUrl);
      router.push(backUrl ? backUrl : "/");
    } else {
      setError(ApiError.InvalidCredentials);
    }
  };

  return (
    <main className="flex flex-col w-full items-center mt-16">
      <form onSubmit={onSubmit} className="flex flex-col w-[90%] sm:w-96 gap-4">
        <h2 className="font-semibold text-2xl">Sign In</h2>
        <label htmlFor="email" className="flex flex-col w-full">
          <p className="font-semibold">Email:</p>
          <input
            type="text"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-black outline outline-1 outline-black p-2 rounded-sm focus:outline-blue-500 focus:outline-2"
            required
          />
        </label>
        <label htmlFor="lastName" className="flex flex-col">
          <p className="font-semibold">Password:</p>
          <input
            type="text"
            name="lastName"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-black outline outline-1 outline-black p-2 rounded-sm focus:outline-blue-500 focus:outline-2"
            required
          />
        </label>
        {error && <p className="text-red-500">Error: {error}</p>}
        <button
          type="submit"
          className="bg-blue-500 font-semibold text-white py-2 rounded-sm hover:bg-blue-600"
        >
          Sign in
        </button>
        <div className="w-full text-center">
          Don&apos;t have an acccount?{" "}
          <Link className="underline hover:text-blue-500" href="/signup">
            Sign Up
          </Link>
        </div>
      </form>
    </main>
  );
}
