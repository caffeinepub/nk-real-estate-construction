import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { DollarSign, MapPin, Maximize2 } from "lucide-react";
import type { PropertyListing } from "../backend.d";

const PLACEHOLDER_IMAGES: Record<string, string> = {
  land: "/assets/generated/land-placeholder-1.dim_600x400.jpg",
  plot: "/assets/generated/plot-placeholder-1.dim_600x400.jpg",
  commercial: "/assets/generated/commercial-placeholder-1.dim_600x400.jpg",
};

function TypeBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    land: "bg-emerald-100 text-emerald-800 border-emerald-200",
    plot: "bg-amber-100 text-amber-800 border-amber-200",
    commercial: "bg-sky-100 text-sky-800 border-sky-200",
  };
  return (
    <span
      className={`text-xs font-semibold px-2 py-0.5 rounded-full border capitalize ${styles[type] ?? "bg-muted text-muted-foreground"}`}
    >
      {type}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    available: "bg-green-100 text-green-800 border-green-200",
    pending: "bg-amber-100 text-amber-800 border-amber-200",
    sold: "bg-red-100 text-red-800 border-red-200",
  };
  return (
    <span
      className={`text-xs font-semibold px-2 py-0.5 rounded-full border capitalize ${styles[status] ?? "bg-muted text-muted-foreground"}`}
    >
      {status}
    </span>
  );
}

export { TypeBadge, StatusBadge };

interface PropertyCardProps {
  listing: PropertyListing;
  index?: number;
}

export default function PropertyCard({
  listing,
  index = 1,
}: PropertyCardProps) {
  const imgSrc =
    listing.images?.[0] ||
    PLACEHOLDER_IMAGES[listing.propertyType] ||
    PLACEHOLDER_IMAGES.land;

  return (
    <Link
      to="/listings/$id"
      params={{ id: listing.id.toString() }}
      data-ocid={`listings.item.${index}`}
      className="group block bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative overflow-hidden h-48">
        <img
          src={imgSrc}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <TypeBadge type={listing.propertyType} />
        </div>
        <div className="absolute top-3 right-3">
          <StatusBadge status={listing.status} />
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-display text-lg font-semibold text-foreground line-clamp-1 mb-1">
          {listing.title}
        </h3>
        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{listing.location}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4 text-primary" />
            <span className="font-bold text-lg text-foreground">
              {listing.price.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <Maximize2 className="w-3.5 h-3.5" />
            <span>{listing.size.toLocaleString()} sqft</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
