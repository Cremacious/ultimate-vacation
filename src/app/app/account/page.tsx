import Link from "next/link";

export default function AccountPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1
        className="text-3xl font-semibold text-[#1A1A1A] mb-8"
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        Account
      </h1>

      <div className="space-y-4">
        {/* Profile section */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-[#00A8CC] flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
              C
            </div>
            <div>
              <p className="font-bold text-[#1A1A1A]">Chris</p>
              <p className="text-sm text-gray-400 font-medium">chris@example.com</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Name</label>
              <input
                type="text"
                defaultValue="Chris"
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 bg-[#F8F8FA] text-[#1A1A1A] focus:outline-none focus:border-[#00A8CC] transition-colors text-sm font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Email</label>
              <input
                type="email"
                defaultValue="chris@example.com"
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 bg-[#F8F8FA] text-[#1A1A1A] focus:outline-none focus:border-[#00A8CC] transition-colors text-sm font-medium"
              />
            </div>
            <button
              className="w-full bg-[#00A8CC] text-white font-bold py-3 rounded-full hover:bg-[#0096b8] transition-colors text-sm"
              style={{ boxShadow: "0 3px 0 #007a99" }}
            >
              Save changes
            </button>
          </div>
        </div>

        {/* Premium */}
        <Link href="/app/account/premium">
          <div className="bg-[#1A1A1A] rounded-3xl p-6 border border-[#1A1A1A] hover:opacity-90 transition-opacity">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Free plan</p>
                <p className="text-sm text-gray-400 font-medium mt-0.5">Upgrade for $5 one-time</p>
              </div>
              <div className="bg-[#00A8CC] text-white text-xs font-bold px-3 py-1.5 rounded-full">
                Upgrade
              </div>
            </div>
          </div>
        </Link>

        {/* Sign out */}
        <button className="w-full text-sm font-bold text-gray-400 hover:text-[#FF2D8B] transition-colors py-3">
          Sign out
        </button>
      </div>
    </div>
  );
}
