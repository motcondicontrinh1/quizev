import React, { useState, useEffect } from "react";
import {
  Play,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Terminal,
  Zap,
  Menu,
  X,
} from "lucide-react";

// Dữ liệu dự phòng trường hợp không gọi được API
const fallbackData = [
  {
    id: 1,
    q: "Chức năng chính của BMS (Battery Management System) trong khối pin là gì?",
    options: [
      "A. Tăng dung lượng pin",
      "B. Giám sát và bảo vệ pin khỏi quá nhiệt, quá dòng",
      "C. Giảm trọng lượng khối pin",
      "D. Tăng tốc độ sạc gấp đôi",
    ],
    answer: "B",
    explain:
      "BMS chịu trách nhiệm giám sát các thông số (điện áp, dòng điện, nhiệt độ) và bảo vệ các cell pin để đảm bảo an toàn, ngăn chặn cháy nổ.",
  },
  {
    id: 2,
    q: "Nhiệt độ môi trường lý tưởng nhất để bảo quản cell pin Lithium-ion là bao nhiêu?",
    options: [
      "A. -10°C đến 0°C",
      "B. 15°C đến 25°C",
      "C. 35°C đến 45°C",
      "D. 50°C đến 60°C",
    ],
    answer: "B",
    explain:
      "Pin Lithium-ion hoạt động và bảo quản tốt nhất ở nhiệt độ phòng (khoảng 15-25°C). Nhiệt độ quá cao gây lão hóa nhanh, quá thấp làm giảm hiệu suất.",
  },
  {
    id: 3,
    q: "Khi hàn điểm (spot welding) các cell pin, yếu tố nào cần được kiểm soát chặt chẽ nhất?",
    options: [
      "A. Ánh sáng trong phòng",
      "B. Thời gian và dòng điện hàn",
      "C. Màu sắc của dải niken",
      "D. Độ ồn của máy hàn",
    ],
    answer: "B",
    explain:
      "Thời gian và dòng điện (công suất hàn) cần được tính toán kỹ. Quá thấp sẽ không dính, quá cao có thể xuyên thủng màng bảo vệ cell pin.",
  },
];

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState("start"); // start, quiz, result
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showGrid, setShowGrid] = useState(false);

  // Fetch dữ liệu từ API
  useEffect(() => {
    fetch(
      "https://res.cloudinary.com/dfeujdemv/raw/upload/v1775550377/data_abstnt.json",
    )
      .then((res) => res.json())
      .then((data) => {
        // Validation dữ liệu
        if (data && data.length > 0) {
          setQuestions(data);
        } else {
          setQuestions(fallbackData);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch failed, using fallback.", err);
        setQuestions(fallbackData);
        setLoading(false);
      });
  }, []);

  const currentQ = questions[currentIndex];
  const progressPercent =
    questions.length > 0
      ? (Object.keys(answers).length / questions.length) * 100
      : 0;

  const handleStart = () => setScreen("quiz");

  const handleOptionClick = (option) => {
    // Nếu đã trả lời rồi thì vô hiệu hoá
    if (answers[currentIndex]) return;

    const isCorrect = option.charAt(0) === currentQ.answer;

    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: option,
    }));

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    setScreen("result");
  };

  const handleRetry = () => {
    setAnswers({});
    setCurrentIndex(0);
    setScore(0);
    setScreen("start");
  };

  // Render Loader
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col items-center justify-center font-mono">
        <style
          dangerouslySetInnerHTML={{ __html: customStyles }}
        />
        <Terminal className="w-10 h-10 text-[#00ffff] animate-pulse mb-4" />
        <p className="text-[14px] text-white/50 uppercase tracking-widest">
          Đang thiết lập trạm...
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#0f0f0f] text-white relative overflow-hidden selection:bg-[#00ffff] selection:text-black">
      <style
        dangerouslySetInnerHTML={{ __html: customStyles }}
      />

      {/* Bioluminescent Background Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#00ffff] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-[#0007cd] opacity-[0.05] blur-[120px] rounded-full pointer-events-none" />

      <main className="h-full w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12 relative z-10 flex flex-col overflow-y-auto">
        {/* Navigation Bar */}
        <header className="flex items-center justify-between border-b border-white/[0.08] pb-4 sm:pb-6 mb-6 sm:mb-8 md:mb-10 flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-black border border-white/[0.12] rounded flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,255,255,0.15)]">
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00ffff]" />
            </div>
            <span className="font-mono text-[12px] sm:text-[14px] uppercase tracking-[0.5px] font-bold text-white/90 hidden sm:inline">
              COMPOSIO_ASSESS
            </span>
          </div>
          {screen === "quiz" && (
            <div className="flex items-center gap-3 md:gap-4">
              <button
                onClick={() => setShowGrid(true)}
                className="flex items-center gap-2 border border-white/[0.1] bg-[#000000] px-3 py-1.5 rounded-[2px] font-mono text-[12px] text-white/70 hover:text-white hover:border-[#00ffff]/50 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]"
              >
                <Menu className="w-4 h-4" />
                <span className="hidden sm:inline">
                  DANH SÁCH CÂU HỎI
                </span>
              </button>
              <button
                onClick={handleSubmit}
                className="bg-[#00ffff]/10 border border-[#00ffff]/30 text-[#00ffff] px-4 py-1.5 rounded-[2px] text-[12px] font-mono hover:bg-[#00ffff]/20 transition-all uppercase tracking-[0.5px] shadow-[2px_2px_0px_0px_rgba(0,255,255,0.1)]"
              >
                NỘP BÀI
              </button>
            </div>
          )}
        </header>

        {/* --- START SCREEN --- */}
        {screen === "start" && (
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-[800px] mx-auto w-full px-4">
            <span className="font-mono text-[10px] sm:text-[12px] uppercase tracking-[1px] text-[#00ffff] bg-[#00ffff]/10 px-3 py-1 border border-[#00ffff]/20 rounded-sm mb-6 sm:mb-8 inline-flex">
              Version 1.0.4 • System Ready
            </span>
            <h1 className="text-[36px] sm:text-[48px] md:text-[64px] lg:text-[80px] font-sans font-normal leading-[0.9] tracking-[-0.03em] mb-6 sm:mb-8 drop-shadow-lg">
              Trạm Đánh Giá <br /> Năng Lực Cốt Lõi
            </h1>
            <p className="text-[14px] sm:text-[16px] md:text-[18px] text-white/60 mb-8 sm:mb-12 leading-[1.6] max-w-[600px] font-sans px-2">
              Hệ thống kiểm tra trình độ chuyên viên lắp ráp
              cell pin. Mỗi module yêu cầu sự chính xác tuyệt
              đối. Dữ liệu sẽ được khóa sau mỗi quyết định.
            </p>
            <button
              onClick={handleStart}
              className="group relative bg-white text-[#111] px-6 sm:px-8 py-3 sm:py-4 text-[14px] sm:text-[16px] font-sans font-medium hover:bg-white/90 transition-all flex items-center gap-2 sm:gap-3 active:scale-[0.98]"
            >
              BẮT ĐẦU KIỂM TRA
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              {/* Brutalist Shadow Effect on Button */}
              <div className="absolute inset-0 border border-white/20 translate-x-[4px] translate-y-[4px] -z-10 group-hover:translate-x-[6px] group-hover:translate-y-[6px] transition-all" />
            </button>
          </div>
        )}

        {/* --- QUIZ SCREEN --- */}
        {screen === "quiz" && (
          <div className="flex-1 flex flex-col max-w-[800px] mx-auto w-full pb-24 sm:pb-28 min-h-0">
            {/* Question Area */}
            <div className="bg-[#000000] border border-white/[0.10] rounded-[4px] p-4 sm:p-6 md:p-8 lg:p-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] flex flex-col relative z-10 flex-1 min-h-0 overflow-y-auto">
              {/* Accent line */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#0007cd] via-[#00ffff] to-transparent opacity-50" />

              <div className="mb-6 sm:mb-8 flex-shrink-0">
                <span className="font-mono text-[10px] sm:text-[12px] uppercase tracking-[0.5px] text-white/40 block mb-3 sm:mb-4">
                  [ RECORD_
                  {String(currentIndex + 1).padStart(3, "0")} ]
                </span>
                <h2 className="text-[16px] sm:text-[20px] md:text-[24px] lg:text-[28px] font-sans leading-[1.4] text-white">
                  {currentQ.q}
                </h2>
              </div>

              <div className="space-y-2.5 sm:space-y-3 flex-shrink-0">
                {currentQ.options.map((opt, idx) => {
                  const isAnswered = !!answers[currentIndex];
                  const isSelected =
                    answers[currentIndex] === opt;
                  const isCorrect =
                    opt.charAt(0) === currentQ.answer;

                  // Logic tính toán CSS classes cho Options
                  let optionClasses =
                    "w-full text-left p-3 sm:p-4 md:p-5 rounded-[2px] border font-sans text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] leading-[1.5] transition-all relative overflow-hidden ";

                  if (!isAnswered) {
                    optionClasses +=
                      "bg-transparent border-white/[0.10] text-white/70 hover:border-[#0089ff] hover:text-white hover:bg-white/[0.02]";
                  } else {
                    optionClasses += "cursor-default ";
                    if (isSelected && isCorrect) {
                      optionClasses +=
                        "border-[#00ffcc] bg-[#00ffcc]/[0.08] text-[#00ffcc] shadow-[0_0_15px_rgba(0,255,204,0.1)]";
                    } else if (isSelected && !isCorrect) {
                      optionClasses +=
                        "border-[#ff003c] bg-[#ff003c]/[0.08] text-[#ff003c]";
                    } else if (!isSelected && isCorrect) {
                      optionClasses +=
                        "border-[#00ffcc]/40 text-[#00ffcc]/80 bg-transparent";
                    } else {
                      optionClasses +=
                        "border-white/[0.04] text-white/20 bg-transparent";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionClick(opt)}
                      disabled={isAnswered}
                      className={optionClasses}
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        <span className="font-mono text-[12px] sm:text-[13px] md:text-[14px] mt-0.5 opacity-60">
                          {["01", "02", "03", "04"][idx]}
                        </span>
                        <span className="flex-1">{opt}</span>

                        {/* Icons validation */}
                        {isAnswered &&
                          isSelected &&
                          isCorrect && (
                            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#00ffcc] shrink-0 mt-0.5" />
                          )}
                        {isAnswered &&
                          isSelected &&
                          !isCorrect && (
                            <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#ff003c] shrink-0 mt-0.5" />
                          )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Explanation Box (Terminal Aesthetic) */}
              {answers[currentIndex] && (
                <div className="mt-6 sm:mt-8 border border-[#0089ff]/30 bg-[#0089ff]/[0.03] p-4 sm:p-5 rounded-[2px] animate-fade-in flex-shrink-0">
                  <div className="flex items-center gap-2 mb-2 font-mono text-[10px] sm:text-[11px] md:text-[12px] text-[#0089ff] uppercase">
                    <Terminal className="w-3 h-3" />{" "}
                    System_Output / Lý giải
                  </div>
                  <p className="font-sans text-[13px] sm:text-[14px] md:text-[15px] text-white/80 leading-[1.6]">
                    {currentQ.explain}
                  </p>
                </div>
              )}
            </div>

            {/* Navigation Footer (Sticky Bottom) */}
            <div className="fixed bottom-0 left-0 w-full bg-[#0f0f0f]/90 backdrop-blur-md border-t border-white/[0.08] p-4 md:p-6 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
              <div className="max-w-[800px] mx-auto flex items-center justify-between gap-3 md:gap-6">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="flex items-center justify-center w-12 h-12 md:w-auto md:px-6 md:py-3 border border-white/[0.1] bg-black text-white rounded-[2px] hover:border-white/40 disabled:opacity-30 disabled:hover:border-white/[0.1] transition-all font-sans uppercase tracking-[0.5px] text-[14px] shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] disabled:shadow-none"
                >
                  <ArrowLeft className="w-5 h-5 md:w-4 md:h-4 md:mr-2" />
                  <span className="hidden md:inline">
                    CÂU TRƯỚC
                  </span>
                </button>

                {/* Progress Indicator */}
                <div className="flex-1 flex flex-col items-center justify-center px-2">
                  <div className="font-mono text-[11px] md:text-[12px] text-[#00ffff]/80 mb-2 uppercase tracking-widest hidden md:block">
                    TIẾN ĐỘ: {currentIndex + 1} /{" "}
                    {questions.length}
                  </div>
                  <div className="font-mono text-[11px] text-[#00ffff]/80 mb-1.5 uppercase tracking-widest md:hidden">
                    {currentIndex + 1} / {questions.length}
                  </div>
                  <div className="w-full max-w-[300px] h-[3px] bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#00ffff] transition-all duration-300 shadow-[0_0_10px_rgba(0,255,255,0.5)]"
                      style={{
                        width: `${((currentIndex + 1) / questions.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <button
                  onClick={
                    currentIndex < questions.length - 1
                      ? handleNext
                      : handleSubmit
                  }
                  className="flex items-center justify-center w-12 h-12 md:w-auto md:px-6 md:py-3 border border-[#0089ff] bg-[#0089ff]/10 text-[#00ffff] rounded-[2px] hover:bg-[#0089ff]/20 transition-all font-sans uppercase tracking-[0.5px] text-[14px] shrink-0 shadow-[2px_2px_0px_0px_rgba(0,137,255,0.2)]"
                >
                  <span className="hidden md:inline mr-2">
                    {currentIndex < questions.length - 1
                      ? "TIẾP THEO"
                      : "NỘP BÀI"}
                  </span>
                  {currentIndex < questions.length - 1 ? (
                    <ArrowRight className="w-5 h-5 md:w-4 md:h-4" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 md:w-4 md:h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Bottom Sheet Modal for Jump-to Grid */}
            {showGrid && (
              <div
                className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm transition-opacity"
                onClick={(e) => {
                  if (e.target === e.currentTarget)
                    setShowGrid(false);
                }}
              >
                <div className="w-full max-w-[800px] bg-[#000000] border-t border-l border-r border-white/[0.12] rounded-t-[12px] animate-slide-up shadow-[0_-8px_40px_rgba(0,0,0,0.8)] relative max-h-[85vh] flex flex-col">
                  {/* Handle for drag indicator aesthetic */}
                  <div
                    className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mt-4 mb-4 cursor-pointer hover:bg-white/30 transition-colors flex-shrink-0"
                    onClick={() => setShowGrid(false)}
                  />

                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/[0.08] px-6 flex-shrink-0">
                    <div>
                      <h3 className="font-mono text-[14px] text-white/90 uppercase tracking-[1px] mb-1">
                        BẢN ĐỒ DỮ LIỆU
                      </h3>
                      <p className="font-sans text-[13px] text-white/40">
                        {Object.keys(answers).length}/
                        {questions.length} MODULE ĐÃ HOÀN THÀNH
                      </p>
                    </div>
                    <button
                      onClick={() => setShowGrid(false)}
                      className="w-8 h-8 flex items-center justify-center rounded-[2px] border border-white/[0.1] text-white/50 hover:text-white hover:bg-white/[0.05] transition-colors bg-transparent"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Scrollable content area */}
                  <div className="overflow-y-auto flex-1 px-6">
                    {/* Grid */}
                    <div className="grid grid-cols-5 sm:grid-cols-8 gap-3 md:gap-4 mb-6">
                      {questions.map((q, idx) => {
                        const isAnswered = !!answers[idx];
                        const isCurrent = currentIndex === idx;
                        let isCorrect = false;

                        if (isAnswered) {
                          isCorrect =
                            answers[idx].charAt(0) === q.answer;
                        }

                        let btnClasses =
                          "aspect-square flex items-center justify-center font-mono text-[14px] md:text-[16px] rounded-[2px] border transition-all relative ";

                        if (!isAnswered) {
                          btnClasses +=
                            "border-white/[0.1] text-white/40 hover:border-white/30 hover:text-white/80 ";
                        } else if (isCorrect) {
                          btnClasses +=
                            "border-[#00ffcc]/30 bg-[#00ffcc]/10 text-[#00ffcc] shadow-[inset_0_0_10px_rgba(0,255,204,0.05)] ";
                        } else {
                          btnClasses +=
                            "border-[#ff003c]/30 bg-[#ff003c]/10 text-[#ff003c] shadow-[inset_0_0_10px_rgba(255,0,60,0.05)] ";
                        }

                        if (isCurrent) {
                          btnClasses +=
                            "!border-[#00ffff] !text-[#00ffff] shadow-[0_0_15px_rgba(0,255,255,0.2)] bg-[#00ffff]/5 outline outline-1 outline-offset-2 outline-[#00ffff]/50 ";
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

                    {/* Legend */}
                    <div className="flex flex-wrap items-center gap-6 font-sans text-[13px] text-white/50 justify-center bg-white/[0.02] p-4 rounded-[4px] border border-white/[0.04] mb-6">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-[2px] border border-white/[0.1] bg-black" />{" "}
                        Chưa làm
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-[2px] border border-[#00ffcc]/30 bg-[#00ffcc]/10" />{" "}
                        Đạt chuẩn
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-[2px] border border-[#ff003c]/30 bg-[#ff003c]/10" />{" "}
                        Cảnh báo lỗi
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- RESULT SCREEN --- */}
        {screen === "result" && (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in w-full max-w-[600px] mx-auto px-4">
            <div className="w-full bg-[#000000] border border-white/[0.12] p-6 sm:p-8 md:p-10 lg:p-14 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] rounded-[4px] relative overflow-hidden">
              {/* Glow overlay */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00ffff] to-transparent opacity-50" />

              <p className="font-mono text-[11px] sm:text-[12px] md:text-[14px] uppercase tracking-[1.5px] sm:tracking-[2px] text-white/50 mb-4 sm:mb-6">
                ĐÁNH GIÁ HOÀN TẤT
              </p>

              <div className="flex items-baseline justify-center gap-2 mb-4">
                <span className="font-mono text-[56px] sm:text-[72px] md:text-[88px] lg:text-[100px] leading-[1] text-white font-normal tracking-tighter">
                  {score}
                </span>
                <span className="font-mono text-[24px] sm:text-[28px] md:text-[36px] lg:text-[40px] text-white/30">
                  / {questions.length}
                </span>
              </div>

              <h2 className="text-[15px] sm:text-[18px] md:text-[20px] lg:text-[24px] font-sans font-medium text-[#00ffff] mb-6 sm:mb-8 px-2">
                {score === questions.length
                  ? "XUẤT SẮC - HỆ THỐNG ĐỒNG BỘ"
                  : score >= questions.length / 2
                    ? "ĐẠT YÊU CẦU - CẦN TỐI ƯU THÊM"
                    : "KHÔNG ĐẠT - YÊU CẦU ĐÀO TẠO LẠI"}
              </h2>

              <div className="w-full h-[1px] bg-white/[0.08] mb-6 sm:mb-8" />

              <button
                onClick={handleRetry}
                className="group w-full md:w-auto mx-auto border border-[#2c2c2c] bg-transparent text-white hover:border-[#0089ff] px-6 sm:px-8 py-2.5 sm:py-3 flex items-center justify-center gap-2 sm:gap-3 transition-colors font-sans text-[13px] sm:text-[14px] md:text-[15px] uppercase tracking-[0.5px]"
              >
                <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-rotate-90 transition-transform duration-300" />
                KHỞI ĐỘNG LẠI MODULE
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer Ambient Fade */}
      <div className="fixed bottom-0 left-0 w-full h-[20vh] bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/80 to-transparent pointer-events-none z-0" />
    </div>
  );
}

// Inline CSS tuân thủ chặt chẽ theo DESIGN.md
const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap');

  :root {
    --font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    --font-sans: 'abcDiatype', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  }

  .font-mono {
    font-family: var(--font-mono);
  }

  .font-sans {
    font-family: var(--font-sans);
  }

  /* Custom Animations */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideUp {
    from { transform: translateY(100%); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  .animate-fade-in {
    animation: fadeIn 0.4s ease-out forwards;
  }

  .animate-slide-up {
    animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  /* Scrollbar Aesthetics */
  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    background: #0f0f0f;
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.12);
    border-radius: 2px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;