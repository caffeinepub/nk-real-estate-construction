import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, SlidersHorizontal } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import PropertyCard from "../components/PropertyCard";
import { useAvailableListings } from "../hooks/useQueries";

export default function ListingsPage() {
  const { data: listings, isLoading } = useAvailableListings();
  const [typeFilter, setTypeFilter] = useState("all");
  const [maxPrice, setMaxPrice] = useState("");
  const [locationSearch, setLocationSearch] = useState("");

  const filtered = useMemo(() => {
    if (!listings) return [];
    return listings.filter((l) => {
      if (typeFilter !== "all" && l.propertyType !== typeFilter) return false;
      if (maxPrice && l.price > Number(maxPrice)) return false;
      if (
        locationSearch &&
        !l.location.toLowerCase().includes(locationSearch.toLowerCase())
      )
        return false;
      return true;
    });
  }, [listings, typeFilter, maxPrice, locationSearch]);

  const skeletonKeys = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"];

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <span className="text-primary text-sm font-semibold tracking-widest uppercase">
          Available Properties
        </span>
        <h1 className="font-display text-4xl font-bold text-foreground mt-1">
          Browse Listings
        </h1>
        <p className="text-muted-foreground mt-2">
          Find the perfect land, plot, or commercial property for your needs.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8 p-4 bg-card rounded-xl shadow-xs border border-border">
        <div className="flex items-center gap-2 text-muted-foreground">
          <SlidersHorizontal className="w-4 h-4" />
          <span className="text-sm font-medium">Filter:</span>
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger
            className="w-full sm:w-44"
            data-ocid="listings.filter.select"
          >
            <SelectValue placeholder="Property Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="land">Land</SelectItem>
            <SelectItem value="plot">Plot</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="number"
          placeholder="Max Price ($)"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-full sm:w-44"
          data-ocid="listings.filter.input"
        />
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by location..."
            value={locationSearch}
            onChange={(e) => setLocationSearch(e.target.value)}
            className="pl-9 w-full"
            data-ocid="listings.search_input"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skeletonKeys.map((k) => (
            <div key={k} className="rounded-xl overflow-hidden shadow-card">
              <Skeleton className="h-48 w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          data-ocid="listings.empty_state"
          className="text-center py-20 text-muted-foreground"
        >
          <div className="text-6xl mb-4">🌾</div>
          <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
            No listings found
          </h3>
          <p>Try adjusting your filters to see more properties.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((listing, i) => (
            <motion.div
              key={listing.id.toString()}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <PropertyCard listing={listing} index={i + 1} />
            </motion.div>
          ))}
        </div>
      )}
    </main>
  );
}
