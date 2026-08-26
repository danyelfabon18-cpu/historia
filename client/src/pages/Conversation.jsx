import { useCallback, useEffect, useState } from "react";

import {
  ArrowLeft,
  CheckCheck,
  MessageCircle,
  RefreshCw,
  Send,
  UserRound,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

/* =========================================================
   CONFIG
========================================================= */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* =========================================================
   CONVERSATION
========================================================= */

function Conversation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [conversation, setConversation] = useState(null);

  const [message, setMessage] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [status, setStatus] = useState({
    type: "",
    message: "",
  });

  /* =======================================================
     GET VISITOR TOKEN
  ======================================================= */

  const getVisitorToken = useCallback(() => {
    return localStorage.getItem(`historia_conversation_${id}_token`);
  }, [id]);

  /* =======================================================
     LOAD CONVERSATION
  ======================================================= */

  const fetchConversation = useCallback(
    async (silent = false) => {
      const visitorToken = getVisitorToken();

      if (!visitorToken) {
        setStatus({
          type: "error",
          message: "This conversation is not available on this browser.",
        });

        setIsLoading(false);

        return;
      }

      if (!silent) {
        setIsRefreshing(true);
      }

      try {
        const response = await fetch(`${API_URL}/api/conversations/${id}`, {
          headers: {
            "x-conversation-token": visitorToken,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load conversation.");
        }

        setConversation(data.conversation);

        setStatus({
          type: "",
          message: "",
        });
      } catch (error) {
        setStatus({
          type: "error",
          message: error.message || "Unable to load conversation.",
        });
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [getVisitorToken, id],
  );

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchConversation(true);
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [fetchConversation]);

  /* =======================================================
     AUTO REFRESH
  ======================================================= */

  useEffect(() => {
    const interval = window.setInterval(() => {
      fetchConversation(true);
    }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, [fetchConversation]);

  /* =======================================================
     SEND VISITOR MESSAGE
  ======================================================= */

  const sendMessage = async (event) => {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || isSending) {
      return;
    }

    const visitorToken = getVisitorToken();

    if (!visitorToken) {
      setStatus({
        type: "error",
        message: "Conversation access is unavailable.",
      });

      return;
    }

    setIsSending(true);

    try {
      const response = await fetch(
        `${API_URL}/api/conversations/${id}/messages`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            "x-conversation-token": visitorToken,
          },

          body: JSON.stringify({
            message: trimmedMessage,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to send message.");
      }

      setConversation((current) => ({
        ...current,
        status: data.conversation.status,
        messages: data.conversation.messages,
      }));

      setMessage("");

      setStatus({
        type: "",
        message: "",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to send message.",
      });
    } finally {
      setIsSending(false);
    }
  };

  /* =======================================================
     DATE FORMAT
  ======================================================= */

  const formatTime = (date) => {
    if (!date) {
      return "";
    }

    return new Intl.DateTimeFormat("en-PH", {
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    return new Intl.DateTimeFormat("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (isLoading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <RefreshCw
            size={22}
            className="mx-auto animate-spin text-orange-400"
          />

          <p className="mt-4 text-xs text-zinc-600">Loading conversation...</p>
        </div>
      </section>
    );
  }

  /* =======================================================
     NO ACCESS
  ======================================================= */

  if (!conversation) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
        <div className="max-w-md text-center">
          <MessageCircle size={30} className="mx-auto text-zinc-700" />

          <h1 className="mt-5 text-2xl font-medium">
            Conversation unavailable.
          </h1>

          <p className="mt-3 text-sm leading-7 text-zinc-600">
            {status.message || "This conversation could not be loaded."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/contact")}
            className="mt-7 inline-flex items-center gap-2 rounded-xl border border-orange-400/20 px-5 py-3 text-xs text-orange-400"
          >
            <ArrowLeft size={14} />
            Start a New Conversation
          </button>
        </div>
      </section>
    );
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* BACKGROUND */}

      <div className="home-grid pointer-events-none absolute inset-0" />
      <div className="home-moving-light pointer-events-none absolute inset-0" />

      <div className="pointer-events-none absolute right-[8%] top-[15%] h-[420px] w-[420px] rounded-full bg-orange-500/[0.025] blur-[150px]" />

      {/* CONTENT */}

      <div className="relative z-10 mx-auto max-w-4xl px-4 pb-16 pt-12 sm:px-6 lg:px-8">
        {/* BACK */}

        <button
          type="button"
          onClick={() => navigate("/contact")}
          className="mb-6 flex items-center gap-2 text-[10px] text-zinc-600 transition-colors hover:text-orange-400"
        >
          <ArrowLeft size={13} />
          Contact
        </button>

        {/* CONVERSATION CARD */}

        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-black/70">
          {/* HEADER */}

          <div className="flex items-start justify-between gap-5 border-b border-white/[0.08] p-5 sm:p-7">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-orange-400/20 bg-orange-400/[0.04] text-orange-400">
                <MessageCircle size={18} />
              </div>

              <div className="min-w-0">
                <p className="text-[8px] uppercase tracking-[0.28em] text-orange-400">
                  Historia Conversation
                </p>

                <h1 className="mt-2 break-words text-xl font-medium text-white sm:text-2xl">
                  {conversation.subject}
                </h1>

                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] text-zinc-600">
                  <span>{conversation.visitorName}</span>

                  <span className="text-zinc-800">•</span>

                  <span>{formatDate(conversation.createdAt)}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => fetchConversation(false)}
              disabled={isRefreshing}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] text-zinc-600 transition-colors hover:text-orange-400 disabled:opacity-40"
              aria-label="Refresh conversation"
            >
              <RefreshCw
                size={14}
                className={isRefreshing ? "animate-spin" : ""}
              />
            </button>
          </div>

          {/* =================================================
              CHAT MESSAGES
          ================================================== */}

          <div className="min-h-[430px] max-h-[60vh] space-y-5 overflow-y-auto p-4 sm:p-7">
            {conversation.messages.map((chatMessage) => {
              const isVisitor = chatMessage.sender === "visitor";

              return (
                <div
                  key={chatMessage._id}
                  className={`flex ${
                    isVisitor ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[72%] ${
                      isVisitor ? "text-right" : "text-left"
                    }`}
                  >
                    {/* SENDER */}

                    <div
                      className={`mb-2 flex items-center gap-2 ${
                        isVisitor ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!isVisitor && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-md border border-orange-400/15 bg-orange-400/[0.04] text-orange-400">
                          <UserRound size={11} />
                        </div>
                      )}

                      <span className="text-[8px] uppercase tracking-[0.2em] text-zinc-700">
                        {isVisitor ? "You" : "Daniel"}
                      </span>
                    </div>

                    {/* BUBBLE */}

                    <div
                      className={`rounded-2xl px-4 py-3 text-left text-sm leading-7 ${
                        isVisitor
                          ? "rounded-br-md border border-orange-400/20 bg-orange-400/[0.055] text-zinc-300"
                          : "rounded-bl-md border border-white/[0.08] bg-white/[0.025] text-zinc-400"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">
                        {chatMessage.body}
                      </p>
                    </div>

                    {/* TIME */}

                    <div
                      className={`mt-1.5 flex items-center gap-1.5 ${
                        isVisitor ? "justify-end" : "justify-start"
                      }`}
                    >
                      <span className="font-mono text-[7px] text-zinc-800">
                        {formatTime(chatMessage.createdAt)}
                      </span>

                      {isVisitor && (
                        <CheckCheck size={10} className="text-zinc-800" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* =================================================
              STATUS
          ================================================== */}

          {status.message && (
            <div className="mx-4 mb-4 rounded-xl border border-red-400/20 bg-red-400/[0.035] px-4 py-3 text-xs text-red-300 sm:mx-7">
              {status.message}
            </div>
          )}

          {/* =================================================
              INPUT
          ================================================== */}

          <div className="border-t border-white/[0.08] p-4 sm:p-6">
            {conversation.status === "closed" ? (
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.015] px-4 py-4 text-center">
                <p className="text-xs text-zinc-600">
                  This conversation has been closed.
                </p>
              </div>
            ) : (
              <form onSubmit={sendMessage} className="flex items-end gap-3">
                <div className="flex-1">
                  <textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Type your message..."
                    rows={1}
                    maxLength={3000}
                    className="max-h-36 min-h-[52px] w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.015] px-4 py-3.5 text-sm leading-6 text-white outline-none transition-colors placeholder:text-zinc-700 focus:border-orange-400/30"
                  />

                  <p className="mt-1 text-right font-mono text-[7px] text-zinc-800">
                    {message.length} / 3000
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSending || !message.trim()}
                  className="mb-[17px] flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-xl border border-orange-400/25 bg-orange-400/[0.06] text-orange-400 transition-all hover:border-orange-400/50 hover:bg-orange-400/[0.1] disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </form>
            )}

            <p className="mt-4 text-center text-[8px] leading-5 text-zinc-800">
              Keep this conversation on the same browser to continue messaging.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Conversation;
