import React, { useState, useEffect, useContext } from 'react';
import { IndianRupee, Car, LayoutGrid, Calendar, MapPin, Activity, Plus, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const OperatorDashboard = () => {
    const { user } = useContext(AuthContext);
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

    return (
        <div className="min-h-screen bg-slate-950 p-4 sm:p-8 pt-24 font-sans text-slate-200 selection:bg-blue-500/30 relative">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
            
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 animate-fade-in">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-4 uppercase tracking-widest">
                            <Activity size={14} className="animate-pulse" /> Operator Command Center
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">Facility Overview</h1>
                        <p className="text-slate-400 font-medium text-lg">Manage your smart parking network.</p>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <Link to="/add-parking" className="glass-button w-full md:w-auto px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm shadow-lg shadow-blue-600/20">
                            <Plus size={18} /> Add New Location
                        </Link>
                        <button className="bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 w-full md:w-auto px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm transition-colors cursor-pointer">
                            <FileText size={18} /> Generate Report
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="glass-panel p-6 rounded-3xl animate-pulse h-32 border border-slate-800"></div>
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Stats Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            <div className="glass-panel p-6 rounded-3xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[30px] -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
                                <div className="flex items-center gap-4 mb-4 relative z-10">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                                        <IndianRupee size={24} />
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Revenue</h3>
                                </div>
                                <div className="text-4xl font-black text-white relative z-10">₹{stats.total_revenue || 0}</div>
                            </div>
                            
                            <div className="glass-panel p-6 rounded-3xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[30px] -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
                                <div className="flex items-center gap-4 mb-4 relative z-10">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                                        <Car size={24} />
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Bookings</h3>
                                </div>
                                <div className="text-4xl font-black text-white relative z-10">{stats.total_bookings || 0}</div>
                            </div>

                            <div className="glass-panel p-6 rounded-3xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[30px] -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
                                <div className="flex items-center gap-4 mb-4 relative z-10">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                                        <LayoutGrid size={24} />
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Active Spaces</h3>
                                </div>
                                <div className="text-4xl font-black text-white relative z-10">100%</div>
                                <div className="absolute bottom-6 right-6 text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/20">OPTIMAL</div>
                            </div>
                            
                            <div className="glass-panel p-6 rounded-3xl relative overflow-hidden group flex flex-col justify-center items-center text-center">
                                <div className="w-12 h-12 rounded-full border-2 border-slate-700 flex items-center justify-center mb-3 text-slate-400 group-hover:border-blue-500 group-hover:text-blue-400 transition-colors">
                                    <Plus size={24} />
                                </div>
                                <Link to="/add-parking" className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">Register Facility</Link>
                            </div>
                        </div>

                        {/* Recent Bookings List */}
                        <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
                            <div className="p-6 md:p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                                <div>
                                    <h2 className="text-2xl font-black text-white">Recent Transactions</h2>
                                    <p className="text-slate-400 text-sm font-medium mt-1">Live feed of facility reservations</p>
                                </div>
                                <button className="text-sm font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer">
                                    View All <ArrowRight size={16} />
                                </button>
                            </div>
                            
                            {recentBookings.length === 0 ? (
                                <div className="p-16 text-center">
                                    <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-800">
                                        <Car size={32} className="text-slate-600" />
                                    </div>
                                    <p className="text-slate-400 font-medium">No active bookings for your facilities yet.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-900/30 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                                <th className="p-4 md:px-8 border-b border-slate-800">Booking ID</th>
                                                <th className="p-4 md:px-8 border-b border-slate-800">Customer</th>
                                                <th className="p-4 md:px-8 border-b border-slate-800">Facility</th>
                                                <th className="p-4 md:px-8 border-b border-slate-800">Slot</th>
                                                <th className="p-4 md:px-8 border-b border-slate-800">Revenue</th>
                                                <th className="p-4 md:px-8 border-b border-slate-800">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800/50">
                                            {recentBookings.map((b) => (
                                                <tr key={b.id} className="hover:bg-slate-900/40 transition-colors">
                                                    <td className="p-4 md:px-8 font-mono text-xs text-slate-400">#{b.id.substring(0,8)}</td>
                                                    <td className="p-4 md:px-8">
                                                        <div className="font-bold text-slate-200">{b.user?.name || 'Unknown'}</div>
                                                        <div className="text-xs text-slate-500">{b.user?.email || 'N/A'}</div>
                                                    </td>
                                                    <td className="p-4 md:px-8 text-sm font-semibold text-slate-300">
                                                        {b.parking_location?.name || 'N/A'}
                                                    </td>
                                                    <td className="p-4 md:px-8 text-sm text-slate-300">
                                                        <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700 font-mono text-xs">
                                                            {b.slot_id}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 md:px-8 font-black text-white text-sm">
                                                        ₹{b.total_price}
                                                    </td>
                                                    <td className="p-4 md:px-8">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                                            b.booking_status === 'ACTIVE' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                                                            b.booking_status === 'COMPLETED' ? 'bg-slate-800 text-slate-400 border-slate-700' :
                                                            'bg-red-500/10 text-red-400 border-red-500/30'
                                                        }`}>
                                                            {b.booking_status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default OperatorDashboard;
