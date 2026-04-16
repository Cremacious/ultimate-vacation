import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
      <h1
        className="text-3xl font-semibold text-[#1A1A1A] mb-1"
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        Welcome back.
      </h1>
      <p className="text-gray-400 text-sm mb-8">
        Your trip is waiting.
      </p>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-[#1A1A1A] mb-1.5">Email</label>
          <input
            type="email"
            placeholder="you@email.com"
            className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 bg-[#F8F8FA] text-[#1A1A1A] placeholder:text-gray-300 focus:outline-none focus:border-[#00A8CC] transition-colors text-sm font-medium"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-bold text-[#1A1A1A]">Password</label>
            <Link href="/forgot-password" className="text-xs font-semibold text-gray-400 hover:text-[#00A8CC] transition-colors">
              Forgot?
            </Link>
          </div>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 bg-[#F8F8FA] text-[#1A1A1A] placeholder:text-gray-300 focus:outline-none focus:border-[#00A8CC] transition-colors text-sm font-medium"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#00A8CC] text-white font-bold py-3.5 rounded-full hover:bg-[#0096b8] transition-colors"
          style={{ boxShadow: "0 3px 0 #007a99" }}
        >
          Log in
        </button>
      </form>

      <p className="text-center text-sm text-gray-400 mt-6">
        Don't have an account?{" "}
        <Link href="/signup" className="font-bold text-[#1A1A1A] hover:text-[#00A8CC] transition-colors">
          Sign up free
        </Link>
      </p>
    </div>
  );
}
