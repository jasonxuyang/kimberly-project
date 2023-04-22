import { Role } from "@prisma/client";
import { HTTP_METHODS } from "next/dist/server/web/http";
import { ApiResponse } from "./types";

export const apiPut = async (route: string, body: any) => {
  const response = await fetch(route, {
    method: HTTP_METHODS[4],
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return await response.json();
};

export const apiPost = async (route: string, body: any) => {
  const response = await fetch(route, {
    method: HTTP_METHODS[3],
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return await response.json();
};

export const apiDelete = async (route: string, body: any) => {
  const response = await fetch(route, {
    method: HTTP_METHODS[5],
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return await response.json();
};

export type SignUpProps = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: Role;
};
export const signUp = async (data: SignUpProps) => {
  return await apiPut("/api/user", data);
};

export type SignInProps = {
  email: string;
  password: string;
};

export const signIn = async (data: SignInProps) => {
  return await apiPost("/api/auth/signin", data);
};
