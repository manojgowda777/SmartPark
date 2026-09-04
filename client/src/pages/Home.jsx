import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Clock, Car } from 'lucide-react';
import { LanguageContext } from '../context/LanguageContext';

const Home = () => {
    const [searchLocation, setSearchLocation] = useState('');
    const navigate = useNavigate();
    const { t: getT } = useContext(LanguageContext);
    const t = getT('home');

    const handleSearch = (e) => {
        e.preventDefault();
        navigate('/find-parking', { state: { query: searchLocation } });
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50 overflow-hidden relative">

            {/* Hero Section */}
            <div className="relative overflow-hidden min-h-[700px] flex flex-col justify-center bg-gradient-to-br from-[#0B1533] via-blue-600 to-indigo-500 shadow-2xl">
                {/* Background Video/Image with Parallax feel */}
                <div className="absolute inset-0">
                    <img 
                        src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
                        alt="Parking facility" 
                        className="w-full h-full object-cover scale-110  mix-blend-overlay opacity-40"
                        style={{ animationDuration: '10s' }}
                    />
                </div>
                
                {/* Animated Glowing Orbs */}
                
                
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col items-center text-center z-20">
                    <div className="">
                        <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-6 drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]">
                            {t.hero.split(' ')[0]} {t.hero.split(' ')[1]} <br className="hidden md:block"/> 
                            <span className=" text-sky-400 ">
                                {t.hero.split(' ').slice(2).join(' ')}
                            </span>
                        </h1>
                        <p className="mt-6 text-2xl text-blue-100 max-w-3xl mx-auto font-medium mb-12 drop-shadow-lg">
                            {t.sub}
                        </p>
                    </div>

                    {/* Search Component with Glassmorphism */}
                    <div className="w-full max-w-5xl mx-auto relative group perspective-1000 ">
                        
                        <form onSubmit={handleSearch} className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 md:p-10 shadow-2xl flex flex-col md:flex-row gap-6 items-end relative overflow-hidden group-hover:rotate-x-2 transition-transform duration-500">
                            {/* Inner neon streak */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
                            
                            <div className="flex-1 w-full text-left z-10">
                                <label className="block text-sm font-black text-[#0F172A] mb-3 flex items-center gap-2 uppercase tracking-wider"><MapPin size={20} className="text-blue-600 animate-bounce"/> {t.dest}</label>
                                <input 
                                    type="text" 
                                    value={searchLocation}
                                    onChange={(e) => setSearchLocation(e.target.value)}
                                    placeholder={t.destPh}
                                    className="w-full bg-slate-100 border-2 border-transparent text-[#0F172A] rounded-2xl px-6 py-5 focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 focus:outline-none transition-all font-bold text-xl shadow-inner hover:bg-white" 
                                />
                            </div>
                            <div className="flex gap-6 w-full md:w-auto text-left z-10">
                                <div className="flex-1 md:w-44">
                                    <label className="block text-sm font-black text-[#0F172A] mb-3 flex items-center gap-2 uppercase tracking-wider"><Calendar size={20} className="text-blue-600 "/> {t.date}</label>
                                    <input type="date" className="w-full bg-slate-100 border-2 border-transparent text-[#0F172A] rounded-2xl px-5 py-5 focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 focus:outline-none transition-all shadow-inner font-bold hover:bg-white" />
                                </div>
                                <div className="flex-1 md:w-36">
                                    <label className="block text-sm font-black text-[#0F172A] mb-3 flex items-center gap-2 uppercase tracking-wider"><Clock size={20} className="text-blue-600 animate-spin-slow"/> {t.time}</label>
                                    <input type="time" className="w-full bg-slate-100 border-2 border-transparent text-[#0F172A] rounded-2xl px-5 py-5 focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 focus:outline-none transition-all shadow-inner font-bold hover:bg-white" />
                                </div>
                            </div>
                            <button type="submit" className="w-full md:w-auto relative group overflow-hidden bg-[#0B1533] text-white hover:bg-[#1D4ED8] font-black py-5 px-12 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex items-center justify-center gap-3 transition-all hover:scale-110 z-10">
                                <div className="absolute inset-0 bg-blue-700  opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <Search size={26} className="relative z-10 group-hover:rotate-12 transition-transform" />
                                <span className="relative z-10 text-xl tracking-wide">{t.blast}</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10">
                <div className="text-center mb-24 relative ">
                    <h2 className="text-5xl md:text-6xl font-black  bg-gradient-to-r from-slate-900 to-slate-500 mb-6 tracking-tighter">Next-Gen Parking</h2>
                    <p className="mt-4 text-2xl text-slate-500 font-bold">We make parking seamless for everyone.</p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-14">
                    <div className="bg-white/70 backdrop-blur-xl p-12 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white hover:shadow-[0_30px_60px_rgba(59,130,246,0.3)] hover:-translate-y-6 transition-all duration-500 text-center group cursor-pointer relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative w-28 h-28 bg-blue-600 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-10 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-2xl shadow-blue-500/50 ">
                            <Search size={48} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-3xl font-black text-[#0F172A] mb-5 group-hover:text-blue-600 transition-colors relative z-10">Instant Radar</h3>
                        <p className="text-slate-500 text-xl leading-relaxed relative z-10 font-medium">Find the absolute closest and cheapest parking spots near your destination instantly.</p>
                    </div>
                    
                    <div className="bg-white/70 backdrop-blur-xl p-12 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white hover:shadow-[0_30px_60px_rgba(16,185,129,0.3)] hover:-translate-y-6 transition-all duration-500 text-center group cursor-pointer relative overflow-hidden mt-0 md:mt-12">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative w-28 h-28 bg-white text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-10 group-hover:scale-125 group-hover:-rotate-12 transition-all duration-500 shadow-2xl shadow-emerald-500/50 ">
                            <MapPin size={48} strokeWidth={2.5} />
                        </div>
                        <h3 className="relative text-3xl font-black text-[#0F172A] mb-5 group-hover:text-emerald-600 transition-colors z-10">Ironclad Lock</h3>
                        <p className="relative text-slate-500 text-xl leading-relaxed z-10 font-medium">Book in advance and never worry about finding a space when you arrive.</p>
                    </div>
                    
                    <div className="bg-white/70 backdrop-blur-xl p-12 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white hover:shadow-[0_30px_60px_rgba(168,85,247,0.3)] hover:-translate-y-6 transition-all duration-500 text-center group cursor-pointer relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative w-28 h-28 bg-white text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-10 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-2xl shadow-purple-500/50 ">
                            <Car size={48} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-3xl font-black text-[#0F172A] mb-5 group-hover:text-blue-600 transition-colors relative z-10">Garage Sync</h3>
                        <p className="text-slate-500 text-xl leading-relaxed relative z-10 font-medium">Save multiple vehicles and switch between them seamlessly when booking.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
