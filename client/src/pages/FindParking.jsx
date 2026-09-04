import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, MapPin, Filter, Star, Map as MapIcon, List } from 'lucide-react';
import api from '../services/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { LanguageContext } from '../context/LanguageContext';

// Create a custom modern map pin icon
const customIcon = new L.divIcon({
    className: 'custom-map-icon',
    html: `<div style="background-color: #2563eb; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-family: sans-serif;">P</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

const FindParking = () => {
    const locationState = useLocation();
    const { t: getT } = useContext(LanguageContext);
    const t = getT('find');
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCity, setSelectedCity] = useState('');
    const [searchQuery, setSearchQuery] = useState(locationState.state?.query || '');
    const [viewMode, setViewMode] = useState('both'); // 'list', 'map', or 'both'

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

    return (
        <div className="bg-slate-50 min-h-[calc(100vh-4rem)] p-4 sm:p-8 relative overflow-hidden">
            {/* Background glowing blob */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-100 rounded-full blur-[120px] opacity-60 -z-10 pointer-events-none"></div>

            {/* Radar Sweep Effect (Only visible during search/loading) */}
            {loading && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full border border-blue-500/20 -z-10 flex items-center justify-center opacity-30">
                    <div className="absolute w-[800px] h-[800px] rounded-full border border-blue-500/30"></div>
                    <div className="absolute w-[400px] h-[400px] rounded-full border border-blue-500/40"></div>
                    <div className="absolute top-1/2 left-1/2 w-[600px] h-1 bg-gradient-to-r from-transparent to-blue-500 origin-left animate-spin" style={{ animationDuration: '3s' }}></div>
                </div>
            )}

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 relative z-10">
                
                {/* Sidebar Filters */}
                <div className="w-full lg:w-72 flex-shrink-0">
                    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-white">
                        <h2 className="text-xl font-black text-[#0F172A] mb-8 flex items-center gap-3">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl"><Filter size={20} /></div> Filters
                        </h2>
                        
                        <div className="space-y-8">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-3">City</label>
                                <select 
                                    value={selectedCity} 
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium cursor-pointer hover:bg-white"
                                >
                                    <option value="">All Cities</option>
                                    <option value="Mumbai">Mumbai</option>
                                    <option value="Pune">Pune</option>
                                    <option value="Nagpur">Nagpur</option>
                                    <option value="Nashik">Nashik</option>
                                    <option value="Thane">Thane</option>
                                    <option value="Chhatrapati Sambhajinagar">Chhatrapati Sambhajinagar</option>
                                    <option value="Solapur">Solapur</option>
                                    <option value="Navi Mumbai">Navi Mumbai</option>
                                    <option value="Kolhapur">Kolhapur</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-3">{t.distance}</label>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 cursor-pointer transition-colors border border-transparent hover:border-blue-100"><input type="radio" name="distance" className="text-blue-600 focus:ring-blue-500 w-4 h-4" /> <span className="font-medium text-slate-700">&lt; 1 km</span></label>
                                    <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 cursor-pointer transition-colors border border-transparent hover:border-blue-100"><input type="radio" name="distance" className="text-blue-600 focus:ring-blue-500 w-4 h-4" /> <span className="font-medium text-slate-700">&lt; 3 km</span></label>
                                    <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 cursor-pointer transition-colors border border-transparent hover:border-blue-100"><input type="radio" name="distance" className="text-blue-600 focus:ring-blue-500 w-4 h-4" /> <span className="font-medium text-slate-700">&lt; 5 km</span></label>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-3">{t.vehicleType}</label>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-purple-50 cursor-pointer transition-colors border border-transparent hover:border-purple-100"><input type="checkbox" className="text-purple-600 rounded focus:ring-purple-500 w-4 h-4" defaultChecked /> <span className="font-medium text-slate-700">{t.car}</span></label>
                                    <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-purple-50 cursor-pointer transition-colors border border-transparent hover:border-purple-100"><input type="checkbox" className="text-purple-600 rounded focus:ring-purple-500 w-4 h-4" /> <span className="font-medium text-slate-700">{t.bike}</span></label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    <div className="mb-8 flex gap-3">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={22} />
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={t.searchPh} 
                                className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-md border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all shadow-sm font-medium text-lg hover:bg-white" 
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">{t.title}</h2>
                            <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold shadow-inner">
                                {filteredLocations.length} {t.found}
                            </span>
                        </div>
                        <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 p-1 w-full sm:w-auto overflow-x-auto">
                            <button onClick={() => setViewMode('both')} className={`flex-1 sm:flex-none justify-center px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${viewMode === 'both' ? 'bg-slate-100 text-[#0F172A] shadow-inner' : 'text-slate-500 hover:text-slate-700'}`}>{t.split}</button>
                            <button onClick={() => setViewMode('map')} className={`flex-1 sm:flex-none justify-center px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${viewMode === 'map' ? 'bg-slate-100 text-[#0F172A] shadow-inner' : 'text-slate-500 hover:text-slate-700'}`}><MapIcon size={16}/> {t.map}</button>
                            <button onClick={() => setViewMode('list')} className={`flex-1 sm:flex-none justify-center px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${viewMode === 'list' ? 'bg-slate-100 text-[#0F172A] shadow-inner' : 'text-slate-500 hover:text-slate-700'}`}><List size={16}/> {t.list}</button>
                        </div>
                    </div>

                    {/* Interactive 3D Map */}
                    {(viewMode === 'both' || viewMode === 'map') && !loading && (
                        <div className="w-full h-[400px] mb-8 bg-slate-200 rounded-3xl overflow-hidden shadow-xl border-4 border-white relative z-0">
                            <MapContainer 
                                center={filteredLocations.length > 0 ? [filteredLocations[0].latitude, filteredLocations[0].longitude] : [19.0760, 72.8777]} 
                                zoom={filteredLocations.length > 0 ? 12 : 7} 
                                style={{ height: '100%', width: '100%', zIndex: 0 }}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                {filteredLocations.map(loc => (
                                    <Marker key={loc.id} position={[loc.latitude, loc.longitude]} icon={customIcon}>
                                        <Popup className="rounded-xl overflow-hidden">
                                            <div className="w-48">
                                                <img src={loc.image || "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=300"} alt={loc.name} className="w-full h-24 object-cover mb-2 rounded-lg" />
                                                <h3 className="font-bold text-[#0F172A] leading-tight mb-1">{loc.name}</h3>
                                                <p className="text-xs text-slate-500 mb-2">{loc.address}, {loc.city}</p>
                                                <Link to={`/parking/${loc.id}`} className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg font-bold text-xs hover:bg-blue-700">Book Spot</Link>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        </div>
                    )}

                    {/* List View */}
                    {(viewMode === 'both' || viewMode === 'list') && (
                        <>
                            {loading ? (
                        <div className="grid md:grid-cols-2 gap-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="bg-white p-5 rounded-3xl border border-slate-200 animate-pulse flex flex-col xl:flex-row gap-5 shadow-sm">
                                    <div className="w-full xl:w-40 h-40 bg-slate-200 rounded-2xl"></div>
                                    <div className="flex-1 py-2">
                                        <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
                                        <div className="h-4 bg-slate-200 rounded w-1/2 mb-6"></div>
                                        <div className="h-10 bg-slate-200 rounded-xl w-full mt-auto"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredLocations.length === 0 ? (
                        <div className="bg-white/80 backdrop-blur-md p-16 rounded-3xl border border-slate-200 text-center shadow-xl shadow-slate-200/50">
                            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search size={40} className="text-slate-400" />
                            </div>
                            <h3 className="text-2xl font-black text-[#0F172A] mb-3">No parking spots found</h3>
                            <p className="text-slate-500 text-lg">Try changing your city or search filter to find available locations.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {filteredLocations.map(location => (
                                <div key={location.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-md shadow-slate-200/50 hover:shadow-lg hover:shadow-slate-300 hover:-translate-y-2 transition-all duration-300 flex flex-col xl:flex-row gap-6 group">
                                    <div className="overflow-hidden rounded-2xl w-full xl:w-40 h-48 xl:h-auto flex-shrink-0 relative">
                                        <img 
                                            src={location.image || "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=300"} 
                                            alt={location.name} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent xl:hidden"></div>
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start gap-2 mb-2">
                                                <h3 className="font-black text-xl text-[#0F172A] leading-tight group-hover:text-blue-600 transition-colors">{location.name}</h3>
                                                <span className="flex items-center text-sm font-bold text-amber-500 gap-1 bg-amber-50 px-2 py-1 rounded-lg"><Star size={14} fill="currentColor"/> 4.8</span>
                                            </div>
                                            <p className="text-slate-500 font-medium text-sm flex items-start gap-1.5 mt-2"><MapPin size={16} className="text-blue-500 mt-0.5 flex-shrink-0"/> <span className="line-clamp-2">{location.address}, {location.city}</span></p>
                                        </div>
                                        
                                        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-200">
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Starting from</p>
                                                <span className="font-black text-2xl text-[#0B1533]">â‚¹40<span className="text-slate-500 font-medium text-sm">/hr</span></span>
                                            </div>
                                            <Link to={`/parking/${location.id}`} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all hover:shadow-[0_8px_15px_rgba(79,70,229,0.3)] hover:-translate-y-0.5 text-center whitespace-nowrap">
                                                Book Spot
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FindParking;
