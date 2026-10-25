import React from 'react';
import { Link } from 'react-router-dom';
import { Bed, Bath, Maximize2, MapPin, Tag } from 'lucide-react';

const PropertyCard = ({ property, onApplyClick, isManager = false }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return <span className="bg-emerald-500/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm backdrop-blur-sm">Active Listing</span>;
      case 'PENDING':
        return <span className="bg-amber-500/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm backdrop-blur-sm">Pending Approval</span>;
      case 'REJECTED':
        return <span className="bg-rose-500/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm backdrop-blur-sm">Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-brand-300 transition-all duration-300 flex flex-col">
      {/* Image container */}
      <div className="relative h-56 overflow-hidden bg-slate-100">
        <img
          src={property.imageUrl || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-black/20 pointer-events-none"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
          <span className="bg-white/95 text-slate-800 text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm backdrop-blur-md flex items-center space-x-1">
            <Tag className="w-3.5 h-3.5 text-brand-600" />
            <span>{property.propertyType || 'Apartment'}</span>
          </span>
          {getStatusBadge(property.status)}
        </div>

        {/* Price overlay */}
        <div className="absolute bottom-3 left-3 text-white">
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-black tracking-tight text-white drop-shadow-sm">
              ${Number(property.rent).toLocaleString()}
            </span>
            <span className="text-xs font-medium text-slate-200">/ month</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-brand-600 transition-colors">
            {property.title}
          </h3>

          <div className="flex items-center text-slate-500 text-xs mt-1.5 space-x-1">
            <MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0" />
            <span className="truncate">{property.address}{property.city ? `, ${property.city}` : ''}</span>
          </div>

          <p className="text-slate-600 text-xs mt-3 line-clamp-2 leading-relaxed">
            {property.description}
          </p>
        </div>

        {/* Property Specs */}
        <div className="pt-4 mt-4 border-t border-slate-100">
          <div className="grid grid-cols-3 gap-2 py-1 text-slate-600 text-xs font-medium text-center">
            <div className="flex items-center justify-center space-x-1.5 bg-slate-50 py-1.5 rounded-lg">
              <Bed className="w-4 h-4 text-brand-600" />
              <span>{property.bedrooms || 2} Beds</span>
            </div>
            <div className="flex items-center justify-center space-x-1.5 bg-slate-50 py-1.5 rounded-lg">
              <Bath className="w-4 h-4 text-brand-600" />
              <span>{property.bathrooms || 2} Baths</span>
            </div>
            <div className="flex items-center justify-center space-x-1.5 bg-slate-50 py-1.5 rounded-lg">
              <Maximize2 className="w-3.5 h-3.5 text-brand-600" />
              <span>{property.areaSqft || 1000} sqft</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-4 flex items-center space-x-2">
            <Link
              to={`/properties/${property.id}`}
              className="flex-1 text-center py-2 px-3 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              View Details
            </Link>
            {onApplyClick && (
              <button
                onClick={() => onApplyClick(property)}
                className="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-tealbrand-500 hover:from-brand-700 hover:to-tealbrand-600 shadow-md shadow-brand-500/20 transition-all"
              >
                Apply Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
