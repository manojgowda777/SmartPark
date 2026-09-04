import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, MapPin, Star, Filter, SlidersHorizontal, Zap, Car } from 'lucide-react';
import api from '../services/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { LanguageContext } from '../context/LanguageContext';

// Premium map pin
const customIcon = new L.divIcon({
    className: 'custom-map-icon',
    html: `<div style="background-color: #2563eb; width: 36px; height: 36px; border-radius: 50%; border: 3px solid #0B1121; box-shadow: 0 0 15px rgba(37,99,235,0.6); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-family: sans-serif; transition: all 0.3s ease;">P</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36]
});

const FindParking = () => {
    const locationState = useLocation();
    const { t: getT } = useContext(LanguageContext);
    const t = getT('find');
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCity, setSelectedCity] = useState('');
    const [searchQuery, setSearchQuery] = useState(locationState.state?.query || '');

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const res = await api.get('/parking');
                setLocations(res.data);
            } catch (error) {
                console.error("Failed to fetch parking locations", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLocations();
    }, []);

    const filteredLocations = locations.filter(loc => {
        const matchesCity = selectedCity === '' || loc.city === selectedCity;
        const matchesSearch = loc.name.toLowerCase().includes(searchQuery.toLowerCase()) || loc.address.toLowerCase().includes(searchQuery.toLowerCase()) || loc.city.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCity && matchesSearch;
    });

    const smartPick = filteredLocations.length > 0 ? filteredLocations[0] : null; // Simple frontend scoring simulation

    return (
        <div className="bg-slate-950 min-h-[calc(100vh-4rem)] p-4 sm:p-8 relative pt-24 font-sans text-slate-200">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6 animate-fade-in">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-2">Find your next spot.</h1>
                        <div className="flex items-center gap-3 text-slate-400 font-semibold tracking-wider text-sm mt-4">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-subtle"></span>
                            {filteredLocations.length} PARKING LOCATIONS LIVE
                        </div>
                    </div>

                    <div className="w-full md:w-[400px]">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                            <input 
                                type="text"
                                placeholder="Search areas, locations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* LEFT: Premium Filter Panel */}
                    <div className="w-full lg:w-72 flex-shrink-0 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        <div className="glass-panel p-6 rounded-3xl sticky top-28">
                            <div className="flex items-center gap-2 mb-6 text-white font-bold pb-4 border-b border-slate-800">
                                <SlidersHorizontal size={20} className="text-blue-400" />
                                <span>Refine Search</span>
                            </div>

                            <div className="mb-6">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">City</label>
                                <select 
                                    value={selectedCity} 
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700/50 rounded-xl px-4 py-3 text-sm font-semibold text-slate-200 outline-none focus:border-blue-500 appearance-none"
                                >
                                    <option value="">All Cities</option>
                                    {[...new Set(locations.map(l => l.city))].map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-6">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Vehicle Type</label>
                                <div className="flex gap-2">
                                    <button className="flex-1 bg-blue-600/20 border border-blue-500/50 text-blue-400 py-2 rounded-xl text-sm font-bold transition-colors">Car</button>
                                    <button className="flex-1 bg-slate-900 border border-slate-700/50 text-slate-400 py-2 rounded-xl text-sm font-bold hover:border-slate-600 transition-colors">Bike</button>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Features</label>
                                <label className="flex items-center gap-3 mb-3 cursor-pointer group">
                                    <div className="w-5 h-5 rounded bg-slate-900 border border-slate-700 flex items-center justify-center group-hover:border-blue-500 transition-colors"></div>
                                    <span className="text-sm font-medium text-slate-300">EV Charging</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="w-5 h-5 rounded bg-slate-900 border border-slate-700 flex items-center justify-center group-hover:border-blue-500 transition-colors"></div>
                                    <span className="text-sm font-medium text-slate-300">Covered Parking</span>
                                </label>
                            </div>

                            <button onClick={() => { setSelectedCity(''); setSearchQuery(''); }} className="w-full text-center text-xs font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-colors mt-4 cursor-pointer">
                                Clear Filters
                            </button>
                        </div>
                    </div>

                    {/* RIGHT: Map & Results */}
                    <div className="flex-1 flex flex-col gap-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        
                        {/* Premium Map Container */}
                        <div className="w-full h-[300px] md:h-[400px] glass-panel p-2 rounded-3xl overflow-hidden relative group">
                            {!loading && filteredLocations.length > 0 && (
                                <MapContainer 
                                    center={[filteredLocations[0].latitude, filteredLocations[0].longitude]} 
                                    zoom={12} 
                                    style={{ height: '100%', width: '100%', borderRadius: '1.25rem', zIndex: 0 }}
                                >
                                    <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                                    {filteredLocations.map(loc => (
                                        <Marker key={loc.id} position={[loc.latitude, loc.longitude]} icon={customIcon}>
                                            <Popup className="premium-popup">
                                                <div className="w-56 bg-slate-900 text-white rounded-xl overflow-hidden shadow-2xl border border-slate-700">
                                                    <img src={loc.image || "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=300"} alt={loc.name} className="w-full h-28 object-cover opacity-80" />
                                                    <div className="p-3 text-center">
                                                        <h3 className="font-bold text-white mb-1 truncate">{loc.name}</h3>
                                                        <div className="text-xs text-blue-400 mb-3 font-semibold">₹40/hr • 42 Spaces</div>
                                                        <Link to={`/parking/${loc.id}`} className="block w-full bg-white text-slate-900 py-2 rounded-lg font-bold text-xs hover:bg-blue-50 transition-colors">View Spaces</Link>
                                                    </div>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    ))}
                                </MapContainer>
                            )}
                            <div className="absolute top-4 left-4 z-10 glass-card px-4 py-2 rounded-full text-xs font-bold text-white shadow-lg border border-white/10 backdrop-blur-md flex items-center gap-2">
                                <MapPin size={14} className="text-blue-400" /> Live Map
                            </div>
                        </div>

                        {/* SMART PICK SECTION */}
                        {!loading && smartPick && (
                            <div className="relative overflow-hidden glass-panel rounded-3xl p-1 shadow-lg shadow-blue-900/20 border border-blue-500/30">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 pointer-events-none"></div>
                                <div className="absolute top-0 left-6 px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-b-lg flex items-center gap-1 z-10 shadow-lg">
                                    <Zap size={12} fill="currentColor" /> SmartPark Pick
                                </div>
                                
                                <div className="bg-slate-950/80 rounded-[1.4rem] p-6 flex flex-col md:flex-row gap-6 items-center relative z-0 mt-4 mx-2 mb-2 border border-slate-800">
                                    <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden flex-shrink-0 relative">
                                        <img src={smartPick.image || "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=300"} alt={smartPick.name} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-80"></div>
                                        <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-slate-900/80 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold text-white border border-slate-700">
                                            <Star size={12} className="text-yellow-500" fill="currentColor"/> 4.9
                                        </div>
                                    </div>
                                    <div className="flex-1 w-full">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-black text-white mb-1 group-hover:text-blue-400 transition-colors">{smartPick.name}</h3>
                                                <p className="text-slate-400 text-sm mb-3 flex items-center gap-1"><MapPin size={14} className="text-blue-500"/> {smartPick.address}, {smartPick.city}</p>
                                            </div>
                                            <div className="text-right hidden sm:block">
                                                <div className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-1">94% Match</div>
                                                <div className="text-xs text-slate-400 font-semibold">Closest • Affordable</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center gap-4">
                                                <div className="text-2xl font-black text-white">₹40<span className="text-sm text-slate-500 font-medium">/hr</span></div>
                                                <div className="text-xs font-semibold text-green-400 bg-green-400/10 px-2 py-1 rounded-md border border-green-400/20">● 42 spaces</div>
                                            </div>
                                            <Link to={`/parking/${smartPick.id}`} className="glass-button text-sm px-6 py-2 rounded-xl font-bold">
                                                View Spaces
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* NORMAL RESULTS */}
                        <div className="flex flex-col gap-4">
                            {loading ? (
                                <div className="text-center py-20 text-slate-500 font-medium animate-pulse">Scanning network for parking locations...</div>
                            ) : filteredLocations.length === 0 ? (
                                <div className="glass-panel text-center py-24 rounded-3xl">
                                    <Search size={48} className="mx-auto text-slate-600 mb-4" />
                                    <h3 className="text-xl font-bold text-white mb-2">Nothing nearby</h3>
                                    <p className="text-slate-400 text-sm">Try adjusting your filters or expanding your search radius.</p>
                                </div>
                            ) : (
                                filteredLocations.map(location => (
                                    <div key={location.id} className="glass-card p-4 rounded-3xl flex flex-col md:flex-row gap-6 group hover:border-blue-500/30">
                                        <div className="w-full md:w-56 h-40 rounded-2xl overflow-hidden flex-shrink-0 relative">
                                            <img src={location.image || "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=300"} alt={location.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 group-hover:brightness-100" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60"></div>
                                            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-slate-900/80 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold text-white border border-slate-700">
                                                <Star size={12} className="text-yellow-500" fill="currentColor"/> 4.6
                                            </div>
                                            {/* Simulated vehicle support */}
                                            <div className="absolute top-2 right-2 flex gap-1">
                                                <div className="w-6 h-6 rounded bg-slate-900/80 backdrop-blur-md flex items-center justify-center text-slate-300 border border-slate-700"><Car size={12} /></div>
                                            </div>
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-2">
                                            <div>
                                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{location.name}</h3>
                                                <p className="text-slate-400 text-sm mb-3 flex items-center gap-1"><MapPin size={14} className="text-blue-500"/> {location.address}, {location.city}</p>
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    <span className="text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-md border border-green-400/20">● AVAILABLE</span>
                                                    <span className="text-[10px] font-bold text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded-md border border-cyan-400/20">⚡ EV CHARGING</span>
                                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded-md border border-slate-700">COVERED</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-xl font-black text-white">₹40</span>
                                                    <span className="text-xs text-slate-500 font-medium">/hr</span>
                                                </div>
                                                <Link to={`/parking/${location.id}`} className="bg-slate-800 hover:bg-blue-600 text-white text-sm px-6 py-2 rounded-xl font-bold transition-colors border border-slate-700 hover:border-blue-500">
                                                    Select
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FindParking;
