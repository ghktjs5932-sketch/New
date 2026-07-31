"use client";

import { useState, useEffect, useCallback } from "react";
import { Rocket, Trophy, Play, RotateCcw, Timer, BookOpen, CheckCircle, ArrowRight } from "lucide-react";
import { supabase, getUserId } from "@/lib/supabase";

type ReviewStep = {
  title: string;
  options: string[];
  answer: string;
};

type Problem = {
  question: string;
  answer: string;
  options: string[];
  reviewSteps: ReviewStep[];
};

const shuffle = (array: string[]) => {
  const newArray = [...array];
  return newArray.sort(() => Math.random() - 0.5);
};

const generateProblems = (): Problem[] => {
  const problems: Problem[] = [];
  
  for (let i = 0; i < 10; i++) {
    const isWordProblem = Math.random() > 0.5;
    
    if (isWordProblem) {
      const wpType = Math.floor(Math.random() * 3);
      if (wpType === 0) {
        // Savings problem
        const diff = Math.floor(Math.random() * 5) + 2; 
        const ansX = Math.floor(Math.random() * 8) + 3; 
        const b = (Math.floor(Math.random() * 5) + 1) * 1000;
        const d = b + diff * 1000;
        const c = (Math.floor(Math.random() * 10) + 1) * 1000;
        const a = c + diff * 1000 * ansX; 
        
        const question = `현재 형의 저축액은 ${a.toLocaleString()}원, 동생은 ${c.toLocaleString()}원이다. 다음 달부터 매달 형은 ${b.toLocaleString()}원씩, 동생은 ${d.toLocaleString()}원씩 저축할 때, 동생의 저축액이 형보다 많아지는 것은 몇 개월 후부터인가?`;
        
        const correctAns = ansX + 1;
        const optionsSet = new Set([`${correctAns}개월 후`]);
        while(optionsSet.size < 4) {
           const offset = Math.floor(Math.random() * 5) - 2; 
           const fakeAns = correctAns + (offset === 0 ? 3 : offset);
           if (fakeAns > 0) optionsSet.add(`${fakeAns}개월 후`);
        }
        const options = shuffle(Array.from(optionsSet));

        const reviewSteps: ReviewStep[] = [
          {
            title: "1단계. 문제의 조건에 맞게 올바른 부등식을 세워보세요.",
            answer: `${c} + ${d}x > ${a} + ${b}x`,
            options: shuffle([
              `${c} + ${d}x > ${a} + ${b}x`,
              `${c} + ${d}x < ${a} + ${b}x`,
              `${a} + ${d}x > ${c} + ${b}x`,
              `${a} + ${b}x > ${c} + ${d}x`
            ])
          },
          {
            title: "2단계. x항은 좌변으로, 상수항은 우변으로 이항하여 정리해 보세요.",
            answer: `${d - b}x > ${a - c}`,
            options: shuffle([
              `${d - b}x > ${a - c}`,
              `${d - b}x < ${a - c}`,
              `${d + b}x > ${a + c}`,
              `${d - b}x > ${c - a}`
            ])
          },
          {
            title: "3단계. 양변을 나누어 x의 범위를 구하세요.",
            answer: `x > ${ansX}`,
            options: shuffle([
              `x > ${ansX}`,
              `x < ${ansX}`,
              `x > ${((a+c)/(d+b)).toFixed(1)}`,
              `x > ${((c-a)/(d-b)).toFixed(1)}`
            ])
          }
        ];

        problems.push({ question, answer: `${correctAns}개월 후`, options, reviewSteps });
        
      } else if (wpType === 1) {
        // Purchasing problem
        const priceA = (Math.floor(Math.random() * 4) + 2) * 500;
        const priceB = priceA + (Math.floor(Math.random() * 3) + 1) * 500;
        const totalItems = Math.floor(Math.random() * 10) + 10;
        const maxA = Math.floor(Math.random() * 5) + 3; 
        const budget = priceA * maxA + priceB * (totalItems - maxA); 
        
        const question = `한 개에 ${priceA}원인 아이스크림과 ${priceB}원인 과자를 합하여 ${totalItems}개를 사고, 전체 금액이 ${budget.toLocaleString()}원 이하가 되게 하려고 한다. 과자는 최대 몇 개까지 살 수 있는가?`;
        
        const correctAns = totalItems - maxA;
        const optionsSet = new Set([`${correctAns}개`]);
        while(optionsSet.size < 4) {
           const offset = Math.floor(Math.random() * 5) - 2; 
           const fakeAns = correctAns + (offset === 0 ? 3 : offset);
           if (fakeAns > 0) optionsSet.add(`${fakeAns}개`);
        }
        const options = shuffle(Array.from(optionsSet));

        const reviewSteps: ReviewStep[] = [
          {
            title: `1단계. 과자의 개수를 x라 할 때, 올바른 부등식을 세워보세요. (아이스크림은 ${totalItems}-x개)`,
            answer: `${priceB}x + ${priceA}(${totalItems} - x) <= ${budget}`,
            options: shuffle([
              `${priceB}x + ${priceA}(${totalItems} - x) <= ${budget}`,
              `${priceB}x + ${priceA}(${totalItems} - x) >= ${budget}`,
              `${priceA}x + ${priceB}(${totalItems} - x) <= ${budget}`,
              `${priceB}x + ${priceA * totalItems} - x <= ${budget}`
            ])
          },
          {
            title: "2단계. 괄호를 풀고 이항하여 식을 간단히 정리하세요.",
            answer: `${priceB - priceA}x <= ${budget - priceA * totalItems}`,
            options: shuffle([
              `${priceB - priceA}x <= ${budget - priceA * totalItems}`,
              `${priceB - priceA}x >= ${budget - priceA * totalItems}`,
              `${priceA - priceB}x <= ${budget - priceB * totalItems}`,
              `${priceB - 1}x <= ${budget - priceA * totalItems}`
            ])
          },
          {
            title: "3단계. 양변을 나누어 x의 범위를 구하세요.",
            answer: `x <= ${correctAns}`,
            options: shuffle([
              `x <= ${correctAns}`,
              `x >= ${correctAns}`,
              `x >= ${((priceB * totalItems - budget) / (priceB - priceA)).toFixed(1)}`,
              `x <= ${((budget - priceA * totalItems) / (priceB - 1)).toFixed(1)}`
            ])
          }
        ];

        problems.push({ question, answer: `${correctAns}개`, options, reviewSteps });
        
      } else {
        // Distance problem
        const speedGo = Math.floor(Math.random() * 2) + 3;
        const speedBack = speedGo - (Math.floor(Math.random() * 1) + 1);
        const maxDist = Math.floor(Math.random() * 3) + 2;
        
        const timeLimit = maxDist / speedGo + maxDist / speedBack; 
        let timeLimitStr = Number.isInteger(timeLimit) ? `${timeLimit}` : `${timeLimit.toFixed(1)}`;
        
        const question = `등산을 하는데 올라갈 때는 시속 ${speedGo}km로 걷고, 내려올 때는 같은 길을 시속 ${speedBack}km로 걸어서 총 ${timeLimitStr}시간 이내에 등반을 마치려고 한다. 최대 몇 km 지점까지 올라갔다 올 수 있는가?`;
        
        const correctAns = maxDist;
        const optionsSet = new Set([`${correctAns}km`]);
        while(optionsSet.size < 4) {
           const fakeAns = correctAns + (Math.floor(Math.random() * 5) - 2) * 0.5;
           if (fakeAns > 0 && !optionsSet.has(`${fakeAns}km`)) optionsSet.add(`${fakeAns}km`);
        }
        const options = shuffle(Array.from(optionsSet));

        const reviewSteps: ReviewStep[] = [
          {
            title: "1단계. 거리를 x km라 할 때, 시간에 대한 부등식을 세워보세요. (시간 = 거리/속력)",
            answer: `x/${speedGo} + x/${speedBack} <= ${timeLimitStr}`,
            options: shuffle([
              `x/${speedGo} + x/${speedBack} <= ${timeLimitStr}`,
              `x/${speedGo} + x/${speedBack} >= ${timeLimitStr}`,
              `x/(${speedGo} + ${speedBack}) <= ${timeLimitStr}`,
              `x/${speedBack} - x/${speedGo} <= ${timeLimitStr}`
            ])
          },
          {
            title: `2단계. 양변에 최소공배수(${speedGo * speedBack})를 곱하여 분모를 없애고 정리하세요.`,
            answer: `${speedBack + speedGo}x <= ${timeLimit * speedGo * speedBack}`,
            options: shuffle([
              `${speedBack + speedGo}x <= ${timeLimit * speedGo * speedBack}`,
              `x <= ${timeLimit * (speedGo + speedBack)}`,
              `${speedBack + speedGo}x >= ${timeLimit * speedGo * speedBack}`,
              `${speedGo - speedBack}x <= ${timeLimit * speedGo * speedBack}`
            ])
          },
          {
            title: "3단계. 양변을 나누어 x의 범위를 구하세요.",
            answer: `x <= ${correctAns}`,
            options: shuffle([
              `x <= ${correctAns}`,
              `x >= ${correctAns}`,
              `x <= ${((timeLimit * speedGo * speedBack) / (speedGo - speedBack)).toFixed(1)}`,
              `x <= ${(timeLimit * (speedGo + speedBack)).toFixed(1)}`
            ])
          }
        ];

        problems.push({ question, answer: `${correctAns}km`, options, reviewSteps });
      }
    } else {
      // Basic linear inequality
      const isNegativeCoef = Math.random() > 0.7;
      let a = Math.floor(Math.random() * 5) + 1;
      if (isNegativeCoef) a = -a;
      const b = Math.floor(Math.random() * 21) - 10;
      const x = Math.floor(Math.random() * 11) - 5;
      
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
      
      const distractors = new Set<string>([correctAnswer]);
      while (distractors.size < 4) {
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
        distractors.add(`x ${fakeDir} ${fakeX}`);
      }
      const options = shuffle(Array.from(distractors));
      
      const op1 = isGreater ? '>' : '<';
      
      const reviewSteps: ReviewStep[] = [
        {
          title: "1단계. 상수항을 우변으로 이항하여 식을 정리하세요.",
          answer: `${a}x ${op1} ${c - b}`,
          options: shuffle([
            `${a}x ${op1} ${c - b}`,
            `${a}x ${op1} ${c + b}`,
            `${-a}x ${op1} ${c - b}`,
            `${a}x ${op1 === '>' ? '<' : '>'} ${c - b}`
          ])
        },
        {
          title: `2단계. 양변을 x의 계수(${a})로 나누어 해를 구하세요. (음수로 나누면 부등호 방향이 바뀝니다)`,
          answer: `x ${ansDir} ${x}`,
          options: shuffle([
            `x ${ansDir} ${x}`,
            `x ${ansDir === '>' ? '<' : '>'} ${x}`,
            `x ${ansDir} ${((c + b)/a).toFixed(1)}`,
            `x ${ansDir === '>' ? '<' : '>'} ${((c + b)/a).toFixed(1)}`
          ])
        }
      ];

      problems.push({ question, answer: correctAnswer, options, reviewSteps });
    }
  }
  return problems;
};

