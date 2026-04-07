import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Check, X as XIcon, RotateCcw, Menu, Info, MessageSquare } from 'lucide-react';

// Thuật toán xáo trộn mảng (Fisher-Yates Shuffle)
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Dữ liệu dự phòng trường hợp không gọi được API
const fallbackData = [
  {
    id: 1,
    q: "Chức năng chính của BMS (Battery Management System) trong khối pin là gì?",
    options: ["A. Tăng dung lượng pin", "B. Giám sát và bảo vệ pin khỏi quá nhiệt, quá dòng", "C. Giảm trọng lượng khối pin", "D. Tăng tốc độ sạc gấp đôi"],
    answer: "B",
    explain: "BMS chịu trách nhiệm giám sát các thông số (điện áp, dòng điện, nhiệt độ) và bảo vệ các cell pin để đảm bảo an toàn, ngăn chặn cháy nổ."
  },
  {
    id: 2,
    q: "Nhiệt độ môi trường lý tưởng nhất để bảo quản cell pin Lithium-ion là bao nhiêu?",
    options: ["A. -10°C đến 0°C", "B. 15°C đến 25°C", "C. 35°C đến 45°C", "D. 50°C đến 60°C"],
    answer: "B",
    explain: "Pin Lithium-ion hoạt động và bảo quản tốt nhất ở nhiệt độ phòng (khoảng 15-25°C). Nhiệt độ quá cao gây lão hóa nhanh, quá thấp làm giảm hiệu suất."
  },
  {
    id: 3,
    q: "Khi hàn điểm (spot welding) các cell pin, yếu tố nào cần được kiểm soát chặt chẽ nhất?",
    options: ["A. Ánh sáng trong phòng", "B. Thời gian và dòng điện hàn", "C. Màu sắc của dải niken", "D. Độ ồn của máy hàn"],
    answer: "B",
    explain: "Thời gian và dòng điện (công suất hàn) cần được tính toán kỹ. Quá thấp sẽ không dính, quá cao có thể xuyên thủng màng bảo vệ cell pin."
  }
];

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState('start'); // start, quiz, result
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showGrid, setShowGrid] = useState(false);

  // Fetch dữ liệu từ API
  useEffect(() => {
    fetch('https://res.cloudinary.com/dfeujdemv/raw/upload/v1775550377/data_abstnt.json')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setQuestions(data);
        } else {
          setQuestions(fallbackData);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch failed, using fallback.", err);
        setQuestions(fallbackData);
        setLoading(false);
      });
  }, []);

  const currentQ = questions[currentIndex];

  const handleStart = () => {
    // Xáo trộn mảng câu hỏi mỗi khi bắt đầu bài làm mới
    setQuestions(prev => shuffleArray(prev));
    setScreen('quiz');
  };

  const handleOptionClick = (option) => {
    if (answers[currentIndex]) return;

    const isCorrect = option.charAt(0) === currentQ.answer;
    
    setAnswers(prev => ({
      ...prev,
      [currentIndex]: option
    }));

    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    setScreen('result');
    setShowGrid(false);
  };

  const handleRetry = () => {
    setAnswers({});
    setCurrentIndex(0);
    setScore(0);
    setScreen('start'); // Trở về màn hình Start để người dùng bấm Bắt đầu (sẽ xáo trộn lại câu hỏi)
  };

  // Render Loader
  if (loading) {
    return (
      <div className="min-h-screen bg-[#ffffff] flex flex-col items-center justify-center font-future">
        <style dangerouslySetInnerHTML={{ __html: customStyles }} />
        <div className="w-8 h-8 border-[2px] border-black/10 border-t-[#010120] rounded-full animate-spin mb-4" />
      </div>
    );
  }

  return (
    <div className="min-h-screen font-future transition-colors duration-500 bg-[#ffffff] text-[#000000] selection:bg-[#bdbbff]/30">
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      
      {/* Navigation Bar */}
      <header className="fixed top-0 w-full z-40 flex items-center justify-between px-6 py-4 transition-colors duration-500 bg-white/80 border-b border-black/5 backdrop-blur-md">
        <div className="flex items-center">
          <span className="font-future text-[18px] font-[500] tracking-[-0.18px] text-black">
            together<span className="text-[#ef2cc1]">_</span>assess
          </span>
        </div>
        
        {screen === 'quiz' && (
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={() => setShowGrid(true)}
              className="flex items-center gap-2 bg-black/[0.04] px-3 sm:px-4 py-1 h-[32px] rounded-[4px] text-[14px] font-[500] text-black hover:bg-black/[0.08] transition-all border border-black/[0.08]"
            >
              <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-[0.055px] pt-[2px]">Danh sách câu</span>
              <Menu className="w-4 h-4 sm:hidden" />
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center justify-center bg-[#010120] text-white px-4 py-1 h-[32px] rounded-[4px] text-[14px] font-[500] hover:opacity-90 transition-opacity"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.055px] pt-[2px]">Nộp bài</span>
            </button>
          </div>
        )}
      </header>

      <main className={`w-full flex flex-col min-h-screen ${screen === 'start' ? 'pt-0 together-gradient' : 'pt-[64px]'}`}>
        
        {/* --- START SCREEN --- */}
        {screen === 'start' && (
          <div className="relative flex-1 flex flex-col items-center justify-center text-center w-full min-h-screen px-6">
            <div className="relative z-10 flex-1 flex flex-col justify-center items-center w-full mt-[60px] max-w-[800px] mx-auto">
              
              <div className="mb-6 px-3 py-1 bg-black/[0.04] border border-black/[0.08] rounded-[4px]">
                <span className="font-mono text-[11px] font-[500] uppercase tracking-[0.08px] text-black">
                  Bài kiểm tra kiến thức
                </span>
              </div>

              <h1 className="text-[48px] md:text-[64px] font-[500] text-black leading-[1.0] md:leading-[1.10] tracking-[-1.5px] md:tracking-[-1.92px] mb-6">
                Lắp Ráp Pin Xe Điện
              </h1>
              
              <p className="text-[16px] md:text-[18px] font-[400] text-black/70 mb-10 max-w-[600px] leading-[1.30] tracking-[-0.18px]">
                Đánh giá năng lực chuyên môn về quy trình lắp ráp, an toàn cháy nổ và quản lý năng lượng (BMS) trên hạ tầng pin xe điện.
              </p>
            </div>
            
            <div className="relative z-10 pb-24 w-full flex justify-center px-6">
              <button 
                onClick={handleStart}
                className="bg-[#010120] text-white text-[16px] font-[500] rounded-[4px] px-8 py-3 w-full sm:w-auto hover:opacity-90 transition-opacity tracking-[-0.16px]"
              >
                Bắt đầu đánh giá
              </button>
            </div>
          </div>
        )}

        {/* --- QUIZ SCREEN (LIGHT ZONE) --- */}
        {screen === 'quiz' && (
          <div className="flex-1 flex flex-col w-full bg-[#ffffff]">
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col max-w-[800px] mx-auto w-full px-6 pt-[6vh] pb-[140px]">
              
              <div className="mb-6 flex items-center">
                <span className="font-mono text-[11px] font-[500] uppercase tracking-[0.08px] text-black bg-black/[0.04] border border-black/[0.08] px-2 py-1 rounded-[4px]">
                  Câu hỏi {currentIndex + 1} / {questions.length}
                </span>
              </div>

              <h2 className="text-[28px] md:text-[32px] font-[500] leading-[1.15] tracking-[-0.42px] text-black mb-10">
                {currentQ.q}
              </h2>

              <div className="space-y-3">
                {currentQ.options.map((opt, idx) => {
                  const isAnswered = !!answers[currentIndex];
                  const isSelected = answers[currentIndex] === opt;
                  const isCorrect = opt.charAt(0) === currentQ.answer;
                  
                  let optionClasses = "w-full text-left px-5 py-4 rounded-[4px] border text-[16px] font-[400] tracking-[-0.16px] leading-[1.3] flex items-start gap-4 outline-none transition-all min-h-[56px] ";
                  
                  if (!isAnswered) {
                    optionClasses += "bg-white border-black/[0.08] text-black hover:bg-black/[0.02]";
                  } else {
                    optionClasses += "cursor-default ";
                    if (isSelected && isCorrect) {
                      optionClasses += "border-[#bdbbff] bg-[#bdbbff]/10 text-black"; 
                    } else if (isSelected && !isCorrect) {
                      optionClasses += "border-[#fc4c02] bg-[#fc4c02]/10 text-black"; 
                    } else if (!isSelected && isCorrect) {
                      optionClasses += "border-[#bdbbff]/50 text-black bg-transparent"; 
                    } else {
                      optionClasses += "border-black/5 text-black/40 bg-transparent"; 
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionClick(opt)}
                      disabled={isAnswered}
                      className={optionClasses}
                    >
                      <div className="w-6 h-6 shrink-0 flex items-center justify-center mt-[-2px]">
                        <span className="font-mono text-[12px] font-[500]">{['A', 'B', 'C', 'D'][idx]}</span>
                      </div>
                      <span className="flex-1">{opt.substring(3)}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation Callout */}
              {answers[currentIndex] && (
                <div className="mt-8 bg-black/[0.02] border border-black/[0.08] p-5 rounded-[4px] animate-fade-in shadow-together">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-mono text-[11px] font-[500] uppercase tracking-[0.08px] text-[#010120]">
                      Giải thích
                    </span>
                  </div>
                  <p className="text-[15px] text-black/80 font-[400] leading-[1.40] tracking-[-0.16px]">
                    {currentQ.explain}
                  </p>
                </div>
              )}
            </div>

            {/* Sticky Bottom Navigation */}
            <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-black/5 z-30">
              {/* Progress Bar */}
              <div className="w-full h-[2px] bg-black/5">
                <div 
                  className="h-full bg-[#ef2cc1] transition-all duration-500 ease-out" 
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>

              <div className="max-w-[800px] mx-auto px-6 py-4 flex items-center justify-between gap-4">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="flex items-center justify-center text-black/50 hover:text-black disabled:opacity-30 disabled:hover:text-black/50 transition-colors font-[500] text-[15px] h-[40px] tracking-[-0.16px]"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Câu trước</span>
                </button>
                
                <div className="font-mono text-[11px] font-[500] uppercase tracking-[0.08px] text-black/50">
                  {currentIndex + 1} / {questions.length}
                </div>

                <button
                  onClick={currentIndex < questions.length - 1 ? handleNext : handleSubmit}
                  className="flex items-center justify-center rounded-[4px] font-[500] text-[15px] tracking-[-0.16px] transition-all min-h-[40px] px-6 bg-[#010120] text-white hover:opacity-90"
                >
                  <span className={currentIndex < questions.length - 1 ? 'mr-2' : ''}>
                    {currentIndex < questions.length - 1 ? "Tiếp theo" : "Hoàn tất"}
                  </span>
                  {currentIndex < questions.length - 1 && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Bottom Sheet Grid (Modal) */}
            {showGrid && (
              <div 
                className="fixed inset-0 z-50 flex items-end justify-center bg-[#010120]/20 backdrop-blur-sm transition-all"
                onClick={(e) => { if(e.target === e.currentTarget) setShowGrid(false) }}
              >
                <div className="w-full bg-white border-t border-black/10 pb-[calc(24px+env(safe-area-inset-bottom))] animate-slide-up relative max-h-[85vh] flex flex-col shadow-[0_-10px_40px_rgba(1,1,32,0.1)]">
                  
                  <div className="flex items-center justify-between mb-6 max-w-[800px] mx-auto w-full px-6 pt-6 flex-shrink-0">
                    <div>
                      <h3 className="font-mono text-[11px] font-[500] uppercase tracking-[0.08px] text-black mb-1">
                        Danh sách câu hỏi
                      </h3>
                      <p className="font-[400] text-[14px] text-black/50 tracking-[-0.16px]">
                        Đã trả lời {Object.keys(answers).length} / {questions.length}
                      </p>
                    </div>
                    <button 
                      onClick={() => setShowGrid(false)}
                      className="w-8 h-8 flex items-center justify-center text-black/50 hover:bg-black/5 hover:text-black rounded-[4px] transition-colors"
                    >
                      <XIcon className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Scrollable Area */}
                  <div className="overflow-y-auto flex-1 px-6">
                    
                    {/* Legend Banner */}
                    <div className="flex flex-wrap items-center gap-6 justify-center bg-black/[0.02] border border-black/[0.08] p-4 rounded-[4px] mb-8 max-w-[800px] mx-auto text-[14px] text-black/70 tracking-[-0.16px]">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-[2px] border border-black/20 bg-transparent" /> Chưa làm
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-[2px] border border-[#bdbbff] bg-[#bdbbff]/20" /> Đúng
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-[2px] border border-[#fc4c02] bg-[#fc4c02]/20" /> Sai
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-[2px] border border-[#010120] bg-[#010120]" /> Hiện tại
                      </div>
                    </div>

                    {/* Grid Buttons */}
                    <div className="grid grid-cols-5 sm:grid-cols-8 gap-3 max-w-[800px] mx-auto pb-4">
                      {questions.map((q, idx) => {
                        const isAnswered = !!answers[idx];
                        const isCurrent = currentIndex === idx;
                        let isCorrect = false;
                        
                        if (isAnswered) {
                          isCorrect = answers[idx].charAt(0) === q.answer;
                        }

                        let btnClasses = "aspect-square flex items-center justify-center font-mono text-[12px] rounded-[4px] border transition-all relative ";
                        
                        if (!isAnswered) {
                          btnClasses += "border-black/10 bg-transparent text-black/60 hover:bg-black/5 hover:text-black ";
                        } else if (isCorrect) {
                          btnClasses += "border-[#bdbbff] bg-[#bdbbff]/10 text-black ";
                        } else {
                          btnClasses += "border-[#fc4c02] bg-[#fc4c02]/10 text-black ";
                        }

                        if (isCurrent) {
                          btnClasses += "!border-[#010120] !bg-[#010120] !text-white ";
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => {
                              setCurrentIndex(idx);
                              setShowGrid(false);
                            }}
                            className={btnClasses}
                          >
                            {idx + 1}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- RESULT SCREEN (LIGHT ZONE) --- */}
        {screen === 'result' && (
          <div className="flex-1 flex flex-col items-center justify-center pt-[10vh] pb-24 px-6 animate-fade-in w-full max-w-[1000px] mx-auto together-gradient">
            
            <div className="w-full text-center">
              <div className="mb-8">
                <span className="font-mono text-[11px] font-[500] uppercase tracking-[0.08px] text-black bg-black/[0.04] border border-black/[0.08] px-3 py-1 rounded-[4px]">
                  Hoàn tất đánh giá
                </span>
              </div>
              
              <div className="bg-white border border-black/[0.08] rounded-[8px] p-8 md:p-12 shadow-together max-w-[600px] mx-auto">
                <h2 className="font-mono text-[14px] font-[500] uppercase tracking-[0.08px] text-black/50 mb-4">
                  Điểm số của bạn
                </h2>
                
                <div className="flex items-baseline justify-center gap-2 mb-8">
                  <span className="text-[80px] md:text-[100px] font-[500] text-black leading-[1] tracking-[-1.92px]">
                    {score}
                  </span>
                  <span className="text-[32px] md:text-[40px] font-[400] text-black/30 tracking-[-0.8px]">
                    / {questions.length}
                  </span>
                </div>
                
                <p className="text-[16px] font-[400] text-black/70 mb-10 leading-[1.4] tracking-[-0.16px]">
                  {score === questions.length ? "Kết quả xuất sắc. Nền tảng kiến thức hạ tầng AI và xe điện của bạn rất vững chắc." : 
                   score >= questions.length / 2 ? "Kết quả khả quan. Tuy nhiên cần rà soát lại các giao thức an toàn chưa chính xác." : 
                   "Chưa đạt tiêu chuẩn. Vui lòng tham khảo lại tài liệu kỹ thuật."}
                </p>

                <div className="flex flex-col justify-center">
                  <button 
                    onClick={handleRetry}
                    className="bg-[#010120] text-white rounded-[4px] px-8 py-3 text-[16px] font-[500] tracking-[-0.16px] hover:opacity-90 transition-opacity flex items-center justify-center gap-2 w-full sm:w-auto mx-auto"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Thực hiện lại
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Inline CSS định nghĩa các phong cách cốt lõi của Together AI
const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    /* Using Inter to approximate "The Future" with heavy letter-spacing applied via Tailwind classes */
    --font-future: 'Inter', -apple-system, system-ui, sans-serif;
    /* Using JetBrains Mono to approximate "PP Neue Montreal Mono" */
    --font-mono: 'JetBrains Mono', ui-monospace, monospace;
  }

  .font-future { font-family: var(--font-future); }
  .font-mono { font-family: var(--font-mono); }

  /* Pastel Cloud Gradient Background for Light Zones */
  .together-gradient {
    background-color: #ffffff;
    background-image: 
      radial-gradient(circle at 15% 10%, rgba(239, 44, 193, 0.08) 0%, transparent 40%), 
      radial-gradient(circle at 85% 20%, rgba(189, 187, 255, 0.15) 0%, transparent 40%),
      radial-gradient(circle at 50% 80%, rgba(252, 76, 2, 0.06) 0%, transparent 50%);
  }

  /* Distinctive tinted shadow */
  .shadow-together {
    box-shadow: rgba(1, 1, 32, 0.1) 0px 4px 10px;
  }

  /* Custom Animations */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }

  .animate-fade-in {
    animation: fadeIn 0.4s ease-out forwards;
  }

  .animate-slide-up {
    animation: slideUp 0.3s ease-out forwards;
  }

  /* Clean minimal scrollbar */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(128, 128, 128, 0.3);
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(128, 128, 128, 0.5);
  }
`;
