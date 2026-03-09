import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { startups } from '../lib/mockData';
import StartupCard from '../components/explore/StartupCard';
import FilterChips from '../components/explore/FilterChips';
import SearchBar from '../components/explore/SearchBar';
import { TrendingUp } from 'lucide-react';

const industries = ['All', 'FinTech', 'CleanTech', 'EdTech', 'HealthTech', 'SaaS', 'DeepTech'];
const stages = ['All', 'Pre-seed', 'Seed', 'Series A'];

export default function ExplorePage() {
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('All');
  const [stage, setStage] = useState('All');

  const filtered = useMemo(() => {
    return startups.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.tagline.toLowerCase().includes(search.toLowerCase());
      const matchIndustry = industry === 'All' || s.industry === industry;
      const matchStage = stage === 'All' || s.stage === stage;
      return matchSearch && matchIndustry && matchStage;
    });
  }, [search, industry, stage]);

  const trending = startups.slice().sort((a, b) => b.likes - a.likes).slice(0, 3);

  return (
    <div className="h-dvh overflow-y-auto scrollbar-hide bg-background pb-4">
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-4 pt-12 pb-3 flex flex-col gap-3">
        <h1 className="text-2xl font-bold text-white">Explore</h1>
        <SearchBar value={search} onChange={e => setSearch(e.target.value)} />
        <FilterChips options={industries} selected={industry} onSelect={setIndustry} />
        <FilterChips options={stages} selected={stage} onSelect={setStage} />
      </div>

      <div className="px-4">
        {!search && industry === 'All' && stage === 'All' && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={16} className="text-accent" />
              <h2 className="text-sm font-semibold text-white">Trending Now</h2>
            </div>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              {trending.map(s => (
                <div key={s.id} className="flex-shrink-0 w-36">
                  <StartupCard startup={s} compact />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {filtered.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <StartupCard startup={s} />
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-medium">No results found</p>
            <p className="text-sm mt-1">Try different filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
