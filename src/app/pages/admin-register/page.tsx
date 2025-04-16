import { RegisterForm } from "@/app/components/RegisterForm"
import Head from "next/head";

export default function AdminRegisterPage() {
  return (
    <>
      <Head>
        <title>Admin Registration</title>
      </Head>
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-8">
        <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Create Admin Account</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Fill in the form to register a new admin.
            </p>
          </div>

          <RegisterForm />
        </div>
      </div>
    </>
  );
}
