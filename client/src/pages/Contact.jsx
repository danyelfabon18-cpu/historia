import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowUpRight,
  Code2,
  Mail,
  MapPin,
  MessageSquare,
  Send,
} from "lucide-react";

const initialForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

function Contact() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialForm);

  const [status, setStatus] = useState({
    type: "",
    message: "",
  });

  const [isSending, setIsSending] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (status.message) {
      setStatus({
        type: "",
        message: "",
      });
    }
  };

  /* =======================================================
     START CONVERSATION
  ======================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSending(true);

    setStatus({
      type: "",
      message: "",
    });

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const response = await fetch(`${apiUrl}/api/conversations`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to start conversation.");
      }

      const conversationId = data.conversation.id;

      /*
        Store private access token only in this browser.
      */

      localStorage.setItem(
        `historia_conversation_${conversationId}_token`,
        data.visitorToken,
      );

      localStorage.setItem("historia_latest_conversation", conversationId);

      setFormData(initialForm);

      navigate(`/conversation/${conversationId}`);
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* BACKGROUND */}

      <div className="home-grid pointer-events-none absolute inset-0" />
      <div className="home-moving-light pointer-events-none absolute inset-0" />

      <div className="pointer-events-none absolute right-[5%] top-[14%] h-[520px] w-[520px] rounded-full bg-orange-500/[0.03] blur-[160px]" />

      <div className="pointer-events-none absolute bottom-[8%] left-[4%] h-[420px] w-[420px] rounded-full bg-white/[0.015] blur-[150px]" />

      <Code2
        size={34}
        className="tech-float tech-float-one pointer-events-none absolute left-[5%] top-[16%] hidden text-orange-400/15 lg:block"
      />

      <Mail
        size={30}
        className="tech-float tech-float-two pointer-events-none absolute right-[7%] top-[19%] hidden text-orange-400/15 lg:block"
      />

      <MessageSquare
        size={28}
        className="tech-float tech-float-three pointer-events-none absolute bottom-[15%] right-[11%] hidden text-white/[0.05] lg:block"
      />

      {/* MAIN */}

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-16 lg:px-10 lg:pb-14 lg:pt-12">
        {/* PAGE INDICATOR */}

        <div className="mb-5 flex items-center gap-4">
          <span className="font-mono text-[10px] tracking-[0.3em] text-orange-400">
            05
          </span>

          <div className="h-px w-12 bg-orange-400/50" />

          <span className="text-xs uppercase tracking-[0.35em] text-zinc-500">
            Contact
          </span>
        </div>

        {/* INTRO */}

        <div className="grid items-end gap-8 border-b border-white/10 pb-8 lg:grid-cols-[1fr_0.72fr]">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.35em] text-orange-500">
              Let's Connect
            </p>

            <h1 className="max-w-3xl text-4xl font-medium leading-[1] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
              Have a project,
              <span className="block text-zinc-500">opportunity or idea?</span>
            </h1>
          </div>

          <div className="max-w-lg lg:justify-self-end">
            <p className="text-sm leading-7 text-zinc-500">
              Start a conversation directly through Historia. Once your first
              message is sent, you can continue the conversation here on the
              website.
            </p>
          </div>
        </div>

        {/* CONTACT */}

        <div className="mt-12 grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          {/* LEFT */}

          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-600">
              Get In Touch
            </p>

            <h2 className="mt-3 max-w-sm text-2xl font-medium tracking-[-0.025em] text-white sm:text-3xl">
              Let's start a
              <span className="text-orange-400"> conversation.</span>
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-zinc-500">
              Send your first message and Historia will create a private
              conversation where you can continue messaging me directly.
            </p>

            <div className="mt-9">
              <div className="flex items-center gap-4 border-b border-white/[0.07] py-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-400/15 bg-orange-400/[0.035] text-orange-400">
                  <MapPin size={16} />
                </div>

                <div>
                  <p className="text-[8px] uppercase tracking-[0.25em] text-zinc-700">
                    Location
                  </p>

                  <p className="mt-1.5 text-sm text-zinc-300">
                    Bulacan, Philippines
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 border-b border-white/[0.07] py-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-400/15 bg-orange-400/[0.035] text-orange-400">
                  <MessageSquare size={16} />
                </div>

                <div>
                  <p className="text-[8px] uppercase tracking-[0.25em] text-zinc-700">
                    Messaging
                  </p>

                  <p className="mt-1.5 text-sm text-zinc-300">
                    Direct Website Conversation
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 border-b border-white/[0.07] py-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-400/15 bg-orange-400/[0.035] text-orange-400">
                  <Mail size={16} />
                </div>

                <div>
                  <p className="text-[8px] uppercase tracking-[0.25em] text-zinc-700">
                    Open To
                  </p>

                  <p className="mt-1.5 text-sm text-zinc-300">
                    Opportunities & Projects
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 border-l border-orange-400/30 pl-4">
              <p className="text-[8px] uppercase tracking-[0.25em] text-orange-400">
                Private Conversation
              </p>

              <p className="mt-2 max-w-sm text-xs leading-6 text-zinc-600">
                A private conversation access token is stored on your browser
                after your first message.
              </p>
            </div>
          </div>

          {/* FORM */}

          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.012] p-6 sm:p-8">
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-orange-500/[0.035] blur-[80px]" />

            <span className="pointer-events-none absolute -bottom-8 -right-3 select-none text-[95px] font-semibold tracking-[-0.06em] text-white/[0.012]">
              HELLO
            </span>

            {/* HEADER */}

            <div className="relative z-10 mb-7 flex items-start justify-between gap-5 border-b border-white/[0.07] pb-6">
              <div>
                <p className="text-[8px] uppercase tracking-[0.28em] text-orange-400">
                  Start a Conversation
                </p>

                <h2 className="mt-2 text-xl font-medium text-white sm:text-2xl">
                  Tell me what's on your mind.
                </h2>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-400/15 bg-orange-400/[0.035] text-orange-400">
                <MessageSquare size={17} />
              </div>
            </div>

            {/* FORM */}

            <form onSubmit={handleSubmit} className="relative z-10">
              <div className="grid gap-6 sm:grid-cols-2">
                {/* NAME */}

                <div>
                  <label
                    htmlFor="name"
                    className="text-[8px] uppercase tracking-[0.25em] text-zinc-600"
                  >
                    Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    maxLength={100}
                    required
                    className="mt-2 w-full border-b border-white/10 bg-transparent py-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-700 focus:border-orange-400/60"
                  />
                </div>

                {/* EMAIL */}

                <div>
                  <label
                    htmlFor="email"
                    className="text-[8px] uppercase tracking-[0.25em] text-zinc-600"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    maxLength={150}
                    required
                    className="mt-2 w-full border-b border-white/10 bg-transparent py-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-700 focus:border-orange-400/60"
                  />
                </div>
              </div>

              {/* SUBJECT */}

              <div className="mt-7">
                <label
                  htmlFor="subject"
                  className="text-[8px] uppercase tracking-[0.25em] text-zinc-600"
                >
                  Subject
                </label>

                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What would you like to discuss?"
                  maxLength={150}
                  required
                  className="mt-2 w-full border-b border-white/10 bg-transparent py-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-700 focus:border-orange-400/60"
                />
              </div>

              {/* MESSAGE */}

              <div className="mt-7">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="message"
                    className="text-[8px] uppercase tracking-[0.25em] text-zinc-600"
                  >
                    First Message
                  </label>

                  <span className="font-mono text-[8px] text-zinc-700">
                    {formData.message.length} / 3000
                  </span>
                </div>

                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project, opportunity, or idea..."
                  maxLength={3000}
                  rows={6}
                  required
                  className="mt-3 w-full resize-none rounded-xl border border-white/[0.08] bg-black/20 p-4 text-sm leading-7 text-white outline-none transition-all placeholder:text-zinc-700 focus:border-orange-400/40"
                />
              </div>

              {/* ERROR */}

              {status.message && (
                <div className="mt-5 rounded-xl border border-red-400/20 bg-red-400/[0.04] px-4 py-3 text-xs text-red-300">
                  {status.message}
                </div>
              )}

              {/* SUBMIT */}

              <div className="mt-7 flex flex-wrap items-center justify-between gap-5">
                <p className="max-w-xs text-[9px] leading-5 text-zinc-700">
                  After sending, you'll be taken to your private Historia
                  conversation.
                </p>

                <button
                  type="submit"
                  disabled={isSending}
                  className="group flex items-center gap-3 rounded-full border border-orange-400/25 bg-orange-400/[0.06] px-5 py-3 text-xs font-medium text-orange-300 transition-all hover:border-orange-400/50 hover:bg-orange-400/[0.1] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send size={14} />

                  {isSending ? "Starting..." : "Start Conversation"}

                  {!isSending && (
                    <ArrowUpRight size={13} className="text-orange-400" />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* BOTTOM */}

        <div className="mt-12 flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

          <span className="font-mono text-[8px] tracking-[0.22em] text-zinc-700">
            {"< CONTACT />"}
          </span>

          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        </div>
      </div>
    </section>
  );
}

export default Contact;
