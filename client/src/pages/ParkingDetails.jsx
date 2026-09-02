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

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-slate-900">Select a Slot</h2>
                                <div className="flex gap-4 text-xs font-medium">
                                    <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-500"></div> {t.free}</span>
                                    <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-500"></div> {t.full}</span>
                                    <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-blue-600"></div> {t.selected}</span>
                                </div>
                            </div>

                            <div className="bg-slate-100 p-8 rounded-xl border border-slate-200 overflow-x-auto">
                                <div className="min-w-max">
                                    <div className="text-center text-slate-400 text-xs font-bold tracking-widest uppercase mb-8 border-b border-dashed border-slate-300 pb-2">{t.entrance}</div>
                                    <div className="grid grid-cols-4 md:grid-cols-6 gap-x-2 gap-y-12">
                                        {slots.map(slot => (
                                            <button 
                                                key={slot.id}
                                                onClick={() => handleSlotSelect(slot)}
                                                disabled={slot.status !== 'AVAILABLE'}
                                                className={`
                                                    relative h-32 w-20 md:w-24 border-x-4 border-t-4 border-yellow-400 flex flex-col items-center justify-center transition-all overflow-hidden bg-slate-800
                                                    ${slot.status === 'AVAILABLE' && selectedSlot !== slot.id ? 'hover:bg-slate-700 cursor-pointer shadow-[inset_0_0_20px_rgba(34,197,94,0.1)]' : ''}
                                                    ${slot.status !== 'AVAILABLE' ? 'cursor-not-allowed bg-slate-900/80 shadow-[inset_0_0_30px_rgba(239,68,68,0.2)]' : ''}
                                                    ${selectedSlot === slot.id ? 'shadow-[inset_0_0_30px_rgba(59,130,246,0.5)] ring-4 ring-blue-500 bg-slate-700 scale-105 z-10' : ''}
                                                `}
                                            >
                                                <span className="absolute top-2 font-black text-slate-400 text-lg">{slot.slot_number}</span>
                                                
                                                {slot.status !== 'AVAILABLE' && (
                                                    <div className="absolute inset-0 flex items-center justify-center animate-pulse" style={{ animationDuration: '3s' }}>
                                                        <img src="/car.png" alt="Car" className="w-16 h-auto drop-shadow-2xl grayscale opacity-50 -rotate-90" />
                                                    </div>
                                                )}
                                                {selectedSlot === slot.id && (
                                                    <div className="absolute inset-0 flex items-center justify-center animate-float" style={{ animationDuration: '2s' }}>
                                                        <img src="/car.png" alt="Car" className="w-20 h-auto drop-shadow-[0_0_15px_rgba(59,130,246,0.8)] -rotate-90 brightness-125" />
                                                    </div>
                                                )}
                                                
                                                {slot.status === 'AVAILABLE' && selectedSlot !== slot.id && (
                                                    <div className="absolute bottom-2 text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full uppercase tracking-wider border border-green-400/20">{t.free}</div>
                                                )}
                                                {slot.status !== 'AVAILABLE' && (
                                                    <div className="absolute bottom-2 text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider border border-red-500/20">{t.full}</div>
                                                )}
                                            </button>
                                        ))}
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
                                    <span className="font-medium text-slate-900">₹{slots[0]?.price_per_hour}/hr</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t border-dashed border-slate-200">
                                    <span className="text-slate-900">{t.total}</span>
                                    <span className="text-blue-600">₹{slots[0]?.price_per_hour || 0}</span>
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
