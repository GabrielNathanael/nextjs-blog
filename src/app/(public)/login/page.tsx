import LoginForm from "@/components/LoginForm";
import AuthProvider from "@/components/AuthProvider";

export default function LoginPage() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </AuthProvider>
  );
}
