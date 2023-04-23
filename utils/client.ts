import { Course, Role } from "@prisma/client";
import { HTTP_METHODS } from "next/dist/server/web/http";

export const fetcher = (url: string) =>
  fetch(url).then((response) => response.json());

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

export const fetchAccounts = async (userId: string) => {
  return await apiPost("/api/account", userId);
};

export type CreateCourseProps = {
  accountId: string;
  courseName: string;
};
export const createCourse = async (data: CreateCourseProps) => {
  return await apiPut("/api/course", data);
};

export type JoinAndLeaveCourseProps = {
  accountId: string;
  courseId: string;
  role: Role;
};
export const joinCourse = async (data: JoinAndLeaveCourseProps) => {
  return await apiPost("/api/course/join", data);
};

export const leaveCourse = async (data: JoinAndLeaveCourseProps) => {
  return await apiPost("/api/course/leave", data);
};

export type UserAndRole = {
  id: string;
  role: Role;
};

export type CreatePostProps = {
  content: string;
  title?: string;
  courseId?: string;
  parentId?: string;
  userAndRole?: UserAndRole;
};
export const createPost = async (data: CreatePostProps) => {
  return await apiPut("/api/posts", data);
};