type WrongAnswerLog = {
  id: string;
  question: string;
  correct_answer: string;
  wrong_answer_submitted: string;
  review_options: string;
};

export default function Home() {
  const [gameState, setGameState] = useState<"intro" | "playing" | "end" | "review_list" | "review_playing">("intro");
  const [problems, setProblems] = useState<Problem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | "timeout" | null>(null);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes total

  // To track wrong answers in current session
  const [wrongAnswersThisSession, setWrongAnswersThisSession] = useState<{
    question: string;
    correct_answer: string;
    wrong_answer_submitted: string;
    review_steps: ReviewStep[];
  }[]>([]);

  // Supabase states
  const [reviewList, setReviewList] = useState<WrongAnswerLog[]>([]);
  const [currentReviewItem, setCurrentReviewItem] = useState<WrongAnswerLog | null>(null);
  const [currentReviewSteps, setCurrentReviewSteps] = useState<ReviewStep[]>([]);
  const [reviewStepIndex, setReviewStepIndex] = useState(0);
  const [reviewMistakes, setReviewMistakes] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const startGame = () => {
    setProblems(generateProblems());
    setCurrentIndex(0);
    setScore(0);
    setFeedback(null);
    setTimeLeft(600);
    setWrongAnswersThisSession([]);
    setGameState("playing");
  };

  const loadReviewList = async () => {
    try {
      const userId = getUserId();
      const { data, error } = await supabase
        .from('wrong_answers')
        .select('*')
        .eq('user_id', userId)
        .eq('is_reviewed', false)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Supabase Error:", error);
        alert("데이터를 불러오는 데 실패했습니다.");
        return;
      }
      setReviewList(data || []);
      setGameState("review_list");
    } catch (e) {
      console.error(e);
      alert("데이터를 불러오는 중 오류가 발생했습니다. (Supabase URL 및 Key 확인 필요)");
    }
  };

  const startReviewItem = (item: WrongAnswerLog) => {
    try {
      const parsedSteps = JSON.parse(item.review_options || "[]");
      // Check if it's legacy data (array of strings instead of ReviewStep objects)
      if (parsedSteps.length > 0 && typeof parsedSteps[0] === 'string') {
        alert("이전 버전의 데이터는 새로운 단계별 복습 모드를 지원하지 않습니다. 새로 게임을 플레이해주세요.");
        return;
      }
      setCurrentReviewSteps(parsedSteps as ReviewStep[]);
      setCurrentReviewItem(item);
      setReviewStepIndex(0);
      setReviewMistakes(0);
      setFeedback(null);
      setGameState("review_playing");
    } catch (e) {
      alert("문제 데이터를 해석하는 중 오류가 발생했습니다.");
    }
  };

  const submitReviewAnswer = async (selectedOption: string) => {
    if (feedback !== null || !currentReviewItem) return;

    const currentStep = currentReviewSteps[reviewStepIndex];
    const isCorrect = selectedOption === currentStep.answer;
    
    if (isCorrect) {
      setFeedback("correct");
      setTimeout(async () => {
        setFeedback(null);
        if (reviewStepIndex + 1 < currentReviewSteps.length) {
          setReviewStepIndex(c => c + 1);
        } else {
          // Review complete
          try {
            await supabase.from('review_logs').insert({
              wrong_answer_id: currentReviewItem.id,
              is_correct: reviewMistakes === 0 // Perfect review if 0 mistakes
            });
            await supabase.from('wrong_answers').update({ is_reviewed: true }).eq('id', currentReviewItem.id);
          } catch (e) {
            console.error(e);
          }
          setReviewList(prev => prev.filter(r => r.id !== currentReviewItem.id));
          setGameState("review_list");
        }
      }, 1000);
    } else {
      setFeedback("wrong");
      setReviewMistakes(m => m + 1);
      setTimeout(() => {
        setFeedback(null); // allow them to try again
      }, 1500);
    }
  };

  const submitAnswer = useCallback((selectedOption: string | null) => {
    if (feedback !== null) return;

    const currentProb = problems[currentIndex];

    if (selectedOption === null) {
      setFeedback("timeout");
      setWrongAnswersThisSession(prev => [...prev, {
        question: currentProb.question,
        correct_answer: currentProb.answer,
        wrong_answer_submitted: "시간 초과",
        review_steps: currentProb.reviewSteps
      }]);
    } else {
      const isCorrect = selectedOption === currentProb.answer;
      if (isCorrect) {
        setScore(s => s + 1);
        setFeedback("correct");
      } else {
        setFeedback("wrong");
        setWrongAnswersThisSession(prev => [...prev, {
          question: currentProb.question,
          correct_answer: currentProb.answer,
          wrong_answer_submitted: selectedOption,
          review_steps: currentProb.reviewSteps
        }]);
      }
    }

    setTimeout(async () => {
      setFeedback(null);
      if (currentIndex + 1 < problems.length) {
        setCurrentIndex(c => c + 1);
      } else {
        setGameState("end");
      }
    }, 1000);
  }, [currentIndex, problems, feedback]);

  useEffect(() => {
    let isMounted = true;
    if (gameState === "end" && wrongAnswersThisSession.length > 0) {
      const saveWrongAnswers = async () => {
        setIsSaving(true);
        try {
          const userId = getUserId();
          const inserts = wrongAnswersThisSession.map(w => ({
            user_id: userId,
            question: w.question,
            correct_answer: w.correct_answer,
            wrong_answer_submitted: w.wrong_answer_submitted,
            review_options: JSON.stringify(w.review_steps),
            is_reviewed: false
          }));
          await supabase.from('wrong_answers').insert(inserts);
        } catch (e) {
          console.error("Failed to save wrong answers", e);
        } finally {
          if (isMounted) setIsSaving(false);
          setWrongAnswersThisSession([]);
        }
      };
      saveWrongAnswers();
    }
    return () => { isMounted = false; };
  }, [gameState, wrongAnswersThisSession]);

  useEffect(() => {
    if (gameState === "playing" && feedback === null) {
      if (timeLeft <= 0) {
        setGameState("end");
        return;
      }
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState, feedback, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 relative z-10 overflow-hidden min-h-screen">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-cyan/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-pixel-pink/50 to-transparent" />
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-15 pointer-events-none mix-blend-screen flex items-center justify-center">
        <img src="/arcade.png" alt="Arcade Background" className="w-full h-full object-contain blur-[2px]" />
      </div>

      <div className="text-center w-full max-w-5xl relative z-10 backdrop-blur-sm bg-slate-900/40 p-6 md:p-10 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-500">
        
        {gameState === "intro" && (
          <div className="space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan font-semibold text-sm mb-4 tracking-wide shadow-[0_0_10px_rgba(34,211,238,0.2)]">
              Next Level Learning
            </div>
            
            <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-100 to-slate-400 drop-shadow-sm leading-tight">
              이해하기 쉬운 <br />
              <span className="text-pixel-pink drop-shadow-[0_0_15px_rgba(244,114,182,0.6)]">수학 공부하기</span>
            </h2>
            
            <p className="text-lg md:text-xl text-slate-300 font-medium leading-relaxed max-w-xl mx-auto">
              총 10문제, 제한 시간 10분! 기초 일차부등식부터 까다로운 활용 문제까지 한 번에 클리어해 보세요.
            </p>
            
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
              <button type="button" onClick={startGame} className="arcade-btn group flex items-center justify-center gap-2 w-full sm:w-auto">
                <Rocket size={20} className="group-hover:animate-bounce" />
                <span>START GAME</span>
              </button>
              <button type="button" onClick={loadReviewList} className="arcade-btn arcade-btn-yellow group flex items-center justify-center gap-2 w-full sm:w-auto">
                <BookOpen size={20} className="group-hover:animate-bounce" />
                <span>오답 복습하기</span>
              </button>
            </div>
          </div>
        )}

        {gameState === "review_list" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-4xl font-black text-white mb-6 border-b border-white/10 pb-4">오답 복습 보관함</h2>
            {reviewList.length === 0 ? (
              <p className="text-xl text-slate-400 py-12">현재 복습할 오답이 없습니다. 훌륭합니다!</p>
            ) : (
              <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {reviewList.map(item => (
                  <div key={item.id} className="flex flex-col md:flex-row items-center justify-between bg-slate-800/50 p-6 rounded-xl border border-white/5 hover:border-neon-cyan/50 transition-colors gap-4">
                    <div className="text-left flex-1">
                      <p className="text-lg text-white font-bold mb-2">{item.question}</p>
                      <p className="text-sm text-red-400">내가 고른 답: {item.wrong_answer_submitted}</p>
                    </div>
                    <button onClick={() => startReviewItem(item)} className="arcade-btn !px-4 !py-2 !text-sm whitespace-nowrap">
                      복습 시작
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button type="button" onClick={() => setGameState("intro")} className="text-slate-400 hover:text-white underline underline-offset-4 pt-4 block mx-auto">메인으로 돌아가기</button>
          </div>
        )}

        {gameState === "review_playing" && currentReviewItem && currentReviewSteps.length > 0 && (
          <div className="space-y-8 animate-in fade-in duration-500 text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 text-neon-cyan font-bold tracking-widest uppercase">
                <BookOpen size={20} /> Review Mode
              </div>
              <div className="flex items-center gap-2">
                {currentReviewSteps.map((_, idx) => (
                  <div key={idx} className={`h-2 w-8 rounded-full transition-colors duration-500 ${idx < reviewStepIndex ? 'bg-green-400' : idx === reviewStepIndex ? 'bg-neon-cyan animate-pulse' : 'bg-slate-700'}`} />
                ))}
              </div>
            </div>
            
            <div className="bg-slate-800/40 p-6 rounded-2xl border border-white/5 mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-slate-300 leading-snug break-keep">
                {currentReviewItem.question}
              </h3>
            </div>
            
            <div className="bg-neon-cyan/5 border border-neon-cyan/20 p-6 rounded-2xl">
              <p className="text-white font-black text-xl md:text-2xl mb-6 flex items-start gap-3">
                <span className="text-neon-cyan text-3xl">Q.</span> 
                {currentReviewSteps[reviewStepIndex].title}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentReviewSteps[reviewStepIndex].options.map((option: string, idx: number) => {
                  let buttonStyle = "bg-slate-800/80 hover:bg-slate-700 border-white/20 hover:border-neon-cyan";
                  if (feedback) {
                    if (option === currentReviewSteps[reviewStepIndex].answer) {
                      buttonStyle = "bg-green-500/20 border-green-400 text-green-400";
                    } else {
                      buttonStyle = "bg-slate-800 border-slate-700 text-slate-600 opacity-30";
                    }
                  }
                  
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => submitReviewAnswer(option)}
                      disabled={feedback !== null}
                      className={`text-center font-mono text-lg md:text-xl font-bold px-6 py-6 rounded-xl border-2 transition-all active:scale-95 break-keep ${buttonStyle}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="relative h-12">
              {feedback === "correct" && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <span className="text-3xl font-black text-green-400 flex items-center gap-2"><CheckCircle /> {reviewStepIndex + 1 === currentReviewSteps.length ? '복습 완료!' : '정답! 다음 단계로 넘어갑니다.'}</span>
                </div>
              )}
              {feedback === "wrong" && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <span className="text-3xl font-black text-red-500">다시 한 번 생각해보세요!</span>
                </div>
              )}
            </div>

            <button type="button" onClick={() => setGameState("review_list")} className="text-slate-500 hover:text-white underline underline-offset-4 pt-4 block mx-auto">목록으로 돌아가기 (그만두기)</button>
          </div>
        )}

        {gameState === "playing" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-neon-cyan font-bold tracking-widest uppercase text-xl">
                Stage {currentIndex + 1} <span className="text-slate-500 text-sm">/ 10</span>
              </span>
              <div className="flex items-center gap-6">
                <span className={`font-black flex items-center gap-2 text-2xl ${timeLeft <= 60 ? 'text-red-500 animate-pulse' : 'text-pixel-pink'}`}>
                  <Timer size={24} /> {formatTime(timeLeft)}
                </span>
                <span className="text-bright-yellow font-bold flex items-center gap-2 text-xl">
                  <Trophy size={20} /> {score} 점
                </span>
              </div>
            </div>

            <div className="py-8 relative min-h-[160px] flex items-center justify-center">
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

              <h3 className={`text-3xl md:text-5xl font-black text-white tracking-wide drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-opacity leading-snug break-keep ${feedback ? 'opacity-20' : 'opacity-100'}`}>
                {problems[currentIndex].question}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {problems[currentIndex].options.map((option, idx) => {
                let buttonStyle = "bg-slate-800/80 hover:bg-slate-700 border-white/20 hover:border-neon-cyan";
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
                    className={`font-bold text-xl md:text-2xl px-6 py-6 rounded-xl border-2 transition-all active:scale-95 break-keep ${buttonStyle}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            
            <div className="w-full bg-slate-800/50 rounded-full h-3 overflow-hidden mt-8 shadow-inner">
              <div 
                className={`h-full transition-all duration-1000 ease-linear ${timeLeft <= 60 ? 'bg-red-500' : 'bg-neon-cyan'}`} 
                style={{ width: `${(timeLeft / 600) * 100}%` }} 
              />
            </div>
          </div>
        )}

        {gameState === "end" && (
          <div className="space-y-8 animate-in fade-in zoom-in duration-500">
            <h2 className="text-5xl font-black text-white mb-2">GAME OVER</h2>
            <div className="py-8">
              <div className="text-8xl font-black text-bright-yellow drop-shadow-[0_0_30px_rgba(250,204,21,0.6)]">
                {score} <span className="text-4xl text-slate-400">/ 10</span>
              </div>
              <p className="mt-6 text-xl text-slate-300">
                {score === 10 ? "완벽합니다! 수학 마스터 칭호를 획득하셨습니다! 🏆" : 
                 score >= 7 ? "훌륭합니다! 조금만 더 연습하면 마스터가 될 수 있어요! 🌟" : 
                 "수고하셨습니다! 틀린 문제는 오답 복습하기에서 확인할 수 있습니다! 💪"}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button type="button" onClick={startGame} className="arcade-btn arcade-btn-pink group flex items-center justify-center gap-2">
                <RotateCcw size={20} className="group-hover:-rotate-180 transition-transform duration-500" />
                <span>RESTART GAME</span>
              </button>
              {score < 10 && (
                <button type="button" onClick={loadReviewList} disabled={isSaving} className="arcade-btn arcade-btn-yellow group flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  <BookOpen size={20} className={!isSaving ? "group-hover:animate-bounce" : ""} />
                  <span>{isSaving ? "오답 저장 중..." : "오답 바로 복습하기"}</span>
                </button>
              )}
              <button type="button" onClick={() => setGameState("intro")} className="arcade-btn group flex items-center justify-center gap-2">
                <span>MAIN MENU</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
