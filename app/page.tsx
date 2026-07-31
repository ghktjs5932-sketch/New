import { Rocket } from "lucide-react";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10 overflow-hidden min-h-screen">
      {/* Decorative background grids/glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-cyan/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-pixel-pink/50 to-transparent" />
      
      {/* Arcade Machine Image Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-15 pointer-events-none mix-blend-screen flex items-center justify-center">
        <img src="/arcade.png" alt="Arcade Background" className="w-full h-full object-contain blur-[2px]" />
      </div>

      {/* Floating Math Symbols */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-[15%] left-[10%] text-5xl text-neon-cyan/30 animate-float-slow font-black">∑</div>
        <div className="absolute top-[25%] right-[15%] text-6xl text-pixel-pink/30 animate-float-medium font-black animation-delay-1000">∫</div>
        <div className="absolute bottom-[25%] left-[15%] text-5xl text-bright-yellow/30 animate-float-fast font-black animation-delay-2000">π</div>
        <div className="absolute bottom-[15%] right-[20%] text-7xl text-neon-cyan/20 animate-float-slow font-black animation-delay-3000">∞</div>
        <div className="absolute top-[45%] left-[25%] text-5xl text-white/20 animate-float-medium font-black animation-delay-4000">×</div>
        <div className="absolute top-[60%] right-[30%] text-6xl text-pixel-pink/20 animate-float-fast font-black">÷</div>
        <div className="absolute bottom-[40%] left-[8%] text-4xl text-bright-yellow/20 animate-float-slow font-black">√</div>
        <div className="absolute top-[10%] right-[40%] text-4xl text-neon-cyan/40 animate-float-medium font-black animation-delay-2000">±</div>
      </div>
      
      <div className="text-center space-y-8 max-w-2xl relative z-10 backdrop-blur-sm bg-slate-900/30 p-10 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan font-semibold text-sm mb-4 tracking-wide shadow-[0_0_10px_rgba(34,211,238,0.2)]">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-neon-cyan"></span>
          </span>
          Next Level Learning
        </div>
        
        <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-100 to-slate-400 drop-shadow-sm leading-tight">
          이해하기 쉬운 <br />
          <span className="text-pixel-pink drop-shadow-[0_0_15px_rgba(244,114,182,0.6)]">수학 공부하기</span>
        </h2>
        
        <p className="text-lg md:text-xl text-slate-300 font-medium leading-relaxed max-w-xl mx-auto">
          딱딱하고 지루한 수학은 이제 그만! 마치 게임을 클리어하듯 재미있고 직관적으로 수학의 원리를 마스터해 보세요.
        </p>
        
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
          <button type="button" className="arcade-btn group flex items-center gap-2 w-full sm:w-auto">
            <Rocket size={20} className="group-hover:animate-bounce" />
            <span>START GAME</span>
          </button>
          
          <button type="button" className="arcade-btn arcade-btn-yellow w-full sm:w-auto">
            <span>TUTORIAL</span>
          </button>
        </div>
      </div>
    </div>
  );
}
