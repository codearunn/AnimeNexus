import { useState, useRef, useEffect } from 'react';
import toast from "react-hot-toast";
import api from "../../api/axios";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

function AIchat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const divRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (divRef.current && !divRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // for auto-scrolling
  const messagesEndRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // scrollIntoView() is a DOM method. => “Scroll the page/container so that this element becomes visible.”
  }, [messages]);


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

  return (
    <div
      className={`bg-black/60
                     ${open ? "inset-0 fixed" : ""}`}>

      {/* chat button */}
      <div>
        <motion.button
          onClick={() => setOpen(!open)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300 }}
          className='fixed bottom-10 right-7 text-7xl text-red-700'
        >💬
        </motion.button>
        <span className='text-red-700 font-extrabold text-md fixed bottom-5 right-9'>
          {open ? "Tap Anywhere to close" : "Ask an AI"}
        </span>
      </div>

      {/* Chat Window Container */}
      <AnimatePresence> {/* Open=false → play exit animation → THEN remove */}
        {open && (
          <motion.div
            ref={divRef}
            initial={{ opacity: 0, y: 100, scale: 0.8 }} //Before appearing
            animate={{ opacity: 1, y: 0, scale: 1 }}  // while
            exit={{ opacity: 0, y: 100, scale: 0.8 }} // after
            transition={{ duration: 0.3 }}
            className="fixed bottom-28 right-6 w-[500px] h-[600px]
                 bg-black rounded-2xl shadow-2xl
                 flex flex-col overflow-hidden text-red-700 border-2 border-red-900"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-700 font-extrabold text-3xl text-center tracking-wider">
              AnimeNexus AI
              <span className='text-gray-500 text-sm block tracking-tight'>Ask any Recommendation 😉</span>
            </div>

            {/* Messages */}
            {/* // flex-1 => so it takes remaining space */}
            <div className="flex-1 overflow-y-auto p-4">
              {messages.length === 0 && (
                <>
                  <span className='text-gray-400 font-extrabold text-xl flex items-center justify-center mt-[150px]'>
                    (ᴗ˳ᴗ)ᶻ𝗓𐰁 .ᐟ
                  </span>
                  <span className='text-gray-400 font-extrabold text-2xl flex items-center justify-center'> No convesation yet!</span>
                </>
              )}
              {messages.map((message, ind) => (
                <div
                  key={ind}
                  className={`flex text-gray-500/90 ${message.role === "ai" ? "justify-start" : "justify-end"}`}
                >
                  <div className={`max-w-[70%] p-3 rounded-lg ${
                    message.role === "ai"
                      ? "bg-red-950/40 border border-red-800 "
                      : "bg-gray-700 text-black font-extrabold"
                  }`}>
                    {message.role === "ai" ? (
                      <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown>
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      message.content
                    )}
                  </div>
                </div>
              ))}
              {loading && (<div className="text-gray-400 animate-pulse">
                ✌︎㋡ AI is thinking...
              </div>)}

              <div ref={messagesEndRef} ></div>
            </div>

            {/* Input */}
            <div className="p-3 border-t border-gray-700 flex">
              <input
                type='text'
                placeholder='Suggest Top 3 rated animes or something...'
                maxLength={500}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
                value={input}
                onChange={e => setInput(e.target.value)}
                className='w-full h-auto p-3 bg-black rounded-lg border border-gray-500 focus:outline-none focus:border-red-600'
              />
              <motion.button
                disabled={isDisabled}
                whileTap={{ scale: 0.9 }}
                onClick={sendMessage}
                className={`mt-2 ml-3 ${isDisabled
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer"}`}
              >
                <span
                  className='text-5xl hover:scale-105'>➣</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AIchat