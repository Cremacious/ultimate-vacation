export default function LegalPage() {
  return (
    <div className="px-6 py-20 max-w-2xl mx-auto">
      <h1
        className="text-4xl font-semibold text-[#1A1A1A] mb-8"
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        Legal
      </h1>
      <div className="prose prose-sm text-gray-500 space-y-8">
        <section>
          <h2 className="text-lg font-bold text-[#1A1A1A] mb-2">Terms of Service</h2>
          <p className="font-medium leading-relaxed">Coming soon.</p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-[#1A1A1A] mb-2">Privacy Policy</h2>
          <p className="font-medium leading-relaxed">Coming soon.</p>
        </section>
      </div>
    </div>
  );
}
