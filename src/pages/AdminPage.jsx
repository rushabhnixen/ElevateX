import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactPlayer from 'react-player';
import {
  Shield, Users, Rocket, Clock, CheckCircle, XCircle, LogOut, Eye,
  X, Search, Play, BarChart3, UserCheck, AlertTriangle,
  Heart, MessageCircle, RefreshCw, TrendingUp,
  Bookmark, Globe, DollarSign, Percent
} from 'lucide-react';
import { adminAPI } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';

function StatBox({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-surface rounded-2xl p-4 lg:p-5 border border-border/50 flex items-center gap-3">
      <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-2xl lg:text-3xl font-bold text-white">{value ?? '—'}</p>
        <p className="text-muted text-xs lg:text-sm">{label}</p>
      </div>
    </div>
  );
}

function VideoPreviewModal({ startup, onClose }) {
  if (!startup) return null;
  return (
    <>
      <motion.div
        className="fixed inset-0 bg-black/80 z-50"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="fixed inset-4 lg:inset-16 z-50 bg-surface rounded-2xl overflow-hidden flex flex-col lg:flex-row"
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
      >
        <div className="lg:w-1/2 h-48 lg:h-full bg-black flex items-center justify-center relative">
          {startup.videoUrl ? (
            <ReactPlayer
              url={startup.videoUrl}
              width="100%" height="100%"
              controls playing
              style={{ position: 'absolute', top: 0, left: 0 }}
              config={{ file: { attributes: { style: { width: '100%', height: '100%', objectFit: 'contain' } } } }}
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted">
              <Play size={48} />
              <p className="text-sm">No video uploaded</p>
            </div>
          )}
        </div>
        <div className="lg:w-1/2 flex-1 overflow-y-auto p-5 lg:p-6 flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl lg:text-2xl font-bold text-white">{startup.name}</h2>
              <p className="text-muted text-sm mt-1">{startup.tagline}</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-background transition-colors flex-shrink-0">
              <X size={20} className="text-muted" />
            </button>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Badge label={startup.industry} />
            <Badge label={startup.stage} />
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              startup.status === 'approved' ? 'bg-green-500/20 text-green-400' :
              startup.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
              startup.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-zinc-500/20 text-zinc-400'
            }`}>{startup.status}</span>
          </div>

          <p className="text-zinc-400 text-sm leading-relaxed">{startup.description || 'No description provided.'}</p>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-background rounded-xl p-3">
              <div className="flex items-center gap-2 text-muted text-xs mb-1"><DollarSign size={12} /> Raising</div>
              <p className="text-white font-semibold">${startup.askAmount || '—'}</p>
            </div>
            <div className="bg-background rounded-xl p-3">
              <div className="flex items-center gap-2 text-muted text-xs mb-1"><Percent size={12} /> Equity</div>
              <p className="text-white font-semibold">{startup.equity || '—'}</p>
            </div>
            <div className="bg-background rounded-xl p-3">
              <div className="flex items-center gap-2 text-muted text-xs mb-1"><TrendingUp size={12} /> Traction</div>
              <p className="text-white font-semibold">{startup.traction || '—'}</p>
            </div>
            <div className="bg-background rounded-xl p-3">
              <div className="flex items-center gap-2 text-muted text-xs mb-1"><Globe size={12} /> Website</div>
              <p className="text-white font-semibold text-xs truncate">{startup.website || '—'}</p>
            </div>
          </div>

          <div className="flex gap-4 text-xs text-muted border-t border-border pt-3">
            <span className="flex items-center gap-1"><Eye size={12} /> {startup.views || 0} views</span>
            <span className="flex items-center gap-1"><Heart size={12} /> {startup.likes || 0} likes</span>
            <span className="flex items-center gap-1"><MessageCircle size={12} /> {startup.comments || 0} comments</span>
            <span className="flex items-center gap-1"><Bookmark size={12} /> {startup.bookmarks || 0} saves</span>
          </div>

          {startup.founder && (
            <div className="flex items-center gap-3 bg-background rounded-xl p-3">
              <Avatar name={startup.founder.name || 'Unknown'} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm">{startup.founder.name}</p>
                <p className="text-muted text-xs">{startup.founder.title || startup.founder.bio || 'Founder'}</p>
              </div>
            </div>
          )}

          {startup.team?.length > 0 && (
            <div>
              <p className="text-xs text-muted font-medium mb-2">Team ({startup.team.length})</p>
              <div className="flex gap-2 flex-wrap">
                {startup.team.map((m, i) => (
                  <div key={i} className="flex items-center gap-2 bg-background rounded-lg px-2.5 py-1.5">
                    <Avatar name={m.name} size="sm" />
                    <div>
                      <p className="text-white text-xs font-medium">{m.name}</p>
                      <p className="text-muted text-[10px]">{m.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-muted">
            Submitted {new Date(startup.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            {startup.reviewedAt && ` · Reviewed ${new Date(startup.reviewedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
          </p>
        </div>
      </motion.div>
    </>
  );
}

export default function AdminPage() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('pending');
  const [stats, setStats] = useState(null);
  const [startups, setStartups] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState(null);
  const [previewStartup, setPreviewStartup] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const statsData = await adminAPI.getStats();
      setStats(statsData);

      if (tab === 'users') {
        const data = await adminAPI.getUsers({ role: userRoleFilter !== 'all' ? userRoleFilter : undefined });
        setUsers(data.users || data || []);
      } else {
        const data = await adminAPI.getStartups({ status: tab });
        setStartups(data.startups || data || []);
      }
    } catch (err) {
      console.error('Admin load error:', err);
    } finally {
      setLoading(false);
    }
  }, [tab, userRoleFilter]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleReview = async (id, status) => {
    setActionLoading(true);
    try {
      await adminAPI.reviewStartup(id, {
        status,
        ...(status === 'rejected' && rejectionReason ? { rejectionReason } : {}),
      });
      setReviewModal(null);
      setRejectionReason('');
      loadData();
    } catch (err) {
      console.error('Review error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerifyUser = async (userId, verified) => {
    try {
      await adminAPI.updateUser(userId, { verified });
      loadData();
    } catch {}
  };

  const filteredStartups = startups.filter(s =>
    !searchQuery ||
    s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.tagline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.founder?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(u =>
    !searchQuery ||
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = [
    { key: 'pending', label: 'Pending', icon: Clock, count: stats?.pendingStartups },
    { key: 'approved', label: 'Approved', icon: CheckCircle },
    { key: 'rejected', label: 'Rejected', icon: XCircle },
    { key: 'users', label: 'Users', icon: Users },
  ];

  return (
    <div className="h-dvh flex flex-col lg:flex-row bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 xl:w-72 flex-col border-r border-border bg-surface/50 shrink-0">
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center">
              <Shield size={18} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-base font-bold text-white">ElevateX Admin</h1>
              <p className="text-muted text-xs truncate">{user?.email}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 flex flex-col gap-1">
          {tabs.map(t => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => { setTab(t.key); setSearchQuery(''); }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active ? 'bg-accent text-white' : 'text-muted hover:bg-background hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span className="flex-1 text-left">{t.label}</span>
                {t.count > 0 && (
                  <span className={`text-[10px] rounded-full px-2 py-0.5 font-bold ${
                    active ? 'bg-white/20 text-white' : 'bg-red-500 text-white'
                  }`}>{t.count}</span>
                )}
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={18} /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden px-4 pt-10 pb-3 bg-surface/80 backdrop-blur-lg border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center">
                <Shield size={16} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Admin Panel</h1>
                <p className="text-muted text-[11px]">{user?.email}</p>
              </div>
            </div>
            <button onClick={logout} className="p-2 rounded-xl bg-surface border border-border/50 text-muted">
              <LogOut size={16} />
            </button>
          </div>
          <div className="flex bg-background rounded-xl p-1 overflow-x-auto scrollbar-hide">
            {tabs.map(t => {
              const Icon = t.icon;
              return (
                <button
                  key={t.key}
                  onClick={() => { setTab(t.key); setSearchQuery(''); }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap px-2 ${
                    tab === t.key ? 'bg-accent text-white' : 'text-muted'
                  }`}
                >
                  <Icon size={12} />{t.label}
                  {t.count > 0 && (
                    <span className="bg-red-500 text-white text-[9px] rounded-full px-1.5 py-0.5 min-w-[16px] text-center">
                      {t.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-xl font-bold text-white capitalize">
              {tab === 'users' ? 'User Management' : `${tab} Pitches`}
            </h2>
            <p className="text-muted text-sm">
              {tab === 'users' ? `${filteredUsers.length} users` : `${filteredStartups.length} ${tab} startups`}
            </p>
          </div>
          <button onClick={loadData} className="p-2 rounded-xl border border-border text-muted hover:text-white hover:bg-surface transition-colors" title="Refresh">
            <RefreshCw size={16} />
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="px-4 lg:px-6 pt-4">
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
              <StatBox label="Total Users" value={stats.totalUsers || 0} icon={Users} color="bg-blue-500/20 text-blue-400" />
              <StatBox label="Startups" value={stats.totalStartups || 0} icon={Rocket} color="bg-purple-500/20 text-purple-400" />
              <StatBox label="Pending" value={stats.pendingStartups || 0} icon={Clock} color="bg-yellow-500/20 text-yellow-400" />
              <StatBox label="Matches" value={stats.totalMatches || 0} icon={Heart} color="bg-pink-500/20 text-pink-400" />
              <StatBox label="Founders" value={stats.founders || 0} icon={Rocket} color="bg-green-500/20 text-green-400" />
              <StatBox label="Investors" value={stats.investors || 0} icon={BarChart3} color="bg-cyan-500/20 text-cyan-400" />
            </div>
          </div>
        )}

        {/* Search */}
        <div className="px-4 lg:px-6 pt-4">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder={tab === 'users' ? 'Search users by name or email...' : 'Search startups by name, tagline, or founder...'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-muted focus:outline-none focus:border-accent text-sm"
            />
          </div>
          {tab === 'users' && (
            <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
              {['all', 'founder', 'investor', 'admin'].map(r => (
                <button
                  key={r}
                  onClick={() => setUserRoleFilter(r)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all capitalize ${
                    userRoleFilter === r ? 'bg-accent text-white' : 'bg-surface border border-border text-muted'
                  }`}
                >{r}</button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 lg:px-6 pt-4 pb-8">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : tab === 'users' ? (
            filteredUsers.length === 0 ? (
              <div className="text-center py-16 text-muted">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No users found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {filteredUsers.map(u => (
                  <div key={u._id} className="bg-surface rounded-2xl p-4 border border-border/50 hover:border-border transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar name={u.name} size="md" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-white font-semibold text-sm truncate">{u.name}</p>
                          {u.verified && <CheckCircle size={12} className="text-green-400 flex-shrink-0" />}
                        </div>
                        <p className="text-muted text-xs truncate">{u.email}</p>
                      </div>
                      <Badge label={u.role} />
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted">
                      <span>Joined {new Date(u.createdAt).toLocaleDateString()}</span>
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleVerifyUser(u._id, !u.verified)}
                          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition-colors ${
                            u.verified
                              ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                              : 'bg-surface border border-border text-muted hover:text-white'
                          }`}
                        >
                          <UserCheck size={10} />
                          {u.verified ? 'Verified' : 'Verify'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            filteredStartups.length === 0 ? (
              <div className="text-center py-16 text-muted">
                <p className="text-3xl mb-2">{tab === 'pending' ? '⏳' : tab === 'approved' ? '✅' : '❌'}</p>
                <p className="font-medium">No {tab} startups</p>
                <p className="text-sm mt-1">{tab === 'pending' ? 'No pitches waiting for review' : `No ${tab} pitches found`}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                {filteredStartups.map(s => (
                  <motion.div
                    key={s._id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-surface rounded-2xl border border-border/50 hover:border-border transition-all overflow-hidden"
                  >
                    <div className={`h-1.5 w-full ${
                      tab === 'pending' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                      tab === 'approved' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                      'bg-gradient-to-r from-red-500 to-pink-500'
                    }`} />
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold text-sm truncate">{s.name}</h3>
                          <p className="text-muted text-xs truncate mt-0.5">{s.tagline}</p>
                        </div>
                        <button
                          onClick={() => setPreviewStartup(s)}
                          className="p-1.5 rounded-lg hover:bg-background text-muted hover:text-white transition-colors flex-shrink-0 ml-2"
                          title="Preview pitch"
                        >
                          <Eye size={14} />
                        </button>
                      </div>

                      <div className="flex gap-1.5 mb-3 flex-wrap">
                        <Badge label={s.industry} />
                        <Badge label={s.stage} />
                      </div>

                      <p className="text-zinc-400 text-xs line-clamp-2 mb-3">{s.description}</p>

                      <div className="flex items-center gap-3 text-xs text-muted mb-3 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Avatar name={s.founder?.name || '?'} size="sm" className="!w-4 !h-4 !text-[8px]" />
                          {s.founder?.name || 'Unknown'}
                        </span>
                        <span>💰 ${s.askAmount}</span>
                        <span>{s.equity} equity</span>
                      </div>

                      <div className="flex gap-3 text-xs text-muted border-t border-border/50 pt-2.5 mb-3">
                        <span className="flex items-center gap-1"><Eye size={11} /> {s.views || 0}</span>
                        <span className="flex items-center gap-1"><Heart size={11} /> {s.likes || 0}</span>
                        <span className="flex items-center gap-1"><MessageCircle size={11} /> {s.comments || 0}</span>
                      </div>

                      {tab === 'pending' && (
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1" onClick={() => handleReview(s._id, 'approved')} disabled={actionLoading}>
                            <CheckCircle size={13} className="mr-1 inline" /> Approve
                          </Button>
                          <button
                            onClick={() => setReviewModal(s)}
                            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl border border-red-500/30 text-red-400 text-xs font-semibold active:bg-red-500/10 transition-colors"
                          >
                            <XCircle size={13} /> Reject
                          </button>
                        </div>
                      )}

                      {tab === 'rejected' && s.rejectionReason && (
                        <div className="flex items-start gap-2 text-xs text-red-400/80 bg-red-500/5 rounded-lg p-2.5">
                          <AlertTriangle size={13} className="flex-shrink-0 mt-0.5" />
                          <p>{s.rejectionReason}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )
          )}
        </div>
      </div>

      {/* Rejection Modal */}
      <AnimatePresence>
        {reviewModal && (
          <>
            <motion.div className="fixed inset-0 bg-black/60 z-40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setReviewModal(null)} />
            <motion.div
              className="fixed bottom-0 left-0 right-0 lg:bottom-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 z-50 bg-surface rounded-t-3xl lg:rounded-2xl lg:max-w-lg lg:w-full p-5"
              initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-lg">Reject "{reviewModal.name}"</h3>
                <button onClick={() => setReviewModal(null)}><X size={20} className="text-muted" /></button>
              </div>
              <p className="text-muted text-sm mb-3">This will notify the founder that their pitch was rejected.</p>
              <textarea
                className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-white placeholder:text-muted/50 focus:outline-none focus:border-accent resize-none text-sm mb-4"
                rows={3}
                placeholder="Reason for rejection (optional but recommended)…"
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
              />
              <div className="flex gap-3">
                <button onClick={() => setReviewModal(null)} className="flex-1 py-2.5 rounded-xl border border-border text-muted text-sm font-medium hover:bg-background transition-colors">Cancel</button>
                <button
                  onClick={() => handleReview(reviewModal._id, 'rejected')}
                  disabled={actionLoading}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold disabled:opacity-50 hover:bg-red-600 transition-colors"
                >
                  {actionLoading ? 'Rejecting…' : 'Reject Startup'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Video Preview Modal */}
      <AnimatePresence>
        {previewStartup && (
          <VideoPreviewModal startup={previewStartup} onClose={() => setPreviewStartup(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
