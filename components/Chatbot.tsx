"use client";

import { MessageSquare, X, Send, Bot, User } from "lucide-react";
import { useState, useRef, useEffect, FormEvent } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    // 빈 assistant 메시지를 먼저 추가해서 스트리밍 효과를 연출
    const assistantId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: assistantId, role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok || !res.body) throw new Error("API 오류");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages(prev =>
          prev.map(m => m.id === assistantId ? { ...m, content: accumulated } : m)
        );
      }
    } catch (err) {
      console.error(err);
      setMessages(prev =>
        prev.map(m => m.id === assistantId ? { ...m, content: "⚠️ 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." } : m)
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* 챗봇 창 */}
      <div
        className={`mb-4 w-80 sm:w-96 h-[500px] max-h-[70vh] bg-slate-900/95 backdrop-blur-md border border-neon-cyan/30 rounded-2xl shadow-[0_0_30px_rgba(34,211,238,0.2)] flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
        }`}
      >
        {/* 헤더 */}
        <div className="bg-slate-800/80 p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2 text-neon-cyan font-bold">
            <Bot size={20} />
            <span>AI 수학 튜터 🤖</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* 메시지 영역 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-slate-400 mt-10">
              <Bot size={40} className="mx-auto mb-3 opacity-50" />
              <p className="font-semibold">안녕! 나는 AI 수학 튜터야! 🎮</p>
              <p className="text-sm mt-1">모르는 문제가 있으면 질문해봐!</p>
              <div className="mt-4 space-y-2 text-xs text-left">
                <p className="bg-slate-800 rounded-xl px-3 py-2 cursor-pointer hover:bg-slate-700 transition-colors" onClick={() => setInput("일차부등식이 뭐야?")}>💡 일차부등식이 뭐야?</p>
                <p className="bg-slate-800 rounded-xl px-3 py-2 cursor-pointer hover:bg-slate-700 transition-colors" onClick={() => setInput("2x + 3 > 7을 어떻게 풀어?")}>💡 2x + 3 &gt; 7을 어떻게 풀어?</p>
              </div>
            </div>
          )}

          {messages.map((m) => (
            <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === "user" ? "bg-pixel-pink/20 text-pixel-pink" : "bg-neon-cyan/20 text-neon-cyan"}`}>
                {m.role === "user" ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`px-4 py-3 rounded-2xl max-w-[75%] text-sm leading-relaxed whitespace-pre-wrap break-words ${
                m.role === "user"
                  ? "bg-pixel-pink/10 border border-pixel-pink/30 text-white rounded-tr-sm"
                  : "bg-slate-800 border border-white/10 text-slate-200 rounded-tl-sm"
              }`}>
                {m.content || (m.role === "assistant" && isLoading ? "..." : "")}
              </div>
            </div>
          ))}

          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-neon-cyan/20 text-neon-cyan flex items-center justify-center shrink-0">
                <Bot size={16} />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-slate-800 border border-white/10 rounded-tl-sm flex gap-1 items-center">
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 입력 영역 */}
        <form onSubmit={handleSubmit} className="p-3 bg-slate-800/50 border-t border-white/10 flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="수학 질문을 입력하세요..."
            disabled={isLoading}
            className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-neon-cyan/50 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 rounded-xl px-3 py-2 hover:bg-neon-cyan/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send size={18} />
          </button>
        </form>
      </div>

      {/* 토글 버튼 */}
      <button
        onClick={() => setIsOpen(o => !o)}
        className="w-14 h-14 bg-slate-900 border-2 border-neon-cyan text-neon-cyan rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:scale-110 hover:bg-neon-cyan hover:text-slate-900 transition-all duration-300 relative"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pixel-pink opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-pixel-pink border border-white" />
          </span>
        )}
      </button>
    </div>
  );
}
