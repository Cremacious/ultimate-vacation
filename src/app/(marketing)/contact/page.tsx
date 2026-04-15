export default function ContactPage() {
  return (
    <div className="px-6 py-20 max-w-2xl mx-auto">
      <h1
        className="text-4xl font-semibold text-[#1A1A1A] mb-4"
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        Say hello.
      </h1>
      <p className="text-gray-400 font-medium mb-10">
        Questions, feedback, or just want to chat about your next trip? We are here.
      </p>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-[#1A1A1A] mb-1.5">Name</label>
          <input
            type="text"
            placeholder="Your name"
            className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 bg-[#F8F8FA] text-[#1A1A1A] placeholder:text-gray-300 focus:outline-none focus:border-[#00A8CC] transition-colors text-sm font-medium"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#1A1A1A] mb-1.5">Email</label>
          <input
            type="email"
            placeholder="you@email.com"
            className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 bg-[#F8F8FA] text-[#1A1A1A] placeholder:text-gray-300 focus:outline-none focus:border-[#00A8CC] transition-colors text-sm font-medium"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#1A1A1A] mb-1.5">Message</label>
          <textarea
            rows={5}
            placeholder="What's on your mind?"
            className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 bg-[#F8F8FA] text-[#1A1A1A] placeholder:text-gray-300 focus:outline-none focus:border-[#00A8CC] transition-colors text-sm font-medium resize-none"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#00A8CC] text-white font-bold py-3.5 rounded-full hover:bg-[#0096b8] transition-colors"
          style={{ boxShadow: "0 3px 0 #007a99" }}
        >
          Send message
        </button>
      </form>
    </div>
  );
}
