import React, { useState, useEffect, useRef } from 'react';
import { TimerState, TimerPreset } from '../types';
import { Play, Pause, RotateCcw, Clock, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';

const Timer: React.FC = () => {
  const [timerState, setTimerState] = useState<TimerState>({
    minutes: 25,
    seconds: 0,
    isRunning: false,
    isPaused: false,
    totalSeconds: 25 * 60
  });

  const [selectedPreset, setSelectedPreset] = useState<TimerPreset>(TimerPreset.POMODORO);
  const [customMinutes, setCustomMinutes] = useState(25);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerState.isRunning && !timerState.isPaused && timerState.totalSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setTimerState(prev => {
          if (prev.totalSeconds <= 1) {
            handleTimerComplete();
            return {
              ...prev,
              totalSeconds: 0,
              minutes: 0,
              seconds: 0,
              isRunning: false,
              isPaused: false
            };
          }

          const newTotalSeconds = prev.totalSeconds - 1;
          const newMinutes = Math.floor(newTotalSeconds / 60);
          const newSeconds = newTotalSeconds % 60;

          return {
            ...prev,
            totalSeconds: newTotalSeconds,
            minutes: newMinutes,
            seconds: newSeconds
          };
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerState.isRunning, timerState.isPaused, timerState.totalSeconds]);

  const handleTimerComplete = () => {
    if (isSoundEnabled) {
      playNotificationSound();
    }
    showNotification();
  };

  const playNotificationSound = () => {
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZURE');
      audio.play();
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  const showNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('计时器完成！', {
        body: '你的学习时间结束了，休息一下吧！',
        icon: '/favicon.ico'
      });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('计时器完成！', {
            body: '你的学习时间结束了，休息一下吧！',
            icon: '/favicon.ico'
          });
        }
      });
    }
  };

  const handleStart = () => {
    setTimerState(prev => ({
      ...prev,
      isRunning: true,
      isPaused: false
    }));
  };

  const handlePause = () => {
    setTimerState(prev => ({
      ...prev,
      isPaused: true
    }));
  };

  const handleResume = () => {
    setTimerState(prev => ({
      ...prev,
      isPaused: false
    }));
  };

  const handleReset = () => {
    setTimerState(prev => ({
      ...prev,
      isRunning: false,
      isPaused: false,
      totalSeconds: prev.minutes * 60 + prev.seconds
    }));
  };

  const handlePresetChange = (preset: TimerPreset) => {
    setSelectedPreset(preset);
    let minutes = 25;

    switch (preset) {
      case TimerPreset.POMODORO:
        minutes = 25;
        break;
      case TimerPreset.SHORT_BREAK:
        minutes = 5;
        break;
      case TimerPreset.LONG_BREAK:
        minutes = 15;
        break;
      case TimerPreset.CUSTOM:
        minutes = customMinutes;
        break;
    }

    setTimerState({
      minutes,
      seconds: 0,
      isRunning: false,
      isPaused: false,
      totalSeconds: minutes * 60
    });
  };

  const handleCustomMinutesChange = (value: string) => {
    const minutes = parseInt(value) || 1;
    setCustomMinutes(minutes);
    if (selectedPreset === TimerPreset.CUSTOM) {
      setTimerState({
        minutes,
        seconds: 0,
        isRunning: false,
        isPaused: false,
        totalSeconds: minutes * 60
      });
    }
  };

  const formatTime = (minutes: number, seconds: number) => {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = timerState.totalSeconds > 0
    ? ((timerState.minutes * 60 + timerState.seconds) / timerState.totalSeconds) * 100
    : 0;

  const timerContent = (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center justify-center gap-2">
          <Clock size={28} className="text-violet-600" /> 学习倒计时
        </h2>
        <p className="text-slate-500">专注学习，提高效率</p>
      </div>

      {/* 预设选择器 */}
      <div className="flex flex-wrap gap-2 justify-center">
        {Object.values(TimerPreset).map((preset) => (
          <button
            key={preset}
            onClick={() => handlePresetChange(preset)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedPreset === preset
                ? 'bg-violet-600 text-white shadow-lg'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {preset}
          </button>
        ))}
      </div>

      {/* 自定义时间输入 */}
      {selectedPreset === TimerPreset.CUSTOM && (
        <div className="flex items-center justify-center gap-3">
          <label className="text-sm font-medium text-slate-600">自定义时间:</label>
          <input
            type="number"
            min="1"
            max="180"
            value={customMinutes}
            onChange={(e) => handleCustomMinutesChange(e.target.value)}
            className="w-20 px-3 py-1 border border-slate-200 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <span className="text-sm text-slate-500">分钟</span>
        </div>
      )}

      {/* 计时器显示 */}
      <div className="relative max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
          <div className="relative w-48 h-48 mx-auto mb-6">
            {/* 进度环 */}
            <svg className="transform -rotate-90 w-48 h-48">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="#e2e8f0"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="#7c3aed"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 88}`}
                strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-linear"
              />
            </svg>

            {/* 时间显示 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-slate-800 tabular-nums">
                  {formatTime(timerState.minutes, timerState.seconds)}
                </div>
                {timerState.isRunning && !timerState.isPaused && (
                  <div className="text-xs text-emerald-600 font-medium mt-1">运行中</div>
                )}
                {timerState.isPaused && (
                  <div className="text-xs text-amber-600 font-medium mt-1">已暂停</div>
                )}
              </div>
            </div>
          </div>

          {/* 控制按钮 */}
          <div className="flex justify-center gap-3">
            {!timerState.isRunning ? (
              <button
                onClick={handleStart}
                disabled={timerState.totalSeconds === 0}
                className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Play size={20} /> 开始
              </button>
            ) : timerState.isPaused ? (
              <button
                onClick={handleResume}
                className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <Play size={20} /> 继续
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="bg-amber-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-amber-700 transition-colors flex items-center gap-2"
              >
                <Pause size={20} /> 暂停
              </button>
            )}

            <button
              onClick={handleReset}
              className="bg-slate-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-700 transition-colors flex items-center gap-2"
            >
              <RotateCcw size={20} /> 重置
            </button>
          </div>
        </div>
      </div>

      {/* 设置选项 */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setIsSoundEnabled(!isSoundEnabled)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            isSoundEnabled
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          {isSoundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          提醒音效
        </button>

        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition-colors"
        >
          {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          {isFullscreen ? '退出全屏' : '全屏模式'}
        </button>
      </div>
    </div>
  );

  if (isFullscreen) {
    return (
      <div data-timer-fullscreen="true" className="fixed inset-0 bg-slate-900 flex items-center justify-center z-50">
        <div className="max-w-2xl w-full mx-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            {timerContent}
            <button
              onClick={() => setIsFullscreen(false)}
              className="mt-6 w-full bg-slate-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-700 transition-colors"
            >
              退出全屏 (ESC)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return timerContent;
};

export default Timer;