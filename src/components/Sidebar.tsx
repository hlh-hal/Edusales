import React from 'react';
import { Search, Map, MessageSquare, Megaphone, GraduationCap } from 'lucide-react';

const navItems = [
  { id: 'resonance', label: '成长路径共鸣引擎', icon: Search },
  { id: 'sandbox', label: '个性化决策沙盘', icon: Map },
  { id: 'collaborator', label: '智能销售协作者', icon: MessageSquare },
  { id: 'community', label: '社群价值放大器', icon: Megaphone },
];

export function Sidebar({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (id: string) => void }) {
  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-full">
      <div className="p-6 flex items-center gap-3 border-b border-slate-100">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <h1 className="font-bold text-lg text-slate-800">EduSales AI</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive 
                  ? 'bg-indigo-50 text-indigo-700 font-medium' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-100 text-xs text-slate-400 text-center">
        Powered by Volcengine Doubao
      </div>
    </div>
  );
}
