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
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-md animate-fade-in p-4">
              <div className="glass-panel max-w-xl w-full rounded-[2rem] p-8 md:p-10 relative overflow-hidden max-h-[95vh] overflow-y-auto animate-slide-up">
                {/* Decorative background glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-32 bg-blue-500/20 blur-[80px] rounded-full pointer-events-none"></div>
                
                <div className="text-center relative z-10">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-900/40 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/30 shadow-[0_0_20px_rgba(37,99,235,0.2)]">
                    <Car size={32} strokeWidth={1.5} className="md:w-10 md:h-10" />
                  </div>
                  
                  <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">SmartPark</h1>
                  <h2 className="text-xs md:text-sm font-bold text-blue-400 mb-8 uppercase tracking-[0.2em]">Premium Mobility Experience</h2>
                  
                  <p className="text-sm md:text-base text-slate-300 mb-6 leading-relaxed px-2 font-light">
                    A student-developed <strong>academic mini project</strong> designed to demonstrate a next-generation approach to parking search and reservation.
                  </p>
                  
                  <div className="bg-slate-900/80 border border-slate-700/50 p-5 rounded-2xl mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                    <AlertTriangle className="text-blue-400 flex-shrink-0" size={24} />
                    <div className="text-slate-400 text-xs md:text-sm leading-relaxed">
                      <strong>Disclaimer:</strong> This application is created exclusively for educational purposes. Parking slots and payments are simulated and do not represent actual commercial services.
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleEnter}
                    className="w-full bg-white text-slate-950 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-all hover:-translate-y-1 active:translate-y-0 shadow-[0_10px_40px_rgba(255,255,255,0.1)] text-sm md:text-base"
                  >
                    Enter Application <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className={`font-sans min-h-screen flex flex-col transition-all duration-700 ${showDisclaimer ? 'blur-md scale-[0.98]' : ''}`}>
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
            
            <footer className="bg-transparent text-slate-500 py-12 text-center relative z-20 border-t border-slate-800/50 mt-12">
              <div className="max-w-7xl mx-auto px-4">
                <p className="flex justify-center items-center gap-2 text-sm font-medium">
                  Designed & Developed by <span className="text-white font-bold tracking-wider hover:text-blue-400 transition-colors cursor-pointer">Manoj Gowda</span>
                </p>
                <p className="text-xs mt-3 opacity-40">&copy; {new Date().getFullYear()} SmartPark Premium. All rights reserved.</p>
              </div>
            </footer>
          </div>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
