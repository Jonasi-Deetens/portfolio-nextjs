"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { trpc } from "@/utils/trpc";
import { useUser } from "../context/UserContext";

interface LoginFormValues {
  email: string;
  password: string;
}

const initialValues: LoginFormValues = {
  email: "",
  password: "",
};

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const LoginPage = () => {
  const { login } = useUser();
  const router = useRouter();
  const loginMutation = trpc.auth.login.useMutation();
  const [error, setError] = useState("");

  const handleSubmit = async (values: LoginFormValues) => {
    setError("");
    try {
      const user = await loginMutation.mutateAsync(values);
      login({ ...user, name: user?.name || "" });
      router.push("/game-menu");
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="bg-white/10 p-8 rounded-xl shadow-lg backdrop-blur-md border border-white/20 max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Log In</h1>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="space-y-4">
            <div>
              <Field
                name="email"
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-400 text-sm mt-1"
              />
            </div>

            <div>
              <Field
                name="password"
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-400 text-sm mt-1"
              />
            </div>

            {error && <div className="text-red-400 text-sm">{error}</div>}

            <button
              type="submit"
              className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-md"
            >
              Continue
            </button>

            <p className="text-sm text-white/60 mt-4 text-center">
              Don’t have an account?{" "}
              <a href="/register" className="underline hover:text-white">
                Register
              </a>
            </p>
          </Form>
        </Formik>
      </div>
    </main>
  );
};

export default LoginPage;
