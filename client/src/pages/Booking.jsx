import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, CreditCard, Car, Calendar as CalendarIcon, MapPin } from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';

const Booking = () => {
    const { slotId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { t: getT } = useContext(LanguageContext);
    const t = getT('book');
    const tDet = getT('details');
    
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('upi');
    
    // In a real app, we'd fetch slot details. For simplicity here, we'll mock the details based on URL 
    // or fetch from an endpoint. Let's assume price is ₹40.
    const [bookingData, setBookingData] = useState({
        vehicle_number: '',
        date: new Date().toISOString().split('T')[0],
        start_time: '10:00',
        duration: 2,
        amount: 80, // 40 * 2
        parking_location_id: 1, // hardcoded for this MVP simplicity, should fetch slot info
        slot_id: parseInt(slotId)
    });

    // If user is not logged in, they shouldn't be here (handle loosely for now)
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleDurationChange = (e) => {
        const duration = parseInt(e.target.value);
        setBookingData({ ...bookingData, duration, amount: duration * 40 });
    };

    const handlePayment = async () => {
        setLoading(true);
        setError('');
        
        try {
            await api.post('/bookings', bookingData);
            setSuccess(true);
            setStep(4);
        } catch (err) {
            setError(err.response?.data?.message || 'Payment failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-50 min-h-[calc(100vh-4rem)] p-4 sm:p-8 flex items-center justify-center">
            <div className="max-w-4xl w-full">
                <div className="w-full h-12 relative mb-8 overflow-hidden rounded-full border-b-4 border-slate-300 bg-slate-200 shadow-inner">
                    <div className="absolute w-full h-1 top-1/2 -translate-y-1/2 flex justify-between px-4 opacity-50" style={{ backgroundImage: 'linear-gradient(90deg, #fff 50%, transparent 50%)', backgroundSize: '20px 100%' }}></div>
                    <div className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000 ease-in-out flex items-center gap-2" 
                         style={{ left: step === 1 ? '10%' : step === 2 ? '50%' : '90%', transform: 'translate(-50%, -50%)' }}>
                        <img src="/car.png" alt="Driving Car" className="w-14 h-auto drop-shadow-xl" />
                    </div>
                </div>

                <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-white">
                    {/* Progress Tracker */}
                    <div className="flex justify-between items-center mb-10 relative">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-10 rounded-full"></div>
                        <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 -z-10 rounded-full transition-all duration-500`} style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
                        
                        {[1, 2, 3].map(i => (
                            <div key={i} className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full font-bold ${step >= i ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                {step > i ? <CheckCircle size={20} /> : i}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-xs font-bold text-slate-500 uppercase mt-3 px-2">
                        <span>Details</span>
                        <span>Summary</span>
                        <span>Payment</span>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-6">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    {/* Step 1: Vehicle & Time Details */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">{tDet.summary}</h2>
                            
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">{t.vehicle}</label>
                                <div className="relative">
                                    <Car className="absolute left-3 top-3 text-slate-400" size={20} />
                                    <input type="text" placeholder={t.vehiclePh} required
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg uppercase"
                                        value={bookingData.vehicle_number}
                                        onChange={(e) => setBookingData({...bookingData, vehicle_number: e.target.value.toUpperCase()})}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">{tDet.date}</label>
                                    <div className="relative">
                                        <CalendarIcon className="absolute left-3 top-3 text-slate-400" size={20} />
                                        <input type="date" required
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg"
                                            value={bookingData.date}
                                            onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">{tDet.duration}</label>
                                    <select 
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg"
                                        value={bookingData.duration}
                                        onChange={handleDurationChange}
                                    >
                                        <option value={1}>1 Hour (₹40)</option>
                                        <option value={2}>2 Hours (₹80)</option>
                                        <option value={3}>3 Hours (₹120)</option>
                                        <option value={4}>4 Hours (₹160)</option>
                                    </select>
                                </div>
                            </div>

                            <button 
                                onClick={() => bookingData.vehicle_number.trim() ? setStep(2) : setError("Please enter a " + t.vehicle)}
                                className="w-full mt-6 bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors"
                            >
                                Continue to Summary
                            </button>
                        </div>
                    )}

                    {/* Step 2: Summary */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Booking Summary</h2>
                            
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
                                <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                                    <span className="text-slate-600 flex items-center gap-2"><Car size={18}/> Vehicle</span>
                                    <span className="font-bold text-slate-900">{bookingData.vehicle_number}</span>
                                </div>
                                <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                                    <span className="text-slate-600 flex items-center gap-2"><MapPin size={18}/> Location & Slot</span>
                                    <span className="font-bold text-slate-900">City Center • Slot {slotId}</span>
                                </div>
                                <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                                    <span className="text-slate-600 flex items-center gap-2"><CalendarIcon size={18}/> {tDet.date} & Time</span>
                                    <span className="font-bold text-slate-900">{bookingData.date} • {bookingData.duration} hrs</span>
                                </div>
                                <div className="flex justify-between items-center text-lg pt-2">
                                    <span className="font-bold text-slate-900">Total Amount</span>
                                    <span className="font-bold text-blue-600">₹{bookingData.amount}</span>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button onClick={() => setStep(1)} className="flex-1 bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-xl hover:bg-slate-300 transition-colors">
                                    Back
                                </button>
                                <button onClick={() => setStep(3)} className="flex-[2] bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors">
                                    {t.next}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Payment */}
                    {step === 3 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="text-center relative">
                                <h2 className="text-4xl font-black text-slate-900 mb-2 relative z-10">Secure Checkout</h2>
                                <p className="text-slate-500 font-medium relative z-10">Choose your preferred payment method</p>
                            </div>
                            
                            {/* Glowing Amount Display */}
                            <div className="relative overflow-hidden rounded-3xl p-8 text-center shadow-[0_10px_40px_rgba(59?30,246,0.3)] bg-slate-900 group">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/40 via-purple-600/40 to-blue-600/40 animate-gradient-x opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
                                <div className="absolute -inset-[100%] animate-spin-slow opacity-20" style={{ background: 'conic-gradient(from 90deg at 50% 50%, #00000000 50%, #3b82f6 100%)' }}></div>
                                <div className="relative z-10">
                                    <p className="text-sm font-bold text-blue-200 uppercase tracking-widest mb-3 animate-pulse">Total Amount</p>
                                    <p className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">₹{bookingData.amount}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label onClick={() => setPaymentMethod('card')} className={`flex items-center gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50 shadow-[0_0_20px_rgba(59?30,246,0.2)] scale-[1.02]' : 'border-slate-200 hover:border-blue-300 bg-white hover:bg-slate-50'}`}>
                                    <div className={`p-3 rounded-full transition-colors ${paymentMethod === 'card' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
                                        <CreditCard size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <span className="block font-black text-slate-900 text-lg">Credit / Debit Card</span>
                                        <span className="text-sm text-slate-500 font-medium">Pay securely with your bank card</span>
                                    </div>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${paymentMethod === 'card' ? 'border-blue-600' : 'border-slate-300'}`}>
                                        {paymentMethod === 'card' && <div className="w-3 h-3 bg-blue-600 rounded-full animate-in zoom-in"></div>}
                                    </div>
                                </label>
                                
                                <label onClick={() => setPaymentMethod('upi')} className={`flex items-center gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${paymentMethod === 'upi' ? 'border-purple-500 bg-purple-50 shadow-[0_0_20px_rgba(168,85,247,0.2)] scale-[1.02]' : 'border-slate-200 hover:border-purple-300 bg-white hover:bg-slate-50'}`}>
                                    <div className={`p-3 rounded-full transition-colors ${paymentMethod === 'upi' ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
                                        <div className="w-6 h-6 font-black text-center leading-6 text-sm">UPI</div>
                                    </div>
                                    <div className="flex-1">
                                        <span className="block font-black text-slate-900 text-lg flex items-center gap-2">UPI / QR Code <span className="text-[10px] bg-gradient-to-r from-purple-600 to-pink-500 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-wider animate-pulse">Fastest</span></span>
                                        <span className="text-sm text-slate-500 font-medium">GPay, PhonePe, Paytm, etc.</span>
                                    </div>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${paymentMethod === 'upi' ? 'border-purple-600' : 'border-slate-300'}`}>
                                        {paymentMethod === 'upi' && <div className="w-3 h-3 bg-purple-600 rounded-full animate-in zoom-in"></div>}
                                    </div>
                                </label>
                            </div>

                            {paymentMethod === 'upi' && (
                                <div className="mt-8 p-8 border-2 border-purple-100 rounded-3xl bg-gradient-to-b from-white to-purple-50/50 flex flex-col items-center animate-in zoom-in-95 duration-500 shadow-inner relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/20 rounded-full filter blur-[40px]"></div>
                                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-400/20 rounded-full filter blur-[40px]"></div>
                                    
                                    <p className="text-sm font-bold text-purple-600 mb-6 text-center uppercase tracking-wider relative z-10">Scan to Pay Instantly</p>
                                    
                                    {/* Sci-fi Scanning QR Code */}
                                    <div className="relative p-4 bg-white border-4 border-slate-900 rounded-[2rem] shadow-2xl mb-8 group overflow-hidden">
                                        {/* Scanner Line */}
                                        <div className="absolute top-0 left-0 w-full h-1 bg-green-400 shadow-[0_0_15px_#4ade80] animate-[float_2s_ease-in-out_infinite] z-20" style={{ animationName: 'scan' }}></div>
                                        <img 
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`upi://pay?pa=smartpark@upi&pn=SmartPark&am=${bookingData.amount}&cu=INR`)}`}
                                            alt="UPI QR Code" 
                                            className="w-48 h-48 relative z-10 mix-blend-multiply"
                                        />
                                        {/* Corner Brackets */}
                                        <div className="absolute top-2 left-2 w-8 h-8 border-t-4 border-l-4 border-purple-500 rounded-tl-xl z-20"></div>
                                        <div className="absolute top-2 right-2 w-8 h-8 border-t-4 border-r-4 border-purple-500 rounded-tr-xl z-20"></div>
                                        <div className="absolute bottom-2 left-2 w-8 h-8 border-b-4 border-l-4 border-purple-500 rounded-bl-xl z-20"></div>
                                        <div className="absolute bottom-2 right-2 w-8 h-8 border-b-4 border-r-4 border-purple-500 rounded-br-xl z-20"></div>
                                    </div>

                                    {/* Direct App Payment Buttons */}
                                    <div className="w-full max-w-sm mb-8 relative z-10">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="flex-1 h-px bg-purple-200"></div>
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Or Pay With App</span>
                                            <div className="flex-1 h-px bg-purple-200"></div>
                                        </div>
                                        
                                        <div className="grid grid-cols-3 gap-3 w-full">
                                            {/* Google Pay Button */}
                                            <a 
                                                href={`tez://upi/pay?pa=smartpark@upi&pn=SmartPark&am=${bookingData.amount}&cu=INR`}
                                                className="relative overflow-hidden flex items-center justify-center py-3 px-1 bg-white border border-slate-200 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-300 group"
                                            >
                                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                <span className="font-black text-slate-800 text-[15px] sm:text-lg tracking-tight"><span className="text-blue-600">G</span>Pay</span>
                                            </a>
                                            
                                            {/* PhonePe Button */}
                                            <a 
                                                href={`phonepe://pay?pa=smartpark@upi&pn=SmartPark&am=${bookingData.amount}&cu=INR`}
                                                className="relative overflow-hidden flex items-center justify-center py-3 px-1 bg-white border border-slate-200 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(107,33,168,0.15)] hover:border-purple-300 hover:-translate-y-0.5 transition-all duration-300 group"
                                            >
                                                <div className="absolute top-0 left-0 w-full h-1 bg-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                <span className="font-black text-purple-700 text-[15px] sm:text-lg tracking-tight">Phone<span className="text-purple-500">Pe</span></span>
                                            </a>
                                            
                                            {/* Paytm Button */}
                                            <a 
                                                href={`paytmmp://pay?pa=smartpark@upi&pn=SmartPark&am=${bookingData.amount}&cu=INR`}
                                                className="relative overflow-hidden flex items-center justify-center py-3 px-1 bg-white border border-slate-200 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(2,132,199,0.15)] hover:border-sky-300 hover:-translate-y-0.5 transition-all duration-300 group"
                                            >
                                                <div className="absolute top-0 left-0 w-full h-1 bg-sky-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                <span className="font-black text-slate-800 text-[15px] sm:text-lg tracking-tight">Pay<span className="text-sky-500">tm</span></span>
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 text-slate-500 font-bold bg-white/50 backdrop-blur-sm px-6 py-3 rounded-full border border-purple-100 relative z-10">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                                        Awaiting Payment Confirmation...
                                    </div>
                                </div>
                            )}

                            {paymentMethod === 'card' && (
                                <div className="mt-8 p-8 border-2 border-blue-100 rounded-3xl bg-slate-50 flex flex-col animate-in zoom-in-95 duration-500 shadow-inner">
                                    <div className="relative mb-6 pb-6 border-b-2 border-slate-200 border-dashed">
                                        <p className="text-sm font-bold text-slate-500 mb-1">Total to Deduct</p>
                                        <p className="text-4xl font-black text-slate-900">₹{bookingData.amount}</p>
                                    </div>
                                    <div className="space-y-4">
                                        <input type="text" placeholder="Card Number" className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none" defaultValue="•••• •••• •••• 4242" />
                                        <div className="flex gap-4">
                                            <input type="text" placeholder="MM/YY" className="w-1/2 px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none" defaultValue="12/28" />
                                            <input type="password" placeholder="CVV" className="w-1/2 px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none" defaultValue="123" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 font-medium animate-in shake">{error}</div>}

                            <div className="flex gap-4 mt-10">
                                <button type="button" onClick={() => setStep(2)} className="flex-1 py-4 border-2 border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                                    Back
                                </button>
                                <button 
                                    type="button" 
                                    onClick={handlePayment}
                                    disabled={loading}
                                    className="flex-[2] relative overflow-hidden group bg-slate-900 text-white font-black py-4 rounded-xl shadow-[0_15px_30px_rgba(0,0,0,0.3)] transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-emerald-400 to-green-500 animate-gradient-x opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <span className="relative z-10 flex items-center justify-center gap-2 text-lg">
                                        {loading ? (
                                            <><div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></div> Processing</>
                                        ) : t.confirm}
                                    </span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Success Holographic Ticket */}
                    {step === 4 && (
                        <div className="flex flex-col items-center animate-in zoom-in duration-700">
                            {/* Holographic Ticket Container */}
                            <div className="relative w-full max-w-sm mx-auto group perspective-1000">
                                {/* Holographic Glow */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-3xl blur opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-x"></div>
                                
                                {/* Ticket Body */}
                                <div className="relative bg-white/90 backdrop-blur-xl border border-white rounded-3xl overflow-hidden shadow-2xl transition-transform duration-500 transform group-hover:-translate-y-2 group-hover:rotate-x-12">
                                    {/* Ticket Header */}
                                    <div className="bg-slate-900 text-white p-6 text-center relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent"></div>
                                        <CheckCircle size={48} className="mx-auto text-green-400 mb-2 relative z-10 animate-bounce" />
                                        <h2 className="text-2xl font-black relative z-10 tracking-wider uppercase">Pass Confirmed</h2>
                                    </div>
                                    
                                    {/* Perforation Line */}
                                    <div className="flex justify-between items-center -my-3 relative z-20">
                                        <div className="w-6 h-6 bg-slate-50 rounded-full -ml-3 shadow-inner"></div>
                                        <div className="flex-1 border-t-4 border-dashed border-slate-300"></div>
                                        <div className="w-6 h-6 bg-slate-50 rounded-full -mr-3 shadow-inner"></div>
                                    </div>

                                    {/* Ticket Details */}
                                    <div className="p-8">
                                        <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-6">
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Vehicle</p>
                                                <p className="font-black text-slate-900 text-lg">{bookingData.vehicle_number.toUpperCase()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{tDet.date}</p>
                                                <p className="font-black text-slate-900 text-lg">{bookingData.date}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Time</p>
                                                <p className="font-black text-slate-900 text-lg">{bookingData.start_time}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Duration</p>
                                                <p className="font-black text-slate-900 text-lg">{bookingData.duration} hrs</p>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-slate-100 p-4 rounded-xl flex items-center justify-between border-2 border-slate-200">
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Amount Paid</p>
                                                <p className="font-black text-blue-600 text-2xl">₹{bookingData.amount}</p>
                                            </div>
                                            <div className="h-12 w-24 flex gap-1">
                                                {/* Fake Barcode */}
                                                {[...Array(12)].map((_, i) => (
                                                    <div key={i} className="h-full bg-slate-900" style={{ width: `${Math.random() * 4 + 1}px` }}></div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Holographic Overlay overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-white/10 opacity-0 group-hover:opacity-100 mix-blend-overlay transition-opacity duration-500 pointer-events-none"></div>
                                </div>
                            </div>
                            
                            <div className="mt-10 flex gap-4 w-full max-w-sm">
                                <button onClick={() => window.print()} className="flex-1 bg-white border-2 border-slate-200 text-slate-700 font-bold py-4 px-6 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                                    Download PDF
                                </button>
                                <button onClick={() => navigate('/driver/dashboard')} className="flex-[2] bg-slate-900 text-white font-black py-4 px-6 rounded-xl hover:bg-slate-800 transition-colors shadow-xl shadow-slate-900/20 text-lg">
                                    My Dashboard
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Booking;
