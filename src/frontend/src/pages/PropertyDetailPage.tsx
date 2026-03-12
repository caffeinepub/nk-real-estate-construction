import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle,
  DollarSign,
  Loader2,
  MapPin,
  Maximize2,
} from "lucide-react";
import { useState } from "react";
import { StatusBadge, TypeBadge } from "../components/PropertyCard";
import { useListing, useSubmitInquiry } from "../hooks/useQueries";

const PLACEHOLDER_IMAGES: Record<string, string> = {
  land: "/assets/generated/land-placeholder-1.dim_600x400.jpg",
  plot: "/assets/generated/plot-placeholder-1.dim_600x400.jpg",
  commercial: "/assets/generated/commercial-placeholder-1.dim_600x400.jpg",
};

export default function PropertyDetailPage() {
  const { id } = useParams({ from: "/listings/$id" });
  const listingId = BigInt(id);
  const { data: listing, isLoading, isError } = useListing(listingId);
  const submitInquiry = useSubmitInquiry();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitInquiry.mutateAsync({ ...form, propertyId: listingId });
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <Skeleton className="h-96 w-full rounded-2xl mb-8" />
        <Skeleton className="h-8 w-1/2 mb-4" />
        <Skeleton className="h-4 w-1/3 mb-8" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (isError || !listing) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="font-display text-3xl font-bold mb-4">
          Property Not Found
        </h2>
        <Button asChild variant="outline">
          <Link to="/listings">Back to Listings</Link>
        </Button>
      </div>
    );
  }

  const imgSrc =
    listing.images?.[0] ||
    PLACEHOLDER_IMAGES[listing.propertyType] ||
    PLACEHOLDER_IMAGES.land;

  return (
    <main className="container mx-auto px-4 py-10 max-w-5xl">
      <Link
        to="/listings"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Listings
      </Link>

      {/* Image */}
      <div className="rounded-2xl overflow-hidden mb-8 shadow-card h-72 md:h-96">
        <img
          src={imgSrc}
          alt={listing.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-10">
        {/* Details */}
        <div className="md:col-span-2">
          <div className="flex flex-wrap gap-2 mb-3">
            <TypeBadge type={listing.propertyType} />
            <StatusBadge status={listing.status} />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            {listing.title}
          </h1>
          <div className="flex items-center gap-2 text-muted-foreground mb-6">
            <MapPin className="w-4 h-4" />
            <span>{listing.location}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-secondary/60 rounded-xl p-4">
              <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
                Price
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-5 h-5 text-primary" />
                <span className="font-display text-2xl font-bold">
                  {listing.price.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="bg-secondary/60 rounded-xl p-4">
              <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
                Size
              </div>
              <div className="flex items-center gap-1">
                <Maximize2 className="w-5 h-5 text-primary" />
                <span className="font-display text-2xl font-bold">
                  {listing.size.toLocaleString()}
                </span>
                <span className="text-muted-foreground text-sm">sqft</span>
              </div>
            </div>
          </div>
          <h2 className="font-display text-xl font-semibold mb-3">
            Description
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {listing.description}
          </p>
        </div>

        {/* Inquiry Form */}
        <div className="bg-card rounded-2xl p-6 shadow-card border border-border h-fit">
          <h2 className="font-display text-xl font-bold mb-5">
            Inquire About This Property
          </h2>
          {submitted ? (
            <div data-ocid="inquiry.success_state" className="text-center py-6">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="font-display text-lg font-semibold mb-2">
                Inquiry Sent!
              </h3>
              <p className="text-muted-foreground text-sm">
                We'll get back to you within 24 hours.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setSubmitted(false)}
              >
                Send Another
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="inq-name">Full Name</Label>
                <Input
                  id="inq-name"
                  data-ocid="inquiry.name.input"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  required
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="inq-email">Email</Label>
                <Input
                  id="inq-email"
                  type="email"
                  data-ocid="inquiry.email.input"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  required
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <Label htmlFor="inq-phone">Phone</Label>
                <Input
                  id="inq-phone"
                  type="tel"
                  data-ocid="inquiry.phone.input"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  required
                  placeholder="+1 555 000 0000"
                />
              </div>
              <div>
                <Label htmlFor="inq-message">Message</Label>
                <Textarea
                  id="inq-message"
                  data-ocid="inquiry.message.textarea"
                  value={form.message}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, message: e.target.value }))
                  }
                  required
                  rows={4}
                  placeholder="I am interested in this property..."
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={submitInquiry.isPending}
                data-ocid="inquiry.submit_button"
              >
                {submitInquiry.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...
                  </>
                ) : (
                  "Send Inquiry"
                )}
              </Button>
              {submitInquiry.isError && (
                <p className="text-destructive text-sm">
                  Failed to send. Please try again.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
