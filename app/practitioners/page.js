"use client";

import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  MapPin, 
  Building, 
  ShieldCheck, 
  Sparkles,
  ExternalLink 
} from 'lucide-react';
import { useRealtimePlatformData } from '../../lib/realtimeStore';

export default function PractitionersDirectory() {
  const { users } = useRealtimePlatformData();
  const [searchTerm, setSearchTerm] = useState('');

  // Default initial practitioners if none exist yet
  const fallbackPractitioners = [
    {
      id: 'doc-1',
      name: 'Dr. Jane Muthoni',
      title: 'Dr.',
      specialty: 'Obstetrician & Gynecologist',
      facility: 'Kenyatta National Hospital',
      location: 'Nairobi, Kenya',
      authorityId: 'KMPDC-88219-A',
      cpdPoints: 48,
      verifiedDate: '2026-03-15',
      bio: 'Lead clinician specializing in high-risk obstetric emergencies and EMOTIVE protocol training across central Kenya.',
      photoURL: 'https://images.unsplash.com/photo-1594824813637-84ff0d0469b6?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'doc-2',
      name: 'Dr. Ronald Kasule',
      title: 'Dr.',
      specialty: 'Senior Midwife & Simulation Mentor',
      facility: 'Mulago National Referral Hospital',
      location: 'Kampala, Uganda',
      authorityId: 'UMDPC-40291-C',
      cpdPoints: 62,
      verifiedDate: '2026-04-10',
      bio: 'Facility Practice Coordinator guiding clinical officers and midwives in rural postpartum hemorrhage drills.',
      photoURL: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'doc-3',
      name: 'Dr. Amina Diallo',
      title: 'Dr.',
      specialty: 'Clinical Epidemiologist & HIV Care Specialist',
      facility: 'Dakar University Teaching Hospital',
      location: 'Dakar, Senegal',
      authorityId: 'MOH-SN-99120-X',
      cpdPoints: 35,
      verifiedDate: '2026-02-28',
      bio: 'Adolescent health researcher coordinating PMTCT peer educator mentorship networks in western Africa.',
      photoURL: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80'
    }
  ];

  const directoryList = (users && users.length > 0) 
    ? users.filter(u => u.role !== 'guest' && u.name)
    : fallbackPractitioners;

  const displayList = directoryList.length > 0 ? directoryList : fallbackPractitioners;

  const filtered = displayList.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.authorityId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.facility?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pamoja-shell font-['Inter'] pb-24">
      
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        <div className="pamoja-card border pamoja-divider rounded-[2rem] p-8 sm:p-10 shadow-xl relative overflow-hidden text-center max-w-4xl mx-auto">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-800 text-cyan-800 dark:text-cyan-300 text-[11px] font-black uppercase tracking-widest mb-4">
            <Users size={14} className="text-cyan-600 dark:text-cyan-400" /> Pan-African Medical Board Registry
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-['Outfit'] text-slate-900 dark:text-white tracking-tight mb-3">
            Verified Practitioner Directory
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Verify certified healthcare practitioners holding accredited Continuous Professional Development (CPD) credits validated across UMDPC, HPCSA, and KMPDC.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by practitioner name, specialty, facility, or council ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl pl-11 pr-4 py-3.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:bg-white shadow-xs" 
            />
          </div>

          <div className="absolute -top-24 -right-24 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      </div>

      {/* Directory Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filtered.length === 0 ? (
          <div className="pamoja-card border pamoja-divider rounded-[2rem] p-12 text-center text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">No practitioners found</h3>
            <p className="text-xs">Try adjusting your search criteria or clear the search input.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(p => (
              <div 
                key={p.id} 
                className="pamoja-card border border-slate-200 dark:border-slate-800 rounded-[2rem] p-7 shadow-xs hover:shadow-xl flex flex-col justify-between hover:border-cyan-500/50 transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-start gap-4 mb-5">
                    <img 
                      src={p.photoURL || 'https://images.unsplash.com/photo-1594824813637-84ff0d0469b6?auto=format&fit=crop&w=400&q=80'}
                      alt={p.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-800 shadow-md group-hover:scale-105 transition-transform shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider mb-0.5">
                        <ShieldCheck size={13} /> Medical Council Verified
                      </div>
                      <h3 className="text-lg font-bold font-['Outfit'] text-slate-900 dark:text-white truncate">
                        {p.title} {p.name}
                      </h3>
                      <div className="text-xs text-cyan-700 dark:text-cyan-400 font-semibold truncate">
                        {p.specialty}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-5 line-clamp-3">
                    {p.bio}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 pb-5 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <Building size={13} className="text-slate-400 shrink-0" />
                      <span className="truncate">{p.facility}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={13} className="text-slate-400 shrink-0" />
                      <span className="truncate">{p.location}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Validated Credits</span>
                    <span className="text-base font-black text-amber-700 dark:text-amber-400 font-['Outfit']">
                      {p.cpdPoints} CPD Points
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-cyan-800 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/70 border border-cyan-200 dark:border-cyan-800 px-2.5 py-1 rounded-lg">
                    {p.authorityId}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
