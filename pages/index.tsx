import { Role } from "@prisma/client";

export default function Home() {
  const username = "test";
  const role = Role.PROFESSOR;
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div
        onClick={() => {
          fetch("/api/user/hello", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
        }}
      >
        hello world
      </div>
    </main>
  );
}
