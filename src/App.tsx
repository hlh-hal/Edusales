/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ResonanceEngine } from './components/ResonanceEngine';
import { DecisionSandbox } from './components/DecisionSandbox';
import { SalesCollaborator } from './components/SalesCollaborator';
import { CommunityMultiplier } from './components/CommunityMultiplier';

export default function App() {
  const [activeTab, setActiveTab] = useState('resonance');

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto">
          {activeTab === 'resonance' && <ResonanceEngine />}
          {activeTab === 'sandbox' && <DecisionSandbox />}
          {activeTab === 'collaborator' && <SalesCollaborator />}
          {activeTab === 'community' && <CommunityMultiplier />}
        </div>
      </main>
    </div>
  );
}
