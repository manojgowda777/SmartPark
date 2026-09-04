import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, Star, ArrowLeft, Shield, Zap, Car } from 'lucide-react';
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

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                <div className="text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">Initializing Interface...</div>
            </div>
        );
    }

    if (!location) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-2xl font-bold">Location not found.</div>;

    const availableCount = slots.filter(s => s.status === 'AVAILABLE').length;
    const isHighDemand = availableCount < slots.length * 0.3;

    return (
        <div className="min-h-screen bg-slate-950 font-sans text-slate-200 selection:bg-blue-500/30 relative pb-24 pt-20">
            {/* Background elements */}
            <div className="fixed top-0 left-0 w-full h-96 bg-blue-900/10 blur-[100px] pointer-events-none mix-blend-screen z-0"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
                <Link to="/find-parking" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm font-bold uppercase tracking-widest group">
                    <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center group-hover:border-slate-500 transition-colors">
                        <ArrowLeft size={16} />
                    </div>
                    Back to Network
                </Link>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* LEFT COLUMN: Map & Info */}
                    <div className="flex-1 animate-slide-up">
                        {/* Title Section */}
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                    availableCount > 0 ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'
                                }`}>
                                    {availableCount > 0 ? 'Accepting Vehicles' : 'Full Capacity'}
                                </span>
                                {isHighDemand && availableCount > 0 && (
                                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border bg-amber-500/10 text-amber-400 border-amber-500/30 flex items-center gap-1">
                                        <Zap size={10} fill="currentColor"/> High Demand
                                    </span>
                                )}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">{location.name}</h1>
                            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 font-medium">
                                <span className="flex items-center gap-2"><MapPin size={16} className="text-blue-500"/> {location.address}, {location.city}</span>
                                <span className="flex items-center gap-2"><Star size={16} className="text-yellow-500" fill="currentColor"/> 4.8 / 5.0 Rating</span>
                                <span className="flex items-center gap-2"><Clock size={16} className="text-emerald-500"/> Open 24/7</span>
                            </div>
                        </div>

                        {/* Interactive Premium Map */}
                        <div className="glass-panel p-6 rounded-3xl border border-slate-800 mb-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>
                            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <Car size={20} className="text-blue-400" /> Interactive Facility Map
                            </h2>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {slots.map(slot => {
                                    const isAvailable = slot.status === 'AVAILABLE';
                                    const isSelected = selectedSlot === slot.id;
                                    const isEV = slot.slot_number.includes('EV') || parseInt(slot.slot_number) % 5 === 0; // Mock EV logic

                                    return (
                                        <button 
                                            key={slot.id}
                                            disabled={!isAvailable}
                                            onClick={() => setSelectedSlot(slot.id)}
                                            className={`
                                                relative h-24 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center
                                                ${isSelected ? 'bg-blue-600/20 border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)] scale-105 z-10' : 
                                                  !isAvailable ? 'bg-slate-900/50 border-slate-800 opacity-50 cursor-not-allowed' : 
                                                  'bg-slate-900 border-slate-700 hover:border-slate-500 hover:bg-slate-800 cursor-pointer'}
                                            `}
                                        >
                                            <div className="absolute top-2 left-2 text-xs font-black text-slate-500">{slot.slot_number}</div>
                                            
                                            {!isAvailable ? (
                                                <div className="w-12 h-6 bg-red-500/20 rounded-md border border-red-500/50 flex items-center justify-center transform -rotate-12">
                                                    <div className="w-8 h-1 bg-red-400 rounded-full"></div>
                                                </div>
                                            ) : isEV ? (
                                                <Zap size={24} className={isSelected ? "text-blue-400" : "text-cyan-500"} fill={isSelected ? "currentColor" : "none"} />
                                            ) : (
                                                <div className={`w-8 h-12 rounded-sm border-2 border-dashed ${isSelected ? 'border-blue-400/50' : 'border-slate-600'} flex items-center justify-center`}>
                                                    <span className="text-[10px] text-slate-600 font-bold uppercase">P</span>
                                                </div>
                                            )}

                                            {isSelected && (
                                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white border-2 border-slate-950 shadow-lg">
                                                    <Shield size={12} fill="currentColor" />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="mt-8 flex flex-wrap gap-6 justify-center text-xs font-bold uppercase tracking-widest text-slate-500">
                                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded border-2 border-slate-700 bg-slate-900"></div> Available</div>
                                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded border-2 border-red-500/50 bg-red-500/20 flex items-center justify-center"><div className="w-2 h-[2px] bg-red-400 transform -rotate-45"></div></div> Occupied</div>
                                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded border-2 border-blue-500 bg-blue-600/20"></div> Selected</div>
                                <div className="flex items-center gap-2"><Zap size={14} className="text-cyan-500"/> EV Charging</div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Booking Summary */}
                    <div className="w-full lg:w-96 flex-shrink-0 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <div className="glass-panel p-8 rounded-3xl border border-slate-800 sticky top-28 shadow-2xl">
                            <h3 className="text-xl font-black text-white mb-6 pb-4 border-b border-slate-800">Reservation Setup</h3>
                            
                            <div className="space-y-6 mb-8">
                                <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Base Rate</p>
                                        <p className="font-black text-xl text-white">₹{slots[0]?.price_per_hour || 0}<span className="text-sm font-medium text-slate-500">/hr</span></p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                        <Clock size={18} className="text-blue-400" />
                                    </div>
                                </div>

                                <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Selected Slot</p>
                                        <p className="font-black text-xl text-white">
                                            {selectedSlot ? slots.find(s=>s.id === selectedSlot)?.slot_number : '--'}
                                        </p>
                                    </div>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${selectedSlot ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                                        <MapPin size={18} />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="border-t border-slate-800 pt-6 mb-8">
                                <div className="flex justify-between items-end">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Estimated Total</p>
                                    <p className="font-black text-3xl text-blue-400">₹{slots[0]?.price_per_hour || 0}</p>
                                </div>
                            </div>

                            <Link 
                                to={selectedSlot ? `/book/${selectedSlot}` : '#'} 
                                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                                    selectedSlot 
                                        ? 'glass-button shadow-lg shadow-blue-600/20 group' 
                                        : 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed'
                                }`}
                                onClick={(e) => { if (!selectedSlot) e.preventDefault(); }}
                            >
                                Continue to Checkout
                                {selectedSlot && <ArrowLeft size={18} className="transform rotate-180 group-hover:translate-x-1 transition-transform" />}
                            </Link>

                            {!selectedSlot && (
                                <p className="text-center text-xs text-slate-500 mt-4 font-medium">Please select a slot on the map to continue.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParkingDetails;
