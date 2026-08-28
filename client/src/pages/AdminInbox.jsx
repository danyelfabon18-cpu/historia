import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  AlertTriangle,
  ArrowLeft,
  CheckCheck,
  Inbox,
  Lock,
  LogOut,
  MessageCircle,
  RefreshCw,
  Search,
  Send,
  Trash2,
  Unlock,
  UserRound,
  X,
} from "lucide-react";

/* =========================================================
   CONFIG
========================================================= */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getAdminToken = () => {
  return sessionStorage.getItem("historia_admin_token");
};

/* =========================================================
   ADMIN INBOX
========================================================= */

function AdminInbox() {
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);

  const [selectedConversation, setSelectedConversation] = useState(null);

  const [search, setSearch] = useState("");

  const [replyMessage, setReplyMessage] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [isSending, setIsSending] = useState(false);

  /* MOBILE */

  const [mobileView, setMobileView] = useState("list");

  /* DELETE */

  const [deleteTarget, setDeleteTarget] = useState(null);

  const [isDeleting, setIsDeleting] = useState(false);

  /* STATUS */

  const [status, setStatus] = useState({
    type: "",
    message: "",
  });

  /* REFS */

  const selectedConversationIdRef = useRef(null);

  const mobileViewRef = useRef("list");

  /*
    IMPORTANT:
    This ref points to the CHAT SCROLL AREA only.

    We no longer use scrollIntoView() because
    that can move the entire browser viewport.
  */

  const chatScrollRef = useRef(null);

  /* =========================================================
     KEEP REFS UPDATED
  ========================================================= */

  useEffect(() => {
    selectedConversationIdRef.current = selectedConversation?._id || null;
  }, [selectedConversation]);

  useEffect(() => {
    mobileViewRef.current = mobileView;
  }, [mobileView]);

  /* =========================================================
     LOGOUT
  ========================================================= */

  const logout = useCallback(() => {
    sessionStorage.removeItem("historia_admin_token");

    navigate("/admin");
  }, [navigate]);

  /* =========================================================
     UPDATE CONVERSATION LOCALLY
  ========================================================= */

  const updateConversationLocally = useCallback((updatedConversation) => {
    setConversations((current) => {
      const updated = current.map((conversation) =>
        conversation._id === updatedConversation._id
          ? updatedConversation
          : conversation,
      );

      return [...updated].sort(
        (a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt),
      );
    });

    setSelectedConversation((current) =>
      current?._id === updatedConversation._id ? updatedConversation : current,
    );
  }, []);

  /* =========================================================
     MARK CONVERSATION AS READ
  ========================================================= */

  const markConversationAsRead = useCallback(
    async (conversationId) => {
      const token = getAdminToken();

      if (!token) {
        logout();
        return false;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/conversations/${conversationId}/admin-read`,
          {
            method: "PATCH",

            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (response.status === 401 || response.status === 403) {
          logout();
          return false;
        }

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to mark conversation as read.",
          );
        }

        setConversations((current) =>
          current.map((conversation) =>
            conversation._id === conversationId
              ? {
                  ...conversation,
                  adminUnreadCount: 0,
                }
              : conversation,
          ),
        );

        setSelectedConversation((current) =>
          current?._id === conversationId
            ? {
                ...current,
                adminUnreadCount: 0,
              }
            : current,
        );

        return true;
      } catch (error) {
        setStatus({
          type: "error",

          message: error.message || "Unable to update conversation.",
        });

        return false;
      }
    },
    [logout],
  );

  /* =========================================================
     FETCH CONVERSATIONS
  ========================================================= */

  const fetchConversations = useCallback(
    async (silent = false) => {
      const token = getAdminToken();

      if (!token) {
        logout();
        return;
      }

      if (silent) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      try {
        const response = await fetch(`${API_URL}/api/conversations/admin`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.status === 401 || response.status === 403) {
          logout();
          return;
        }

        if (!response.ok) {
          throw new Error(data.message || "Unable to load conversations.");
        }

        const loadedConversations = Array.isArray(data.conversations)
          ? data.conversations
          : [];

        setConversations(loadedConversations);

        const selectedId = selectedConversationIdRef.current;

        let conversationToSelect = null;

        if (selectedId) {
          conversationToSelect =
            loadedConversations.find(
              (conversation) => conversation._id === selectedId,
            ) || null;
        }

        const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

        if (!conversationToSelect && isDesktop) {
          conversationToSelect = loadedConversations[0] || null;
        }

        setSelectedConversation(conversationToSelect);

        if (conversationToSelect) {
          selectedConversationIdRef.current = conversationToSelect._id;

          const conversationIsVisible =
            isDesktop || mobileViewRef.current === "message";

          if (
            conversationIsVisible &&
            conversationToSelect.adminUnreadCount > 0
          ) {
            await markConversationAsRead(conversationToSelect._id);
          }
        }

        setStatus({
          type: "",
          message: "",
        });
      } catch (error) {
        setStatus({
          type: "error",

          message: error.message || "Unable to load conversations.",
        });
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [logout, markConversationAsRead],
  );

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchConversations(false);
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [fetchConversations]);

  /* =========================================================
     AUTO REFRESH

     Refreshes conversations every 5 seconds.

     IMPORTANT:
     This will NOT move the browser page anymore.
  ========================================================= */

  useEffect(() => {
    const interval = window.setInterval(() => {
      fetchConversations(true);
    }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, [fetchConversations]);

  /* =========================================================
     SAFE CHAT AUTO SCROLL

     Only the INTERNAL CHAT BOX scrolls.

     This effect only runs when:
     - selected conversation changes
     - message count changes

     Typing in the reply box will NOT trigger it.
  ========================================================= */

  const selectedConversationId = selectedConversation?._id || "";

  const selectedMessageCount = selectedConversation?.messages?.length || 0;

  useEffect(() => {
    const chatContainer = chatScrollRef.current;

    if (!chatContainer || !selectedConversationId) {
      return undefined;
    }

    const frame = window.requestAnimationFrame(() => {
      chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: "smooth",
      });
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [selectedConversationId, selectedMessageCount]);

  /* =========================================================
     SELECT CONVERSATION
  ========================================================= */

  const handleSelectConversation = async (conversation) => {
    setSelectedConversation(conversation);

    selectedConversationIdRef.current = conversation._id;

    setMobileView("message");

    setReplyMessage("");

    if (conversation.adminUnreadCount > 0) {
      await markConversationAsRead(conversation._id);
    }
  };

  /* =========================================================
     MOBILE BACK
  ========================================================= */

  const backToInbox = () => {
    setMobileView("list");
  };

  /* =========================================================
     ADMIN SEND REPLY
  ========================================================= */

  const sendReply = async (event) => {
    event.preventDefault();

    if (!selectedConversation || !replyMessage.trim() || isSending) {
      return;
    }

    const token = getAdminToken();

    if (!token) {
      logout();
      return;
    }

    const trimmedReply = replyMessage.trim();

    setIsSending(true);

    try {
      const response = await fetch(
        `${API_URL}/api/conversations/${selectedConversation._id}/admin-message`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            message: trimmedReply,
          }),
        },
      );

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        logout();
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Unable to send reply.");
      }

      updateConversationLocally(data.conversation);

      setReplyMessage("");

      setStatus({
        type: "success",
        message: "Reply sent.",
      });

      window.setTimeout(() => {
        setStatus({
          type: "",
          message: "",
        });
      }, 2000);
    } catch (error) {
      setStatus({
        type: "error",

        message: error.message || "Unable to send reply.",
      });
    } finally {
      setIsSending(false);
    }
  };

  /* =========================================================
     CLOSE / REOPEN CONVERSATION
  ========================================================= */

  const changeConversationStatus = async () => {
    if (!selectedConversation) {
      return;
    }

    const token = getAdminToken();

    if (!token) {
      logout();
      return;
    }

    const nextStatus =
      selectedConversation.status === "open" ? "closed" : "open";

    try {
      const response = await fetch(
        `${API_URL}/api/conversations/${selectedConversation._id}/status`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            status: nextStatus,
          }),
        },
      );

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        logout();
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Unable to update conversation.");
      }

      updateConversationLocally(data.conversation);

      setStatus({
        type: "success",

        message:
          nextStatus === "closed"
            ? "Conversation closed."
            : "Conversation reopened.",
      });

      window.setTimeout(() => {
        setStatus({
          type: "",
          message: "",
        });
      }, 2000);
    } catch (error) {
      setStatus({
        type: "error",

        message: error.message || "Unable to update conversation.",
      });
    }
  };

  /* =========================================================
     DELETE MODAL
  ========================================================= */

  const openDeleteModal = (conversation) => {
    setDeleteTarget(conversation);
  };

  const closeDeleteModal = () => {
    if (isDeleting) {
      return;
    }

    setDeleteTarget(null);
  };

  /* =========================================================
     ESCAPE CLOSES MODAL
  ========================================================= */

  useEffect(() => {
    if (!deleteTarget) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape" && !isDeleting) {
        setDeleteTarget(null);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [deleteTarget, isDeleting]);

  /* =========================================================
     DELETE CONVERSATION
  ========================================================= */

  const deleteConversation = async () => {
    if (!deleteTarget) {
      return;
    }

    const token = getAdminToken();

    if (!token) {
      logout();
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(
        `${API_URL}/api/conversations/${deleteTarget._id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        logout();
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete conversation.");
      }

      const remainingConversations = conversations.filter(
        (conversation) => conversation._id !== deleteTarget._id,
      );

      setConversations(remainingConversations);

      if (selectedConversation?._id === deleteTarget._id) {
        const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

        const nextConversation = isDesktop
          ? remainingConversations[0] || null
          : null;

        setSelectedConversation(nextConversation);

        selectedConversationIdRef.current = nextConversation?._id || null;

        setMobileView("list");
      }

      setDeleteTarget(null);

      setStatus({
        type: "success",
        message: "Conversation deleted successfully.",
      });

      window.setTimeout(() => {
        setStatus({
          type: "",
          message: "",
        });
      }, 2500);
    } catch (error) {
      setStatus({
        type: "error",

        message: error.message || "Unable to delete conversation.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  /* =========================================================
     SEARCH
  ========================================================= */

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return conversations;
    }

    return conversations.filter((conversation) => {
      const name = conversation.visitorName?.toLowerCase() || "";

      const email = conversation.visitorEmail?.toLowerCase() || "";

      const subject = conversation.subject?.toLowerCase() || "";

      const messageText = Array.isArray(conversation.messages)
        ? conversation.messages
            .map((message) => message.body?.toLowerCase() || "")
            .join(" ")
        : "";

      return (
        name.includes(query) ||
        email.includes(query) ||
        subject.includes(query) ||
        messageText.includes(query)
      );
    });
  }, [conversations, search]);

  /* =========================================================
     UNREAD COUNT
  ========================================================= */

  const unreadConversationCount = conversations.filter(
    (conversation) => conversation.adminUnreadCount > 0,
  ).length;

  /* =========================================================
     LAST MESSAGE
  ========================================================= */

  const getLastMessage = (conversation) => {
    if (!conversation?.messages || conversation.messages.length === 0) {
      return null;
    }

    return conversation.messages[conversation.messages.length - 1];
  };

  /* =========================================================
     DATE
  ========================================================= */

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
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const formatShortDate = (date) => {
    if (!date) {
      return "";
    }

    return new Intl.DateTimeFormat("en-PH", {
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <section className="min-h-screen bg-black text-white">
      {/* HEADER */}

      <header className="border-b border-white/[0.08] bg-black/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-3 px-4 py-4 sm:px-8 sm:py-5">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-400/20 bg-orange-400/[0.04] text-orange-400">
              <MessageCircle size={17} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-[7px] uppercase tracking-[0.25em] text-orange-400 sm:text-[8px]">
                Historia Admin
              </p>

              <h1 className="mt-1 truncate text-base font-medium text-white sm:text-lg">
                Conversations
              </h1>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-zinc-500 transition-colors hover:text-white sm:w-auto sm:gap-2 sm:px-3"
              aria-label="Portfolio"
            >
              <ArrowLeft size={13} />

              <span className="hidden sm:inline">Portfolio</span>
            </button>

            <button
              type="button"
              onClick={logout}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-zinc-500 transition-colors hover:border-red-400/20 hover:text-red-300 sm:w-auto sm:gap-2 sm:px-3"
              aria-label="Logout"
            >
              <LogOut size={13} />

              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* CONTENT */}

      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-8 sm:py-7">
        {/* TOP */}

        <div
          className={`mb-6 items-center justify-between gap-4 ${
            mobileView === "list" ? "flex" : "hidden lg:flex"
          }`}
        >
          <div>
            <p className="text-[7px] uppercase tracking-[0.25em] text-zinc-700 sm:text-[8px]">
              Portfolio Conversations
            </p>

            <div className="mt-2 flex items-center gap-3">
              <h2 className="text-2xl font-medium">Inbox</h2>

              {unreadConversationCount > 0 && (
                <span className="rounded-full border border-orange-400/20 bg-orange-400/[0.05] px-3 py-1 text-[8px] text-orange-400">
                  {unreadConversationCount} unread
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => fetchConversations(true)}
            disabled={isRefreshing}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-zinc-500 transition-colors hover:text-white sm:w-auto sm:gap-2 sm:px-4"
          >
            <RefreshCw
              size={13}
              className={isRefreshing ? "animate-spin" : ""}
            />

            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {/* MOBILE BACK */}

        {mobileView === "message" && (
          <div className="mb-5 lg:hidden">
            <button
              type="button"
              onClick={backToInbox}
              className="flex items-center gap-2 text-xs text-zinc-500 transition-colors hover:text-orange-400"
            >
              <ArrowLeft size={14} />
              Back to Inbox
            </button>
          </div>
        )}

        {/* STATUS */}

        {status.message && (
          <div
            className={`mb-5 rounded-xl border px-4 py-3 text-xs ${
              status.type === "success"
                ? "border-orange-400/20 bg-orange-400/[0.035] text-orange-300"
                : "border-red-400/20 bg-red-400/[0.035] text-red-300"
            }`}
          >
            {status.message}
          </div>
        )}

        {/* INBOX */}

        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.01] lg:grid lg:min-h-[680px] lg:grid-cols-[390px_1fr]">
          {/* CONVERSATION LIST */}

          <aside
            className={`border-white/[0.08] lg:block lg:border-r ${
              mobileView === "list" ? "block" : "hidden"
            }`}
          >
            {/* SEARCH */}

            <div className="border-b border-white/[0.08] p-4">
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-700"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search conversations..."
                  className="w-full rounded-xl border border-white/[0.07] bg-black/30 py-3 pl-9 pr-3 text-xs text-white outline-none transition-colors placeholder:text-zinc-700 focus:border-orange-400/30"
                />
              </div>
            </div>

            {/* LIST */}

            <div className="max-h-[calc(100vh-270px)] min-h-[350px] overflow-y-auto overscroll-contain lg:max-h-[620px]">
              {isLoading ? (
                <div className="flex min-h-[300px] items-center justify-center">
                  <div className="text-center">
                    <RefreshCw
                      size={18}
                      className="mx-auto animate-spin text-zinc-700"
                    />

                    <p className="mt-3 text-xs text-zinc-700">
                      Loading conversations...
                    </p>
                  </div>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="flex min-h-[300px] items-center justify-center">
                  <div className="text-center">
                    <Inbox size={25} className="mx-auto text-zinc-800" />

                    <p className="mt-3 text-xs text-zinc-700">
                      No conversations found.
                    </p>
                  </div>
                </div>
              ) : (
                filteredConversations.map((conversation) => {
                  const lastMessage = getLastMessage(conversation);

                  const isUnread = conversation.adminUnreadCount > 0;

                  return (
                    <button
                      key={conversation._id}
                      type="button"
                      onClick={() => handleSelectConversation(conversation)}
                      className={`relative w-full border-b border-white/[0.05] p-4 text-left transition-colors sm:p-5 ${
                        selectedConversation?._id === conversation._id
                          ? "bg-white/[0.035]"
                          : "hover:bg-white/[0.02]"
                      }`}
                    >
                      {isUnread && (
                        <div className="absolute left-0 top-0 h-full w-[2px] bg-orange-400" />
                      )}

                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p
                              className={`truncate text-xs ${
                                isUnread
                                  ? "font-medium text-white"
                                  : "text-zinc-400"
                              }`}
                            >
                              {conversation.visitorName}
                            </p>

                            {isUnread && (
                              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
                            )}
                          </div>

                          <p className="mt-1 truncate text-[10px] text-zinc-600">
                            {conversation.subject}
                          </p>
                        </div>

                        <span className="shrink-0 font-mono text-[7px] text-zinc-700">
                          {formatShortDate(conversation.lastMessageAt)}
                        </span>
                      </div>

                      {lastMessage && (
                        <div className="mt-3 flex items-start gap-2">
                          {lastMessage.sender === "admin" && (
                            <span className="mt-[1px] text-[8px] text-orange-400/60">
                              You:
                            </span>
                          )}

                          <p className="line-clamp-2 text-[9px] leading-5 text-zinc-700">
                            {lastMessage.body}
                          </p>
                        </div>
                      )}

                      <div className="mt-3 flex items-center gap-2">
                        <span
                          className={`rounded-full border px-2 py-1 text-[7px] uppercase tracking-[0.15em] ${
                            conversation.status === "open"
                              ? "border-orange-400/15 text-orange-400/70"
                              : "border-white/[0.06] text-zinc-700"
                          }`}
                        >
                          {conversation.status}
                        </span>

                        <span className="font-mono text-[7px] text-zinc-800">
                          {conversation.messages?.length} messages
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          {/* CHAT */}

          <main
            className={`lg:block ${
              mobileView === "message" ? "block" : "hidden"
            }`}
          >
            {!selectedConversation ? (
              <div className="flex min-h-[500px] items-center justify-center p-8 text-center lg:h-full">
                <div>
                  <MessageCircle size={30} className="mx-auto text-zinc-800" />

                  <p className="mt-4 text-sm text-zinc-600">
                    Select a conversation.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[600px] flex-col lg:min-h-[680px]">
                {/* CHAT HEADER */}

                <div className="border-b border-white/[0.08] p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[8px] uppercase tracking-[0.25em] text-orange-400">
                        Conversation
                      </p>

                      <h2 className="mt-2 break-words text-xl font-medium text-white sm:text-2xl">
                        {selectedConversation.subject}
                      </h2>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={changeConversationStatus}
                        className="flex h-9 items-center gap-2 rounded-lg border border-white/[0.08] px-3 text-[9px] text-zinc-500 transition-colors hover:border-orange-400/20 hover:text-orange-400"
                      >
                        {selectedConversation.status === "open" ? (
                          <Lock size={12} />
                        ) : (
                          <Unlock size={12} />
                        )}

                        <span className="hidden sm:inline">
                          {selectedConversation.status === "open"
                            ? "Close"
                            : "Reopen"}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openDeleteModal(selectedConversation)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-zinc-600 transition-colors hover:border-red-400/25 hover:text-red-300"
                        aria-label="Delete conversation"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.02] text-zinc-500">
                      <UserRound size={14} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-medium text-zinc-300">
                        {selectedConversation.visitorName}
                      </p>

                      <p className="mt-1 break-all text-[10px] text-zinc-600">
                        {selectedConversation.visitorEmail}
                      </p>

                      <p className="mt-1.5 font-mono text-[8px] text-zinc-700">
                        Started {formatDate(selectedConversation.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* CHAT MESSAGES */}

                <div
                  ref={chatScrollRef}
                  className="flex-1 space-y-5 overflow-y-auto overscroll-contain p-4 sm:p-6 lg:h-[430px] lg:max-h-[430px]"
                >
                  {selectedConversation.messages?.map((chatMessage) => {
                    const isAdmin = chatMessage.sender === "admin";

                    return (
                      <div
                        key={chatMessage._id}
                        className={`flex ${
                          isAdmin ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div className="max-w-[85%] sm:max-w-[72%]">
                          <div
                            className={`mb-2 flex items-center gap-2 ${
                              isAdmin ? "justify-end" : "justify-start"
                            }`}
                          >
                            <span className="text-[8px] uppercase tracking-[0.2em] text-zinc-700">
                              {isAdmin
                                ? "You"
                                : selectedConversation.visitorName}
                            </span>
                          </div>

                          <div
                            className={`rounded-2xl px-4 py-3 text-sm leading-7 ${
                              isAdmin
                                ? "rounded-br-md border border-orange-400/20 bg-orange-400/[0.055] text-zinc-300"
                                : "rounded-bl-md border border-white/[0.08] bg-white/[0.025] text-zinc-400"
                            }`}
                          >
                            <p className="whitespace-pre-wrap break-words">
                              {chatMessage.body}
                            </p>
                          </div>

                          <div
                            className={`mt-1.5 flex items-center gap-1.5 ${
                              isAdmin ? "justify-end" : "justify-start"
                            }`}
                          >
                            <span className="font-mono text-[7px] text-zinc-800">
                              {formatTime(chatMessage.createdAt)}
                            </span>

                            {isAdmin && (
                              <CheckCheck size={10} className="text-zinc-800" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* REPLY BOX */}

                <div className="border-t border-white/[0.08] p-4 sm:p-5">
                  {selectedConversation.status === "closed" ? (
                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.015] p-4 text-center">
                      <Lock size={15} className="mx-auto text-zinc-700" />

                      <p className="mt-2 text-xs text-zinc-600">
                        This conversation is closed.
                      </p>

                      <button
                        type="button"
                        onClick={changeConversationStatus}
                        className="mt-3 text-[10px] text-orange-400"
                      >
                        Reopen Conversation
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={sendReply} className="flex items-end gap-3">
                      <div className="flex-1">
                        <textarea
                          value={replyMessage}
                          onChange={(event) =>
                            setReplyMessage(event.target.value)
                          }
                          placeholder={`Reply to ${selectedConversation.visitorName}...`}
                          rows={2}
                          maxLength={3000}
                          className="max-h-36 min-h-[54px] w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.015] px-4 py-3 text-sm leading-6 text-white outline-none transition-colors placeholder:text-zinc-700 focus:border-orange-400/30"
                        />

                        <p className="mt-1 text-right font-mono text-[7px] text-zinc-800">
                          {replyMessage.length} / 3000
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={isSending || !replyMessage.trim()}
                        className="mb-[17px] flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-xl border border-orange-400/25 bg-orange-400/[0.06] text-orange-400 transition-colors hover:border-orange-400/50 hover:bg-orange-400/[0.1] disabled:cursor-not-allowed disabled:opacity-30"
                        aria-label="Send reply"
                      >
                        <Send size={16} />
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* DELETE MODAL */}

      {deleteTarget && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 px-4 backdrop-blur-md"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeDeleteModal();
            }
          }}
        >
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/[0.09] bg-zinc-950 shadow-2xl">
            <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-red-500/[0.05] blur-[70px]" />

            <button
              type="button"
              onClick={closeDeleteModal}
              disabled={isDeleting}
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.07] text-zinc-600 transition-colors hover:text-white disabled:opacity-40"
            >
              <X size={14} />
            </button>

            <div className="relative z-10 p-5 sm:p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-400/20 bg-red-400/[0.04] text-red-300">
                <AlertTriangle size={18} />
              </div>

              <p className="mt-6 text-[8px] uppercase tracking-[0.28em] text-red-300">
                Delete Conversation
              </p>

              <h2 className="mt-2 pr-8 text-xl font-medium text-white">
                Permanently delete this conversation?
              </h2>

              <p className="mt-4 text-sm leading-7 text-zinc-500">
                The entire conversation with{" "}
                <span className="text-zinc-300">
                  {deleteTarget.visitorName}
                </span>{" "}
                will be permanently removed.
              </p>

              <div className="mt-5 rounded-xl border border-white/[0.07] bg-black/30 p-4">
                <p className="text-xs font-medium text-zinc-300">
                  {deleteTarget.subject}
                </p>

                <p className="mt-2 text-[10px] text-zinc-600">
                  {deleteTarget.messages?.length} messages
                </p>
              </div>

              <p className="mt-4 text-[9px] text-zinc-700">
                This action cannot be undone.
              </p>

              <div className="mt-7 grid grid-cols-2 gap-3 sm:flex sm:justify-end">
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  disabled={isDeleting}
                  className="rounded-xl border border-white/[0.08] px-5 py-3 text-[10px] text-zinc-500 transition-colors hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={deleteConversation}
                  disabled={isDeleting}
                  className="flex items-center justify-center gap-2 rounded-xl border border-red-400/25 bg-red-400/[0.05] px-5 py-3 text-[10px] text-red-300 transition-colors hover:bg-red-400/[0.09] disabled:opacity-50"
                >
                  <Trash2 size={13} />

                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminInbox;
