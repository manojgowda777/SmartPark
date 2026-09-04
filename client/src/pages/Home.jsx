import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crosshair, MapPin, Target, Activity, Cpu, Radar, Terminal, ChevronRight } from 'lucide-react';
import { LanguageContext } from '../context/LanguageContext';

const Home = () => {
    const [searchLocation, setSearchLocation] = useState('');
    const [systemTime, setSystemTime] = useState(new Date().toISOString());
    const [typingText, setTypingText] = useState('');
    const fullText = "INITIALIZING SMARTPARK TACTICAL GRID...";
    const navigate = useNavigate();
    const { t: getT } = useContext(LanguageContext);
    const t = getT('home');

    // Simulate system clock & typing effect
    useEffect(() => {
        const timer = setInterval(() => setSystemTime(new Date().toISOString()), 1000);
        let i = 0;
        const typer = setInterval(() => {
            setTypingText(fullText.slice(0, i));
            i++;
            if (i > fullText.length) clearInterval(typer);
        }, 50);
        return () => { clearInterval(timer); clearInterval(typer); };
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        navigate('/find-parking', { state: { query: searchLocation } });
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-black text-cyan-500 font-mono overflow-hidden relative selection:bg-cyan-900 selection:text-cyan-100">
            {/* HUD Grid Background */}
            <div className="absolute inset-0 hud-grid opacity-30 pointer-events-none"></div>
            
            {/* HUD Scanner Line */}
            <div className="absolute top-0 left-0 w-full h-8 hud-scanner pointer-events-none z-0"></div>

            {/* Corner Targeting Brackets */}
            <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-cyan-500/50 pointer-events-none"></div>
            <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-cyan-500/50 pointer-events-none"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-cyan-500/50 pointer-events-none"></div>
            <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-cyan-500/50 pointer-events-none"></div>

            {/* Main Content */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24 z-10 flex flex-col items-center">
                
                {/* System Status Top Bar */}
                <div className="w-full flex justify-between items-start mb-16 text-xs md:text-sm font-bold text-cyan-600/80 tracking-widest">
                    <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-2"><Activity size={14} className="animate-pulse-fast text-cyan-400" /> SYS.STATUS: ONLINE</span>
                        <span>LAT: 47.6062 N | LNG: 122.3321 W</span>
                    </div>
                    <div className="flex flex-col items-end gap-1 text-right">
                        <span>{systemTime}</span>
                        <span>SECURE LINK ESTABLISHED</span>
                    </div>
                </div>

                {/* Hero Title Area */}
                <div className="text-center mb-16 w-full max-w-4xl">
                    <div className="flex items-center justify-center gap-3 mb-4 text-cyan-400">
                        <Terminal size={20} />
                        <span className="tracking-[0.2em] text-sm">{typingText}<span className="animate-pulse-fast">_</span></span>
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-500 tracking-tighter mb-4 hud-text-glow uppercase">
                        {t.hero || "Target Your Parking"}
                    </h1>
                    
                    <div className="flex items-center justify-center gap-4 text-cyan-500/60 text-sm tracking-[0.3em]">
                        <span className="h-[1px] w-12 bg-cyan-500/30"></span>
                        TACTICAL RESERVATION SYSTEM
                        <span className="h-[1px] w-12 bg-cyan-500/30"></span>
                    </div>
                </div>

                {/* Target Acquisition Form (Search) */}
                <div className="w-full max-w-3xl hud-border bg-cyan-950/20 backdrop-blur-sm p-1 relative group">
                    {/* Corner accents */}
                    <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-cyan-400"></div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-cyan-400"></div>
                    <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-cyan-400"></div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-cyan-400"></div>
                    
                    <form onSubmit={handleSearch} className="bg-black/60 p-6 md:p-8 flex flex-col md:flex-row gap-6 items-end relative overflow-hidden">
                        <div className="flex-1 w-full text-left">
                            <label className="text-[10px] font-bold text-cyan-500 mb-2 flex items-center gap-2 uppercase tracking-[0.2em]">
                                <Target size={14} className="animate-pulse-fast"/> Destination Coordinates
                            </label>
                            <div className="relative">
                                <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500/50" />
                                <input 
                                    type="text" 
                                    value={searchLocation}
                                    onChange={(e) => setSearchLocation(e.target.value)}
                                    placeholder="Enter Sector or City..."
                                    className="w-full bg-cyan-950/30 border border-cyan-900 text-cyan-100 placeholder-cyan-800 rounded-none px-12 py-4 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-400 focus:outline-none transition-all font-mono shadow-[inset_0_0_20px_rgba(6,182,212,0.1)] uppercase" 
                                />
                            </div>
                        </div>
                        
                        <button type="submit" className="w-full md:w-auto bg-cyan-900/40 border border-cyan-500 text-cyan-300 font-bold py-4 px-8 flex items-center justify-center gap-2 transition-all hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] uppercase tracking-widest group/btn cursor-pointer">
                            <Crosshair size={18} className="group-hover/btn:rotate-90 transition-transform duration-500" />
                            Lock Target
                        </button>
                    </form>
                </div>

                {/* Tactical Data Readouts (Features) */}
                <div className="grid md:grid-cols-3 gap-6 mt-24 w-full max-w-6xl">
                    <div className="hud-border bg-black/40 p-6 relative group overflow-hidden cursor-pointer hover:bg-cyan-950/40 transition-colors">
                        <div className="absolute top-0 right-0 p-2 text-[10px] text-cyan-700 font-bold">MOD.01</div>
                        <Radar size={32} className="text-cyan-400 mb-6 group-hover:animate-pulse-fast" />
                        <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide hud-text-glow">Instant Radar</h3>
                        <p className="text-cyan-600 text-sm leading-relaxed">Scan local sectors for optimal parking coordinates and live pricing feeds in real-time.</p>
                        <div className="mt-4 flex items-center gap-2 text-[10px] text-cyan-500 tracking-widest uppercase group-hover:text-cyan-300 transition-colors">
                            Initialize <ChevronRight size={12} />
                        </div>
                    </div>
                    
                    <div className="hud-border bg-black/40 p-6 relative group overflow-hidden cursor-pointer hover:bg-cyan-950/40 transition-colors">
                        <div className="absolute top-0 right-0 p-2 text-[10px] text-cyan-700 font-bold">MOD.02</div>
                        <Cpu size={32} className="text-cyan-400 mb-6 group-hover:animate-pulse-fast" />
                        <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide hud-text-glow">Ironclad Lock</h3>
                        <p className="text-cyan-600 text-sm leading-relaxed">Secure target locations with encrypted pre-booking. Spots are physically locked until your arrival.</p>
                        <div className="mt-4 flex items-center gap-2 text-[10px] text-cyan-500 tracking-widest uppercase group-hover:text-cyan-300 transition-colors">
                            Initialize <ChevronRight size={12} />
                        </div>
                    </div>
                    
                    <div className="hud-border bg-black/40 p-6 relative group overflow-hidden cursor-pointer hover:bg-cyan-950/40 transition-colors">
                        <div className="absolute top-0 right-0 p-2 text-[10px] text-cyan-700 font-bold">MOD.03</div>
                        <Target size={32} className="text-cyan-400 mb-6 group-hover:animate-pulse-fast" />
                        <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide hud-text-glow">Garage Sync</h3>
                        <p className="text-cyan-600 text-sm leading-relaxed">Synchronize multiple transport vehicles to your command profile for rapid deployment.</p>
                        <div className="mt-4 flex items-center gap-2 text-[10px] text-cyan-500 tracking-widest uppercase group-hover:text-cyan-300 transition-colors">
                            Initialize <ChevronRight size={12} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
