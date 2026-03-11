import React, { useState } from 'react';
import { callAI } from '../lib/api';
import { SYSTEM_PROMPT } from '../lib/prompts';
import { Loader2, Sparkles, Database, MessageSquare } from 'lucide-react';
import Markdown from 'react-markdown';

// 模拟从图1中提取的真实学员案例库（RAG数据源）
const mockDatabase = [
  {
    id: 1,
    school: "二本",
    major: "计算机",
    grade: "大一",
    confusion: "不知道方向",
    result: "大三拿到腾讯实习",
    action: "加入社群导师指导，尝试开源项目"
  },
  {
    id: 2,
    school: "普本",
    major: "机械",
    grade: "大二",
    confusion: "不喜欢本专业",
    result: "大三进入互联网运营岗",
    action: "职业规划方法转向互联网运营"
  },
  {
    id: 3,
    school: "一本",
    major: "经管",
    grade: "大二",
    confusion: "想进互联网但没经验",
    result: "获得产品经理实习",
    action: "做竞品分析+产品作业"
  },
  {
    id: 4,
    school: "二本",
    major: "软件工程",
    grade: "大一",
    confusion: "技术基础弱",
    result: "大二完成完整项目",
    action: "社群打卡学习+做项目"
  },
  {
    id: 5,
    school: "普本",
    major: "金融",
    grade: "大三",
    confusion: "不知道考研还是工作",
    result: "决定就业进入互联网公司",
    action: "SWOT分析规划方向"
  }
];

export function ResonanceEngine() {
  const [input, setInput] = useState('二本计算机大一 迷茫');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [retrievedCases, setRetrievedCases] = useState<typeof mockDatabase>([]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      // 模拟 RAG 检索：根据输入关键词匹配案例
      const cases = mockDatabase.filter(c => 
        input.includes(c.school) || input.includes(c.major) || input.includes(c.grade) || input.includes('迷茫') || input.includes('方向')
      ).slice(0, 3);
      
      const finalCases = cases.length > 0 ? cases : mockDatabase.slice(0, 2);
      setRetrievedCases(finalCases);

      const casesText = finalCases.map(c => 
        `【案例${c.id}】背景：${c.school} ${c.major} ${c.grade} | 痛点：${c.confusion} | 关键行动：${c.action} | 结果：${c.result}`
      ).join('\n');

      // 模块化 Prompt 设计
      const prompt = `
<sales_framework>
请严格按照以下5步结构生成销售回复话术（不要输出标题，直接输出自然连贯的对话）：
1. <共鸣>：基于客户的背景和痛点，表达深深的理解和共情，拉近距离。
2. <信任>：结合我们的产品理念（拒绝盲目卷，掌握自主决策方法）建立信任。
3. <方法>：给出一个微小但有用的建议或思维框架（如目标倒推法、SWOT分析等），体现专业度。
4. <案例>：自然地引入检索到的参考案例（“之前有个和你一样背景的同学……”），用讲故事的口吻复述。
5. <行动>：以一个轻松的问句结尾，引导客户继续对话或说出更具体的痛点（不要直接卖课）。
</sales_framework>

<context>
检索到的真实案例：
${casesText}
</context>

<customer_input>
客户背景与问题：${input}
</customer_input>

<instruction>
请根据 <customer_input>，结合 <context> 中的案例，严格按照 <sales_framework> 的5步结构，生成一段高情商、高转化的微信回复话术。
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
        <h2 className="text-2xl font-bold text-slate-800">成长路径共鸣引擎</h2>
        <p className="text-slate-500 mt-1">基于RAG案例检索，落地“共鸣-信任-方法-案例-行动”5步转化模型</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <label className="block text-sm font-medium text-slate-700 mb-2">学生背景与困惑</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-24 p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          placeholder="例如：二本计算机大一 迷茫"
        />
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={loading || !input}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors font-medium"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            检索案例并生成话术
          </button>
        </div>
      </div>

      {retrievedCases.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {retrievedCases.map((c, i) => (
            <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 text-indigo-600 mb-2">
                <Database className="w-4 h-4" />
                <span className="text-sm font-semibold">检索案例 {i + 1}</span>
              </div>
              <div className="text-sm space-y-1 text-slate-600">
                <p><span className="font-medium text-slate-700">背景：</span>{c.school} {c.major} {c.grade}</p>
                <p><span className="font-medium text-slate-700">困惑：</span>{c.confusion}</p>
                <p><span className="font-medium text-slate-700">结果：</span>{c.result}</p>
                <p><span className="font-medium text-slate-700">行动：</span>{c.action}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {result && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            AI 生成话术 (5步结构)
          </h3>
          <div className="prose prose-slate max-w-none">
            <Markdown>{result}</Markdown>
          </div>
        </div>
      )}
    </div>
  );
}
