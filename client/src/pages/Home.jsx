import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Clock, ArrowRight, ShieldCheck, Zap, Car } from 'lucide-react';
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
        <div className="bg-slate-950 min-h-screen overflow-hidden relative selection:bg-blue-500/30 selection:text-blue-200">
            {/* HERO SECTION */}
            <div className="relative min-h-[85vh] flex flex-col justify-center pt-20">
                {/* Background Imaging & Gradient Overlay */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
                        alt="Premium Parking" 
                        className="w-full h-full object-cover opacity-20 filter grayscale contrast-125"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/80 to-slate-950"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
                </div>

                {/* Animated Parking Visualization Overlay */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
                    <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-green-400 shadow-[0_0_15px_#4ade80] animate-pulse"></div>
                    <div className="absolute top-1/3 right-1/3 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_15px_#ef4444]"></div>
                    <div className="absolute bottom-1/3 left-1/2 w-2 h-2 rounded-full bg-green-400 shadow-[0_0_15px_#4ade80] animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-1/2 right-1/4 w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_15px_#facc15]"></div>
                    
                    {/* Simulated moving car */}
                    <div className="absolute top-1/2 left-0 w-20 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50" style={{ animation: 'drive 15s linear infinite' }}></div>
                </div>
                
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center text-center">
                    
                    {/* Floating Info Badges */}
                    <div className="flex flex-wrap justify-center gap-4 mb-8 animate-fade-in opacity-0" style={{ animationFillMode: 'forwards' }}>
                        <div className="glass-card rounded-full px-5 py-2 flex items-center gap-2 text-xs font-semibold text-slate-300">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-subtle"></span>
                            LIVE AVAILABILITY: 126 SPACES
                        </div>
                        <div className="glass-card rounded-full px-5 py-2 flex items-center gap-2 text-xs font-semibold text-slate-300">
                            NEAR YOU: 8 LOCATIONS
                        </div>
                        <div className="glass-card rounded-full px-5 py-2 flex items-center gap-2 text-xs font-semibold text-slate-300 text-blue-300">
                            AVG PRICE: ₹40/HR
                        </div>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight leading-tight animate-slide-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                        Find your space. <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400">Park without the wait.</span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-slate-400 font-light mb-16 max-w-2xl animate-slide-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                        Discover premium parking locations nearby, reserve your spot in advance, and arrive with confidence.
                    </p>

                    {/* Premium Search Console */}
                    <div className="w-full max-w-5xl animate-slide-up opacity-0" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
                        <form onSubmit={handleSearch} className="glass-panel rounded-3xl p-4 md:p-6 flex flex-col md:flex-row gap-4 items-end group transition-all duration-300 hover:border-blue-500/30">
                            
                            <div className="flex-1 w-full text-left relative">
                                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest pl-2">Where</label>
                                <div className="relative">
                                    <MapPin size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input 
                                        type="text" 
                                        value={searchLocation}
                                        onChange={(e) => setSearchLocation(e.target.value)}
                                        placeholder="Search a location or destination"
                                        className="w-full bg-slate-950/50 border border-slate-700/50 text-white rounded-2xl pl-12 pr-6 py-4 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none transition-all text-lg shadow-inner placeholder:text-slate-600" 
                                    />
                                </div>
                            </div>
                            
                            <div className="flex gap-4 w-full md:w-auto text-left">
                                <div className="flex-1 md:w-40">
                                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest pl-2">Date</label>
                                    <input type="date" className="w-full bg-slate-950/50 border border-slate-700/50 text-slate-300 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none transition-all shadow-inner [color-scheme:dark]" />
                                </div>
                                <div className="flex-1 md:w-32">
                                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest pl-2">Arrival</label>
                                    <input type="time" className="w-full bg-slate-950/50 border border-slate-700/50 text-slate-300 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none transition-all shadow-inner [color-scheme:dark]" />
                                </div>
                            </div>
                            
                            <button type="submit" className="w-full md:w-auto glass-button font-bold py-4 px-10 rounded-2xl flex items-center justify-center gap-3">
                                <span>Find Parking</span>
                                <ArrowRight size={20} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* TRUST / LIVE INFORMATION STRIP */}
            <div className="border-y border-slate-800/50 bg-slate-900/30 backdrop-blur-sm relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium text-slate-400">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"></div>
                        <span className="tracking-widest uppercase text-xs font-bold">Live Network</span>
                    </div>
                    <div className="hidden md:block w-px h-4 bg-slate-800"></div>
                    <div>126 spaces currently available</div>
                    <div className="hidden md:block w-px h-4 bg-slate-800"></div>
                    <div>Secure encrypted booking</div>
                    <div className="hidden md:block w-px h-4 bg-slate-800"></div>
                    <div>Instant digital pass issuance</div>
                </div>
            </div>

            {/* FEATURES SECTION */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Precision engineered for drivers.</h2>
                    <p className="text-lg text-slate-400 font-light">The technology you need to make parking an afterthought.</p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="glass-card p-10 rounded-3xl group">
                        <div className="mb-8 w-14 h-14 rounded-2xl bg-blue-900/30 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                            <Search size={28} strokeWidth={1.5} />
                        </div>
                        <div className="text-xs font-bold text-blue-500 mb-2 tracking-widest uppercase">01</div>
                        <h3 className="text-xl font-bold text-white mb-4">Instant Radar</h3>
                        <p className="text-slate-400 font-light leading-relaxed">Find the closest available parking in seconds using our real-time availability network.</p>
                    </div>
                    
                    {/* Feature 2 */}
                    <div className="glass-card p-10 rounded-3xl group">
                        <div className="mb-8 w-14 h-14 rounded-2xl bg-indigo-900/30 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                            <ShieldCheck size={28} strokeWidth={1.5} />
                        </div>
                        <div className="text-xs font-bold text-indigo-500 mb-2 tracking-widest uppercase">02</div>
                        <h3 className="text-xl font-bold text-white mb-4">Ironclad Lock</h3>
                        <p className="text-slate-400 font-light leading-relaxed">Reserve your designated space before you arrive. Guaranteed availability upon entry.</p>
                    </div>
                    
                    {/* Feature 3 */}
                    <div className="glass-card p-10 rounded-3xl group">
                        <div className="mb-8 w-14 h-14 rounded-2xl bg-cyan-900/30 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-600 group-hover:text-white transition-all duration-300">
                            <Car size={28} strokeWidth={1.5} />
                        </div>
                        <div className="text-xs font-bold text-cyan-500 mb-2 tracking-widest uppercase">03</div>
                        <h3 className="text-xl font-bold text-white mb-4">Garage Sync</h3>
                        <p className="text-slate-400 font-light leading-relaxed">Manage all your vehicles and upcoming reservations securely from a single unified dashboard.</p>
                    </div>
                </div>
            </div>
            
            {/* NETWORK GLANCE SECTION */}
            <div className="relative py-32 border-t border-slate-800/50 bg-slate-900/20 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Parking, at a glance.</h2>
                    <div className="relative w-full max-w-4xl mx-auto h-[400px] glass-panel rounded-3xl overflow-hidden flex items-center justify-center">
                        <div className="text-center">
                            <MapPin size={48} className="text-slate-600 mx-auto mb-4" strokeWidth={1} />
                            <p className="text-slate-400 font-light">Interactive Network Map available in the Find Parking console.</p>
                            <button onClick={handleSearch} className="mt-6 px-6 py-2 border border-slate-600 text-slate-300 rounded-full hover:bg-slate-800 hover:text-white transition-all text-sm font-bold cursor-pointer">
                                View Live Map
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
