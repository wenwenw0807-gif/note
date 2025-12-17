import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { generateQuickQuiz } from '../services/geminiService';
import { BrainCircuit, ChevronRight, RefreshCw, Trophy, AlertCircle, CheckCircle } from 'lucide-react';

const Assessment: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [level, setLevel] = useState('Intermediate');
  const [topic, setTopic] = useState('Grammar');

  const startQuiz = async () => {
    setLoading(true);
    setQuizStarted(false);
    setShowResults(false);
    setAnswers([]);
    
    const generatedQuestions = await generateQuickQuiz(level, topic);
    if (generatedQuestions.length > 0) {
      setQuestions(generatedQuestions);
      setQuizStarted(true);
      setAnswers(new Array(generatedQuestions.length).fill(-1));
    }
    setLoading(false);
  };

  const handleAnswer = (questionIndex: number, optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const calculateScore = () => {
    return questions.reduce((acc, q, idx) => {
      return acc + (answers[idx] === q.correctIndex ? 1 : 0);
    }, 0);
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = score / total;
    if (percentage >= 0.8) return 'text-emerald-600 bg-emerald-100';
    if (percentage >= 0.5) return 'text-amber-600 bg-amber-100';
    return 'text-red-600 bg-red-100';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500 animate-fade-in">
        <Loader size={48} className="animate-spin text-violet-600 mb-4" />
        <p className="text-lg font-medium">正在生成您的个性化评估...</p>
        <p className="text-sm opacity-70">Gemini 正在根据您的水平编写题目。</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {!quizStarted && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center space-y-6">
          <div className="w-16 h-16 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center mx-auto">
            <BrainCircuit size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">技能评估</h2>
            <p className="text-slate-500 mt-2 max-w-md mx-auto">
              参加快速的 AI 生成测验来检查您当前的状态。我们将根据您的需求生成新题目。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="space-y-2 text-left">
              <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider">等级 (Level)</label>
              <select 
                value={level} 
                onChange={(e) => setLevel(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="Beginner">初级 (A1-A2)</option>
                <option value="Intermediate">中级 (B1-B2)</option>
                <option value="Advanced">高级 (C1-C2)</option>
              </select>
            </div>
            <div className="space-y-2 text-left">
              <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider">主题 (Topic)</label>
              <select 
                value={topic} 
                onChange={(e) => setTopic(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="Grammar">语法</option>
                <option value="Vocabulary">词汇</option>
                <option value="Idioms">习语</option>
                <option value="Business">商务英语</option>
              </select>
            </div>
          </div>

          <button 
            onClick={startQuiz}
            className="w-full max-w-md mx-auto bg-violet-600 text-white py-3.5 rounded-xl font-bold hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200"
          >
            开始评估
          </button>
        </div>
      )}

      {quizStarted && !showResults && (
        <div className="space-y-6">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-xl font-bold text-slate-800">第 {answers.filter(a => a !== -1).length + 1} 题 / 共 {questions.length} 题</h3>
            <button 
              onClick={() => { setQuizStarted(false); setAnswers([]); }}
              className="text-slate-400 hover:text-red-500 text-sm font-medium"
            >
              退出测验
            </button>
          </div>

          {questions.map((q, qIdx) => (
            <div key={q.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h4 className="text-lg font-medium text-slate-800 mb-4">{qIdx + 1}. {q.question}</h4>
              <div className="space-y-3">
                {q.options.map((option, oIdx) => (
                  <button
                    key={oIdx}
                    onClick={() => handleAnswer(qIdx, oIdx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      answers[qIdx] === oIdx 
                        ? 'border-violet-500 bg-violet-50 text-violet-700 ring-1 ring-violet-500' 
                        : 'border-slate-200 hover:border-violet-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="inline-block w-6 h-6 rounded-full border border-current text-xs text-center leading-[22px] mr-3 font-semibold opacity-60">
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-end pt-4">
             <button
              disabled={answers.some(a => a === -1)}
              onClick={() => setShowResults(true)}
              className="bg-slate-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
             >
               提交答案
             </button>
          </div>
        </div>
      )}

      {showResults && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 text-center border-b border-slate-100">
            <div className="inline-flex items-center justify-center p-4 bg-yellow-100 text-yellow-600 rounded-full mb-4">
               <Trophy size={40} />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">测验完成！</h2>
            <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold ${getScoreColor(calculateScore(), questions.length)}`}>
               得分: {calculateScore()} / {questions.length}
            </div>
          </div>

          <div className="p-8 space-y-8">
            {questions.map((q, idx) => (
              <div key={idx} className="border-b border-slate-100 last:border-0 pb-6 last:pb-0">
                <div className="flex gap-3 mb-2">
                  {answers[idx] === q.correctIndex ? (
                    <div className="mt-1 text-emerald-500"><CheckCircle size={20} /></div>
                  ) : (
                    <div className="mt-1 text-red-500"><AlertCircle size={20} /></div>
                  )}
                  <div>
                    <h4 className="font-medium text-slate-800">{q.question}</h4>
                    <p className="text-sm text-slate-500 mt-1">
                      正确答案: <span className="font-medium text-slate-700">{q.options[q.correctIndex]}</span>
                    </p>
                    <p className="text-sm bg-slate-50 p-3 rounded-lg mt-3 text-slate-600 border border-slate-100">
                      <span className="font-semibold text-xs uppercase tracking-wider text-slate-400 block mb-1">解析</span>
                      {q.explanation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-center">
             <button 
               onClick={startQuiz}
               className="flex items-center gap-2 text-violet-600 font-bold hover:text-violet-700"
             >
               <RefreshCw size={20} /> 再测一次
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Internal icon helpers for cleaner JSX above
const Loader = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export default Assessment;