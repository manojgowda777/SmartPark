import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { Car, Moon, Sun, Globe, Menu, X } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { lang, setLang, t: getT } = useContext(LanguageContext);
    const navigate = useNavigate();
    const [isDark, setIsDark] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    const handleLogout = () => {
        logout();
        setIsMobileMenuOpen(false);
        navigate('/');
    };

    const t = getT('nav');

    return (
        <nav className="bg-white shadow-sm border-b border-slate-200 relative z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl">
                            <Car className="text-blue-600" size={28} />
                            <span className="text-slate-900">Smart<span className="text-blue-600">Park</span></span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* Language Toggle */}
                        <div className="relative group flex items-center bg-slate-100 rounded-lg p-1 mr-2 border border-slate-200">
                            <Globe size={16} className="text-slate-500 mx-2" />
                            <select 
                                value={lang} 
                                onChange={(e) => setLang(e.target.value)}
                                className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer pr-2"
                            >
                                <option value="en">English</option>
                                <option value="mr">मराठी</option>
                                <option value="hi">हिंदी</option>
                            </select>
                        </div>

                        <button 
                            onClick={() => setIsDark(!isDark)} 
                            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors mr-2 shadow-inner border border-slate-200"
                            title="Toggle Dark Mode"
                        >
                            {isDark ? <Sun size={20} className="text-amber-500" /> : <Moon size={20} className="text-indigo-600" />}
                        </button>
                        
                        <Link to="/find-parking" className="text-slate-600 hover:text-blue-600 font-medium">{t.find}</Link>
                        
                        {user ? (
                            <>
                                <Link to={`/${user.role.toLowerCase()}/dashboard`} className="text-slate-600 hover:text-blue-600 font-medium">{t.dash}</Link>
                                <button 
                                    onClick={handleLogout}
                                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2 rounded-lg font-medium transition-colors"
                                >
                                    {t.out}
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-slate-600 hover:text-blue-600 font-medium">{t.login}</Link>
                                <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                                    {t.reg}
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden items-center gap-3">
                        <button 
                            onClick={() => setIsDark(!isDark)} 
                            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors shadow-inner border border-slate-200"
                        >
                            {isDark ? <Sun size={20} className="text-amber-500" /> : <Moon size={20} className="text-indigo-600" />}
                        </button>
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-slate-200 shadow-xl py-4 px-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
                    <div className="flex items-center bg-slate-100 rounded-lg p-2 border border-slate-200">
                        <Globe size={18} className="text-slate-500 mx-2" />
                        <select 
                            value={lang} 
                            onChange={(e) => setLang(e.target.value)}
                            className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer flex-1"
                        >
                            <option value="en">English</option>
                            <option value="mr">मराठी</option>
                            <option value="hi">हिंदी</option>
                        </select>
                    </div>
                    
                    <Link to="/find-parking" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-700 hover:bg-slate-50 font-bold p-3 rounded-xl border border-transparent hover:border-slate-100 transition-colors">
                        {t.find}
                    </Link>
                    
                    {user ? (
                        <>
                            <Link to={`/${user.role.toLowerCase()}/dashboard`} onClick={() => setIsMobileMenuOpen(false)} className="text-slate-700 hover:bg-slate-50 font-bold p-3 rounded-xl border border-transparent hover:border-slate-100 transition-colors">
                                {t.dash}
                            </Link>
                            <button 
                                onClick={handleLogout}
                                className="bg-red-50 text-red-600 font-bold p-3 rounded-xl text-left border border-red-100"
                            >
                                {t.out}
                            </button>
                        </>
                    ) : (
                        <div className="flex gap-3">
                            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 bg-slate-100 text-slate-800 text-center p-3 rounded-xl font-bold">
                                {t.login}
                            </Link>
                            <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 bg-blue-600 text-white text-center p-3 rounded-xl font-bold">
                                {t.reg}
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
