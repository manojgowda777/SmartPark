import React, { useState, useEffect } from 'react';
import { IndianRupee, Car, LayoutGrid } from 'lucide-react';
import api from '../services/api';

const OperatorDashboard = () => {
    const [stats, setStats] = useState({ total_bookings: 0, total_revenue: 0 });
    const [recentBookings, setRecentBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await api.get('/dashboard/operator');
                setStats(res.data.stats || { total_bookings: 0, total_revenue: 0 });
                setRecentBookings(res.data.recentBookings || []);
            } catch (error) {
                console.error("Failed to fetch operator dashboard", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) return <div className="p-10 text-center">Loading dashboard...</div>;

    return (
        <div className="bg-slate-50 min-h-[calc(100vh-4rem)] p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-[#0B1533] mb-8">Operator Dashboard</h1>
                
                <div className="grid md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                        <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center"><LayoutGrid size={24}/></div>
                        <div>
                            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Bookings</p>
                            <p className="text-3xl font-black text-[#0B1533]">{stats.total_bookings || 0}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                        <div className="w-14 h-14 bg-green-100 text-green-600 rounded-xl flex items-center justify-center"><IndianRupee size={24}/></div>
                        <div>
                            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Revenue</p>
                            <p className="text-3xl font-black text-[#0B1533]">â‚¹{stats.total_revenue || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-200">
                        <h2 className="text-xl font-bold text-[#0B1533]">Recent Bookings</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold tracking-wider">
                                    <th className="p-4">Booking ID</th>
                                    <th className="p-4">Location & Slot</th>
                                    <th className="p-4">Driver & Vehicle</th>
                                    <th className="p-4">Time</th>
                                    <th className="p-4">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentBookings.length === 0 ? (
                                    <tr><td colSpan="5" className="p-8 text-center text-slate-500">No bookings found.</td></tr>
                                ) : recentBookings.map(booking => (
                                    <tr key={booking.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                                        <td className="p-4 font-medium text-[#0B1533]">#BK{1000 + booking.id}</td>
                                        <td className="p-4">
                                            <p className="font-bold text-[#0B1533]">{booking.parking_name}</p>
                                            <p className="text-xs text-slate-500">{booking.slot_number}</p>
                                        </td>
                                        <td className="p-4">
                                            <p className="font-bold text-[#0B1533]">{booking.driver_name}</p>
                                            <p className="text-xs text-slate-500 uppercase">{booking.vehicle_number}</p>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-sm text-[#0B1533]">{new Date(booking.booking_date).toLocaleDateString()}</p>
                                            <p className="text-xs text-slate-500">{booking.start_time.slice(0,5)}</p>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                                                {booking.booking_status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OperatorDashboard;
