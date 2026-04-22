const EFFECTIVE_DATE = "April 22, 2026";
const CONTACT_EMAIL = "hello@tripwave.app";

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20">
      <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-6" style={{ fontFamily: "var(--font-fredoka)" }}>
        {title}
      </h2>
      <div className="space-y-5 text-sm text-gray-600 font-medium leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-bold text-[#1A1A1A] mt-6 mb-1">{children}</h3>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p>{children}</p>;
}

export default function LegalPage() {
  return (
    <div className="px-6 py-20 max-w-2xl mx-auto">
      <h1
        className="text-4xl font-semibold text-[#1A1A1A] mb-2"
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        Legal
      </h1>
      <p className="text-sm text-gray-400 font-medium mb-12">Effective {EFFECTIVE_DATE}</p>

      {/* Nav */}
      <div className="flex gap-6 mb-14 border-b border-gray-100 pb-6">
        <a href="#terms" className="text-sm font-bold text-[#00A8CC] hover:underline">Terms of Service</a>
        <a href="#privacy" className="text-sm font-bold text-[#00A8CC] hover:underline">Privacy Policy</a>
      </div>

      <div className="space-y-16">

        {/* ── TERMS OF SERVICE ── */}
        <Section id="terms" title="Terms of Service">
          <P>
            These Terms of Service govern your use of TripWave, a trip-planning web application. By
            creating an account or using the service, you agree to these terms. If you do not agree,
            do not use TripWave.
          </P>

          <H3>Who can use TripWave</H3>
          <P>
            You must be at least 13 years old to use TripWave. By using the service you confirm you
            meet this requirement. If you are under 18, a parent or guardian must review these terms
            on your behalf.
          </P>

          <H3>Your account</H3>
          <P>
            You are responsible for keeping your login credentials secure and for all activity under
            your account. Use a strong, unique password. If you suspect unauthorized access, change
            your password and contact us immediately.
          </P>

          <H3>Supporter payment</H3>
          <P>
            TripWave offers an optional one-time Supporter payment of $4.99 USD, processed securely
            through Stripe. This is not a subscription — you are charged once only. The payment grants
            a supporter badge, ad-free status, and early access to certain features as they ship.
            Because the payment immediately entitles you to supporter status, we do not offer refunds
            except where required by applicable law. If you have a billing issue, email us.
          </P>

          <H3>Your data and trip content</H3>
          <P>
            You own the content you add to TripWave — trip details, expenses, itinerary events, packing
            lists, and notes. You grant TripWave a limited license to store and display that content
            solely to provide the service to you and your trip members. We do not claim ownership of
            your data and do not use it for advertising.
          </P>

          <H3>Collaborative trips</H3>
          <P>
            When you add other people to a trip, they can view all trip content for that trip,
            including itinerary events and shared expenses. Trip members you invite will be able to
            see the name and email address associated with your account. Only invite people you trust.
          </P>

          <H3>Acceptable use</H3>
          <P>
            Do not use TripWave to violate any law, infringe on others&apos; rights, or interfere with
            the service. Do not attempt to access accounts or data that are not yours. We reserve the
            right to suspend or terminate accounts that violate these terms.
          </P>

          <H3>Service availability</H3>
          <P>
            TripWave is provided as-is. We do not guarantee any specific uptime or that the service
            will be error-free. We may modify, suspend, or discontinue features at any time. We will
            make reasonable efforts to notify users of significant changes.
          </P>

          <H3>Limitation of liability</H3>
          <P>
            To the maximum extent permitted by law, TripWave and its developer are not liable for any
            indirect, incidental, or consequential damages arising from your use of the service. Our
            total liability for any claim is limited to the amount you paid us in the twelve months
            prior to the claim (or $4.99 if you have not made any payment).
          </P>

          <H3>Changes to these terms</H3>
          <P>
            We may update these terms over time. When we do, we will update the effective date above.
            Continued use of TripWave after an update means you accept the revised terms.
          </P>

          <H3>Contact</H3>
          <P>
            Questions about these terms? Email us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#00A8CC] hover:underline font-semibold">
              {CONTACT_EMAIL}
            </a>.
          </P>
        </Section>

        <hr className="border-gray-100" />

        {/* ── PRIVACY POLICY ── */}
        <Section id="privacy" title="Privacy Policy">
          <P>
            This Privacy Policy describes what information TripWave collects, why we collect it, and
            how we use it. We collect only what is necessary to provide the service.
          </P>

          <H3>What we collect</H3>
          <P>
            <span className="font-semibold text-[#1A1A1A]">Account information:</span> your email
            address and, optionally, your name. We use your email only for authentication and
            password reset — never for marketing.
          </P>
          <P>
            <span className="font-semibold text-[#1A1A1A]">Trip and planning data:</span> trips,
            itinerary events, expenses, expense splits, settlements, packing lists, polls, proposals,
            and notes you enter into the app. This data is stored to provide the service.
          </P>
          <P>
            <span className="font-semibold text-[#1A1A1A]">Receipt images:</span> if you attach a
            receipt to an expense, the image is stored in Vercel Blob storage linked to your account.
          </P>
          <P>
            <span className="font-semibold text-[#1A1A1A]">Session data:</span> an encrypted session
            cookie is used to keep you logged in. Session records are stored in our database and
            deleted when you sign out or delete your account.
          </P>
          <P>
            <span className="font-semibold text-[#1A1A1A]">Usage analytics:</span> we record
            anonymized product events (e.g., signup completed, feature used) via PostHog to
            understand how the app is used. These events do not include personal travel content.
          </P>

          <H3>What we do not collect</H3>
          <P>
            We do not collect phone numbers, payment card numbers, government IDs, or passport
            details. Payment is handled entirely by Stripe — TripWave never sees or stores your card
            information.
          </P>

          <H3>Third-party services</H3>
          <P>
            TripWave relies on the following third parties to operate:
          </P>
          <ul className="list-disc pl-5 space-y-1.5 mt-2">
            <li>
              <span className="font-semibold text-[#1A1A1A]">Stripe</span> — payment processing for
              the one-time Supporter purchase. Stripe&apos;s privacy policy governs data you provide
              during checkout.
            </li>
            <li>
              <span className="font-semibold text-[#1A1A1A]">Resend</span> — transactional email
              delivery for password reset messages.
            </li>
            <li>
              <span className="font-semibold text-[#1A1A1A]">PostHog</span> — product analytics.
              Events are server-side and do not include personal travel content.
            </li>
            <li>
              <span className="font-semibold text-[#1A1A1A]">Neon</span> — managed PostgreSQL
              database hosting.
            </li>
            <li>
              <span className="font-semibold text-[#1A1A1A]">Vercel</span> — application hosting and
              blob storage for receipt images.
            </li>
          </ul>
          <P>
            We do not sell your data to any third party and do not share it beyond what is required
            to operate these services.
          </P>

          <H3>Cookies</H3>
          <P>
            TripWave uses a single session cookie to authenticate you. No third-party tracking
            cookies are set. We do not run any ad-targeting scripts.
          </P>

          <H3>Advertising</H3>
          <P>
            TripWave currently shows no ads. In the future, a free-tier ad experience may be
            introduced. Supporters who pay before ads launch are permanently exempt. We will update
            this policy before any ad network is added.
          </P>

          <H3>Data deletion</H3>
          <P>
            You can delete your account at any time from Account → Delete account. Deleting your
            account permanently removes your profile, sessions, and personal data. Anonymized expense
            contribution records may be retained in shared trip ledgers so that other members&apos;
            balances remain accurate, but your name and email will no longer be visible.
          </P>

          <H3>Data retention</H3>
          <P>
            We retain your data for as long as your account is active. When you delete your account,
            your personal data is deleted immediately. Backups may retain data for up to 30 days
            before it is permanently purged from all systems.
          </P>

          <H3>Children&apos;s privacy</H3>
          <P>
            TripWave is not directed at children under 13. We do not knowingly collect personal data
            from children under 13. If you believe a child under 13 has provided us data, contact us
            and we will delete it promptly.
          </P>

          <H3>Changes to this policy</H3>
          <P>
            We may update this Privacy Policy over time. When we do, we will update the effective
            date at the top of this page. We will not materially reduce your privacy protections
            without providing notice.
          </P>

          <H3>Contact</H3>
          <P>
            Privacy questions or data requests? Email us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#00A8CC] hover:underline font-semibold">
              {CONTACT_EMAIL}
            </a>.
          </P>
        </Section>

      </div>
    </div>
  );
}
