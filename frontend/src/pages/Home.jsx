import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Building, Shield, KeyRound, ArrowRight, CheckCircle2, Star, Sparkles, MapPin, DollarSign, Users } from 'lucide-react';
import PropertyCard from '../components/common/PropertyCard';
import api from '../api/axios';

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await api.get('/properties/public');
        setFeaturedProperties(res.data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load featured properties', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('query', searchQuery);
    if (selectedCity) params.append('city', selectedCity);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-900 via-slate-900 to-slate-950 text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8">
        {/* Ambient glow backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-brand-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-tealbrand-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-tealbrand-300" />
            <span>Next-Generation Online Real Estate Management</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
            Discover, Lease & Manage <br />
            <span className="bg-gradient-to-r from-brand-300 via-tealbrand-200 to-sky-400 bg-clip-text text-transparent">
              Exceptional Properties
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            The all-in-one portal connecting tenants, verified property managers, and administrators with instant digital agreements, real-time messaging, and seamless applications.
          </p>

          {/* Search Bar Card */}
          <form
            onSubmit={handleSearch}
            className="mt-10 p-3 max-w-3xl mx-auto bg-white/95 rounded-2xl shadow-2xl backdrop-blur-xl border border-white/20 flex flex-col md:flex-row gap-2.5 text-slate-800"
          >
            <div className="flex-1 flex items-center px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200/80 focus-within:border-brand-500 transition-colors">
              <Search className="w-5 h-5 text-slate-400 mr-2.5 shrink-0" />
              <input
                type="text"
                placeholder="Search neighborhood, property title, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
              />
            </div>

            <div className="w-full md:w-52 flex items-center px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200/80 focus-within:border-brand-500 transition-colors">
              <MapPin className="w-5 h-5 text-brand-600 mr-2 shrink-0" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-transparent text-sm text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="">All Cities</option>
                <option value="New York">New York</option>
                <option value="Miami">Miami</option>
                <option value="San Francisco">San Francisco</option>
                <option value="Los Angeles">Los Angeles</option>
                <option value="Chicago">Chicago</option>
              </select>
            </div>

            <button
              type="submit"
              className="py-3 px-7 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-600 to-tealbrand-500 hover:from-brand-700 hover:to-tealbrand-600 shadow-lg shadow-brand-500/30 transition-all flex items-center justify-center space-x-2"
            >
              <Search className="w-4 h-4" />
              <span>Explore</span>
            </button>
          </form>

          {/* Quick Metrics */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-slate-800/80 text-left">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-extrabold text-white">500+</p>
                <p className="text-xs text-slate-400 font-medium">Curated Listings</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-tealbrand-500/10 border border-tealbrand-500/20 text-tealbrand-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-extrabold text-white">12,000+</p>
                <p className="text-xs text-slate-400 font-medium">Active Tenants</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-extrabold text-white">99.4%</p>
                <p className="text-xs text-slate-400 font-medium">Occupancy Rate</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-extrabold text-white">100%</p>
                <p className="text-xs text-slate-400 font-medium">Verified Managers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-brand-600 uppercase tracking-wider mb-2">
              <Building className="w-4 h-4" />
              <span>Handpicked Residences</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Exclusive Listings
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Explore premier rental properties verified by certified managers.
            </p>
          </div>
          <Link
            to="/properties"
            className="mt-4 md:mt-0 inline-flex items-center space-x-2 text-sm font-bold text-brand-600 hover:text-brand-800 group"
          >
            <span>View All Listings</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-slate-200 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        )}
      </section>

      {/* Workflow / Role Highlights */}
      <section className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              A Tailored Experience For Every Role
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              Powerful dedicated dashboards and workflows designed specifically for modern real estate operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Admin */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Admin Control Center</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Complete platform governance with user role assignments, property listing moderation, system-wide analytics, and live activity auditing.
              </p>
              <ul className="mt-5 space-y-2 text-xs text-slate-700">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>Real-time listing approval queue</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>System settings and commission controls</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>Recharts visual metrics & reports</span>
                </li>
              </ul>
            </div>

            {/* Property Manager */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-tealbrand-100 text-tealbrand-700 flex items-center justify-center mb-6">
                <Building className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Property Manager Hub</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Add, edit and curate property listings, review incoming rental applications, manage digital agreements, and chat directly with tenants.
              </p>
              <ul className="mt-5 space-y-2 text-xs text-slate-700">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-tealbrand-600 shrink-0" />
                  <span>Full property portfolio management</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-tealbrand-600 shrink-0" />
                  <span>Instant digital agreement drafting</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-tealbrand-600 shrink-0" />
                  <span>Direct tenant chat & status alerts</span>
                </li>
              </ul>
            </div>

            {/* Tenant */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center mb-6">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Tenant Rental Portal</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Effortlessly discover dream rentals with advanced filters, submit applications in one click, track approval milestones, and sign agreements.
              </p>
              <ul className="mt-5 space-y-2 text-xs text-slate-700">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Interactive search with rent & room filters</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Real-time application status tracker</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Rental history & agreement repository</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <Building className="w-4 h-4" />
            </div>
            <span className="text-white font-extrabold text-lg tracking-tight">EstateSphere</span>
          </div>

          <p className="text-xs text-slate-500 text-center">
            &copy; {new Date().getFullYear()} EstateSphere Management System. Built with React, Vite, Tailwind & Spring Boot.
          </p>

          <div className="flex items-center space-x-6 text-xs">
            <Link to="/properties" className="hover:text-white transition-colors">Listings</Link>
            <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
            <Link to="/register" className="hover:text-white transition-colors">Create Account</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
