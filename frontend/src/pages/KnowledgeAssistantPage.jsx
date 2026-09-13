import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import DemoModeBanner from '../components/ui/DemoModeBanner';
import { Send, Upload, FileText, Trash2, Bot, User, CheckCircle2 } from 'lucide-react';

const inputCls = `w-full bg-[#1A1A22] border border-[#2A2A38] rounded-xl px-4 py-2.5 text-sm text-white
  placeholder-[#555570] focus:outline-none focus:border-brand-500 focus:ring-2
  focus:ring-brand-500/20 transition-all`;

export default function KnowledgeAssistantPage() {
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (activeTab === 'documents') fetchDocuments();
  }, [activeTab]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const fetchDocuments = () => {
    api.get('/documents').then(res => setDocuments(Array.isArray(res) ? res : [])).catch(console.error);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') return toast.error('Only PDF files are supported');

    const formData = new FormData();
    formData.append('document', file);

    const toastId = toast.loading('Uploading and processing document...', {
      style: { background: '#1A1A22', color: '#fff', border: '1px solid #2A2A38' }
    });
    try {
      await api.post('/documents/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Document uploaded successfully', { id: toastId });
      fetchDocuments();
    } catch (err) {
      toast.error('Upload failed', { id: toastId });
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/documents/${id}`);
      toast.success('Document deleted', {
        style: { background: '#1A1A22', color: '#fff', border: '1px solid #2A2A38' }
      });
      fetchDocuments();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleSend = async (text = input) => {
    if (!text.trim()) return;
    
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/chat', { question: text });
      const astMsg = { 
        role: 'assistant', 
        content: res.answer || res,
        sources: res.sources || [],
        isDemoMode: res.isDemoMode
      };
      setMessages(prev => [...prev, astMsg]);
    } catch (err) {
      toast.error('Failed to get answer');
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = ['How many casual leaves can I take?', 'What is the WFH policy?', 'Explain the reimbursement process'];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col pb-4">
      <div className="flex-shrink-0 mb-5">
        <h1 className="page-title">Enterprise Knowledge Assistant</h1>
        <p className="text-xs text-[#555570] mt-0.5">Ask questions securely against your uploaded enterprise policies and documents.</p>
      </div>

      <div className="flex-shrink-0 border-b border-[#1E1E28] mb-5">
        <nav className="-mb-px flex space-x-8">
          <button onClick={() => setActiveTab('chat')}
            className={`pb-4 px-1 border-b-2 text-sm font-medium transition-colors ${
              activeTab === 'chat' ? 'border-brand-500 text-brand-500' : 'border-transparent text-[#888899] hover:text-white'
            }`}>
            Chat
          </button>
          <button onClick={() => setActiveTab('documents')}
            className={`pb-4 px-1 border-b-2 text-sm font-medium transition-colors ${
              activeTab === 'documents' ? 'border-brand-500 text-brand-500' : 'border-transparent text-[#888899] hover:text-white'
            }`}>
            Documents
          </button>
        </nav>
      </div>

      {activeTab === 'chat' && (
        <div className="flex-1 flex flex-col card-dark overflow-hidden">
          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto">
                <div className="w-16 h-16 bg-brand-500/10 border border-brand-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-glow-orange-sm">
                  <Bot className="w-8 h-8 text-brand-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">How can I help you today?</h3>
                <p className="text-xs text-[#888899] mb-8">
                  I can answer questions based on the enterprise documents uploaded in the Knowledge Base.
                </p>
                <div className="space-y-2 w-full">
                  {suggestions.map(s => (
                    <button key={s} onClick={() => handleSend(s)}
                      className="w-full text-left px-4 py-3 bg-[#1A1A22] border border-[#2A2A38] rounded-xl text-xs text-[#ccccdd] hover:bg-white/5 hover:border-[#3A3A48] transition-all flex items-center justify-between group">
                      {s}
                      <Send className="w-3.5 h-3.5 text-[#555570] group-hover:text-brand-500 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-4 max-w-3xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                    msg.role === 'user' ? 'bg-[#1A1A22] border-[#2A2A38]' : 'bg-brand-500/15 border-brand-500/30'
                  }`}>
                    {msg.role === 'user' ? <User className="w-4 h-4 text-[#888899]" /> : <Bot className="w-4 h-4 text-brand-500" />}
                  </div>
                  <div className={`space-y-2 ${msg.role === 'user' ? 'text-right' : ''}`}>
                    <div className={`inline-block p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-brand-600 text-white shadow-glow-orange-sm'
                        : 'bg-[#1A1A22] border border-[#2A2A38] text-[#ccccdd]'
                    }`}>
                      {msg.content}
                    </div>
                    
                    {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {msg.sources.map((src, i) => (
                          <div key={i} className="flex items-center gap-1.5 bg-brand-500/10 border border-brand-500/20 text-brand-400 text-[10px] font-medium px-2 py-1 rounded-md">
                            <FileText className="w-3 h-3" />
                            {src.title || 'Document'}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-brand-500" />
                </div>
                <div className="bg-[#1A1A22] border border-[#2A2A38] rounded-2xl p-4 flex gap-1.5 items-center">
                  <div className="w-2 h-2 bg-brand-500/60 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-brand-500/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-brand-500/60 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-[#1E1E28] bg-[#0E0E12]">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question about HR, IT, or general policies..."
                className={inputCls}
                disabled={loading}
              />
              <Button type="submit" disabled={loading || !input.trim()} icon={Send} className="px-6">
                Send
              </Button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="card-dark p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="section-title">Knowledge Base</h3>
            <div>
              <input type="file" id="file-upload" accept=".pdf" className="hidden" onChange={handleFileUpload} />
              <Button onClick={() => document.getElementById('file-upload').click()} icon={Upload}>
                Upload PDF
              </Button>
            </div>
          </div>

          {documents.length === 0 ? (
             <div className="text-center py-12 border-2 border-dashed border-[#2A2A38] rounded-xl bg-white/[0.02]">
               <FileText className="w-8 h-8 text-[#555570] mx-auto mb-3" />
               <p className="text-sm font-medium text-white">No documents uploaded</p>
               <p className="text-xs text-[#888899] mt-1">Upload PDF files to start chatting with your knowledge base.</p>
             </div>
          ) : (
            <div className="border border-[#1E1E28] rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1E1E28] bg-[#141418]">
                    {['Document Name', 'Type', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-[10px] font-semibold text-[#444460] uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141418]">
                  {documents.map(doc => (
                    <tr key={doc.id} className="hover:bg-white/[0.025] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-[#888899]" />
                          <span className="text-sm font-medium text-white">{doc.title}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-[#888899]">PDF</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          {doc.status || 'Processed'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button onClick={() => handleDelete(doc.id)} className="p-1.5 text-[#555570] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
