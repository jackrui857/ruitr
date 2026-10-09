import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types/railway';
import { 
  Send, Bot, User, Sparkles, Train, AlertTriangle, CheckCircle2, 
  Clock, ArrowRight, RefreshCw, MessageSquare
} from 'lucide-react';

interface AIChatBotProps {
  onSelectTrain: (trainNo: string) => void;
  onSelectStationByName?: (stationName: string) => void;
}

export const AIChatBot: React.FC<AIChatBotProps> = ({
  onSelectTrain,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `您好！我是您的**台鐵 TRC 智能鐵路小幫手** 🚂\n\n我可以協助您：\n• **全台車站即時看板**：查詢各站即時發車、月台與每站是否準點\n• **指定車次動態查詢**：例如查詢「229次」、「115次」沿途停靠與延誤狀態\n• **票價與行程規劃**：查詢各車種搭乘時間與票價\n• **票務與乘車規定**：電子票證（悠遊卡）、全車對號座、自強號規定\n\n請問今天想查詢哪一站或哪班車次呢？`,
      timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        '查詢台北站即時發車與誤點看板',
        '查詢 229 次新自強號各站準點情形',
        '台中到高雄自強號票價與時刻',
        'EMU3000可以用悠遊卡搭乘嗎？',
      ],
    },
  ]);

  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationHistory: messages.slice(-6).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: data.reply || '已收到您的查詢。',
        timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: data.suggestedActions || [],
        attachedData: data.trainData
          ? {
              type: 'train-detail',
              title: `${data.trainData.trainNo} 次列車即時動態`,
              trainNo: data.trainData.trainNo,
              items: data.trainData.stops,
            }
          : undefined,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: '抱歉，暫時無法連線至鐵路客服系統，請檢查網路連線或稍後再試。',
        timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[calc(100vh-170px)] min-h-[580px]">
      {/* Chatroom Header */}
      <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-white">
                台鐵智能客服小幫手
              </h3>
              <span className="text-[11px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Gemini 3.8 + TDX 即時連線
              </span>
            </div>
            <p className="text-xs text-slate-400">
              支援全台各站時刻、車次誤點、月台查詢與票價規定
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([
              {
                id: 'welcome-reset',
                role: 'assistant',
                content: '對話已重置。請問您想查詢全台哪一站或哪班車次？',
                timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
                suggestedActions: [
                  '查詢台北站即時發車看板',
                  '查詢 229 次新自強號各站準點情形',
                  '台中到高雄自強號時刻',
                ],
              },
            ]);
          }}
          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5"
          title="清空聊天記錄"
        >
          <RefreshCw className="w-3.5 h-3.5" /> 清空記錄
        </button>
      </div>

      {/* Messages List Area */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 bg-slate-50/70">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-xs ${
                  isUser ? 'bg-amber-600' : 'bg-blue-700'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Train className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-2xs space-y-2 ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-tr-xs'
                    : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs'
                }`}
              >
                {/* Content formatted with basic markdown rendering */}
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.content.split('\n').map((line, idx) => {
                    // Highlight bold
                    const formatted = line.replace(/\*\*(.*?)\*\*/g, '$1');
                    return (
                      <p key={idx} className={line.startsWith('•') ? 'pl-2' : ''}>
                        {formatted}
                      </p>
                    );
                  })}
                </div>

                {/* Attached Interactive Train Data Card */}
                {msg.attachedData && msg.attachedData.trainNo && (
                  <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-bold flex items-center gap-1.5 text-blue-700">
                        <Train className="w-4 h-4" />
                        {msg.attachedData.title}
                      </div>
                      <button
                        onClick={() => onSelectTrain(msg.attachedData!.trainNo!)}
                        className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded-md font-semibold transition"
                      >
                        檢視各站詳細時間表 →
                      </button>
                    </div>
                  </div>
                )}

                {/* Suggested Action Chips (for Assistant) */}
                {!isUser && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {msg.suggestedActions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(action)}
                        className="text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 transition text-left flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        {action}
                      </button>
                    ))}
                  </div>
                )}

                <div
                  className={`text-[10px] text-right font-mono ${
                    isUser ? 'text-blue-100' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-white shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white p-3.5 rounded-2xl rounded-tl-xs border border-slate-200 flex items-center gap-2 text-xs text-slate-500 shadow-2xs">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
              小幫手正在連線 TDX 查詢即時班次與準點狀態...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box Footer */}
      <div className="p-3 bg-white border-t border-slate-200">
        {/* Quick shortcut tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 text-xs text-slate-600">
          <span className="font-semibold text-slate-400 shrink-0">快捷提問:</span>
          {[
            '台北站目前誤點情形？',
            '229次新自強號',
            '台中到高雄自強號',
            '花蓮到台北最快多久',
            '悠遊卡可以搭自強號嗎',
          ].map((tag, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(tag)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-full shrink-0 transition"
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="請輸入欲查詢的車站、車次或問題 (如: 台北站現在有誤點嗎？或 115次自強號)..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputMessage.trim()}
            className="px-5 py-3 bg-blue-700 hover:bg-blue-800 disabled:bg-slate-300 text-white rounded-xl font-bold transition flex items-center gap-1.5 shadow-md"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">發送</span>
          </button>
        </div>
      </div>
    </div>
  );
};
