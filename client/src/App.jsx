import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import FindParking from './pages/FindParking';
import ParkingDetails from './pages/ParkingDetails';
import Booking from './pages/Booking';
import DriverDashboard from './dashboards/DriverDashboard';
import OperatorDashboard from './dashboards/OperatorDashboard';
import AdminDashboard from './dashboards/AdminDashboard';
import { Car, AlertTriangle, ArrowRight } from 'lucide-react';

function App() {
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    // Only show disclaimer once per session
    if (!sessionStorage.getItem('disclaimerShown')) {
      setShowDisclaimer(true);
    }
  }, []);

  const handleEnter = () => {
    sessionStorage.setItem('disclaimerShown', 'true');
    setShowDisclaimer(false);
  };

  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          {showDisclaimer && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-500 p-4">
              <div className="bg-white max-w-xl w-full rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden max-h-[95vh] overflow-y-auto animate-in zoom-in-95 duration-500">
                {/* Decorative background blob */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-100 rounded-full blur-[50px] opacity-70 pointer-events-none"></div>
                
                <div className="text-center relative z-10">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-inner">
                    <Car size={32} className="md:w-10 md:h-10" />
                  </div>
                  
                  <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-1 md:mb-2 tracking-tight">Welcome to SmartPark</h1>
                  <h2 className="text-xs md:text-lg font-bold text-blue-600 mb-4 md:mb-6 uppercase tracking-wider">Smart Parking Booking System</h2>
                  
                  <p className="text-sm md:text-base text-slate-600 mb-4 md:mb-6 leading-relaxed px-2">
                    A student-developed <strong>academic mini project</strong> designed to demonstrate a smart, convenient, and digital approach to parking search and reservation.
                  </p>
                  
                  <p className="text-xs md:text-sm font-bold text-slate-400 mb-4 md:mb-6 uppercase tracking-wider">
                    Developed by Manoj Gowda
                  </p>
                  
                  <div className="bg-amber-50 border border-amber-200 p-4 md:p-5 rounded-2xl mb-6 md:mb-8 text-left flex flex-col sm:flex-row items-center sm:items-start gap-3 md:gap-4 text-center sm:text-left">
                    <AlertTriangle className="text-amber-500 flex-shrink-0" size={24} />
                    <div className="text-amber-800 text-xs md:text-sm leading-relaxed">
                      <strong>Disclaimer:</strong> This website is created exclusively for educational and demonstration purposes. Parking slots, bookings, payments, and other information may be simulated and do not represent actual commercial services.
                    </div>
                  </div>
                  
                  <p className="text-sm md:text-base text-slate-500 font-medium mb-6 md:mb-8">Thank you for exploring the project.</p>
                  
                  <button 
                    onClick={handleEnter}
                    className="w-full bg-slate-900 text-white font-black py-3 md:py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-slate-900/20 text-sm md:text-base"
                  >
                    Enter SmartPark <ArrowRight size={18} className="md:w-5 md:h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className={`font-sans text-slate-900 min-h-screen bg-slate-50 flex flex-col transition-all duration-700 ${showDisclaimer ? 'blur-sm scale-95' : ''}`}>
            <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/find-parking" element={<FindParking />} />
              <Route path="/parking/:id" element={<ParkingDetails />} />
              <Route path="/book/:slotId" element={<Booking />} />
              
              <Route path="/driver/dashboard" element={<DriverDashboard />} />
              <Route path="/operator/dashboard" element={<OperatorDashboard />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
          </main>
          
          <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 text-center relative z-20">
            <div className="max-w-7xl mx-auto px-4">
              <p className="flex justify-center items-center gap-2 font-medium">
                Designed & Developed by <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-black tracking-wider hover:scale-110 transition-transform cursor-pointer">Manoj Gowda</span>
              </p>
              <p className="text-xs mt-2 opacity-50">&copy; {new Date().getFullYear()} SmartPark. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
