import { useNavigate } from "react-router-dom";

export interface Hotel {
  id: number;
  name: string;
  location: string;
  priceXof: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  amenities: string[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-4 h-4 ${s <= Math.round(rating) ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

interface HotelCardProps {
  hotel: Hotel;
  compact?: boolean;
}

export default function HotelCard({ hotel, compact = false }: HotelCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100"
      style={{ transition: "transform 0.3s ease, box-shadow 0.3s ease" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
      onClick={() => navigate("/booking", { state: { hotelId: hotel.id } })}
    >
      <div className={`relative ${compact ? "h-40" : "h-52"} overflow-hidden`}>
        <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        {hotel.badge && (
          <span className="absolute top-3 left-3 bg-white/95 text-amber-700 text-xs font-bold px-3 py-1 rounded-full shadow">
            ✦ {hotel.badge}
          </span>
        )}
        <div className="absolute bottom-3 right-3 bg-white/95 rounded-xl px-3 py-1.5 shadow">
          <span className="text-gray-900 font-black text-sm">{hotel.priceXof.toLocaleString("fr-FR")}</span>
          <span className="text-gray-500 text-xs"> FCFA/nuit</span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-lg mb-1">{hotel.name}</h3>
        <p className="text-gray-400 text-sm flex items-center gap-1 mb-3">
          <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {hotel.location}
        </p>

        {!compact && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {hotel.amenities.map((a) => (
              <span key={a} className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">{a}</span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <StarRating rating={hotel.rating} />
            <span className="text-gray-700 font-semibold text-sm">{hotel.rating}</span>
            <span className="text-gray-400 text-xs">({hotel.reviews})</span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); navigate("/booking", { state: { hotelId: hotel.id } }); }}
            className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow hover:shadow-md"
          >
            Réserver
          </button>
        </div>
      </div>
    </div>
  );
}