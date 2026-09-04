import React, { useState, useEffect, useContext } from 'react';
import { Users, LayoutGrid, CheckCircle, ShieldAlert, Shield, Activity, ShieldCheck, MapPin } from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({ total_users: 0, total_locations: 0, total_bookings: 0 });
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await api.get('/dashboard/admin');
                setStats(res.data.stats || { total_users: 0, total_locations: 0, total_bookings: 0 });
                setLocations(res.data.locations || []);
            } catch (error) {
                console.error("Failed to fetch admin dashboard", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    const verifyLocation = async (id) => {
        try {
            await api.put(`/parking/${id}/verify`);
            setLocations(locations.map(loc => loc.id === id ? { ...loc, is_verified: true } : loc));
        } catch (error) {
            console.error("Failed to verify location", error);
            alert("Verification failed.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 p-4 sm:p-8 pt-24 font-sans text-slate-200 selection:bg-blue-500/30 relative">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen"></div>
            
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 animate-fade-in">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold mb-4 uppercase tracking-widest">
                            <ShieldAlert size={14} className="animate-pulse" /> Global Admin Access
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">System Authority</h1>
                        <p className="text-slate-400 font-medium text-lg">Monitor and verify the entire network.</p>
                    </div>
                </div>

                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="glass-panel p-6 rounded-3xl animate-pulse h-32 border border-slate-800"></div>
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Stats Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                            <div className="glass-panel p-6 rounded-3xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[30px] -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
                                <div className="flex items-center gap-4 mb-4 relative z-10">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                                        <Users size={24} />
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Users</h3>
                                </div>
                                <div className="text-4xl font-black text-white relative z-10">{stats.total_users || 0}</div>
                            </div>
                            
                            <div className="glass-panel p-6 rounded-3xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[30px] -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
                                <div className="flex items-center gap-4 mb-4 relative z-10">
                                    <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                                        <LayoutGrid size={24} />
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Network Facilities</h3>
                                </div>
                                <div className="text-4xl font-black text-white relative z-10">{stats.total_locations || 0}</div>
                            </div>

                            <div className="glass-panel p-6 rounded-3xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[30px] -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
                                <div className="flex items-center gap-4 mb-4 relative z-10">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                                        <Activity size={24} />
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Global Bookings</h3>
                                </div>
                                <div className="text-4xl font-black text-white relative z-10">{stats.total_bookings || 0}</div>
                            </div>
                        </div>

                        {/* Location Verification List */}
                        <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
                            <div className="p-6 md:p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                                <div>
                                    <h2 className="text-2xl font-black text-white">Facility Verification Queue</h2>
                                    <p className="text-slate-400 text-sm font-medium mt-1">Review and approve operator facilities</p>
                                </div>
                            </div>
                            
                            {locations.length === 0 ? (
                                <div className="p-16 text-center">
                                    <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-800">
                                        <ShieldCheck size={32} className="text-slate-600" />
                                    </div>
                                    <p className="text-slate-400 font-medium">All facilities are currently verified.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-900/30 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                                <th className="p-4 md:px-8 border-b border-slate-800">Facility ID</th>
                                                <th className="p-4 md:px-8 border-b border-slate-800">Name & Location</th>
                                                <th className="p-4 md:px-8 border-b border-slate-800">Operator</th>
                                                <th className="p-4 md:px-8 border-b border-slate-800">Status</th>
                                                <th className="p-4 md:px-8 border-b border-slate-800 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800/50">
                                            {locations.map((loc) => (
                                                <tr key={loc.id} className="hover:bg-slate-900/40 transition-colors">
                                                    <td className="p-4 md:px-8 font-mono text-xs text-slate-400">#{loc.id.substring(0,8)}</td>
                                                    <td className="p-4 md:px-8">
                                                        <div className="font-bold text-slate-200">{loc.name}</div>
                                                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                                            <MapPin size={12}/> {loc.address}, {loc.city}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 md:px-8 text-sm font-semibold text-slate-300">
                                                        {loc.operator?.name || 'System Operator'}
                                                    </td>
                                                    <td className="p-4 md:px-8">
                                                        {loc.is_verified ? (
                                                            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border bg-green-500/10 text-green-400 border-green-500/30 flex items-center gap-1 inline-flex">
                                                                <CheckCircle size={10}/> Verified
                                                            </span>
                                                        ) : (
                                                            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border bg-amber-500/10 text-amber-400 border-amber-500/30 flex items-center gap-1 inline-flex">
                                                                <ShieldAlert size={10}/> Pending
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="p-4 md:px-8 text-right">
                                                        {!loc.is_verified && (
                                                            <button 
                                                                onClick={() => verifyLocation(loc.id)}
                                                                className="glass-button text-xs px-4 py-2 rounded-lg font-bold shadow-lg shadow-blue-600/20 cursor-pointer inline-flex items-center gap-1"
                                                            >
                                                                <Shield size={14} /> Approve
                                                            </button>
                                                        )}
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

export default AdminDashboard;
