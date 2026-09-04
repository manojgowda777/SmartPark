import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Car, User, Mail, Lock, Phone } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', password: '', role: 'DRIVER'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await register(formData);
            navigate(`/${data.user.role.toLowerCase()}/dashboard`);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
                <div>
                    <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-900">
                        Create an account
                    </h2>
                    <p className="mt-2 text-center text-sm text-slate-600">
                        Join SmartPark today
                    </p>
                </div>
                
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-slate-400" />
                            </div>
                            <input type="text" name="name" required className="block w-full pl-10 px-3 py-2 border border-slate-300 rounded-lg bg-slate-50" placeholder="John Doe" onChange={handleChange} />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-slate-400" />
                            </div>
                            <input type="email" name="email" required className="block w-full pl-10 px-3 py-2 border border-slate-300 rounded-lg bg-slate-50" placeholder="john@example.com" onChange={handleChange} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Phone className="h-5 w-5 text-slate-400" />
                            </div>
                            <input type="text" name="phone" required className="block w-full pl-10 px-3 py-2 border border-slate-300 rounded-lg bg-slate-50" placeholder="+91 9876543210" onChange={handleChange} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-400" />
                            </div>
                            <input type="password" name="password" required className="block w-full pl-10 px-3 py-2 border border-slate-300 rounded-lg bg-slate-50" placeholder="••••••••" onChange={handleChange} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Account Type</label>
                        <select name="role" onChange={handleChange} className="block w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-900">
                            <option value="DRIVER">Driver (Looking for parking)</option>
                            <option value="OPERATOR">Operator (Managing parking)</option>
                        </select>
                    </div>

                    <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-colors disabled:opacity-50 mt-6">
                        {loading ? 'Creating account...' : 'Sign up'}
                    </button>
                </form>
                
                <p className="text-center text-sm text-slate-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
