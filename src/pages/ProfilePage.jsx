import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Edit3, X, Save, MapPin, Globe, Briefcase, Eye, Heart, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import StartupCard from '../components/explore/StartupCard';
import { usersAPI, startupsAPI } from '../lib/api';

function StatCard({ value, label, icon: Icon }) {
  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      {Icon && <Icon size={14} className="text-accent" />}
      <span className="text-white font-bold text-lg">{value}</span>
      <span className="text-muted text-[11px]">{label}</span>
    </div>
  );
}

const statusConfig = {
  approved: { color: 'text-green-400 bg-green-500/10', icon: CheckCircle, label: 'Live' },
  pending: { color: 'text-yellow-400 bg-yellow-500/10', icon: Clock, label: 'Pending Review' },
  rejected: { color: 'text-red-400 bg-red-500/10', icon: XCircle, label: 'Rejected' },
  draft: { color: 'text-zinc-400 bg-zinc-500/10', icon: AlertCircle, label: 'Draft' },
};

export default function ProfilePage() {
  const { user, role, logout, setUser } = useAuth();
  const navigate = useNavigate();
  const isFounder = role === 'founder';

  const [myStartups, setMyStartups] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    headline: user?.headline || '',
    company: user?.company || '',
    location: user?.location || '',
    website: user?.website || '',
    linkedin: user?.linkedin || '',
    twitter: user?.twitter || '',
    investmentThesis: user?.investmentThesis || '',
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [activeTab, setActiveTab] = useState(isFounder ? 'pitches' : 'bookmarks');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (isFounder) {
          const data = await startupsAPI.list({ founder: user._id });
          setMyStartups(data.startups || []);
        } else {
          const bmarks = await usersAPI.getBookmarks(user._id);
          setBookmarks(bmarks || []);
        }
      } catch {} finally { setLoading(false); }
    };
    if (user?._id) loadData();
  }, [user?._id, isFounder]);

  const handleSaveProfile = async () => {
    setEditLoading(true);
    setEditError('');
    try {
      const updated = await usersAPI.update(user._id, editForm);
      setUser(updated);
      setEditOpen(false);
    } catch (err) {
      setEditError(err?.response?.data?.error || 'Failed to save');
    } finally { setEditLoading(false); }
  };

  const totalViews = myStartups.reduce((s, p) => s + (p.views || 0), 0);
  const totalLikes = myStartups.reduce((s, p) => s + (p.likes || 0), 0);
  const approvedCount = myStartups.filter(s => s.status === 'approved').length;

  return (
    <div className="h-full overflow-y-auto scrollbar-hide bg-background pb-24">
      <div className="px-4 lg:px-6 pt-12 lg:pt-6 max-w-3xl mx-auto">
        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative">
          <div className="h-24 rounded-2xl bg-gradient-to-r from-accent via-purple-500 to-pink-500 mb-10" />
          <div className="absolute top-14 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-background">
              {user?.name?.[0]?.toUpperCase() || '?'}
            </div>
          </div>
        </motion.div>

        <div className="text-center mt-2 mb-4">
          <h1 className="text-xl font-bold text-white">{user?.name}</h1>
          {user?.headline && <p className="text-sm text-zinc-400 mt-0.5">{user.headline}</p>}
          <div className="flex items-center justify-center gap-3 mt-1.5 text-xs text-muted">
            {user?.company && <span className="flex items-center gap-1"><Briefcase size={12} />{user.company}</span>}
            {user?.location && <span className="flex items-center gap-1"><MapPin size={12} />{user.location}</span>}
          </div>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Badge label={isFounder ? 'Founder' : 'Investor'} />
            {user?.verified && <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-medium">Verified</span>}
          </div>
          {user?.bio && <p className="text-zinc-400 text-sm mt-3 max-w-xs mx-auto leading-relaxed">{user.bio}</p>}
          {user?.website && (
            <a href={user.website.startsWith('http') ? user.website : `https://${user.website}`} target="_blank" rel="noopener noreferrer" className="text-accent text-xs mt-1 flex items-center justify-center gap-1 hover:underline">
              <Globe size={12} />{user.website}
            </a>
          )}
        </div>

        {/* Stats */}
        <div className="flex bg-surface rounded-2xl p-4 mb-5 border border-border/50">
          {isFounder ? (
            <>
              <StatCard value={myStartups.length} label="Pitches" icon={Briefcase} />
              <div className="w-px bg-border" />
              <StatCard value={totalViews} label="Views" icon={Eye} />
              <div className="w-px bg-border" />
              <StatCard value={totalLikes} label="Likes" icon={Heart} />
              <div className="w-px bg-border" />
              <StatCard value={user?.followers?.length || 0} label="Followers" icon={TrendingUp} />
            </>
          ) : (
            <>
              <StatCard value={bookmarks.length} label="Saved" icon={Heart} />
              <div className="w-px bg-border" />
              <StatCard value={user?.following?.length || 0} label="Following" icon={TrendingUp} />
              <div className="w-px bg-border" />
              <StatCard value={user?.followers?.length || 0} label="Followers" icon={TrendingUp} />
            </>
          )}
        </div>

        {/* Content Tabs */}
        {isFounder && (
          <div className="flex bg-surface rounded-xl p-1 mb-4">
            {[{ key: 'pitches', label: 'My Pitches' }, { key: 'stats', label: 'Analytics' }].map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === t.key ? 'bg-accent text-white' : 'text-muted'}`}
              >{t.label}</button>
            ))}
          </div>
        )}

        {/* Founder: Pitches */}
        {isFounder && activeTab === 'pitches' && (
          <div className="mb-6">
            {loading ? (
              <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" /></div>
            ) : myStartups.length === 0 ? (
              <div className="text-center py-10 text-muted">
                <p className="text-3xl mb-2">🚀</p>
                <p className="font-medium">No pitches yet</p>
                <button onClick={() => navigate('/upload')} className="mt-3 text-accent text-sm font-semibold">Upload your first pitch →</button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {myStartups.map(s => {
                  const sc = statusConfig[s.status] || statusConfig.draft;
                  const StatusIcon = sc.icon;
                  return (
                    <div key={s._id} onClick={() => navigate(`/startup/${s._id}`)} className="bg-surface rounded-2xl p-4 border border-border/50 active:scale-[0.98] transition-transform cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold text-sm truncate">{s.name}</h3>
                          <p className="text-xs text-muted truncate">{s.tagline}</p>
                        </div>
                        <span className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full ${sc.color}`}>
                          <StatusIcon size={10} />{sc.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted">
                        <span className="flex items-center gap-1"><Eye size={12} /> {s.views || 0}</span>
                        <span className="flex items-center gap-1"><Heart size={12} /> {s.likes || 0}</span>
                        <span>{s.industry}</span>
                        <span>{s.stage}</span>
                      </div>
                      {s.status === 'rejected' && s.rejectionReason && (
                        <p className="text-xs text-red-400/80 mt-2 bg-red-500/5 rounded-lg p-2">
                          Reason: {s.rejectionReason}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Founder: Analytics */}
        {isFounder && activeTab === 'stats' && (
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface rounded-2xl p-4 border border-border/50">
                <p className="text-muted text-xs">Total Views</p>
                <p className="text-2xl font-bold text-white mt-1">{totalViews}</p>
              </div>
              <div className="bg-surface rounded-2xl p-4 border border-border/50">
                <p className="text-muted text-xs">Total Likes</p>
                <p className="text-2xl font-bold text-white mt-1">{totalLikes}</p>
              </div>
              <div className="bg-surface rounded-2xl p-4 border border-border/50">
                <p className="text-muted text-xs">Approved Pitches</p>
                <p className="text-2xl font-bold text-green-400 mt-1">{approvedCount}</p>
              </div>
              <div className="bg-surface rounded-2xl p-4 border border-border/50">
                <p className="text-muted text-xs">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-400 mt-1">{myStartups.filter(s => s.status === 'pending').length}</p>
              </div>
            </div>
          </div>
        )}

        {/* Investor: Bookmarks */}
        {!isFounder && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white mb-3">Saved Startups</h2>
            {loading ? (
              <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" /></div>
            ) : bookmarks.length === 0 ? (
              <div className="text-center py-10 text-muted">
                <p className="text-3xl mb-2">🔖</p>
                <p className="font-medium">No bookmarks yet</p>
                <p className="text-sm mt-1">Save startups you're interested in</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {bookmarks.map(s => <StartupCard key={s._id} startup={s} />)}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2 mb-4">
          <button onClick={() => setEditOpen(true)} className="w-full flex items-center gap-4 px-4 py-3.5 bg-surface border border-border/50 rounded-2xl text-white active:bg-border transition-colors">
            <Edit3 size={18} className="text-accent" />
            <span className="flex-1 text-left text-sm font-medium">Edit Profile</span>
          </button>
          <button onClick={logout} className="w-full flex items-center gap-4 px-4 py-3.5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 active:bg-red-500/20 transition-colors">
            <LogOut size={18} />
            <span className="text-sm font-medium">Log Out</span>
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {editOpen && (
          <>
            <motion.div className="fixed inset-0 bg-black/60 z-40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditOpen(false)} />
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50 bg-surface rounded-t-3xl max-w-mobile mx-auto p-5 max-h-[85vh] overflow-y-auto"
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-lg">Edit Profile</h3>
                <button onClick={() => setEditOpen(false)}><X size={20} className="text-muted" /></button>
              </div>

              <div className="flex flex-col gap-3">
                {[
                  { key: 'name', label: 'Name', placeholder: 'Your name' },
                  { key: 'headline', label: 'Headline', placeholder: 'e.g. Founder @ StartupX' },
                  { key: 'company', label: isFounder ? 'Company' : 'Fund / Firm', placeholder: 'Company name' },
                  { key: 'location', label: 'Location', placeholder: 'City, Country' },
                  { key: 'website', label: 'Website', placeholder: 'https://...' },
                  { key: 'linkedin', label: 'LinkedIn', placeholder: 'LinkedIn URL' },
                  { key: 'twitter', label: 'Twitter / X', placeholder: '@handle' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-xs text-muted font-medium mb-1 block">{f.label}</label>
                    <input
                      className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-white placeholder:text-muted/50 focus:outline-none focus:border-accent text-sm"
                      value={editForm[f.key]} onChange={e => setEditForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder}
                    />
                  </div>
                ))}

                <div>
                  <label className="text-xs text-muted font-medium mb-1 block">Bio</label>
                  <textarea
                    className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-white placeholder:text-muted/50 focus:outline-none focus:border-accent resize-none text-sm"
                    rows={3} value={editForm.bio} onChange={e => setEditForm(p => ({ ...p, bio: e.target.value }))}
                    placeholder="Tell others about yourself…"
                  />
                </div>

                {!isFounder && (
                  <div>
                    <label className="text-xs text-muted font-medium mb-1 block">Investment Thesis</label>
                    <textarea
                      className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-white placeholder:text-muted/50 focus:outline-none focus:border-accent resize-none text-sm"
                      rows={2} value={editForm.investmentThesis} onChange={e => setEditForm(p => ({ ...p, investmentThesis: e.target.value }))}
                      placeholder="What kind of startups are you looking for?"
                    />
                  </div>
                )}

                {editError && <p className="text-red-400 text-sm">{editError}</p>}

                <Button onClick={handleSaveProfile} disabled={editLoading} className="w-full">
                  {editLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2"><Save size={16} /> Save</span>
                  )}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

