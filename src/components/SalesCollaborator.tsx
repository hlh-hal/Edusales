import React, { useState } from 'react';
import { callAI } from '../lib/api';
import { SYSTEM_PROMPT } from '../lib/prompts';
import { Loader2, MessageSquareText, Lightbulb, Database } from 'lucide-react';
import Markdown from 'react-markdown';

// 模拟从图2提取的历史销售转化对话记录（RAG数据源）
const mockSalesDatabase = [
  {
    id: 1,
    background: "大一计算机",
    question: "课程799有点贵",
    answer: "我理解你的顾虑，其实很多同学刚开始也是觉得贵，所以我们先帮大家看自己方向是否清晰，再决定报名",
    type: "价格异议",
    result: "愿意继续了解"
  },
  {
    id: 2,
    background: "大二金融",
    question: "我怕没效果",
    answer: "很多学员也是担心效果，但我们更强调方法和实践，通过社群+半年陪跑，帮助你系统规划方向",
    type: "效果怀疑",
    result: "继续沟通"
  },
  {
    id: 3,
    background: "大三管理",
    question: "想再考虑一下",
    answer: "完全理解，需要时间考虑，你主要犹豫的是课程内容还是价值？",
    type: "拖延决策",
    result: "继续沟通"
  },
  {
    id: 4,
    background: "大二机械",
    question: "我学校不好",
    answer: "很多同学最初也担心背景，但方法和实践才是核心，你可以参考学员@小林案例",
    type: "学校焦虑",
    result: "愿意了解案例"
  },
  {
    id: 5,
    background: "大一新闻",
    question: "时间不够",
    answer: "课程节奏灵活，你可以边学边参与实践项目，不耽误课程",
    type: "时间不足",
    result: "继续沟通"
  }
];

export function SalesCollaborator() {
  const [input, setInput] = useState('你们这个课程多少钱？');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [retrievedCases, setRetrievedCases] = useState<typeof mockSalesDatabase>([]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      // 模拟 RAG 检索：根据输入关键词匹配历史销售对话
      const cases = mockSalesDatabase.filter(c => 
        input.includes('钱') || input.includes('贵') ? c.type.includes('价格') :
        input.includes('效果') ? c.type.includes('效果') :
        input.includes('考虑') ? c.type.includes('拖延') :
        input.includes('时间') ? c.type.includes('时间') : true
      ).slice(0, 2);
      
      const finalCases = cases.length > 0 ? cases : mockSalesDatabase.slice(0, 2);
      setRetrievedCases(finalCases);

      const casesText = finalCases.map(c => 
        `【历史对话${c.id}】客户问题：${c.question} | 销售金句：${c.answer} | 结果：${c.result}`
      ).join('\n');

      const prompt = `
<sales_methodology>
处理异议需遵循 LSCPA 模型：
1. L (Listen): 倾听，不打断（在话术中体现为耐心）。
2. S (Share): 认同感受，表示理解（共情）。
3. C (Clarify): 用提问挖掘真实原因（SPIN提问法）。
4. P (Present): 提供有说服力的回应（FABE价值匹配）。
5. A (Ask): 测试满意度，引导下一步。

【特别注意】：如果客户直接问价格（如“多少钱”），绝对不能直接报价格、单纯罗列功能。必须先共情，通过提问挖掘需求，再报价格并同步讲清价值。
</sales_methodology>

<context>
检索到的历史高转化话术参考：
${casesText}
</context>

<customer_input>
客户异议/问题：${input}
</customer_input>

<instruction>
请根据 <customer_input>，结合 <sales_methodology> 中的 LSCPA 模型和注意事项，生成应对该异议的回复策略和具体话术。
请严格按照以下结构输出（使用Markdown格式）：

### 1. 异议分析 (Analyze)
（分析客户表象背后的真实顾虑，他是觉得贵、没时间，还是没看到价值？）

### 2. 回复策略 (Strategy)
（简要说明 LSCPA 各步骤的应对要点）

### 3. 实操话术 (Script)
（直接提供一段可以直接发给客户的微信话术，语气要真诚、像真人交流，切忌像机器人说教）
</instruction>`;

      const aiResponse = await callAI(prompt, SYSTEM_PROMPT);
      setResult(aiResponse);
    } catch (error) {
      console.error(error);
      setResult("生成失败，请检查网络或API Key配置。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">智能销售协作者</h2>
        <p className="text-slate-500 mt-1">基于 LSCPA 异议处理模型与历史高转化话术，生成应对策略</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <label className="block text-sm font-medium text-slate-700 mb-2">客户消息</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-32 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 bg-slate-50"
          placeholder="粘贴客户的微信聊天记录..."
        />
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={loading || !input}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors font-medium"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <MessageSquareText className="w-5 h-5" />}
            生成回复策略 (LSCPA)
          </button>
        </div>
      </div>

      {retrievedCases.length > 0 && (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 text-indigo-600 mb-3">
            <Database className="w-4 h-4" />
            <span className="text-sm font-semibold">参考历史高转化对话</span>
          </div>
          <div className="space-y-3">
            {retrievedCases.map((c, i) => (
              <div key={i} className="text-sm text-slate-600 bg-white p-3 rounded-lg border border-slate-100">
                <p><span className="font-medium text-slate-700">客户问：</span>{c.question}</p>
                <p><span className="font-medium text-slate-700">销售答：</span>{c.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {result && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            AI 销售策略与话术
          </h3>
          <div className="prose prose-slate max-w-none">
            <Markdown>{result}</Markdown>
          </div>
        </div>
      )}
    </div>
  );
}
