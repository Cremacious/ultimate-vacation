const CONTACT_EMAIL = "hello@tripwave.app";
const MAILTO = `mailto:${CONTACT_EMAIL}?subject=TripWave%20question`;

export default function ContactPage() {
  return (
    <div className="px-6 py-20 max-w-2xl mx-auto">
      <h1
        className="text-4xl font-semibold text-[#1A1A1A] mb-4"
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        Say hello.
      </h1>
      <p className="text-gray-400 font-medium mb-10 leading-relaxed">
        Questions, feedback, a bug to report, or something about your account — email us directly.
        We read every message.
      </p>

      <div className="bg-white rounded-3xl border border-gray-100 p-8">
        <p className="text-xs font-bold text-[#00A8CC] uppercase tracking-widest mb-3">
          Contact
        </p>
        <a
          href={MAILTO}
          className="text-xl font-semibold text-[#1A1A1A] hover:text-[#00A8CC] transition-colors break-all"
        >
          {CONTACT_EMAIL}
        </a>
        <p className="text-sm text-gray-400 font-medium mt-3 leading-relaxed">
          Click to open in your email client, or copy the address above.
          We aim to respond within one business day.
        </p>

        <div className="mt-8 pt-6 border-t border-gray-100 space-y-2">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            Common topics
          </p>
          {[
            ["Billing question", "billing question"],
            ["Bug report", "bug report"],
            ["Account or data request", "account or data request"],
            ["General feedback", "feedback"],
          ].map(([label, subject]) => (
            <a
              key={subject}
              href={`mailto:${CONTACT_EMAIL}?subject=TripWave%20${encodeURIComponent(subject)}`}
              className="flex items-center justify-between px-4 py-3 rounded-2xl bg-[#F8F8FA] hover:bg-[#00A8CC]/8 transition-colors group"
            >
              <span className="text-sm font-semibold text-[#1A1A1A]">{label}</span>
              <span className="text-xs font-bold text-[#00A8CC] opacity-0 group-hover:opacity-100 transition-opacity">
                Open email →
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
