"use client";

import { trpc } from "@/utils/trpc";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useUser } from "../context/UserContext";

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const initialValues: RegisterFormValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const validationSchema = Yup.object({
  name: Yup.string().min(2).max(32).required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6).required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

const RegisterPage = () => {
  const { login } = useUser();
  const router = useRouter();

  const registerMutation = trpc.auth.register.useMutation();
  const loginMutation = trpc.auth.login.useMutation();

  const handleSubmit = async (values: RegisterFormValues) => {
    try {
      await registerMutation.mutateAsync({
        email: values.email,
        password: values.password,
        name: values.name,
      });

      const user = await loginMutation.mutateAsync({
        email: values.email,
        password: values.password,
      });

      login(user);
      router.push("/game-menu");
    } catch (err: any) {
      alert(err.message || "Something went wrong");
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="bg-white/10 p-8 rounded-xl shadow-lg backdrop-blur-md border border-white/20 max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Create Account</h1>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="space-y-4">
            <div>
              <Field
                name="name"
                placeholder="Name"
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-400 text-sm mt-1"
              />
            </div>

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

            <div>
              <Field
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white"
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="text-red-400 text-sm mt-1"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-md"
            >
              Register
            </button>

            <p className="text-sm text-white/60 mt-4 text-center">
              Already have an account?{" "}
              <a href="/login" className="underline hover:text-white">
                Log in
              </a>
            </p>
          </Form>
        </Formik>
      </div>
    </main>
  );
};

export default RegisterPage;
