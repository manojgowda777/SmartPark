import React, { useState, useEffect } from 'react';
import { Users, LayoutGrid, IndianRupee, Activity } from 'lucide-react';
import api from '../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        total_drivers: 0,
        total_operators: 0,
        total_locations: 0,
        total_bookings: 0,
        total_revenue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await api.get('/dashboard/admin');
                setStats(res.data);
            } catch (error) {
                console.error("Failed to fetch admin dashboard", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) return <div className="p-10 text-center">Loading dashboard...</div>;

    return (
        <div className="bg-slate-50 min-h-[calc(100vh-4rem)] p-4 sm:p-8 flex">
            
            {/* Sidebar Simulation */}
            <div className="hidden lg:block w-64 bg-slate-900 rounded-2xl p-6 text-slate-300 mr-8 flex-shrink-0 shadow-lg">
                <h2 className="text-white font-bold text-xl mb-8">Admin Panel</h2>
                <ul className="space-y-4">
                    <li className="flex items-center gap-3 text-white font-medium bg-white/10 px-4 py-2 rounded-lg cursor-pointer"><Activity size={18}/> Dashboard</li>
                    <li className="flex items-center gap-3 hover:text-white cursor-pointer px-4 py-2"><Users size={18}/> Users</li>
                    <li className="flex items-center gap-3 hover:text-white cursor-pointer px-4 py-2"><LayoutGrid size={18}/> Locations</li>
                    <li className="flex items-center gap-3 hover:text-white cursor-pointer px-4 py-2"><IndianRupee size={18}/> Revenue</li>
                </ul>
            </div>

            <div className="flex-1">
                <h1 className="text-3xl font-bold text-[#0B1533] mb-8">System Overview</h1>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Users</p>
                                <p className="text-3xl font-black text-[#0B1533]">{stats.total_drivers + stats.total_operators}</p>
                            </div>
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center"><Users size={20}/></div>
                        </div>
                        <p className="text-sm text-slate-500">{stats.total_drivers} Drivers â€¢ {stats.total_operators} Operators</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Locations</p>
                                <p className="text-3xl font-black text-[#0B1533]">{stats.total_locations}</p>
                            </div>
                            <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center"><LayoutGrid size={20}/></div>
                        </div>
                        <p className="text-sm text-slate-500">Active parking facilities</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Bookings</p>
                                <p className="text-3xl font-black text-[#0B1533]">{stats.total_bookings}</p>
                            </div>
                            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center"><Activity size={20}/></div>
                        </div>
                        <p className="text-sm text-slate-500">Total successful bookings</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Revenue</p>
                                <p className="text-3xl font-black text-[#0B1533]">â‚¹{stats.total_revenue}</p>
                            </div>
                            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center"><IndianRupee size={20}/></div>
                        </div>
                        <p className="text-sm text-green-600 font-medium">+12% from last month</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center h-64 text-slate-400">
                    <p>Charts and Reports visualization would go here</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
