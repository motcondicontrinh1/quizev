import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Check, X as XIcon, RotateCcw, Menu, Info, MessageSquare } from 'lucide-react';

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
    fetch('https://res.cloudinary.com/dfeujdemv/raw/upload/v1775540411/battery-assembly-quiz_t7r6wu.json')
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

  const handleStart = () => setScreen('quiz');

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
  };

  const handleRetry = () => {
    setAnswers({});
    setCurrentIndex(0);
    setScore(0);
    setScreen('start');
  };

  // Render Loader
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] flex flex-col items-center justify-center font-tesla">
        <style dangerouslySetInnerHTML={{ __html: customStyles }} />
        <div className="w-8 h-8 border-[3px] border-[#EEEEEE] border-t-[#3E6AE1] rounded-full animate-spin mb-4" />
      </div>
    );
  }

  return (
    <div className="min-h-screen font-tesla bg-[#FFFFFF] text-[#171A20] selection:bg-[#3E6AE1] selection:text-white">
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      
      {/* Navigation Bar - Frosted Glass */}
      <header className="fixed top-0 w-full z-40 flex items-center justify-between px-6 py-4 bg-[rgba(255,255,255,0.85)] backdrop-blur-lg transition-tesla">
        <div className="flex items-center">
          <span className="text-[15px] font-[500] tracking-[0.1em] text-[#171A20] uppercase">
            Module Đánh Giá
          </span>
        </div>
        
        {screen === 'quiz' && (
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={() => setShowGrid(true)}
              className="flex items-center gap-2 bg-transparent px-3 sm:px-4 py-1 h-[32px] rounded-[4px] text-[14px] font-[500] text-[#171A20] hover:bg-[#F4F4F4] transition-tesla"
            >
              <span className="hidden sm:inline">Danh sách câu hỏi</span>
              <Menu className="w-4 h-4 sm:hidden" />
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center justify-center bg-[#3E6AE1] text-[#FFFFFF] px-4 py-1 h-[32px] rounded-[4px] text-[14px] font-[500] hover:bg-[#3258B8] transition-tesla border-[2px] border-transparent focus:border-[#3E6AE1]/30 focus:shadow-[inset_0_0_0_2px_#3E6AE1]"
            >
              Nộp bài
            </button>
          </div>
        )}
      </header>

      <main className={`w-full flex flex-col min-h-screen ${screen === 'start' ? 'pt-0' : 'pt-[60px]'}`}>
        {/* --- START SCREEN --- */}
        {screen === 'start' && (
          <div className="relative flex-1 flex flex-col items-center justify-center text-center w-full min-h-screen">
            {/* Cinematic Photography Background */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=2000" 
                alt="Tesla Cinematic Hero" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>

            <div className="relative z-10 flex-1 flex flex-col justify-center items-center w-full px-6 mt-[60px] max-w-[800px] mx-auto">
              <h1 className="text-[40px] font-[500] text-[#FFFFFF] leading-[1.2] mb-4">
                Lắp Ráp Pin Xe Điện
              </h1>
              <p className="text-[14px] font-[400] text-[#FFFFFF] mb-10 max-w-[600px] leading-[1.43]">
                Bài đánh giá kiến thức chuyên môn về quy trình lắp ráp, an toàn cháy nổ và quản lý năng lượng (BMS) trên khối pin xe điện. Hãy chọn phương án chính xác nhất.
              </p>
            </div>
            
            <div className="relative z-10 pb-24 w-full flex flex-col sm:flex-row justify-center gap-4 px-6">
              <button 
                onClick={handleStart}
                className="bg-[#3E6AE1] text-[#FFFFFF] text-[14px] font-[500] rounded-[4px] min-h-[40px] w-full sm:w-[260px] hover:bg-[#3258B8] transition-tesla border-[3px] border-transparent focus:border-[#3E6AE1]/30 focus:shadow-[inset_0_0_0_2px_#3E6AE1]"
              >
                Bắt đầu
              </button>
            </div>
          </div>
        )}

        {/* --- QUIZ SCREEN --- */}
        {screen === 'quiz' && (
          <div className="flex-1 flex flex-col w-full">
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col max-w-[800px] mx-auto w-full px-6 pt-[10vh] pb-[120px]">
              <h2 className="text-[28px] md:text-[32px] font-[500] leading-[1.2] text-[#171A20] mb-10">
                {currentQ.q}
              </h2>

              <div className="space-y-4">
                {currentQ.options.map((opt, idx) => {
                  const isAnswered = !!answers[currentIndex];
                  const isSelected = answers[currentIndex] === opt;
                  const isCorrect = opt.charAt(0) === currentQ.answer;
                  
                  let optionClasses = "w-full text-left px-5 py-4 rounded-[4px] border text-[14px] font-[400] leading-[1.43] flex items-start gap-4 outline-none transition-tesla min-h-[56px] ";
                  
                  // Áp dụng màu semantic (Đúng/Sai) để đồng bộ với bản thiết kế Legend mới
                  if (!isAnswered) {
                    optionClasses += "bg-[#FFFFFF] border-[#D0D1D2] text-[#393C41] hover:bg-[#F4F4F4]";
                  } else {
                    optionClasses += "cursor-default ";
                    if (isSelected && isCorrect) {
                      optionClasses += "border-[#34C759] bg-[#F4F4F4] text-[#171A20]"; // Highlighted correct (Green)
                    } else if (isSelected && !isCorrect) {
                      optionClasses += "border-[#FF3B30] bg-[#F4F4F4] text-[#171A20]"; // Highlighted wrong (Red)
                    } else if (!isSelected && isCorrect) {
                      optionClasses += "border-[#34C759] text-[#171A20] bg-[#FFFFFF]"; // Show correct answer quietly
                    } else {
                      optionClasses += "border-[#EEEEEE] text-[#8E8E8E] bg-[#FFFFFF]"; // Muted wrong answer
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionClick(opt)}
                      disabled={isAnswered}
                      className={optionClasses}
                    >
                      <div className="w-5 h-5 shrink-0 flex items-center justify-center mt-0.5">
                        {isAnswered && isSelected && isCorrect ? (
                          <Check className="w-5 h-5 text-[#34C759]" />
                        ) : isAnswered && isSelected && !isCorrect ? (
                          <XIcon className="w-5 h-5 text-[#FF3B30]" />
                        ) : isAnswered && !isSelected && isCorrect ? (
                          <Check className="w-5 h-5 text-[#34C759]" />
                        ) : (
                          <span className="text-[14px] font-[500]">{['A', 'B', 'C', 'D'][idx]}</span>
                        )}
                      </div>
                      <span className="flex-1 pt-[1px]">{opt.substring(3)}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation Callout */}
              {answers[currentIndex] && (
                <div className="mt-8 bg-[#F4F4F4] p-5 rounded-[4px] animate-fade-in">
                  <div className="flex items-center gap-3 mb-3">
                    <Info className="w-5 h-5 text-[#5C5E62]" />
                    <span className="text-[15px] font-[500] text-[#171A20]">Giải thích</span>
                  </div>
                  <p className="text-[14px] text-[#5C5E62] font-[400] leading-[1.5] pl-8">
                    {currentQ.explain}
                  </p>
                </div>
              )}
            </div>

            {/* Sticky Bottom Navigation - Unified Footer */}
            <div className="fixed bottom-0 left-0 w-full bg-[#FFFFFF] border-t border-[#EEEEEE] z-30">
              {/* Subtle Progress Bar */}
              <div className="w-full h-[2px] bg-[#F4F4F4]">
                <div 
                  className="h-full bg-[#171A20] transition-all duration-[330ms] ease-[cubic-bezier(0.5,0,0,0.75)]" 
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>

              <div className="max-w-[800px] mx-auto px-6 py-4 flex items-center justify-between gap-4">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="flex items-center justify-center text-[#5C5E62] hover:text-[#171A20] disabled:opacity-30 disabled:hover:text-[#5C5E62] transition-tesla font-[500] text-[14px] h-[40px] px-2"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Câu trước</span>
                </button>
                
                <div className="text-[14px] font-[500] text-[#8E8E8E]">
                  {currentIndex + 1} / {questions.length}
                </div>

                <button
                  onClick={currentIndex < questions.length - 1 ? handleNext : handleSubmit}
                  className={`flex items-center justify-center rounded-[4px] font-[500] text-[14px] transition-tesla min-h-[40px] px-6 border-[3px] border-transparent focus:shadow-[inset_0_0_0_2px_#3E6AE1]
                    ${currentIndex < questions.length - 1 
                      ? 'bg-[#F4F4F4] text-[#171A20] hover:bg-[#EAEAEA]' 
                      : 'bg-[#3E6AE1] text-[#FFFFFF] hover:bg-[#3258B8]'}`}
                >
                  <span className={currentIndex < questions.length - 1 ? 'mr-2' : ''}>
                    {currentIndex < questions.length - 1 ? "Tiếp theo" : "Hoàn tất"}
                  </span>
                  {currentIndex < questions.length - 1 && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Bottom Sheet Grid (Modal) - Flat, no shadow, overlay opacity */}
            {showGrid && (
              <div 
                className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(128,128,128,0.65)] transition-tesla"
                onClick={(e) => { if(e.target === e.currentTarget) setShowGrid(false) }}
              >
                <div className="w-full bg-[#FFFFFF] pb-[calc(24px+env(safe-area-inset-bottom))] animate-slide-up relative max-h-[85vh] flex flex-col">
                  
                  <div className="flex items-center justify-between mb-6 max-w-[800px] mx-auto w-full px-6 pt-6 flex-shrink-0">
                    <div>
                      <h3 className="font-[500] text-[17px] text-[#171A20] mb-1">
                        Danh sách câu hỏi
                      </h3>
                      <p className="font-[400] text-[14px] text-[#5C5E62]">
                        Đã trả lời {Object.keys(answers).length} / {questions.length}
                      </p>
                    </div>
                    <button 
                      onClick={() => setShowGrid(false)}
                      className="w-8 h-8 flex items-center justify-center text-[#5C5E62] hover:bg-[#F4F4F4] rounded-[4px] transition-tesla"
                    >
                      <XIcon className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Scrollable Area */}
                  <div className="overflow-y-auto flex-1 px-6">
                    
                    {/* Legend Banner (Chú giải) */}
                    <div className="flex flex-wrap items-center gap-6 justify-center bg-[#F4F4F4] p-4 rounded-[4px] mb-8 max-w-[800px] mx-auto text-[14px] text-[#393C41]">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-[3px] border border-[#D0D1D2] bg-[#FFFFFF]" /> Chưa làm
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-[3px] border border-[#34C759] bg-[#FFFFFF]" /> Đúng
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-[3px] border border-[#FF3B30] bg-[#FFFFFF]" /> Sai
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-[3px] border border-[#3E6AE1] bg-[#FFFFFF]" /> Hiện tại
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

                        let btnClasses = "aspect-square flex items-center justify-center font-[500] text-[14px] rounded-[4px] border transition-tesla relative ";
                        
                        if (!isAnswered) {
                          btnClasses += "border-[#D0D1D2] bg-[#FFFFFF] text-[#393C41] hover:bg-[#F4F4F4] ";
                        } else if (isCorrect) {
                          btnClasses += "border-[#34C759] bg-[#FFFFFF] text-[#34C759] ";
                        } else {
                          btnClasses += "border-[#FF3B30] bg-[#FFFFFF] text-[#FF3B30] ";
                        }

                        if (isCurrent) {
                          btnClasses += "!border-[#3E6AE1] ring-1 ring-offset-2 ring-[#3E6AE1] ";
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

        {/* --- RESULT SCREEN --- */}
        {screen === 'result' && (
          <div className="flex-1 flex flex-col items-center justify-center pt-[10vh] pb-24 px-6 animate-fade-in w-full max-w-[800px] mx-auto">
            
            <div className="w-full text-center">
              <h2 className="text-[40px] font-[500] text-[#171A20] leading-[1.2] mb-2">
                Kết Quả
              </h2>
              
              <div className="flex items-baseline justify-center gap-2 mt-8 mb-4">
                <span className="text-[72px] font-[500] text-[#171A20] leading-[1]">
                  {score}
                </span>
                <span className="text-[24px] font-[400] text-[#8E8E8E]">
                  / {questions.length}
                </span>
              </div>
              
              <p className="text-[14px] font-[400] text-[#393C41] mb-12 max-w-[400px] mx-auto">
                {score === questions.length ? "Tuyệt vời. Bạn đã nắm vững toàn bộ quy trình lắp ráp và an toàn." : 
                 score >= questions.length / 2 ? "Kết quả tốt. Vui lòng xem lại các câu hỏi chưa chính xác để củng cố kiến thức." : 
                 "Chưa đạt yêu cầu. Bạn cần xem lại tài liệu kỹ thuật về pin xe điện."}
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button 
                  onClick={handleRetry}
                  className="bg-[#FFFFFF] text-[#171A20] border border-[#D0D1D2] rounded-[4px] min-h-[40px] px-8 text-[14px] font-[500] hover:bg-[#F4F4F4] transition-tesla flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Làm lại
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Persistent Chatbot Button (Optional structural element) */}
      <div className="fixed bottom-6 right-6 z-40 hidden md:flex">
        <button className="bg-[#FFFFFF] border border-[#D0D1D2] rounded-full p-3 text-[#5C5E62] hover:bg-[#F4F4F4] transition-tesla">
          <MessageSquare className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
}

// Inline CSS định nghĩa các phong cách cốt lõi: không shadow, timing chuẩn 0.33s cubic-bezier
const customStyles = `
  /* Fallback cho Universal Sans (sử dụng system font để đảm bảo sự tối giản và hình học) */
  :root {
    --font-tesla: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  }

  .font-tesla {
    font-family: var(--font-tesla);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Universal Timing 0.33s cho tất cả tương tác */
  .transition-tesla {
    transition: all 0.33s cubic-bezier(0.5, 0, 0, 0.75);
  }

  /* Custom Animations */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }

  .animate-fade-in {
    animation: fadeIn 0.33s cubic-bezier(0.5, 0, 0, 0.75) forwards;
  }

  .animate-slide-up {
    animation: slideUp 0.33s cubic-bezier(0.5, 0, 0, 0.75) forwards;
  }

  /* Tắt thanh cuộn để giữ UI sạch sẽ (Minimal Scrollbar) */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: #D0D1D2;
    border-radius: 3px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #8E8E8E;
  }
`;
