import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff, BrainCircuit, ArrowRight, Zap, CheckCircle } from 'lucide-react';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('admin@ai360.demo');
  const [password, setPassword] = useState('Demo@1234');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome to AI360!');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0C0C0E] flex flex-col overflow-hidden relative">

      {/* ── Background orb (matching reference image) ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Large orange glow orb at bottom center */}
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-[-10%] w-[800px] h-[500px] rounded-full opacity-60"
          style={{
            background: 'radial-gradient(ellipse at 50% 80%, rgba(249,115,22,0.5) 0%, rgba(200,60,0,0.2) 35%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* ── Navbar ── */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center shadow-glow-orange-sm">
            <BrainCircuit className="w-[18px] h-[18px] text-white" />
          </div>
          <span className="text-base font-bold text-white tracking-tight">AI360</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-[#888899]">
          <span onClick={() => document.getElementById('use-cases').scrollIntoView({ behavior: 'smooth' })} className="hover:text-white cursor-pointer transition-colors">Use Cases</span>
          <span onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })} className="hover:text-white cursor-pointer transition-colors">Features</span>
          <span onClick={() => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })} className="hover:text-white cursor-pointer transition-colors">Pricing</span>
          <span onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })} className="hover:text-white cursor-pointer transition-colors">Contact</span>
        </div>
        <button onClick={() => document.getElementById('login-form').scrollIntoView({ behavior: 'smooth' })} className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-xl cursor-pointer transition-colors shadow-glow-orange-sm">
          Get started
        </button>
      </nav>

      {/* ── Hero Section ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 pt-16 pb-12 flex-1">

        {/* Main headline */}
        <h1 className="text-5xl sm:text-6xl font-black text-white leading-tight tracking-tight mb-6 max-w-3xl">
          Power Your Enterprise{' '}
          <span className="text-transparent bg-clip-text"
            style={{ backgroundImage: 'linear-gradient(90deg, #f97316 0%, #fb923c 100%)' }}>
            AI Decisions
          </span>
        </h1>

        <p className="text-base text-[#888899] max-w-lg leading-relaxed mb-10">
          Evaluate use cases, compare LLMs, calculate ROI, and govern AI risk —
          all in one enterprise-grade platform.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-16">
          <button
            onClick={() => document.getElementById('login-form').scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/[0.15] border border-white/10
                       text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-all"
          >
            View Dashboard
          </button>
          <button
            onClick={() => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm
                       font-medium px-6 py-2.5 rounded-xl transition-all shadow-glow-orange"
          >
            Sign In Free <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Trust badges */}
        <div className="text-xs text-[#444460] mb-3">Trusted by enterprise AI teams</div>
        <div className="flex items-center gap-8 text-[#333348] text-sm font-semibold">
          {['IT Teams', 'Digital Transformation', 'AI Governance', 'Business Analytics'].map(b => (
            <span key={b} className="hidden sm:block">{b}</span>
          ))}
        </div>

        {/* ── Login Card (floating dashboard preview) ── */}
        <div id="login-form" className="mt-16 w-full max-w-md mx-auto">
          <div className="card-dark p-8 rounded-2xl border border-[#252530]">
            <div className="text-center mb-7">
              <div className="w-12 h-12 bg-brand-500/15 border border-brand-500/30 rounded-2xl
                              flex items-center justify-center mx-auto mb-4 shadow-glow-orange-sm">
                <BrainCircuit className="w-6 h-6 text-brand-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-1">Welcome back</h2>
              <p className="text-sm text-[#555570]">Sign in to your AI360 workspace</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label-dark">Email address</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com" required className="input-dark"
                />
              </div>
              <div>
                <label className="label-dark">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter password" required className="input-dark pr-10"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555570] hover:text-white transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl px-4 py-2.5">
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600
                           text-white text-sm font-medium py-2.5 rounded-xl transition-all
                           shadow-glow-orange-sm hover:shadow-glow-orange disabled:opacity-50 disabled:cursor-not-allowed mt-1">
                {loading ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                ) : <>Sign in <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── Features Section ── */}
      <section id="features" className="relative z-10 py-24 bg-[#0C0C0E] border-t border-[#141418]">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Enterprise Features</h2>
            <p className="text-[#888899] max-w-2xl mx-auto">Everything you need to evaluate, compare, and safely deploy AI initiatives.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'LLM Comparison Lab', desc: 'Side-by-side evaluation of GPT-4, Gemini, and Claude for your specific prompts.', icon: <BrainCircuit className="w-6 h-6 text-brand-400" /> },
              { title: 'ROI & Cost Calculators', desc: 'Accurately forecast API token costs and projected return on investment.', icon: <Zap className="w-6 h-6 text-emerald-400" /> },
              { title: 'Risk & Governance', desc: 'Assess data security, hallucination risks, and compliance impact before deploying.', icon: <CheckCircle className="w-6 h-6 text-sky-400" /> },
            ].map((f, i) => (
              <div key={i} className="card-dark p-8 border border-[#1E1E28]">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-[#888899] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Use Cases Section ── */}
      <section id="use-cases" className="relative z-10 py-24 bg-[#0E0E12] border-t border-[#141418]">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Built for Every Department</h2>
            <p className="text-[#888899] max-w-2xl mx-auto">Track and prioritize AI use cases across your entire organization.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Customer Support', items: ['Ticket Triage', 'Chatbots', 'Sentiment Analysis'] },
              { name: 'Engineering', items: ['Code Generation', 'PR Reviews', 'Documentation'] },
              { name: 'Human Resources', items: ['Knowledge Assistants', 'Screening', 'Onboarding'] },
              { name: 'Marketing', items: ['Content Generation', 'SEO Optimization', 'Copywriting'] },
            ].map((dep, i) => (
              <div key={i} className="bg-[#141418] border border-[#252530] rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4">{dep.name}</h3>
                <ul className="space-y-3">
                  {dep.items.map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm text-[#888899]">
                      <ArrowRight className="w-3.5 h-3.5 text-brand-500" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing Section ── */}
      <section id="pricing" className="relative z-10 py-24 bg-[#0C0C0E] border-t border-[#141418]">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Transparent Pricing</h2>
            <p className="text-[#888899] max-w-2xl mx-auto">Start evaluating AI for free. Scale as your enterprise adopts more models.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="card-dark p-8 border border-[#1E1E28]">
              <h3 className="text-lg font-bold text-white mb-2">Starter</h3>
              <p className="text-sm text-[#888899] mb-6">For small teams starting AI.</p>
              <p className="text-4xl font-black text-white mb-6">Free</p>
              <ul className="space-y-3 mb-8">
                {['Up to 5 Use Cases', 'Basic Cost Calculator', 'Community Support'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-[#ccccdd]"><CheckCircle className="w-4 h-4 text-emerald-400" /> {f}</li>
                ))}
              </ul>
              <button className="w-full py-2.5 rounded-xl border border-[#252530] text-white text-sm font-medium hover:bg-white/5 transition-colors" onClick={() => document.getElementById('login-form').scrollIntoView({ behavior: 'smooth' })}>Get Started</button>
            </div>
            {/* Pro */}
            <div className="card-dark p-8 border border-brand-500/40 relative bg-brand-500/[0.02]">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-brand-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">Most Popular</div>
              <h3 className="text-lg font-bold text-white mb-2">Pro</h3>
              <p className="text-sm text-[#888899] mb-6">For scaling AI portfolios.</p>
              <p className="text-4xl font-black text-white mb-1">$49<span className="text-lg text-[#555570] font-medium">/mo</span></p>
              <p className="text-xs text-[#555570] mb-6">Billed annually</p>
              <ul className="space-y-3 mb-8">
                {['Unlimited Use Cases', 'LLM Comparison Lab', 'Advanced ROI tools', 'Email Support'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-[#ccccdd]"><CheckCircle className="w-4 h-4 text-brand-400" /> {f}</li>
                ))}
              </ul>
              <button className="w-full py-2.5 rounded-xl bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 transition-colors shadow-glow-orange-sm" onClick={() => document.getElementById('login-form').scrollIntoView({ behavior: 'smooth' })}>Start Free Trial</button>
            </div>
            {/* Enterprise */}
            <div className="card-dark p-8 border border-[#1E1E28]">
              <h3 className="text-lg font-bold text-white mb-2">Enterprise</h3>
              <p className="text-sm text-[#888899] mb-6">Custom limits & governance.</p>
              <p className="text-4xl font-black text-white mb-6">Custom</p>
              <ul className="space-y-3 mb-8">
                {['Custom Integrations', 'Dedicated Account Manager', 'SSO & SAML', 'Custom Risk Frameworks'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-[#ccccdd]"><CheckCircle className="w-4 h-4 text-[#888899]" /> {f}</li>
                ))}
              </ul>
              <button className="w-full py-2.5 rounded-xl border border-[#252530] text-white text-sm font-medium hover:bg-white/5 transition-colors" onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer / Contact Section ── */}
      <footer id="contact" className="relative z-10 bg-[#0E0E12] border-t border-[#1E1E28] py-12">
        <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-6 h-6 bg-brand-500 rounded flex items-center justify-center">
                <BrainCircuit className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-bold text-white tracking-tight">AI360</span>
            </div>
            <p className="text-xs text-[#555570]">Powering enterprise AI decisions securely.</p>
          </div>
          
          <div className="bg-[#141418] border border-[#252530] p-6 rounded-2xl md:min-w-[300px]">
            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Contact Developer
            </h4>
            <div className="space-y-3 text-sm">
              <p className="flex justify-between"><span className="text-[#888899]">Name</span> <span className="text-white font-medium">Imran Ali</span></p>
              <p className="flex justify-between"><span className="text-[#888899]">Mobile</span> <span className="text-brand-400">8958919151</span></p>
              <p className="flex justify-between"><span className="text-[#888899]">Email</span> <span className="text-white">imranalibaqri24@gmail.com</span></p>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-8 mt-12 pt-6 border-t border-[#141418] text-center text-[10px] text-[#444460]">
          &copy; {new Date().getFullYear()} AI360 Enterprise Platform. Built by Imran Ali. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
