import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Play, 
  RotateCcw, 
  Flame, 
  Binary,
  Layers,
  Sparkles,
  Zap,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QUIZ_DATA = [
  { q: "Dữ liệu là gì?", a: ["Thông tin đã được xử lý", "Các ký hiệu, số liệu, hoặc văn bản chưa được xử lý", "Kết quả cuối cùng của một quá trình", "Tư liệu đã được phân tích"], c: 1 },
  { q: "Thông tin được định nghĩa là:", a: ["Dữ liệu chưa được sắp xếp", "Dữ liệu đã được xử lý, có nghĩa", "Một tập hợp các hóa đơn", "Một loại dữ liệu thô"], c: 1 },
  { q: "Quy trình xử lý thông tin của máy tính bắt đầu bằng:", a: ["Phân tích thông tin", "Nhận dữ liệu", "Đưa ra kết quả", "Lưu trữ thông tin"], c: 1 },
  { q: "Trong tháp dữ liệu, cấp độ dưới cùng là:", a: ["Thông tin", "Tri thức", "Dữ liệu", "Kinh nghiệm"], c: 2 },
  { q: "Cấp độ tiếp theo sau dữ liệu trong tháp là:", a: ["Thông tin", "Tri thức", "Dữ liệu chưa được xử lý", "Tài liệu"], c: 0 },
  { q: "Tri thức được hình thành từ:", a: ["Dữ liệu", "Thông tin", "Cả A và B", "Các tài liệu khoa học"], c: 2 },
  { q: "Khi dữ liệu được xử lý, nó thường được:", a: ["Xóa bỏ", "Tập hợp lại", "Thay đổi dạng", "Chuyển đổi sang dạng số"], c: 2 },
  { q: "Phương pháp nào không phải là quy trình xử lý thông tin?", a: ["Ghi nhận dữ liệu", "Phân tích và xử lý dữ liệu", "Lưu trữ dữ liệu", "Dựa vào cảm xúc"], c: 3 },
  { q: "Tháp dữ liệu - thông tin - tri thức được sử dụng để mô tả:", a: ["Các yếu tố khoa học", "Mối quan hệ giữa dữ liệu, thông tin và tri thức", "Các quy trình trong công nghệ thông tin", "Cách học tập hiệu quả"], c: 1 },
  { q: "Một trong những công cụ cải thiện độ chính xác của dữ liệu là:", a: ["Dữ liệu lớn", "Biểu đồ", "Khảo sát", "Phần mềm phân tích"], c: 3 },
  { q: "Dữ liệu có thể đến từ các nguồn nào?", a: ["Internet", "Cảm biến", "Bàn phím", "Tất cả các phương án trên"], c: 3 },
  { q: "Xử lý thông tin có thể giúp ích trong việc:", a: ["Ra quyết định", "Tiêu tiền", "Quyết định không chính xác", "Hoàn toàn không cần thiết"], c: 0 },
  { q: "Dữ liệu thô thường có đặc điểm là:", a: ["Được tổ chức và phân loại", "Chưa được xử lý", "Rất dễ hiểu", "Được lưu trữ trong thư viện"], c: 1 },
  { q: "Phân tích dữ liệu nhằm:", a: ["Biến nó thành không có nghĩa", "Chuyển đổi nó thành thông tin hữu ích", "Lưu trữ vĩnh viễn", "Bỏ qua lỗi"], c: 1 },
  { q: "Một chiếc máy tính có thể xử lý thông tin từ:", a: ["Dữ liệu nhập vào từ bàn phím và chuột", "Chỉ từ điện thoại", "Và chỉ từ một nguồn duy nhất", "Tử nhiệt độ"], c: 0 },
  { q: "Vai trò của tri thức trong cuộc sống hàng ngày là:", a: ["Không quan trọng", "Giúp đưa ra quyết định và giải quyết vấn đề", "Chỉ là một phần của học tập", "Không được xem xét"], c: 1 },
  { q: "Hệ thống nào thường không cần xử lý thông tin?", a: ["Hệ thống tự động", "Hệ thống không ai quan tâm", "Hệ thống lưu trữ", "Hệ thống điều khiển"], c: 1 },
  { q: "Tại sao việc phản biện thông tin là cần thiết?", a: ["Để chống lại ý kiến", "Để cải thiện độ chính xác và độ tin cậy", "Để giảm tải công việc", "Không cần thiết"], c: 1 },
  { q: "Thông tin được coi là hữu ích khi:", a: ["Nó chứa nhiều dữ liệu", "Nó đưa ra câu trả lời cho một câu hỏi cụ thể", "Không có ai hiểu nó", "Chỉ cần có sẵn"], c: 1 },
  { q: "Xử lý thông tin bao gồm:", a: ["Nhận diện thông tin", "Phân tích và tổng hợp thông tin", "Cả A và B", "Không bao gồm bất kỳ yếu tố nào"], c: 2 }
];

const TIME_PER_QUESTION = 30;
const BASE_SCORE = 100;

