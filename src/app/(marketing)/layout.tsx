import Link from "next/link";

function LogoBall() {
  return (
    <div className="relative w-6 h-6 flex-shrink-0">
      <span
        className="animate-ripple absolute inset-0 rounded-full"
        style={{ backgroundColor: "#00A8CC" }}
      />
      <span
        className="animate-ripple-2 absolute inset-0 rounded-full"
        style={{ backgroundColor: "#00A8CC" }}
      />
      <span
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: "#00A8CC" }}
      />
    </div>
  );
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-white/90 backdrop-blur border-b border-gray-100 flex items-center px-6 gap-6">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <LogoBall />
          <span
            className="text-2xl font-semibold text-[#00A8CC]"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            TripWave
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 flex-1">
          <Link href="/pricing" className="text-sm font-semibold text-gray-500 hover:text-[#1A1A1A] transition-colors">
            Pricing
          </Link>
          <Link href="/contact" className="text-sm font-semibold text-gray-500 hover:text-[#1A1A1A] transition-colors">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-2 ml-auto">
          <Link
            href="/login"
            className="text-sm font-bold text-[#1A1A1A] px-4 py-2 rounded-full hover:bg-gray-50 transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="text-sm font-bold text-white bg-[#00A8CC] px-4 py-2 rounded-full hover:bg-[#0096b8] transition-colors"
            style={{ boxShadow: "0 2px 0 #007a99" }}
          >
            Sign up free
          </Link>
        </div>
      </header>

      <main className="flex-1 pt-14">{children}</main>

      <footer className="bg-[#F8F8FA] border-t border-gray-100 px-6 py-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <LogoBall />
            <span
              className="text-xl font-semibold text-[#00A8CC]"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              TripWave
            </span>
          </div>
          <p className="text-xs text-gray-400 font-medium">
            Get everyone on the same wave.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/pricing" className="text-xs font-semibold text-gray-400 hover:text-[#1A1A1A] transition-colors">Pricing</Link>
            <Link href="/legal" className="text-xs font-semibold text-gray-400 hover:text-[#1A1A1A] transition-colors">Legal</Link>
            <Link href="/contact" className="text-xs font-semibold text-gray-400 hover:text-[#1A1A1A] transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
