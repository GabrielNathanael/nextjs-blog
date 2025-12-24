import SignUpForm from "@/components/SignUpForm";
import AuthProvider from "@/components/AuthProvider";

export default function SignUpPage() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-600 mt-2">Sign up to get started</p>
          </div>
          <SignUpForm />
        </div>
      </div>
    </AuthProvider>
  );
}
