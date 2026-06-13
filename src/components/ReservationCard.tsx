import { useNavigate } from "react-router-dom";

export type ReservationStatus = "confirmed" | "pending" | "cancelled" | "completed";

export interface Reservation {
  id: string;
  hotelName: string;
  hotelImage: string;
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalXof: number;
  status: ReservationStatus;
  roomType: string;
}

const STATUS_CONFIG: Record<ReservationStatus, { label: string; bg: string; text: string; dot: string }> = {
  confirmed: { label: "Confirmée", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  pending:   { label: "En attente", bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-400"  },
  cancelled: { label: "Annulée",   bg: "bg-red-50",     text: "text-red-600",     dot: "bg-red-500"    },
  completed: { label: "Terminée",  bg: "bg-gray-100",   text: "text-gray-500",    dot: "bg-gray-400"   },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

function nightCount(checkIn: string, checkOut: string) {
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

interface ReservationCardProps {
  reservation: Reservation;
  onCancel?: (id: string) => void;
}

export default function ReservationCard({ reservation: r, onCancel }: ReservationCardProps) {
  const navigate = useNavigate();
  const status = STATUS_CONFIG[r.status];
  const nights = nightCount(r.checkIn, r.checkOut);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="sm:w-48 h-40 sm:h-auto relative shrink-0 overflow-hidden">
          <img src={r.hotelImage} alt={r.hotelName} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent sm:bg-gradient-to-r" />
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${status.bg} ${status.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                  {status.label}
                </span>
                <span className="text-gray-300 text-xs">#{r.id}</span>
              </div>
              <h3 className="font-bold text-gray-900 text-lg">{r.hotelName}</h3>
              <p className="text-gray-400 text-sm flex items-center gap-1 mt-0.5">
                <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {r.location}
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-2xl font-black text-gray-900">{r.totalXof.toLocaleString("fr-FR")}</div>
              <div className="text-gray-400 text-xs">FCFA · {nights} nuit{nights > 1 ? "s" : ""}</div>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span><strong>{formatDate(r.checkIn)}</strong> → <strong>{formatDate(r.checkOut)}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{r.guests} voyageur{r.guests > 1 ? "s" : ""}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>{r.roomType}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => navigate("/booking", { state: { reservationId: r.id } })}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 border border-amber-200 hover:border-amber-300 px-4 py-2 rounded-xl transition-all"
            >
              Voir détails
            </button>
            {r.status === "confirmed" && onCancel && (
              <button
                onClick={() => onCancel(r.id)}
                className="text-xs font-bold text-red-400 hover:text-red-600 border border-red-100 hover:border-red-200 px-4 py-2 rounded-xl transition-all"
              >
                Annuler
              </button>
            )}
            {r.status === "completed" && (
              <button
                onClick={() => navigate("/booking")}
                className="text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-xl transition-all shadow"
              >
                Réserver à nouveau
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}