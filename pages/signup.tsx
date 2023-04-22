import { SignUpProps, signUp } from "@/utils/client";
import useAuth from "@/utils/hooks/useAuth";
import { ApiError, ApiResponse } from "@/utils/types";
import { Role, User } from "@prisma/client";
import { BaseSyntheticEvent, useState } from "react";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>(Role.STUDENT);
  const [error, setError] = useState<ApiError | null>(null);
  const { signIn } = useAuth();

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
    } else {
      setError(response.data.type);
      console.error(error);
    }
  };

  return (
    <main>
      {error && <div>Error: {error}</div>}
      <form onSubmit={onSubmit}>
        <label htmlFor="firstName">
          First name:{" "}
          <input
            type="text"
            name="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="text-black"
            required
          />
        </label>

        <label htmlFor="lastName">
          Last Name:{" "}
          <input
            type="text"
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="text-black"
            required
          />
        </label>

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
        <label htmlFor="email">
          Password:{" "}
          <input
            type="text"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-black"
            required
          />
        </label>
        <div>
          Radio buttons:
          <label>
            <input
              type="radio"
              checked={role === Role.STUDENT}
              onClick={() => {
                setRole(Role.STUDENT);
              }}
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
            />{" "}
            Professor
          </label>
        </div>
        <button type="submit">Sign up</button>
      </form>
    </main>
  );
}
