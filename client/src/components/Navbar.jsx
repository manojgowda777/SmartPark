import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { Car, Globe, Menu, X, User as UserIcon, LogOut } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { lang, setLang, t: getT } = useContext(LanguageContext);
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        setIsMobileMenuOpen(false);
        navigate('/');
    };

    const t = getT('nav');

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50 py-2 shadow-lg' : 'bg-transparent py-4'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-3 text-white font-black text-2xl tracking-tight group">
                            <div className="bg-blue-600/20 p-2 rounded-xl border border-blue-500/30 group-hover:border-blue-400 transition-colors">
                                <Car className="text-blue-400" size={24} />
                            </div>
                            <span>Smart<span className="text-blue-500">Park</span></span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/find-parking" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">{t.find}</Link>
                        
                        {/* Language Selector */}
                        <div className="relative group flex items-center bg-slate-900/50 rounded-full px-3 py-1.5 border border-slate-700/50 hover:border-slate-500 transition-colors">
                            <Globe size={14} className="text-slate-400 mr-2" />
                            <select 
                                value={lang} 
                                onChange={(e) => setLang(e.target.value)}
                                className="bg-transparent text-xs font-semibold text-slate-200 outline-none cursor-pointer appearance-none pr-4"
                            >
                                <option value="en" className="bg-slate-900">EN</option>
                                <option value="mr" className="bg-slate-900">MR</option>
                                <option value="hi" className="bg-slate-900">HI</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</div>
                        </div>

                        {user ? (
                            <div className="flex items-center gap-3 ml-2 pl-6 border-l border-slate-700/50">
                                <Link to={`/${user.role.toLowerCase()}/dashboard`} className="flex items-center gap-2 text-sm font-semibold text-white bg-slate-800/80 hover:bg-slate-700 px-4 py-2 rounded-full border border-slate-600/50 transition-all">
                                    <UserIcon size={16} /> {t.dash}
                                </Link>
                                <button 
                                    onClick={handleLogout}
                                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
                                    title={t.out}
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 ml-2 pl-6 border-l border-slate-700/50">
                                <Link to="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors px-2">{t.login}</Link>
                                <Link to="/register" className="glass-button text-sm font-bold px-5 py-2 rounded-full">
                                    {t.reg}
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden items-center gap-4">
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-slate-900 border-b border-slate-800 shadow-2xl py-6 px-6 flex flex-col gap-5 animate-slide-up">
                    <div className="flex flex-col gap-4">
                        <Link to="/find-parking" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-200 font-semibold text-lg hover:text-blue-400 transition-colors">
                            {t.find}
                        </Link>
                        
                        <div className="h-px w-full bg-slate-800"></div>

                        <div className="flex items-center bg-slate-950 rounded-xl p-3 border border-slate-800">
                            <Globe size={18} className="text-slate-400 mx-2" />
                            <select 
                                value={lang} 
                                onChange={(e) => setLang(e.target.value)}
                                className="bg-transparent text-sm font-semibold text-slate-200 outline-none cursor-pointer flex-1"
                            >
                                <option value="en">English (EN)</option>
                                <option value="mr">Marathi (MR)</option>
                                <option value="hi">Hindi (HI)</option>
                            </select>
                        </div>
                        
                        {user ? (
                            <div className="flex flex-col gap-3 mt-2">
                                <Link to={`/${user.role.toLowerCase()}/dashboard`} onClick={() => setIsMobileMenuOpen(false)} className="bg-blue-600/20 text-blue-400 font-bold p-4 rounded-xl border border-blue-500/30 text-center">
                                    {t.dash}
                                </Link>
                                <button 
                                    onClick={handleLogout}
                                    className="bg-red-500/10 text-red-400 font-bold p-4 rounded-xl text-center border border-red-500/20"
                                >
                                    {t.out}
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3 mt-2">
                                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="bg-slate-800 text-white text-center p-4 rounded-xl font-bold border border-slate-700">
                                    {t.login}
                                </Link>
                                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="bg-blue-600 text-white text-center p-4 rounded-xl font-bold shadow-lg shadow-blue-600/20">
                                    {t.reg}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
