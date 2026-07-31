"use client";

import { useState, useEffect, useCallback } from "react";
import { Rocket, Trophy, Play, RotateCcw, Timer } from "lucide-react";

type Problem = {
  question: string;
  answer: string;
  options: string[];
};

const generateProblems = (): Problem[] => {
  const problems: Problem[] = [];
  for (let i = 0; i < 20; i++) {
    const isNegativeCoef = Math.random() > 0.7; // 30% chance for negative coefficient
    let a = Math.floor(Math.random() * 5) + 1; // 1 to 5
    if (isNegativeCoef) a = -a;
    const b = Math.floor(Math.random() * 21) - 10; // -10 to 10
    const x = Math.floor(Math.random() * 11) - 5; // -5 to 5
    
    const c = a * x + b;
    const isGreater = Math.random() > 0.5;
    
    let question = "";
    if (a === 1) question += "x";
    else if (a === -1) question += "-x";
    else question += `${a}x`;
    
    if (b > 0) question += ` + ${b}`;
    else if (b < 0) question += ` - ${Math.abs(b)}`;
    
    question += isGreater ? " > " : " < ";
    question += c;
    
    let ansDir = isGreater ? ">" : "<";
    if (a < 0) ansDir = isGreater ? "<" : ">";
    
    const correctAnswer = `x ${ansDir} ${x}`;
    
    // Generate 3 distractors
    const distractors = new Set<string>();
    while (distractors.size < 3) {
      const r = Math.random();
      let fakeDir = ansDir;
      let fakeX = x;
      if (r < 0.33) {
        fakeDir = fakeDir === ">" ? "<" : ">";
      } else if (r < 0.66) {
        fakeX = x + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1);
      } else {
        fakeDir = fakeDir === ">" ? "<" : ">";
        fakeX = x + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1);
      }
      
      const distractor = `x ${fakeDir} ${fakeX}`;
      if (distractor !== correctAnswer) {
        distractors.add(distractor);
      }
    }
    
    const options = [correctAnswer, ...Array.from(distractors)];
    options.sort(() => Math.random() - 0.5); // Shuffle
    
    problems.push({ question, answer: correctAnswer, options });
  }
  return problems;
};

export default function Home() {
  const [gameState, setGameState] = useState<"intro" | "playing" | "end">("intro");
  const [problems, setProblems] = useState<Problem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | "timeout" | null>(null);
  const [timeLeft, setTimeLeft] = useState(20);

  const startGame = () => {
    setProblems(generateProblems());
    setCurrentIndex(0);
    setScore(0);
    setFeedback(null);
    setTimeLeft(20);
    setGameState("playing");
  };

  const submitAnswer = useCallback((selectedOption: string | null) => {
    if (feedback !== null) return;

    if (selectedOption === null) {
      setFeedback("timeout");
    } else {
      const isCorrect = selectedOption === problems[currentIndex].answer;
      if (isCorrect) {
        setScore(s => s + 1);
        setFeedback("correct");
      } else {
        setFeedback("wrong");
      }
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentIndex + 1 < problems.length) {
        setCurrentIndex(c => c + 1);
        setTimeLeft(20);
      } else {
        setGameState("end");
      }
    }, 1000);
  }, [currentIndex, problems, feedback]);

  useEffect(() => {
    if (gameState === "playing" && feedback === null) {
      if (timeLeft === 0) {
        submitAnswer(null);
        return;
      }
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState, feedback, timeLeft, submitAnswer]);

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
      
      <div className="text-center w-full max-w-2xl relative z-10 backdrop-blur-sm bg-slate-900/30 p-10 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-500">
        
        {gameState === "intro" && (
          <div className="space-y-8 animate-in fade-in zoom-in duration-500">
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
              딱딱하고 지루한 수학은 이제 그만! 마치 게임을 클리어하듯 일차부등식 20문제를 풀고 마스터해 보세요.
            </p>
            
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
              <button type="button" onClick={startGame} className="arcade-btn group flex items-center gap-2 w-full sm:w-auto">
                <Rocket size={20} className="group-hover:animate-bounce" />
                <span>START GAME</span>
              </button>
            </div>
          </div>
        )}

        {gameState === "playing" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-neon-cyan font-bold tracking-widest uppercase">
                Stage {currentIndex + 1} <span className="text-slate-500">/ 20</span>
              </span>
              <div className="flex items-center gap-6">
                <span className={`font-black flex items-center gap-2 ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-pixel-pink'}`}>
                  <Timer size={18} /> {timeLeft}s
                </span>
                <span className="text-bright-yellow font-bold flex items-center gap-2">
                  <Trophy size={18} /> Score: {score}
                </span>
              </div>
            </div>

            <div className="py-12 relative">
              {feedback === "correct" && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <span className="text-6xl font-black text-green-400 drop-shadow-[0_0_20px_rgba(74,222,128,0.8)] animate-out fade-out zoom-out duration-1000">PERFECT!</span>
                </div>
              )}
              {feedback === "wrong" && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <span className="text-6xl font-black text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)] animate-out fade-out zoom-out duration-1000">MISS!</span>
                </div>
              )}
              {feedback === "timeout" && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <span className="text-6xl font-black text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)] animate-out fade-out zoom-out duration-1000">TIME OUT!</span>
                </div>
              )}

              <h3 className={`text-6xl md:text-8xl font-black text-white tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-opacity ${feedback ? 'opacity-20' : 'opacity-100'}`}>
                {problems[currentIndex].question}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
              {problems[currentIndex].options.map((option, idx) => {
                let buttonStyle = "bg-slate-800/80 hover:bg-slate-700 border-white/20 hover:border-neon-cyan";
                
                // Show correct/wrong colors if feedback is active
                if (feedback) {
                  if (option === problems[currentIndex].answer) {
                    buttonStyle = "bg-green-500/20 border-green-400 text-green-400 shadow-[0_0_15px_rgba(74,222,128,0.3)]";
                  } else {
                    buttonStyle = "bg-red-500/10 border-red-500/30 text-slate-500 opacity-50";
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => submitAnswer(option)}
                    disabled={feedback !== null}
                    className={`font-mono text-2xl font-bold px-6 py-6 rounded-xl border-2 transition-all active:scale-95 ${buttonStyle}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            
            <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden mt-6">
              <div 
                className={`h-full transition-all duration-1000 linear ${timeLeft <= 5 ? 'bg-red-500' : 'bg-neon-cyan'}`} 
                style={{ width: `${(timeLeft / 20) * 100}%` }} 
              />
            </div>
          </div>
        )}

        {gameState === "end" && (
          <div className="space-y-8 animate-in fade-in zoom-in duration-500">
            <h2 className="text-5xl font-black text-white mb-2">GAME OVER</h2>
            <div className="py-8">
              <div className="text-8xl font-black text-bright-yellow drop-shadow-[0_0_30px_rgba(250,204,21,0.6)]">
                {score} <span className="text-4xl text-slate-400">/ 20</span>
              </div>
              <p className="mt-6 text-xl text-slate-300">
                {score === 20 ? "완벽합니다! 수학 마스터 칭호를 획득하셨습니다! 🏆" : 
                 score >= 15 ? "훌륭합니다! 조금만 더 연습하면 마스터가 될 수 있어요! 🌟" : 
                 "수고하셨습니다! 다음에는 더 높은 점수에 도전해 보세요! 💪"}
              </p>
            </div>
            <button type="button" onClick={startGame} className="arcade-btn arcade-btn-pink group flex items-center justify-center gap-2 mx-auto">
              <RotateCcw size={20} className="group-hover:-rotate-180 transition-transform duration-500" />
              <span>RESTART GAME</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
