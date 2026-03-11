import React, { useState } from 'react';
import { callAI } from '../lib/api';
import { Loader2, Map, FileText } from 'lucide-react';
import Markdown from 'react-markdown';

export function DecisionSandbox() {
  const [formData, setFormData] = useState({
    grade: '大二',
    major: '汉语言文学',
    goal: '想找一份高薪工作，但不喜欢当老师',
    confusion: '不知道除了考公考编还能做什么，对互联网感兴趣但没有任何技能'
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const prompt = `根据以下学生背景生成个性化成长路径报告。
学生背景：
- 年级：${formData.grade}
- 专业：${formData.major}
- 目标：${formData.goal}
- 困惑：${formData.confusion}

请包含以下结构：
# 🎯 个性化成长路径报告

## 1. 现状剖析
（简要分析该学生的优势与劣势）

## 2. 可选方向建议
（提供2-3个适合该学生的职业方向）
对于每个方向，请列出：
- **方向名称**
- **优势 (Pros)**
- **劣势/挑战 (Cons)**
- **核心所需能力**

## 3. 关键行动路径 (Roadmap)
（按时间线给出接下来的具体行动建议，例如大二下、大三上等）

## 4. 参考学员案例
（分享一个类似背景学员的成功案例，增强信心）`;

      const aiResponse = await callAI(prompt, "你是一个资深的大学生职业发展规划导师。");
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
        <h2 className="text-2xl font-bold text-slate-800">个性化决策沙盘</h2>
        <p className="text-slate-500 mt-1">输入学生问卷信息，一键生成专属成长路径报告</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">年级</label>
          <select
            value={formData.grade}
            onChange={(e) => setFormData({...formData, grade: e.target.value})}
            className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option>大一</option>
            <option>大二</option>
            <option>大三</option>
            <option>大四</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">专业</label>
          <input
            type="text"
            value={formData.major}
            onChange={(e) => setFormData({...formData, major: e.target.value})}
            className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="例如：汉语言文学"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">核心目标</label>
          <input
            type="text"
            value={formData.goal}
            onChange={(e) => setFormData({...formData, goal: e.target.value})}
            className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="例如：想找一份高薪工作"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">当前困惑</label>
          <textarea
            value={formData.confusion}
            onChange={(e) => setFormData({...formData, confusion: e.target.value})}
            className="w-full h-24 p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="详细描述学生的困惑..."
          />
        </div>
        <div className="md:col-span-2 flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors font-medium"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Map className="w-5 h-5" />}
            生成成长路径报告
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <FileText className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">专属成长路径报告</h3>
          </div>
          <div className="prose prose-slate prose-indigo max-w-none">
            <Markdown>{result}</Markdown>
          </div>
        </div>
      )}
    </div>
  );
}
