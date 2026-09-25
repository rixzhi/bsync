"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Bell, Check, ShieldCheck, FileText, Sun, Moon, 
  LogOut, LogIn, Search, ChevronRight, AlertCircle, 
  CheckCircle2, User, Cpu, ShieldAlert, Clock, Download, 
  Eye, Lock, Plus, UploadCloud, File, ArrowLeft, Building2, LayoutDashboard
} from 'lucide-react';

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(true);
  
  // BYPASS: Start directly in 'officer' view instead of 'login'
  const [currentView, setCurrentView] = useState('officer');
  
  // Login Tab State
  const [loginTab, setLoginTab] = useState('officer'); 

  // BYPASS: Pre-fill the Sarah Chen mock officer profile
  const [currentUser, setCurrentUser] = useState({
    name: 'Officer Sarah Chen',
    id: 'BSYNC-9942',
    role: 'Senior Permit & Underwriting Officer',
    type: 'officer'
  });

  // Login form inputs
  const [inputId, setInputId] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPermitId, setSelectedPermitId] = useState('PRM-2026-8831');

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New User Aadhaar Verified',
      message: 'New user Rajesh Kumar registered and passed UIDAI biometric verification.',
      time: '14 mins ago',
      read: false,
      type: 'aadhaar',
      permitId: 'PRM-2026-8832'
    },
    {
      id: 2,
      title: 'AI Risk Analysis Complete',
      message: 'Structural load analysis completed for SunVanguard Energy. Risk score: Low (9.5).',
      time: '1 hour ago',
      read: true,
      type: 'ai',
      permitId: 'PRM-2026-8829'
    }
  ]);

  const [permits, setPermits] = useState([
    {
      id: 'PRM-2026-8831',
      applicantName: 'Greenline Solar Inc.',
      applicantType: 'Commercial Solar',
      submittedDate: '2026-03-26',
      status: 'Pending AI Review',
      riskScore: 'Low (9.2)',
      aadhaarName: 'Aarav Sharma',
      aadhaarMasked: '[Aadhaar Redacted]', 
      surveyDocs: [
        { name: 'Rooftop_Structural_Load_Report.pdf', size: '4.2 MB', verified: true },
        { name: 'UIDAI_Entity_Verification_Cert.pdf', size: '1.1 MB', verified: true }
      ]
    },
    {
      id: 'PRM-2026-8832',
      applicantName: 'Rajesh Kumar',
      applicantType: 'Residential Rooftop',
      submittedDate: '2026-03-26',
      status: 'Aadhaar Verified',
      riskScore: 'Very Low (9.8)',
      aadhaarName: 'Rajesh Kumar',
      aadhaarMasked: '[Aadhaar Redacted]',
      surveyDocs: [
        { name: 'Property_Deed_Rajesh.pdf', size: '2.4 MB', verified: true },
        { name: 'UIDAI_eKYC_Document.pdf', size: '840 KB', verified: true }
      ]
    }
  ]);

  const [applyForm, setApplyForm] = useState({
    permitType: 'Residential Rooftop',
    aadhaarName: '',
    aadhaarNumber: '',
    files: []
  });

  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogin = (e) => {
    e.preventDefault();
    if (!inputId.trim() || !inputPassword.trim()) {
      setLoginError('Please enter valid credentials.');
      return;
    }
    setLoginError('');
    
    if (loginTab === 'officer') {
      setCurrentUser({
        name: 'Officer Sarah Chen',
        id: inputId.toUpperCase(),
        role: 'Senior Permit & Underwriting Officer',
        type: 'officer'
      });
      setCurrentView('officer');
    } else {
      setCurrentUser({
        name: 'Rajesh Kumar',
        id: inputId,
        role: 'Citizen / Applicant',
        type: 'citizen'
      });
      setCurrentView('citizen');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('login');
    setInputId('');
    setInputPassword('');
  };

  const handleApplySubmit = (e) => {
    e.preventDefault();
    
    const newPermitId = `PRM-2026-${Math.floor(Math.random() * 1000) + 9000}`;
    const maskedAadhaar = '[Aadhaar Redacted]';

    const newPermit = {
      id: newPermitId,
      applicantName: applyForm.aadhaarName || currentUser.name,
      applicantType: applyForm.permitType,
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'Pending AI Review',
      riskScore: 'Pending Assessment',
      aadhaarName: applyForm.aadhaarName || currentUser.name,
      aadhaarMasked: maskedAadhaar,
      surveyDocs: applyForm.files.length > 0 ? applyForm.files : [
        { name: 'Site_Survey_Document.pdf', size: '2.1 MB', verified: false }
      ]
    };

    setPermits([newPermit, ...permits]);

    setNotifications([
      {
        id: Date.now(),
        title: 'New Permit Application Submitted',
        message: `${newPermit.applicantName} submitted a new ${newPermit.applicantType} permit application.`,
        time: 'Just now',
        read: false,
        type: 'permit',
        permitId: newPermit.id
      },
      ...notifications
    ]);

    setApplyForm({ permitType: 'Residential Rooftop', aadhaarName: '', aadhaarNumber: '', files: [] });
    setCurrentView('citizen');
  };

  const selectedPermit = useMemo(() => {
    return permits.find(p => p.id === selectedPermitId) || permits[0];
  }, [permits, selectedPermitId]);

  const citizenPermits = useMemo(() => {
    if (!currentUser) return [];
    return permits.filter(p => p.applicantName.includes(currentUser.name) || p.aadhaarName.includes(currentUser.name));
  }, [permits, currentUser]);

  if (currentView === 'login') {
    return (
      <div className="bg-slate-50 text-slate-900 min-h-screen flex flex-col items-center justify-center p-4 font-sans transition-colors duration-200">
        <div className="w-full max-w-md p-8 rounded-3xl border shadow-2xl bg-white border-slate-200">
          <div className="flex justify-center items-center mb-8">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-bold text-2xl tracking-wider">
                BS
              </div>
              <div>
                <h1 className="font-bold text-xl tracking-tight text-slate-800">BSYNC Portal</h1>
                <p className="text-xs text-slate-500">Unified Services Gateway</p>
              </div>
            </div>
          </div>

          <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
            <button
              onClick={() => setLoginTab('citizen')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                loginTab === 'citizen' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Citizen Apply
            </button>
            <button
              onClick={() => setLoginTab('officer')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                loginTab === 'officer' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Officer Login
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-medium">
                {loginError}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold mb-1.5 text-slate-700">
                {loginTab === 'officer' ? 'Government ID / Officer ID' : 'Aadhaar Number / Email'}
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input 
                  type="text"
                  value={inputId}
                  onChange={(e) => setInputId(e.target.value)}
                  placeholder={loginTab === 'officer' ? "e.g. BSYNC-9942" : "Enter your ID"}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-slate-50 border-slate-200 text-slate-900"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5 text-slate-700">
                Secure Password / Passkey
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input 
                  type="password"
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-slate-50 border-slate-200 text-slate-900"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center space-x-2 mt-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{loginTab === 'officer' ? 'Authenticate & Sign In' : 'Login to Apply'}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  const renderHeader = () => (
    <header className={`h-16 px-6 flex items-center justify-between border-b ${darkMode ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white/80'} backdrop-blur-md sticky top-0 z-40`}>
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-bold text-xl tracking-wider">
          BS
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-bold text-lg tracking-tight">BSYNC</h1>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${currentUser?.type === 'officer' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
              {currentUser?.type === 'officer' ? 'Officer Portal' : 'Citizen Portal'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-lg border transition-colors ${darkMode ? 'border-slate-800 bg-slate-800 text-amber-400 hover:bg-slate-700' : 'border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {currentUser?.type === 'officer' && (
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2 rounded-lg border relative transition-colors ${darkMode ? 'border-slate-800 bg-slate-800 text-slate-300 hover:bg-slate-700' : 'border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className={`absolute right-0 mt-2 w-96 rounded-2xl shadow-2xl border z-50 overflow-hidden ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'}`}>
                <div className={`p-4 border-b flex items-center justify-between ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                  <h3 className="font-semibold text-sm">Notifications</h3>
                  <button onClick={() => setNotifications([])} className="text-xs text-blue-500">Clear all</button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div key={notif.id} className={`p-4 border-b flex items-start space-x-3 ${darkMode ? 'border-slate-800 hover:bg-slate-800/50' : 'border-slate-100 hover:bg-slate-50'}`}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-semibold">{notif.title}</h4>
                          <span className="text-[10px] text-slate-400">{notif.time}</span>
                        </div>
                        <p className="text-xs mt-1 text-slate-500">{notif.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center space-x-3 pl-3 border-l border-slate-700/20">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold">{currentUser?.name}</div>
            <div className={`text-[10px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{currentUser?.role}</div>
          </div>
          <button 
            onClick={handleLogout}
            className={`p-2 rounded-lg border text-red-500 transition-colors ${darkMode ? 'border-slate-800 bg-slate-800 hover:bg-slate-700' : 'border-slate-200 bg-slate-100 hover:bg-slate-200'}`}
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );

  if (currentView === 'apply') {
    return (
      <div className={`${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} min-h-screen flex flex-col font-sans transition-colors duration-200`}>
        {renderHeader()}
        <main className="flex-1 max-w-3xl mx-auto w-full p-6">
          <div className="mb-6 flex items-center space-x-4">
            <button 
              onClick={() => setCurrentView('citizen')}
              className={`p-2 rounded-full border transition-colors ${darkMode ? 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700' : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-100'}`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">New Permit Application</h1>
              <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Submit your details and survey documents securely.</p>
            </div>
          </div>

          <form onSubmit={handleApplySubmit} className={`p-8 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-6`}>
            <div className="space-y-4">
              <h3 className="text-sm font-bold flex items-center gap-2 border-b pb-2 text-blue-500 border-blue-500/20">
                <Building2 className="w-4 h-4" />
                Project Details
              </h3>
              <div>
                <label className="block text-xs font-semibold mb-2">Permit / Project Type</label>
                <select 
                  value={applyForm.permitType}
                  onChange={(e) => setApplyForm({...applyForm, permitType: e.target.value})}
                  className={`w-full p-3 rounded-xl text-sm border focus:ring-2 focus:ring-blue-500/50 focus:outline-none ${darkMode ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                >
                  <option>Residential Rooftop Solar</option>
                  <option>Commercial Construction</option>
                  <option>Industrial Microgrid</option>
                  <option>Property Renovation</option>
                </select>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="text-sm font-bold flex items-center gap-2 border-b pb-2 text-emerald-500 border-emerald-500/20">
                <ShieldCheck className="w-4 h-4" />
                Identity Verification
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-2">Name (As per Aadhaar)</label>
                  <input 
                    type="text"
                    value={applyForm.aadhaarName}
                    onChange={(e) => setApplyForm({...applyForm, aadhaarName: e.target.value})}
                    placeholder="Enter full name"
                    className={`w-full p-3 rounded-xl text-sm border focus:ring-2 focus:ring-blue-500/50 focus:outline-none ${darkMode ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-2">Aadhaar Number</label>
                  <input 
                    type="text"
                    maxLength={12}
                    value={applyForm.aadhaarNumber}
                    onChange={(e) => setApplyForm({...applyForm, aadhaarNumber: e.target.value.replace(/\D/g, '')})}
                    placeholder="12-digit Aadhaar"
                    className={`w-full p-3 rounded-xl text-sm border focus:ring-2 focus:ring-blue-500/50 focus:outline-none font-mono ${darkMode ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="text-sm font-bold flex items-center gap-2 border-b pb-2 text-amber-500 border-amber-500/20">
                <FileText className="w-4 h-4" />
                Survey Documents
              </h3>
              <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${darkMode ? 'border-slate-700 bg-slate-950/50 hover:bg-slate-800' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'}`}>
                <UploadCloud className="w-10 h-10 mx-auto mb-3 text-blue-500" />
                <p className="text-sm font-medium mb-1">Drag & Drop Survey Documents</p>
                <p className={`text-xs mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>PDF, DWG, or JPEG up to 20MB</p>
                <button 
                  type="button"
                  onClick={() => {
                    const mockFile = { name: `Site_Plan_${Math.floor(Math.random()*100)}.pdf`, size: '3.4 MB', verified: false };
                    setApplyForm({...applyForm, files: [...applyForm.files, mockFile]});
                  }}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold border ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-700'}`}
                >
                  Browse Files
                </button>
              </div>

              {applyForm.files.length > 0 && (
                <div className="space-y-2 mt-4">
                  {applyForm.files.map((file, idx) => (
                    <div key={idx} className={`flex items-center justify-between p-3 rounded-lg border ${darkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-white'}`}>
                      <div className="flex items-center gap-3">
                        <File className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium">{file.name}</span>
                      </div>
                      <span className="text-xs text-slate-500">{file.size}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-slate-800/20 dark:border-slate-800">
              <button 
                type="submit"
                className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center space-x-2 text-sm"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Submit Application for Underwriting</span>
              </button>
            </div>
          </form>
        </main>
      </div>
    );
  }

  if (currentView === 'citizen') {
    return (
      <div className={`${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} min-h-screen flex flex-col font-sans transition-colors duration-200`}>
        {renderHeader()}
        <main className="flex-1 max-w-5xl mx-auto w-full p-6 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold">My Applications</h2>
              <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Track and manage your submitted permits securely.</p>
            </div>
            <button 
              onClick={() => setCurrentView('apply')}
              className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Apply for New Permit</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {citizenPermits.length === 0 ? (
              <div className={`col-span-full p-12 text-center border-2 border-dashed rounded-2xl ${darkMode ? 'border-slate-800 bg-slate-900/50 text-slate-500' : 'border-slate-300 bg-white text-slate-400'}`}>
                <LayoutDashboard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="font-semibold text-lg">No Applications Found</p>
                <p className="text-sm mt-1">You haven't submitted any permits yet.</p>
              </div>
            ) : (
              citizenPermits.map(permit => (
                <div key={permit.id} className={`p-6 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-4`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">{permit.id}</span>
                      <h3 className="font-bold text-lg">{permit.applicantType}</h3>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      permit.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                      permit.status === 'Aadhaar Verified' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 
                      'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                    }`}>
                      {permit.status}
                    </span>
                  </div>
                  
                  <div className={`pt-4 border-t ${darkMode ? 'border-slate-800' : 'border-slate-100'} flex justify-between items-center text-sm`}>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">{permit.surveyDocs.length} Docs Uploaded</span>
                    </div>
                    <span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>{permit.submittedDate}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={`${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} min-h-screen flex flex-col font-sans transition-colors duration-200`}>
      {renderHeader()}
      <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Pending Review</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-bold">{permits.filter(p => p.status !== 'Approved').length}</div>
            </div>

            <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Aadhaar Verified</span>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold">1,482</div>
            </div>

            <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>AI Risk Flagged</span>
                <ShieldAlert className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl font-bold">1</div>
            </div>
          </div>

          <div className={`rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm overflow-hidden`}>
            <div className={`p-4 border-b flex flex-col sm:flex-row items-center justify-between gap-4 ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className="flex items-center space-x-2">
                <h2 className="font-bold text-sm">Permit Queue</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-400 font-medium">{permits.length} Active</span>
              </div>
              <div className="relative flex-1 sm:w-60 w-full">
                <Search className={`absolute left-3 top-2.5 w-4 h-4 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                <input 
                  type="text" 
                  placeholder="Search applicant or ID..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b text-[11px] font-semibold uppercase tracking-wider ${darkMode ? 'border-slate-800 text-slate-400 bg-slate-950/40' : 'border-slate-100 text-slate-500 bg-slate-50/50'}`}>
                    <th className="p-4">Applicant</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/10 dark:divide-slate-800 text-xs">
                  {permits.map((permit) => (
                    <tr 
                      key={permit.id}
                      onClick={() => setSelectedPermitId(permit.id)}
                      className={`cursor-pointer transition-colors ${selectedPermitId === permit.id ? (darkMode ? 'bg-blue-900/20' : 'bg-blue-50/70') : (darkMode ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50')}`}
                    >
                      <td className="p-4">
                        <div className="font-semibold">{permit.applicantName}</div>
                        <div className={`text-[10px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{permit.id}</div>
                      </td>
                      <td className="p-4">{permit.applicantType}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${permit.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500' : permit.status === 'Aadhaar Verified' ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'}`}>
                          {permit.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <button className={`p-1.5 rounded-lg border ${darkMode ? 'border-slate-700 bg-slate-800 text-slate-300' : 'border-slate-200 bg-white text-slate-600'}`}>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className={`rounded-2xl border p-6 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-6 sticky top-20`}>
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/10 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500">Inspector</span>
                <h3 className="font-bold text-base mt-1">{selectedPermit.id}</h3>
              </div>
              <span className="px-2 py-1 rounded-xl text-xs font-medium bg-amber-500/10 text-amber-500">{selectedPermit.status}</span>
            </div>

            <div className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'} space-y-3`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Aadhaar Verification</span>
                </span>
              </div>
              <div className="space-y-2 pt-1 text-xs">
                <div>
                  <span className={`${darkMode ? 'text-slate-400' : 'text-slate-500'} block text-[10px] uppercase font-semibold`}>Name (As per Aadhaar)</span>
                  <span className="font-bold text-sm">{selectedPermit.aadhaarName}</span>
                </div>
                <div>
                  <span className={`${darkMode ? 'text-slate-400' : 'text-slate-500'} block text-[10px] uppercase font-semibold`}>Aadhaar Number (Masked)</span>
                  <span className="font-mono bg-slate-800/40 px-2 py-0.5 rounded text-blue-400 font-bold">{selectedPermit.aadhaarMasked}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Survey Documents</h4>
                <span className="text-xs font-medium text-blue-500">{selectedPermit.surveyDocs.length} Files</span>
              </div>
              <div className="space-y-2">
                {selectedPermit.surveyDocs.map((doc, idx) => (
                  <div key={idx} className={`p-3 rounded-xl border flex items-center justify-between ${darkMode ? 'border-slate-800 bg-slate-950/30' : 'border-slate-200 bg-slate-50'}`}>
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 shrink-0"><FileText className="w-4 h-4" /></div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold truncate">{doc.name}</div>
                        <div className={`text-[10px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{doc.size}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center space-x-3">
              <button className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve Permit</span>
              </button>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}