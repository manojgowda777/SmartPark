import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { Clock, Calendar, CheckCircle2, ShieldCheck, ArrowLeft, QrCode, CreditCard, ChevronRight } from 'lucide-react';
import api from '../services/api';

const Booking = () => {
    const { slotId } = useParams();
    const { user } = useContext(AuthContext);
    const { t: getT } = useContext(LanguageContext);
    const t = getT('booking');
    const navigate = useNavigate();

    const [slot, setSlot] = useState(null);
    const [duration, setDuration] = useState(1);
    const [loading, setLoading] = useState(true);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [bookingRef, setBookingRef] = useState('');

    useEffect(() => {
        const fetchSlot = async () => {
            try {
                const res = await api.get(`/slots/${slotId}`);
                setSlot(res.data);
            } catch (error) {
                console.error("Failed to fetch slot details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSlot();
    }, [slotId]);

    const handleBooking = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            const startTime = new Date();
            const endTime = new Date(startTime.getTime() + duration * 60 * 60 * 1000);

            const res = await api.post('/bookings', {
                slotId: slotId,
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
                totalPrice: slot.price_per_hour * duration
            });
            
            // Set success state to show Digital Boarding Pass
            setBookingRef(res.data.id.substring(0,8).toUpperCase());
            setBookingSuccess(true);
            
            // Wait 5 seconds before redirecting
            setTimeout(() => {
                navigate('/driver/dashboard');
            }, 5000);
            
        } catch (error) {
            console.error("Booking failed", error);
            alert("Booking failed. Slot might be unavailable.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                <div className="text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">Preparing Checkout...</div>
            </div>
        );
    }

    if (!slot) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-2xl font-bold">Slot not found.</div>;

    const totalPrice = slot.price_per_hour * duration;

    // IF SUCCESS, SHOW LUXURY DIGITAL PASS
    if (bookingSuccess) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-8 pt-20 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
                
                <div className="max-w-md w-full relative z-10 animate-slide-up">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                            <CheckCircle2 size={40} />
                        </div>
                        <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Payment Successful</h2>
                        <p className="text-slate-400 font-medium text-sm">Your space is secured and ready.</p>
                    </div>

                    {/* Digital Boarding Pass */}
                    <div className="bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl shadow-blue-900/20 border border-slate-700 relative">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                        
                        <div className="p-8 pb-6 border-b border-dashed border-slate-700 relative">
                            {/* Cutouts for ticket effect */}
                            <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-slate-950 rounded-full border-t border-r border-slate-700"></div>
                            <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-slate-950 rounded-full border-t border-l border-slate-700"></div>
                            
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Reservation ID</p>
                                    <p className="text-xl font-mono font-black text-white">{bookingRef}</p>
                                </div>
                                <div className="px-3 py-1 bg-green-500/10 text-green-400 rounded-md text-[10px] font-black uppercase tracking-widest border border-green-500/20">
                                    Confirmed
                                </div>
                            </div>
                            
                            <h3 className="text-2xl font-black text-white mb-1">{slot.parking_location?.name || 'SmartPark Facility'}</h3>
                            <p className="text-slate-400 text-sm font-medium mb-6">{slot.parking_location?.address || 'City Center'}</p>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-950 rounded-xl p-3 border border-slate-800">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Date</p>
                                    <p className="text-sm font-bold text-white">{new Date().toLocaleDateString()}</p>
                                </div>
                                <div className="bg-slate-950 rounded-xl p-3 border border-slate-800">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Duration</p>
                                    <p className="text-sm font-bold text-white">{duration} Hour{duration > 1 ? 's' : ''}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-8 bg-slate-900/50">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Slot Assigned</p>
                                    <p className="text-3xl font-black text-blue-400">{slot.slot_number}</p>
                                </div>
                                <div className="w-16 h-16 bg-white rounded-lg p-1">
                                    <QrCode className="w-full h-full text-slate-950" />
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Amount Paid</span>
                                <span className="text-lg font-black text-white">₹{totalPrice}</span>
                            </div>
                        </div>
                    </div>
                    
                    <p className="text-center mt-8 text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></div>
                        Redirecting to Dashboard...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 font-sans text-slate-200 pt-24 pb-12 px-4 sm:px-8 relative selection:bg-blue-500/30">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-900/10 blur-[100px] pointer-events-none mix-blend-screen z-0"></div>

            <div className="max-w-5xl mx-auto relative z-10">
                <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm font-bold uppercase tracking-widest group cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center group-hover:border-slate-500 transition-colors">
                        <ArrowLeft size={16} />
                    </div>
                    Modify Selection
                </button>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* LEFT COLUMN: Checkout Details */}
                    <div className="flex-1 animate-slide-up">
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">Complete Reservation.</h1>
                        <p className="text-slate-400 font-medium mb-10 text-lg">Review your details and confirm payment.</p>

                        <div className="glass-panel p-8 rounded-3xl border border-slate-800 mb-8">
                            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2 pb-4 border-b border-slate-800">
                                <Calendar size={20} className="text-blue-400" /> Duration Setup
                            </h2>
                            
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <div className="w-full sm:w-auto flex items-center bg-slate-900 rounded-2xl border border-slate-700 p-2">
                                    <button 
                                        className="w-12 h-12 flex items-center justify-center text-xl font-black text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                                        onClick={() => setDuration(Math.max(1, duration - 1))}
                                    >-</button>
                                    <div className="w-20 text-center font-black text-2xl text-white">{duration}</div>
                                    <button 
                                        className="w-12 h-12 flex items-center justify-center text-xl font-black text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                                        onClick={() => setDuration(duration + 1)}
                                    >+</button>
                                </div>
                                <div className="text-slate-400 font-medium">
                                    Hour{duration > 1 ? 's' : ''} parking time.<br/>
                                    <span className="text-sm text-slate-500">Starts immediately upon payment.</span>
                                </div>
                            </div>
                        </div>

                        <div className="glass-panel p-8 rounded-3xl border border-slate-800">
                            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2 pb-4 border-b border-slate-800">
                                <ShieldCheck size={20} className="text-emerald-400" /> Security & Guarantee
                            </h2>
                            <ul className="space-y-4 text-sm font-medium text-slate-300">
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                                    <p>Your spot is physically locked and guaranteed upon payment.</p>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                                    <p>Free cancellation up to 10 minutes before arrival.</p>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                                    <p>24/7 security surveillance active in this facility.</p>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Invoice */}
                    <div className="w-full lg:w-[400px] flex-shrink-0 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <div className="glass-panel p-8 rounded-3xl border border-slate-800 sticky top-28 shadow-2xl">
                            <h3 className="text-xl font-black text-white mb-6">Invoice Summary</h3>
                            
                            <div className="bg-slate-900/50 rounded-2xl p-5 border border-slate-800 mb-6 space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Facility</span>
                                    <span className="font-bold text-white text-right">{slot.parking_location?.name || 'SmartPark Hub'}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Assigned Slot</span>
                                    <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700 font-mono font-bold text-white">{slot.slot_number}</span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">Base Rate</span>
                                    <span className="font-bold text-white">₹{slot.price_per_hour}/hr</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">Duration</span>
                                    <span className="font-bold text-white">{duration} Hour{duration > 1 ? 's' : ''}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">Taxes & Fees</span>
                                    <span className="font-bold text-white">Included</span>
                                </div>
                            </div>
                            
                            <div className="border-t border-slate-800 pt-6 mb-8">
                                <div className="flex justify-between items-end">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Amount</p>
                                    <p className="font-black text-4xl text-blue-400">₹{totalPrice}</p>
                                </div>
                            </div>

                            <button 
                                onClick={handleBooking}
                                className="w-full glass-button py-4 rounded-xl font-bold flex items-center justify-center gap-2 group shadow-lg shadow-blue-600/20 cursor-pointer"
                            >
                                <CreditCard size={18} /> Confirm & Pay
                                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            
                            <div className="mt-6 flex items-center justify-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-widest">
                                <ShieldCheck size={14} /> Secure Encrypted Transaction
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Booking;
