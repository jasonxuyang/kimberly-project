import { SignUpProps, signUp } from "@/utils/client";
import useAuth from "@/utils/hooks/useAuth";
import { ApiError, ApiResponse } from "@/utils/types";
import { Role, User } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { BaseSyntheticEvent, useState } from "react";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>(Role.STUDENT);
  const [error, setError] = useState<ApiError | null>(null);
  const { signIn } = useAuth();
  const router = useRouter();

  const onSubmit = async (e: BaseSyntheticEvent) => {
    // Prevent the browser from reloading the page
    e.preventDefault();
    const signUpData: SignUpProps = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      role: role,
    };
    const response: ApiResponse = await signUp(signUpData);
    if (response.success) {
      console.log("Sign up successful");
      const userData = response.data;
      signIn(userData);
      router.push("/");
    } else {
      setError(response.data.type);
      console.error(error);
    }
  };

  return (
    <main className="flex flex-col w-full items-center mt-16">
      <form
        onSubmit={onSubmit}
        className="flex flex-col w-[90%] gap-4 sm:w-96 "
      >
        <h2 className="font-semibold text-2xl">Sign Up</h2>
        <label htmlFor="firstName" className="flex flex-col w-full">
          <p className="font-semibold">First Name:</p>
          <input
            type="text"
            name="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="text-black outline outline-1 outline-black p-2 rounded-sm focus:outline-blue-500 focus:outline-2"
            required
          />
        </label>

        <label htmlFor="lastName" className="flex flex-col w-full">
          <p className="font-semibold">Last Name:</p>
          <input
            type="text"
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="text-black outline outline-1 outline-black p-2 rounded-sm focus:outline-blue-500 focus:outline-2"
            required
          />
        </label>

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
        <label htmlFor="password" className="flex flex-col w-full">
          <p className="font-semibold">Password:</p>
          <input
            type="text"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-black outline outline-1 outline-black p-2 rounded-sm focus:outline-blue-500 focus:outline-2"
            required
          />
        </label>

        <div className="flex flex-row items-baseline gap-4">
          <p className="font-semibold">Sign up as:</p>

          <div className="flex flex-row gap-2">
            <label>
              <input
                type="radio"
                checked={role === Role.STUDENT}
                onClick={() => {
                  setRole(Role.STUDENT);
                }}
                className="cursor-pointer"
              />{" "}
              Student
            </label>
            <label>
              <input
                type="radio"
                onClick={() => {
                  setRole(Role.TA);
                }}
                checked={role === Role.TA}
                className="cursor-pointer"
              />{" "}
              TA
            </label>
            <label>
              <input
                type="radio"
                onClick={() => {
                  setRole(Role.PROFESSOR);
                }}
                checked={role === Role.PROFESSOR}
                className="cursor-pointer"
              />{" "}
              Professor
            </label>
          </div>
        </div>
        {error && <div>Error: {error}</div>}
        <button
          type="submit"
          className="bg-blue-500 font-semibold text-white py-2 rounded-sm hover:bg-blue-600"
        >
          Sign up
        </button>
        <div className="w-full text-center">
          Already have an account?{" "}
          <Link className="underline hover:text-blue-500" href="/signin">
            Sign in
          </Link>
        </div>
      </form>
    </main>
  );
}