export default function App() {
  const [gameState, setGameState] = useState('start'); // start, playing, end
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [streak, setStreak] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0 && selectedAnswer === null) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && selectedAnswer === null) {
      handleTimeOut();
    }
  }, [timeLeft, gameState, selectedAnswer]);

  const handleTimeOut = () => {
    setSelectedAnswer(-1);
    setStreak(0);
    setTimeout(nextQuestion, 2000);
  };

  const handleAnswerSelect = (index) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    const isCorrect = index === QUIZ_DATA[currentQIndex].c;
    
    if (isCorrect) {
      const timeSpent = TIME_PER_QUESTION - timeLeft;
      setTotalTime(prev => prev + timeSpent);
      setCorrectAnswersCount(prev => prev + 1);
      setStreak(prev => prev + 1);
    } else {
      setTotalTime(prev => prev + TIME_PER_QUESTION); // Penalty or just full time? Let's use time spent + penalty?
      // Actually, let's just track time spent for all questions.
      const timeSpent = TIME_PER_QUESTION - timeLeft;
      setTotalTime(prev => prev + timeSpent);
      setStreak(0);
    }

    setTimeout(nextQuestion, 2000);
  };

  const nextQuestion = () => {
    if (currentQIndex < QUIZ_DATA.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setTimeLeft(TIME_PER_QUESTION);
    } else {
      setGameState('end');
    }
  };

  const startGame = () => {
    setGameState('playing');
    setCurrentQIndex(0);
    setTotalTime(0);
    setStreak(0);
    setCorrectAnswersCount(0);
    setSelectedAnswer(null);
    setTimeLeft(TIME_PER_QUESTION);
  };

  const getRank = () => {
    const percentage = correctAnswersCount / QUIZ_DATA.length;
    if (percentage === 1) return { title: "THẦN ĐỒNG TIN HỌC", color: "#a855f7", icon: <Trophy className="w-16 h-16"/> };
    if (percentage >= 0.8) return { title: "CHUYÊN GIA DỮ LIỆU", color: "#0ea5e9", icon: <Target className="w-16 h-16"/> };
    if (percentage >= 0.5) return { title: "HACKER TẬP SỰ", color: "#f59e0b", icon: <Zap className="w-16 h-16"/> };
    return { title: "NHẬP MÔN TIN HỌC", color: "#64748b", icon: <Layers className="w-16 h-16"/> };
  };

  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        {/* START SCREEN */}
        {gameState === 'start' && (
          <motion.div 
            key="start"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="result-card"
            style={{ border: 'none', background: 'white' }}
          >
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="inline-block mb-6"
            >
              <Sparkles className="w-20 h-20 text-[#a855f7]" />
            </motion.div>
            <h1 style={{ fontSize: '4rem', fontWeight: 900, color: '#0f172a', marginBottom: '1rem' }}>
              Quiz Tin Học 10
            </h1>
            <p style={{ fontSize: '1.2rem', color: '#64748b', marginBottom: '3rem' }}>
              Dữ liệu, Thông tin & Tri thức
            </p>
            <button className="btn-restart" onClick={startGame}>
              BẮT ĐẦU CHƠI
            </button>
          </motion.div>
        )}

        {/* PLAYING SCREEN */}
        {gameState === 'playing' && (
          <div style={{ width: '100%', maxWidth: '1000px' }}>
            <motion.div 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="hud-bar"
            >
              <div className="hud-item">
                <span className="hud-label">TRẢ LỜI ĐÚNG</span>
                <span className="hud-value" style={{ color: '#22c55e' }}>{correctAnswersCount} / 20</span>
              </div>

              <div className="hud-item" style={{ alignItems: 'center' }}>
                <span className="hud-label">THỜI GIAN ĐÃ DÙNG</span>
                <span className="hud-value" style={{ color: '#a855f7' }}>{totalTime} s</span>
              </div>

              <div className="hud-item" style={{ textAlign: 'right' }}>
                <span className="hud-label">TIẾN TRÌNH</span>
                <span className="hud-value">{Math.round(((currentQIndex + 1) / QUIZ_DATA.length) * 100)}%</span>
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={currentQIndex}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                className="question-card"
              >
                <div className={`timer-ring ${timeLeft <= 5 ? 'low-time' : ''}`}>
                  {timeLeft}
                </div>
                <h2 className="question-text">{QUIZ_DATA[currentQIndex].q}</h2>
              </motion.div>
            </AnimatePresence>

            <div className="answers-grid">
              {QUIZ_DATA[currentQIndex].a.map((option, index) => {
                const isCorrect = index === QUIZ_DATA[currentQIndex].c;
                const isSelected = selectedAnswer === index;
                const choiceClasses = ["card-a", "card-b", "card-c", "card-d"];
                const choiceLabels = ["A", "B", "C", "D"];
                
                let stateClass = choiceClasses[index];
                if (selectedAnswer !== null) {
                  if (isCorrect) stateClass = "correct";
                  else if (isSelected) stateClass = "incorrect animate-wiggle";
                  else if (index === QUIZ_DATA[currentQIndex].c) stateClass = "correct";
                  else stateClass = "dimmed";
                }

                return (
                  <motion.button
                    key={index}
                    disabled={selectedAnswer !== null}
                    onClick={() => handleAnswerSelect(index)}
                    className={`answer-card ${stateClass}`}
                  >
                    <div className="answer-badge">{choiceLabels[index]}</div>
                    <span>{option}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* END SCREEN */}
        {gameState === 'end' && (
          <motion.div 
            key="end"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            className="result-card"
            style={{ borderColor: getRank().color }}
          >
            <div style={{ color: getRank().color, marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {getRank().icon}
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '1rem' }}>{getRank().title}</h2>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
              <div>
                <p style={{ fontWeight: 800, color: '#64748b', fontSize: '0.8rem' }}>TỔNG THỜI GIAN</p>
                <div className="result-score">{totalTime} s</div>
              </div>
              <div>
                <p style={{ fontWeight: 800, color: '#64748b', fontSize: '0.8rem' }}>CHÍNH XÁC</p>
                <div className="result-score" style={{ color: '#22c55e' }}>{Math.round((correctAnswersCount / QUIZ_DATA.length) * 100)}%</div>
              </div>
            </div>

            <button className="btn-restart" onClick={startGame}>
              CHƠI LẠI NGAY
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
