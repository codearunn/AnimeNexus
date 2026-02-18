import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

function AIchat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);

  // for auto-scrolling
  const messagesEndRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // scrollIntoView() is a DOM method. => “Scroll the page/container so that this element becomes visible.”
  }, [messages]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 50);

    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const sendMessage = async () => {
    if (loading) return;
    if (!input || input.trim() === "") {
      toast.error("Message cannot be empty");
      return;
    }
    try {
      setLoading(true);
      const userMessage = {
        role: "user",
        content: input.trim(),
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, userMessage]);

      setInput("");

      const res = await api.post("/ai/recommend",
        { message: userMessage.content }
      );

      const AImessage = {
        role: "ai",
        content: res.data.recommendation,
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, AImessage]);

    } catch (error) {
      console.error("Error in sendMessage", error);
      setMessages(prev => [
        ...prev,
        {
          role: "system",
          content: "⚠️ Failed to get AI response.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const isDisabled = loading || !input.trim();
  const quickPrompts = [
    "Recommend me 5 anime like Attack on Titan.",
    "Suggest a short (12 eps) anime with great animation.",
    "I like romance + comedy. What should I watch next?",
    "Give me 3 underrated psychological thriller anime.",
  ];

  return (
    <>
      {/* Floating action button */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          type="button"
          onClick={() => setOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 320, damping: 22 }}
          className="group relative h-14 w-14 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 shadow-xl shadow-red-600/20 border border-red-300/20 flex items-center justify-center"
          aria-label="Open AnimeNexus AI"
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-black"
          >
            <path
              d="M7.5 18.5H7c-2.761 0-5-2.239-5-5V8.5c0-2.761 2.239-5 5-5h10c2.761 0 5 2.239 5 5v5c0 2.761-2.239 5-5 5h-3.2l-3.1 2.6c-.54.453-1.33.07-1.33-.63V18.5Z"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
            <circle cx="8.5" cy="11" r="1.2" fill="currentColor" />
            <circle cx="12" cy="11" r="1.2" fill="currentColor" />
            <circle cx="15.5" cy="11" r="1.2" fill="currentColor" />
          </svg>

          <span className="pointer-events-none absolute right-16 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition bg-black/80 border border-white/10 text-gray-200 text-xs font-semibold px-3 py-2 rounded-xl whitespace-nowrap">
            Ask AnimeNexus AI
          </span>
        </motion.button>
      </div>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* overlay */}
            <div
              className="absolute inset-0 bg-black/70"
              onClick={() => setOpen(false)}
            />

            {/* panel */}
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-6 right-6 w-[92vw] max-w-md h-[72vh] max-h-[680px] rounded-2xl overflow-hidden border border-red-900/60 bg-gradient-to-br from-gray-950 via-black to-gray-950 shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="AnimeNexus AI chat"
            >
              {/* header */}
              <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-red-600 to-red-800 border border-red-300/20 flex items-center justify-center">
                    <span className="text-black font-black">AI</span>
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-red-400 leading-tight">
                      AnimeNexus AI
                    </p>
                    <p className="text-xs text-gray-400">
                      Recommendations • Q&A
                      <span className="ml-2 inline-flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                        Online
                      </span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-1 text-gray-300 hover:text-white hover:bg-white/10 transition"
                  aria-label="Close chat"
                >
                  ✕
                </button>
              </div>

              {/* messages */}
              <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-3">
                {messages.length === 0 && (
                  <div className="mt-2">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-gray-200 font-semibold">
                        Tell me what you’re in the mood for.
                      </p>
                      <p className="mt-1 text-sm text-gray-400">
                        Try one of these quick prompts:
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {quickPrompts.map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => {
                              setInput(p);
                              inputRef.current?.focus();
                            }}
                            className="text-left text-xs font-semibold text-gray-200 bg-black/50 hover:bg-black/70 border border-red-900/40 hover:border-red-700/50 rounded-xl px-3 py-2 transition"
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {messages.map((message, ind) => {
                  const isAI = message.role === "ai";
                  const isSystem = message.role === "system";
                  return (
                    <div
                      key={ind}
                      className={`flex ${isAI || isSystem ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={[
                          "max-w-[85%] rounded-2xl px-4 py-3 border",
                          isSystem
                            ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-100"
                            : isAI
                              ? "bg-red-950/30 border-red-900/50 text-gray-200"
                              : "bg-white/10 border-white/10 text-white",
                        ].join(" ")}
                      >
                        <div className="text-[11px] font-extrabold tracking-wide uppercase mb-1 opacity-70">
                          {isSystem ? "System" : isAI ? "AnimeNexus AI" : "You"}
                        </div>

                        {isAI ? (
                          <div className="prose prose-invert prose-sm max-w-none">
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                          </div>
                        ) : (
                          <div className="text-sm whitespace-pre-wrap">
                            {message.content}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {loading && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl px-4 py-3 border border-red-900/50 bg-red-950/20 text-gray-300 text-sm animate-pulse">
                      Thinking…
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* input */}
              <div className="border-t border-white/10 p-3">
                <div className="flex gap-2 items-end">
                  <textarea
                    ref={inputRef}
                    rows={1}
                    placeholder="Ask for anime recommendations…"
                    maxLength={500}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    className="flex-1 resize-none rounded-2xl bg-black/60 border border-red-900/40 px-4 py-3 text-sm text-white outline-none focus:border-red-600 focus:ring-2 focus:ring-red-700/20"
                  />

                  <motion.button
                    type="button"
                    disabled={isDisabled}
                    whileTap={{ scale: 0.95 }}
                    onClick={sendMessage}
                    className={[
                      "h-11 w-11 rounded-2xl flex items-center justify-center font-black",
                      "bg-gradient-to-br from-red-600 to-red-800 text-black",
                      "shadow-lg shadow-red-600/20 border border-red-300/20",
                      isDisabled ? "opacity-60 cursor-not-allowed" : "hover:from-red-500 hover:to-red-700",
                    ].join(" ")}
                    aria-label="Send message"
                  >
                    ➤
                  </motion.button>
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500">
                  <span>Enter to send • Shift+Enter for new line</span>
                  <span>{input.length}/500</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default AIchat