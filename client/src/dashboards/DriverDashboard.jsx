import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Calendar, MapPin, Clock, Car, X, ShieldCheck, Zap } from 'lucide-react';
import api from '../services/api';

const DriverDashboard = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await api.get('/dashboard/driver');
                setBookings(res.data.bookings);
            } catch (error) {
                console.error("Failed to fetch driver dashboard", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    const handleCancel = async (id) => {
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            try {
                await api.put(`/bookings/${id}/cancel`);
                setBookings(bookings.map(b => b.id === id ? { ...b, booking_status: 'CANCELLED' } : b));
            } catch (error) {
                console.error("Failed to cancel booking", error);
                alert("Failed to cancel booking.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 p-4 sm:p-8 pt-24 font-sans text-slate-200 selection:bg-blue-500/30">
            {/* Background elements */}
            <div className="fixed top-0 left-[-20%] w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen z-0"></div>
            
            <div className="max-w-6xl mx-auto relative z-10">
                <div className="glass-panel p-8 md:p-10 rounded-3xl shadow-2xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6 border-b-4 border-blue-600 animate-slide-up">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-[2px] shadow-lg shadow-blue-600/30">
                            <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center">
                                <Car size={36} className="text-blue-400" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">Welcome, {user?.name}</h1>
                            <p className="text-slate-400 font-medium">Driver Portal <span className="mx-2">•</span> <span className="text-blue-400">{user?.email}</span></p>
                        </div>
                    </div>
                    <div className="hidden md:flex gap-4">
                        <div className="bg-slate-900 border border-slate-700/50 rounded-2xl p-4 flex flex-col items-center justify-center min-w-[120px]">
                            <span className="text-3xl font-black text-white">{bookings.length}</span>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Total Trips</span>
                        </div>
                        <div className="bg-slate-900 border border-slate-700/50 rounded-2xl p-4 flex flex-col items-center justify-center min-w-[120px]">
                            <span className="text-3xl font-black text-white">{bookings.filter(b => b.booking_status === 'ACTIVE').length}</span>
                            <span className="text-xs font-bold text-green-500 uppercase tracking-widest mt-1">Active</span>
                        </div>
                    </div>
                </div>

                <div className="mb-6 flex items-center gap-3 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                    <h2 className="text-2xl font-black text-white">Your Bookings</h2>
                </div>

                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="glass-panel p-6 rounded-3xl animate-pulse h-64 border border-slate-800"></div>
                        ))}
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="glass-panel text-center py-24 rounded-3xl border border-slate-800">
                        <Calendar size={64} className="mx-auto text-slate-700 mb-6" strokeWidth={1} />
                        <h3 className="text-2xl font-bold text-white mb-2">No bookings yet</h3>
                        <p className="text-slate-400 mb-8 max-w-md mx-auto">You haven't reserved any parking spaces yet. Explore the network and secure your spot today.</p>
                        <a href="/find-parking" className="glass-button px-8 py-3 rounded-xl font-bold text-sm inline-flex items-center gap-2 cursor-pointer">
                            <Zap size={16} /> Find Parking
                        </a>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bookings.map((booking, index) => (
                            <div 
                                key={booking.id} 
                                className={`glass-card p-6 rounded-3xl flex flex-col justify-between group transition-all duration-300 ${booking.booking_status === 'ACTIVE' ? 'border border-blue-500/30 hover:shadow-blue-500/20' : ''} animate-slide-up`}
                                style={{ animationDelay: `${0.1 + (index * 0.05)}s` }}
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${
                                            booking.booking_status === 'ACTIVE' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                                            booking.booking_status === 'COMPLETED' ? 'bg-slate-800 text-slate-300 border-slate-700' :
                                            'bg-red-500/10 text-red-400 border-red-500/30'
                                        }`}>
                                            {booking.booking_status}
                                        </div>
                                        {booking.booking_status === 'ACTIVE' && (
                                            <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
                                                <ShieldCheck size={16} />
                                            </div>
                                        )}
                                    </div>
                                    
                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{booking.parking_location?.name || 'Unknown Location'}</h3>
                                    <p className="text-sm text-slate-400 flex items-center gap-1.5 mb-6">
                                        <MapPin size={14} className="text-blue-500"/>
                                        {booking.parking_location?.city || 'Unknown City'}
                                    </p>

                                    <div className="space-y-3 bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50">
                                        <div className="flex items-center gap-3 text-sm text-slate-300">
                                            <Calendar size={16} className="text-slate-500"/>
                                            <span className="font-semibold">{new Date(booking.start_time).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-slate-300">
                                            <Clock size={16} className="text-slate-500"/>
                                            <span className="font-semibold">
                                                {new Date(booking.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                                                {new Date(booking.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-slate-300">
                                            <div className="w-4 h-4 rounded border border-slate-600 flex items-center justify-center text-[10px] font-bold text-slate-500">P</div>
                                            <span className="font-semibold">Slot #{booking.slot_id}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-800">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Amount</p>
                                        <span className="font-black text-xl text-white">₹{booking.total_price}</span>
                                    </div>
                                    
                                    {booking.booking_status === 'ACTIVE' && (
                                        <button 
                                            onClick={() => handleCancel(booking.id)}
                                            className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl text-xs font-bold transition-colors border border-red-500/20 flex items-center gap-1 cursor-pointer"
                                        >
                                            <X size={14} /> Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DriverDashboard;
