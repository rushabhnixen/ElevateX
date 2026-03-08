import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Plus, CheckCircle } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const industries = ['FinTech', 'CleanTech', 'EdTech', 'HealthTech', 'SaaS', 'DeepTech'];
const stages = ['Pre-seed', 'Seed', 'Series A', 'Series B+'];

export default function UploadPage() {
  const [success, setSuccess] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [form, setForm] = useState({
    name: '', industry: 'FinTech', stage: 'Seed', askAmount: '', equity: '', tagline: '', description: ''
  });
  const [team, setTeam] = useState([{ name: '', role: '' }]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="h-dvh bg-background flex flex-col items-center justify-center px-6 gap-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
          <CheckCircle size={80} className="text-green-400" />
        </motion.div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Pitch Submitted!</h2>
          <p className="text-muted">Your pitch is under review. We'll notify you once it's live.</p>
        </div>
        <Button onClick={() => {
          setSuccess(false);
          setVideoFile(null);
          setForm({ name: '', industry: 'FinTech', stage: 'Seed', askAmount: '', equity: '', tagline: '', description: '' });
          setTeam([{ name: '', role: '' }]);
        }}>
          Submit Another
        </Button>
      </div>
    );
  }

  return (
    <div className="h-dvh overflow-y-auto scrollbar-hide bg-background">
      <div className="px-4 pt-12 pb-24">
        <h1 className="text-2xl font-bold text-white mb-6">Upload Pitch</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Video upload */}
          <div
            className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center gap-3 bg-surface cursor-pointer active:bg-border transition-colors"
            onClick={() => document.getElementById('video-input').click()}
          >
            <input id="video-input" type="file" accept="video/*" className="hidden" onChange={e => setVideoFile(e.target.files[0])} />
            {videoFile ? (
              <>
                <CheckCircle size={32} className="text-green-400" />
                <p className="text-white text-sm font-medium text-center">{videoFile.name}</p>
                <button type="button" onClick={e => { e.stopPropagation(); setVideoFile(null); }} className="text-muted text-xs flex items-center gap-1">
                  <X size={12} /> Remove
                </button>
              </>
            ) : (
              <>
                <Upload size={32} className="text-muted" />
                <p className="text-white font-medium">Tap to upload video</p>
                <p className="text-muted text-sm">MP4, MOV up to 500MB</p>
              </>
            )}
          </div>

          <Input label="Startup Name" placeholder="e.g. NeuralPay" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          <Input label="Tagline" placeholder="One-line description" value={form.tagline} onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))} required />

          <div className="flex gap-3">
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-sm text-muted font-medium">Industry</label>
              <select className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent" value={form.industry} onChange={e => setForm(f => ({ ...f, industry: e.target.value }))}>
                {industries.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-sm text-muted font-medium">Stage</label>
              <select className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent" value={form.stage} onChange={e => setForm(f => ({ ...f, stage: e.target.value }))}>
                {stages.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <Input label="Ask Amount" placeholder="e.g. 2M" value={form.askAmount} onChange={e => setForm(f => ({ ...f, askAmount: e.target.value }))} className="flex-1" required />
            <Input label="Equity %" placeholder="e.g. 10%" value={form.equity} onChange={e => setForm(f => ({ ...f, equity: e.target.value }))} className="flex-1" required />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-muted font-medium">Description</label>
            <textarea
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-white placeholder:text-muted focus:outline-none focus:border-accent resize-none"
              rows={4}
              placeholder="Describe your startup..."
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              required
            />
          </div>

          {/* Team */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-sm text-muted font-medium">Team Members</label>
              <button type="button" onClick={() => setTeam(t => [...t, { name: '', role: '' }])} className="text-accent text-sm flex items-center gap-1">
                <Plus size={14} /> Add
              </button>
            </div>
            {team.map((member, i) => (
              <div key={i} className="flex gap-2 items-start">
                <Input placeholder="Name" value={member.name} onChange={e => { const t = [...team]; t[i].name = e.target.value; setTeam(t); }} className="flex-1" />
                <Input placeholder="Role" value={member.role} onChange={e => { const t = [...team]; t[i].role = e.target.value; setTeam(t); }} className="flex-1" />
                {team.length > 1 && (
                  <button type="button" onClick={() => setTeam(t => t.filter((_, j) => j !== i))} className="mt-2 text-muted">
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <Button type="submit" size="lg" className="w-full mt-2">
            Submit Pitch 🚀
          </Button>
        </form>
      </div>
    </div>
  );
}
