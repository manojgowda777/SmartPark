import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, Star, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import { LanguageContext } from '../context/LanguageContext';

const ParkingDetails = () => {
    const { id } = useParams();
    const { t: getT } = useContext(LanguageContext);
    const t = getT('details');
    const [location, setLocation] = useState(null);
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const [locRes, slotRes] = await Promise.all([
                    api.get(`/parking/${id}`),
                    api.get(`/parking/${id}/slots`)
                ]);
                setLocation(locRes.data);
                setSlots(slotRes.data);
            } catch (error) {
                console.error("Failed to fetch parking details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    // Live Ghost Occupancy Simulator
    useEffect(() => {
        if (loading || slots.length === 0) return;
        
        const interval = setInterval(() => {
            setSlots(currentSlots => {
                const newSlots = [...currentSlots];
                // Pick a random slot to toggle
                const randomIndex = Math.floor(Math.random() * newSlots.length);
                const slot = newSlots[randomIndex];
                
                // Don't toggle the currently selected slot
                if (slot.id !== selectedSlot) {
                    slot.status = slot.status === 'AVAILABLE' ? 'OCCUPIED' : 'AVAILABLE';
                }
                
                return newSlots;
            });
        }, 3000); // Random flip every 3 seconds

        return () => clearInterval(interval);
    }, [loading, slots.length, selectedSlot]);

    const handleSlotSelect = (slot) => {
        if (slot.status === 'AVAILABLE') {
            setSelectedSlot(slot.id === selectedSlot ? null : slot.id);
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>;
    }

    if (!location) return <div className="p-8 text-center text-slate-500">Location not found.</div>;

    const availableCount = slots.filter(s => s.status === 'AVAILABLE').length;

    return (
        <div className="bg-slate-50 min-h-[calc(100vh-4rem)] p-4 sm:p-8">
            <div className="max-w-6xl mx-auto">
                <Link to="/find-parking" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold mb-6 transition-colors">
                    <ArrowLeft size={20} /> Back to Search
                </Link>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column: Location Info & Slot Grid */}
                    <div className="flex-1 space-y-8">
                        
                        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-8 items-start">
                            <img src={location.image || "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=300"} alt={location.name} className="w-full md:w-48 h-48 object-cover rounded-2xl shadow-md" />
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h1 className="text-3xl font-black text-slate-900 leading-tight">{location.name}</h1>
                                    <span className="flex items-center text-sm font-bold text-amber-500 gap-1 bg-amber-50 px-3 py-1.5 rounded-lg"><Star size={16} fill="currentColor"/> 4.8</span>
                                </div>
                                <p className="text-slate-500 font-medium flex items-center gap-2 mb-6"><MapPin size={18} className="text-blue-500"/> {location.address}, {location.city}</p>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center"><Clock size={20}/></div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium uppercase">Hours</p>
                                            <p className="text-sm font-bold text-slate-900">{location.opening_time.slice(0,5)} - {location.closing_time.slice(0,5)}</p>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center"><MapPin size={20}/></div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium uppercase">Available Slots</p>
                                            <p className="text-sm font-bold text-slate-900">{availableCount} / {slots.length}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <style>{`
                            @keyframes slideRight {
                                0% { transform: translateX(-100px); opacity: 0; }
                                10% { opacity: 0.5; }
                                90% { opacity: 0.5; }
                                100% { transform: translateX(800px); opacity: 0; }
                            }
                            @keyframes slideLeft {
                                0% { transform: translateX(100px); opacity: 0; }
                                10% { opacity: 0.5; }
                                90% { opacity: 0.5; }
                                100% { transform: translateX(-800px); opacity: 0; }
                            }
                        `}</style>
                        <div className="bg-slate-950 p-6 rounded-3xl shadow-2xl border border-slate-800 relative overflow-hidden">
                            {/* Futuristic Background Elements */}
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 pointer-events-none"></div>
                            
                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                                <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.3)] tracking-wide">
                                    SELECT A SLOT
                                </h2>
                                {/* Modern Legend */}
                                <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-600 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full border border-slate-200 shadow-inner">
                                    <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></div> {t.free || 'Available'}</span>
                                    <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]"></div> {t.full || 'Occupied'}</span>
                                    <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_8px_#eab308]"></div> Reserved</span>
                                    <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_8px_#06b6d4]"></div> âš¡ EV</span>
                                    <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6] border border-blue-200 animate-pulse"></div> {t.selected || 'Selected'}</span>
                                </div>
                            </div>

                            <div className="bg-white/60 p-6 md:p-12 rounded-2xl border border-slate-200 overflow-x-auto relative shadow-[inset_0_0_40px_rgba(0,0,0,0.5)]">
                                
                                {/* Animated Lane Cars (Subtle Background Simulation) */}
                                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl z-0">
                                    {/* Top Lane Animation */}
                                    <div className="absolute top-[35%] left-[-100px] flex gap-40 animate-[slideRight_15s_linear_infinite] opacity-40">
                                        <div className="w-10 h-6 bg-cyan-400 rounded-md shadow-[0_0_15px_#06b6d4] relative"><div className="absolute right-0 top-1/2 w-4 h-full bg-yellow-100/50 rounded-r-md -translate-y-1/2 blur-[1px]"></div></div>
                                        <div className="w-10 h-6 bg-purple-500 rounded-md shadow-[0_0_15px_#a855f7] relative"><div className="absolute right-0 top-1/2 w-4 h-full bg-yellow-100/50 rounded-r-md -translate-y-1/2 blur-[1px]"></div></div>
                                    </div>
                                    {/* Bottom Lane Animation */}
                                    <div className="absolute bottom-[35%] right-[-100px] flex gap-40 animate-[slideLeft_18s_linear_infinite] opacity-40">
                                        <div className="w-10 h-6 bg-emerald-400 rounded-md shadow-[0_0_15px_#34d399] relative"><div className="absolute left-0 top-1/2 w-4 h-full bg-yellow-100/50 rounded-l-md -translate-y-1/2 blur-[1px]"></div></div>
                                    </div>
                                </div>

                                <div className="min-w-max relative z-10 flex flex-col items-center">
                                    {/* Entrance Indicator */}
                                    <div className="text-center text-green-400 text-xs font-black tracking-[0.3em] uppercase mb-8 border border-green-500/30 bg-green-500/10 px-8 py-2 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.15)] backdrop-blur-md">
                                        â†“ {t.entrance || 'ENTRANCE'} â†“
                                    </div>

                                    {/* Parking Lot Structure */}
                                    <div className="flex flex-col gap-24 relative">
                                        
                                        {/* Top Row */}
                                        <div className="flex gap-4 border-b-2 border-slate-700 pb-2">
                                            {slots.slice(0, Math.ceil(slots.length / 2)).map((slot, index) => {
                                                const isEV = slot.slot_type === 'EV' || index === 2; // Mocking one EV slot for demo if none exists
                                                const isReserved = slot.status === 'MAINTENANCE';
                                                return (
                                                    <div key={slot.id} className="relative group">
                                                        <button 
                                                            onClick={() => handleSlotSelect(slot)}
                                                            disabled={slot.status !== 'AVAILABLE'}
                                                            className={`
                                                                relative h-36 w-24 rounded-t-xl border-x-4 border-t-4 flex flex-col items-center justify-start pt-4 transition-all duration-300 overflow-hidden
                                                                ${slot.status === 'AVAILABLE' && selectedSlot !== slot.id && !isEV ? 'border-emerald-500 bg-emerald-100 hover:bg-emerald-200 hover:-translate-y-2 hover:shadow-[0_10px_20px_rgba(34,197,94,0.2)] cursor-pointer' : ''}
                                                                ${slot.status === 'AVAILABLE' && selectedSlot !== slot.id && isEV ? 'border-cyan-500 bg-cyan-100 hover:bg-cyan-200 hover:-translate-y-2 hover:shadow-[0_10px_20px_rgba(6,182,212,0.3)] cursor-pointer' : ''}
                                                                ${slot.status !== 'AVAILABLE' && !isReserved ? 'border-red-500 bg-red-100 cursor-not-allowed opacity-80' : ''}
                                                                ${isReserved ? 'border-amber-500 bg-amber-100 cursor-not-allowed opacity-80' : ''}
                                                                ${selectedSlot === slot.id ? 'border-blue-400 bg-blue-100 shadow-[0_0_30px_rgba(59,130,246,0.6)] ring-4 ring-blue-500/50 scale-105 z-20' : ''}
                                                                after:content-[''] after:absolute after:bottom-0 after:w-full after:h-1 after:bg-slate-300
                                                            `}
                                                        >
                                                            {/* Slot Number Label */}
                                                            <span className={`font-black text-xl z-10 ${slot.status === 'AVAILABLE' ? 'text-slate-600' : 'text-slate-500'}`}>
                                                                {slot.slot_number}
                                                            </span>
                                                            
                                                            {/* EV Indicator */}
                                                            {isEV && <span className="absolute top-2 right-2 text-cyan-400 text-sm animate-pulse z-10">âš¡</span>}

                                                            {/* Cars for occupied/reserved */}
                                                            {(slot.status !== 'AVAILABLE' || isReserved) && (
                                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none mt-4">
                                                                    <img src="/car.png" alt="Car" className={`w-20 h-auto drop-shadow-2xl -rotate-90 ${isReserved ? 'sepia hue-rotate-30' : 'brightness-75'}`} />
                                                                </div>
                                                            )}

                                                            {/* Selected state glow */}
                                                            {selectedSlot === slot.id && (
                                                                <div className="absolute inset-0 bg-blue-400/10 animate-pulse pointer-events-none"></div>
                                                            )}
                                                        </button>

                                                        {/* Hover Tooltip */}
                                                        <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-xs py-2 px-4 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30 border border-slate-200 backdrop-blur-md">
                                                            <div className="font-bold text-sm text-blue-400 mb-1">{slot.slot_number} {isEV && 'âš¡'}</div>
                                                            <div className="text-slate-600">â‚¹{slot.price_per_hour}/hr â€¢ {slot.slot_type}</div>
                                                            {slot.status !== 'AVAILABLE' && <div className="text-red-400 mt-1 font-semibold">{isReserved ? 'Reserved' : 'Occupied'}</div>}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Central Driving Lane Divider */}
                                        <div className="absolute top-1/2 -translate-y-1/2 w-full h-16 flex items-center justify-center pointer-events-none">
                                            <div className="w-full h-0 border-t-4 border-dashed border-yellow-500/30"></div>
                                            {/* Directional Arrows */}
                                            <div className="absolute left-4 text-yellow-500/40 text-3xl font-black tracking-widest">â†’ â†’</div>
                                            <div className="absolute right-4 text-yellow-500/40 text-3xl font-black tracking-widest">â†’ â†’</div>
                                        </div>

                                        {/* Bottom Row */}
                                        <div className="flex gap-4 border-t-2 border-slate-700 pt-2">
                                            {slots.slice(Math.ceil(slots.length / 2)).map((slot, index) => {
                                                const isEV = slot.slot_type === 'EV' || index === 4; // Mocking one EV slot for demo if none exists
                                                const isReserved = slot.status === 'MAINTENANCE';
                                                return (
                                                    <div key={slot.id} className="relative group">
                                                        <button 
                                                            onClick={() => handleSlotSelect(slot)}
                                                            disabled={slot.status !== 'AVAILABLE'}
                                                            className={`
                                                                relative h-36 w-24 rounded-b-xl border-x-4 border-b-4 flex flex-col items-center justify-end pb-4 transition-all duration-300 overflow-hidden
                                                                ${slot.status === 'AVAILABLE' && selectedSlot !== slot.id && !isEV ? 'border-emerald-500 bg-emerald-100 hover:bg-emerald-200 hover:translate-y-2 hover:shadow-[0_10px_20px_rgba(34,197,94,0.2)] cursor-pointer' : ''}
                                                                ${slot.status === 'AVAILABLE' && selectedSlot !== slot.id && isEV ? 'border-cyan-500 bg-cyan-100 hover:bg-cyan-200 hover:translate-y-2 hover:shadow-[0_10px_20px_rgba(6,182,212,0.3)] cursor-pointer' : ''}
                                                                ${slot.status !== 'AVAILABLE' && !isReserved ? 'border-red-500 bg-red-100 cursor-not-allowed opacity-80' : ''}
                                                                ${isReserved ? 'border-amber-500 bg-amber-100 cursor-not-allowed opacity-80' : ''}
                                                                ${selectedSlot === slot.id ? 'border-blue-400 bg-blue-100 shadow-[0_0_30px_rgba(59,130,246,0.6)] ring-4 ring-blue-500/50 scale-105 z-20' : ''}
                                                                after:content-[''] after:absolute after:top-0 after:w-full after:h-1 after:bg-slate-300
                                                            `}
                                                        >
                                                            {/* Slot Number Label */}
                                                            <span className={`font-black text-xl z-10 ${slot.status === 'AVAILABLE' ? 'text-slate-600' : 'text-slate-500'}`}>
                                                                {slot.slot_number}
                                                            </span>
                                                            
                                                            {/* EV Indicator */}
                                                            {isEV && <span className="absolute bottom-2 right-2 text-cyan-400 text-sm animate-pulse z-10">âš¡</span>}

                                                            {/* Cars for occupied/reserved */}
                                                            {(slot.status !== 'AVAILABLE' || isReserved) && (
                                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none mb-4">
                                                                    <img src="/car.png" alt="Car" className={`w-20 h-auto drop-shadow-2xl rotate-90 ${isReserved ? 'sepia hue-rotate-30' : 'brightness-75'}`} />
                                                                </div>
                                                            )}

                                                            {/* Selected state glow */}
                                                            {selectedSlot === slot.id && (
                                                                <div className="absolute inset-0 bg-blue-400/10 animate-pulse pointer-events-none"></div>
                                                            )}
                                                        </button>

                                                        {/* Hover Tooltip */}
                                                        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-xs py-2 px-4 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30 border border-slate-200 backdrop-blur-md">
                                                            <div className="font-bold text-sm text-blue-400 mb-1">{slot.slot_number} {isEV && 'âš¡'}</div>
                                                            <div className="text-slate-600">â‚¹{slot.price_per_hour}/hr â€¢ {slot.slot_type}</div>
                                                            {slot.status !== 'AVAILABLE' && <div className="text-red-400 mt-1 font-semibold">{isReserved ? 'Reserved' : 'Occupied'}</div>}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Exit Indicator */}
                                    <div className="text-center text-slate-400 text-xs font-black tracking-[0.3em] uppercase mt-8 border border-slate-700 bg-slate-800/50 px-8 py-2 rounded-full shadow-inner backdrop-blur-md">
                                        â†‘ EXIT â†‘
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Booking Summary */}
                    <div className="w-full lg:w-80 flex-shrink-0">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-6">
                            <h2 className="text-lg font-bold text-slate-900 mb-4">{t.summary}</h2>
                            
                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">{t.date}</label>
                                    <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">{t.start}</label>
                                        <input type="time" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">{t.duration}</label>
                                        <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            <option>1 Hour</option>
                                            <option>2 Hours</option>
                                            <option>3 Hours</option>
                                            <option>4 Hours</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-slate-200 pt-4 mb-6 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">{t.slot}</span>
                                    <span className="font-bold text-slate-900">{selectedSlot ? slots.find(s=>s.id === selectedSlot)?.slot_number : t.none}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">{t.rate}</span>
                                    <span className="font-medium text-slate-900">â‚¹{slots[0]?.price_per_hour}/hr</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t border-dashed border-slate-200">
                                    <span className="text-slate-900">{t.total}</span>
                                    <span className="text-blue-600">â‚¹{slots[0]?.price_per_hour || 0}</span>
                                </div>
                            </div>

                            <Link to={`/book/${selectedSlot}`} className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white transition-colors ${selectedSlot ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-300 cursor-not-allowed pointer-events-none'}`}>
                                {t.continue}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParkingDetails;
