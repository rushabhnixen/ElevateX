import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { startupsAPI } from '../lib/api';
import StartupCard from '../components/explore/StartupCard';
import FilterChips from '../components/explore/FilterChips';
import SearchBar from '../components/explore/SearchBar';
import { TrendingUp, Loader2 } from 'lucide-react';

const industries = ['All', 'FinTech', 'CleanTech', 'EdTech', 'HealthTech', 'SaaS', 'DeepTech', 'AI/ML', 'Web3', 'BioTech'];
const stages = ['All', 'Pre-seed', 'Seed', 'Series A', 'Series B+'];

export default function ExplorePage() {
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('All');
  const [stage, setStage] = useState('All');
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const fetchStartups = useCallback(async () => {
    setLoading(true);
    try {
      const params = { status: 'approved', limit: 40 };
      if (industry !== 'All') params.industry = industry;
      if (stage !== 'All') params.stage = stage;
      if (search.trim()) params.search = search.trim();
      const data = await startupsAPI.list(params);
      setStartups(data.startups || []);
      setTotal(data.total || 0);
    } catch {
      setStartups([]);
    } finally {
      setLoading(false);
    }
  }, [industry, stage, search]);

  useEffect(() => {
    const t = setTimeout(fetchStartups, search ? 300 : 0);
    return () => clearTimeout(t);
  }, [fetchStartups]);

  const trending = [...startups].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 4);

  return (
    <div className="h-full overflow-y-auto scrollbar-hide bg-background pb-20">
      <div className="sticky top-0 bg-background/95 backdrop-blur-lg z-10 px-4 lg:px-6 pt-12 lg:pt-6 pb-3 flex flex-col gap-3 border-b border-border/50">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Explore</h1>
          <span className="text-xs text-muted">{total} startups</span>
        </div>
        <SearchBar value={search} onChange={e => setSearch(e.target.value)} />
        <FilterChips options={industries} selected={industry} onSelect={setIndustry} />
        <FilterChips options={stages} selected={stage} onSelect={setStage} />
      </div>

      <div className="px-4 lg:px-6 pt-4">
        {!search && industry === 'All' && stage === 'All' && trending.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={16} className="text-accent" />
              <h2 className="text-sm font-semibold text-white">Trending Now</h2>
            </div>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              {trending.map(s => (
                <div key={s._id} className="flex-shrink-0 w-40 lg:w-48">
                  <StartupCard startup={s} compact />
                </div>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-6 h-6 text-accent animate-spin" />
          </div>
        ) : startups.length === 0 ? (
          <div className="text-center py-20 text-muted">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-medium">No startups found</p>
            <p className="text-sm mt-1">Try different filters or check back later</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {startups.map((s, i) => (
              <motion.div
                key={s._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <StartupCard startup={s} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
