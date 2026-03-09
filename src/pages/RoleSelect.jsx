import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Rocket } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../lib/api';

export default function RoleSelect() {
  const { setUserRole, user } = useAuth();

  const roles = [
    {
      id: 'investor',
      icon: Briefcase,
      title: 'Investor',
      desc: 'I want to discover and fund startups',
      gradient: 'from-blue-500/20 to-indigo-500/20',
      border: 'border-blue-500/30',
    },
    {
      id: 'founder',
      icon: Rocket,
      title: 'Founder',
      desc: 'I have a startup to pitch',
      gradient: 'from-purple-500/20 to-pink-500/20',
      border: 'border-purple-500/30',
    },
  ];

  const handleRoleSelect = (id) => {
    setUserRole(id);
    // Persist role to DB if user is authenticated
    if (user?._id) {
      usersAPI.update(user._id, { role: id }).catch(() => {});
    }
  };

  return (
    <div className="min-h-dvh bg-background flex flex-col items-center justify-center px-6 gap-8 max-w-mobile mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Who are you?</h1>
        <p className="text-muted">Choose your role to personalize your experience</p>
      </div>

      <div className="flex flex-col gap-4 w-full">
        {roles.map(({ id, icon: Icon, title, desc, gradient, border }, i) => (
          <motion.button
            key={id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => handleRoleSelect(id)}
            className={`w-full p-6 rounded-2xl bg-gradient-to-br ${gradient} border ${border} flex items-center gap-5 text-left active:scale-95 transition-all`}
          >
            <div className="w-14 h-14 rounded-xl bg-surface flex items-center justify-center flex-shrink-0">
              <Icon size={28} className="text-accent" />
            </div>
            <div>
              <p className="text-white font-bold text-xl">{title}</p>
              <p className="text-muted text-sm mt-1">{desc}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

