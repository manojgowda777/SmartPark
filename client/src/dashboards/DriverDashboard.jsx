import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Calendar, MapPin, Clock, Car } from 'lucide-react';
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
                // Update local state to reflect cancellation
                setBookings(bookings.map(b => b.id === id ? { ...b, booking_status: 'CANCELLED' } : b));
            } catch (error) {
                alert(error.response?.data?.message || 'Failed to cancel booking');
            }
        }
    };

    if (loading) return <div className="p-10 text-center">Loading your dashboard...</div>;

    const activeBookings = bookings.filter(b => b.booking_status === 'CONFIRMED');
    const pastBookings = bookings.filter(b => b.booking_status === 'COMPLETED' || b.booking_status === 'CANCELLED');

    return (
        <div className="bg-slate-50 min-h-[calc(100vh-4rem)] p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Good morning, {user?.name.split(' ')[0]} 👋</h1>
                <p className="text-slate-600 mb-8">Manage your parking reservations.</p>

                {activeBookings.length > 0 && (
                    <div className="mb-10">
                        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">Active Bookings</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {activeBookings.map(booking => (
                                <div key={booking.id} className="bg-white p-6 rounded-2xl shadow-sm border border-blue-200 relative overflow-hidden flex flex-col justify-between">
                                    <div>
                                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900">{booking.parking_name}</h3>
                                                <p className="text-sm text-slate-500">Slot: {booking.slot_number}</p>
                                            </div>
                                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Confirmed</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100">
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Date & Time</p>
                                                <p className="text-sm font-medium text-slate-900 flex items-center gap-1"><Calendar size={14}/> {new Date(booking.booking_date).toLocaleDateString()}</p>
                                                <p className="text-sm font-medium text-slate-900 flex items-center gap-1"><Clock size={14}/> {booking.start_time.slice(0,5)} ({booking.duration}h)</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Amount</p>
                                                <p className="text-lg font-bold text-slate-900">₹{booking.amount}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                                        <button 
                                            onClick={() => handleCancel(booking.id)}
                                            className="text-sm font-bold text-red-500 hover:text-red-700 transition-colors"
                                        >
                                            Cancel Booking
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Booking History</h2>
                    {pastBookings.length === 0 && activeBookings.length === 0 ? (
                        <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center">
                            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4"><Car size={32}/></div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">No bookings yet</h3>
                            <p className="text-slate-500">Find a parking spot and make your first reservation.</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold tracking-wider">
                                        <th className="p-4">Location</th>
                                        <th className="p-4">Date</th>
                                        <th className="p-4">Amount</th>
                                        <th className="p-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map(booking => (
                                        <tr key={booking.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                                            <td className="p-4">
                                                <p className="font-bold text-slate-900">{booking.parking_name}</p>
                                                <p className="text-xs text-slate-500">Slot: {booking.slot_number}</p>
                                            </td>
                                            <td className="p-4 text-sm text-slate-600">{new Date(booking.booking_date).toLocaleDateString()}</td>
                                            <td className="p-4 text-sm font-medium text-slate-900">₹{booking.amount}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${booking.booking_status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                                                    {booking.booking_status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DriverDashboard;
