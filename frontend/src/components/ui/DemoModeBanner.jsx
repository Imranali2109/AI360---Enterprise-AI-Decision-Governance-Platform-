import React from 'react';
import { Zap } from 'lucide-react';

export default function DemoModeBanner() {
  return (
    <div className="flex items-center gap-3 bg-brand-500/8 border border-brand-500/20 text-brand-400 rounded-xl px-4 py-3 text-xs">
      <div className="w-6 h-6 bg-brand-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
        <Zap className="w-3.5 h-3.5 text-brand-400" />
      </div>
      <div>
        <span className="font-semibold text-brand-300">Demo Mode Active — </span>
        <span className="text-brand-400/80">AI responses are pre-defined simulations. Add API keys in </span>
        <code className="bg-brand-500/15 px-1 py-0.5 rounded text-brand-300">.env</code>
        <span className="text-brand-400/80"> to enable real LLMs.</span>
      </div>
    </div>
  );
}
