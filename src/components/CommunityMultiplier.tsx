import React, { useState } from 'react';
import { callAI } from '../lib/api';
import { Loader2, Megaphone, Newspaper } from 'lucide-react';
import Markdown from 'react-markdown';

export function CommunityMultiplier() {
  const [input, setInput] = useState(`【论坛热帖】
标题：大二下学期，我终于拿到了字节跳动的日常实习！
内容：其实一开始我也很迷茫，不知道该干嘛。后来在圈子里看到学长分享的“倒推法”，我先去看了字节前端的JD，发现自己缺项目经验。于是我花了两个月跟着课程做了一个全栈项目，然后疯狂改简历。面试的时候被问到很多底层原理，还好社群里的助教之前给我模拟面试过。大家加油！

【社群答疑精华】
Q：大一到底要不要去参加学生会？
A（助教）：看你的目标。如果你的目标是进大厂做技术或产品，学生会的经历加成很小，不如去打比赛或者做项目。如果你的目标是考公考编，或者做销售/运营，学生会的组织协调经验会有一定帮助。核心是：不要盲目跟风，要基于你的目标来决策。

【线下活动反馈】
上周末我们在广州举办了“勇闯校招”线下沙龙，来了50多个同学。大家现场修改简历，互相mock面试。很多同学反馈说，第一次知道HR看简历只花10秒钟，以前写的那些废话全删了。`);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const prompt = `你是一个社群运营专家。请根据以下社群素材，总结成一份高质量的“本周成长周报”。这份周报将发在学员群里，目的是提供价值、激励学员、展示我们产品的效果。

素材内容：
${input}

请按照以下结构输出：
# 🌟 本周成长周报

## 🏆 榜样的力量 (优秀学员分享)
（总结学员拿offer的经验，提炼出可复用的方法，如“倒推法”）

## 💡 认知升级 (高频答疑精华)
（总结关于学生会等问题的核心观点，强调“基于目标决策”的理念）

## 🔥 线下火花 (活动回顾)
（提炼线下活动的核心收获，如简历修改的要点）

## 🚀 下周行动建议
（给大一大二、大三大四学生分别一句行动建议）`;

      const aiResponse = await callAI(prompt);
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
        <h2 className="text-2xl font-bold text-slate-800">社群价值放大器</h2>
        <p className="text-slate-500 mt-1">输入碎片化的社群素材，一键生成高质量成长周报</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <label className="block text-sm font-medium text-slate-700 mb-2">本周社群素材（论坛帖子、答疑记录、活动反馈等）</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-48 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 bg-slate-50"
          placeholder="粘贴社群素材..."
        />
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={loading || !input}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors font-medium"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Megaphone className="w-5 h-5" />}
            生成本周成长周报
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-4">
            <Newspaper className="w-5 h-5 text-indigo-600" />
            生成结果预览
          </h3>
          <div className="prose prose-slate prose-indigo max-w-none">
            <Markdown>{result}</Markdown>
          </div>
        </div>
      )}
    </div>
  );
}
