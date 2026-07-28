import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Badge } from "@/app/components/ui/badge";
import { Bot, Send, X, MessageCircle, Sparkles } from "lucide-react";

interface QAItem {
  question: string;
  answer: string;
}

const MOCK_QA: QAItem[] = [
  {
    question: "试岗期未通过有工资吗？",
    answer: "试岗期未通过统一按 100元/天 结算，详见《入职管理制度》第五条",
  },
  {
    question: "驻场补贴一天多少钱？",
    answer: "驻场补贴为 80元/天，需提前报备审批，详见《差旅管理制度》第三条",
  },
  {
    question: "年假有多少天？",
    answer: "入职满1年享有5天年假，满10年享有10天年假，详见《员工手册》第四章",
  },
];

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
}

const DEFAULT_ANSWER = "抱歉，暂未找到相关政策信息，请联系 HR 部门获取帮助。";

function findAnswer(question: string): string {
  for (const qa of MOCK_QA) {
    const keywords = ["试岗", "驻场", "年假"];
    for (const kw of keywords) {
      if (question.includes(kw) && qa.question.includes(kw)) {
        return qa.answer;
      }
    }
  }
  return DEFAULT_ANSWER;
}

export function HRPolicyBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const handleSend = (text?: string) => {
    const question = (text ?? input).trim();
    if (!question) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content: question,
    };

    const botMsg: Message = {
      id: `b-${Date.now()}`,
      role: "bot",
      content: findAnswer(question),
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAsk = (qa: QAItem) => {
    handleSend(qa.question);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open ? (
        <Card className="w-[300px] h-[400px] flex flex-col shadow-2xl border-violet-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3 px-4 bg-violet-600 text-white rounded-t-lg">
            <CardTitle className="text-sm flex items-center gap-2">
              <Bot className="h-4 w-4" />
              HR 政策助手
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-white hover:bg-violet-500"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            <ScrollArea className="flex-1 px-4 py-3">
              {messages.length === 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Sparkles className="h-3 w-3 text-violet-500" />
                    常见问题
                  </div>
                  {MOCK_QA.map((qa, idx) => (
                    <button
                      key={idx}
                      className="w-full text-left text-sm p-2.5 rounded-lg bg-violet-50 hover:bg-violet-100 transition-colors text-violet-700"
                      onClick={() => handleQuickAsk(qa)}
                    >
                      {qa.question}
                    </button>
                  ))}
                </div>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-3 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                      msg.role === "user"
                        ? "bg-violet-600 text-white"
                        : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </ScrollArea>
            <div className="border-t p-3 flex items-center gap-2">
              <Input
                placeholder="输入问题..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="text-sm h-8"
              />
              <Button
                size="icon"
                className="h-8 w-8 shrink-0 bg-violet-600 hover:bg-violet-700"
                onClick={() => handleSend()}
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg bg-violet-600 hover:bg-violet-700 hover:scale-105 transition-all"
          onClick={() => setOpen(true)}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
