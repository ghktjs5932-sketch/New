import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Gamepad2 } from "lucide-react";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "화선쌤의 즐거운 수학교실",
  description: "이해하기 쉬운 수학 공부하기",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans selection:bg-pixel-pink selection:text-white">
        {/* Header Section */}
        <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-neon-cyan rounded-lg text-slate-900 shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                <Gamepad2 size={28} strokeWidth={2.5} />
              </div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-white drop-shadow-md">
                화선쌤의 <span className="text-neon-cyan">즐거운</span> 수학교실
              </h1>
            </div>
            <div className="flex items-center gap-4 md:gap-8">
              <nav className="hidden md:flex gap-6 font-bold text-slate-300">
                <a href="#" className="hover:text-neon-cyan transition-colors">홈</a>
                <a href="#" className="hover:text-pixel-pink transition-colors">강의</a>
                <a href="#" className="hover:text-bright-yellow transition-colors">게시판</a>
              </nav>
              <button type="button" className="px-4 py-2 font-bold text-sm md:text-base bg-neon-cyan text-slate-900 rounded border-2 border-white shadow-[0_4px_0_0_#0891b2,0_5px_5px_rgba(0,0,0,0.3)] hover:brightness-110 active:translate-y-1 active:shadow-[0_1px_0_0_#0891b2,0_2px_2px_rgba(0,0,0,0.3)] transition-all">
                로그인
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col relative overflow-hidden">
          {children}
        </main>

        {/* Footer Section */}
        <footer className="border-t border-slate-800 bg-slate-950 py-8 text-center text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} 화선쌤의 즐거운 수학교실. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
