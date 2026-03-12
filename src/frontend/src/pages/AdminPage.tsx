import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle,
  KeyRound,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import type {
  ListingStatus,
  PropertyListing,
  PropertyType,
} from "../backend.d";
import { StatusBadge, TypeBadge } from "../components/PropertyCard";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllInquiries,
  useAllListings,
  useCreateListing,
  useDeleteListing,
  useIsAdmin,
  useMarkContacted,
  useUpdateListing,
} from "../hooks/useQueries";

const EMPTY_FORM = {
  title: "",
  description: "",
  propertyType: "land" as PropertyType,
  price: "",
  size: "",
  location: "",
  status: "available" as ListingStatus,
  images: "",
};

function AdminLoginForm() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"password" | "awaiting_ii">("password");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setError("");

    // If not logged in with Internet Identity yet, trigger login first
    if (!identity) {
      setStep("awaiting_ii");
      setLoading(true);
      try {
        await login();
      } catch {
        setError("Internet Identity login was cancelled. Please try again.");
        setStep("password");
        setLoading(false);
        return;
      }
      // After login, actor will update — but we can't await that here.
      // The useEffect pattern below handles this.
      return;
    }

    // Already logged in with II, call backend directly
    if (!actor) return;
    setLoading(true);
    try {
      const success = await actor.loginAsAdminWithPassword(password);
      if (success) {
        await queryClient.invalidateQueries();
      } else {
        setError("Incorrect password. Please try again.");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
      setStep("password");
    }
  };

  // After II login completes, automatically call the backend
  const handleIIComplete = async () => {
    if (!actor || !password) return;
    setLoading(true);
    setError("");
    try {
      const success = await actor.loginAsAdminWithPassword(password);
      if (success) {
        await queryClient.invalidateQueries();
      } else {
        setError("Incorrect password. Please try again.");
        setStep("password");
      }
    } catch {
      setError("An error occurred. Please try again.");
      setStep("password");
    } finally {
      setLoading(false);
    }
  };

  // Watch for identity + actor becoming available after II login
  // Using a simple effect via state change
  if (step === "awaiting_ii" && identity && actor && !loading) {
    handleIIComplete();
  }

  return (
    <div className="container mx-auto px-4 py-20 flex justify-center">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <KeyRound className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Admin Login
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Enter the admin password to access the dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="admin-password">Admin Password</Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                autoFocus
                disabled={loading || isLoggingIn}
                data-ocid="admin.password.input"
              />
            </div>

            {error && (
              <div
                className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive"
                data-ocid="admin.password.error_state"
              >
                {error}
              </div>
            )}

            {step === "awaiting_ii" && (
              <div className="rounded-lg bg-primary/5 border border-primary/20 px-4 py-3 text-sm text-primary">
                Please complete Internet Identity login in the popup window...
              </div>
            )}

            <Button
              type="submit"
              className="w-full gap-2 bg-primary hover:bg-primary/90"
              disabled={loading || isLoggingIn || !password}
              data-ocid="admin.password.submit_button"
            >
              {loading || isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {step === "awaiting_ii"
                    ? "Waiting for login..."
                    : "Verifying..."}
                </>
              ) : (
                "Login as Admin"
              )}
            </Button>

            {!identity && (
              <p className="text-xs text-center text-muted-foreground">
                Clicking login will open Internet Identity for verification.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: listings, isLoading: listingsLoading } = useAllListings();
  const { data: inquiries, isLoading: inquiriesLoading } = useAllInquiries();
  const createListing = useCreateListing();
  const updateListing = useUpdateListing();
  const deleteListing = useDeleteListing();
  const markContacted = useMarkContacted();

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<PropertyListing | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<bigint | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const openAdd = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  };
  const openEdit = (l: PropertyListing) => {
    setEditTarget(l);
    setForm({
      title: l.title,
      description: l.description,
      propertyType: l.propertyType,
      price: String(l.price),
      size: String(l.size),
      location: l.location,
      status: l.status,
      images: l.images.join(", "),
    });
    setFormOpen(true);
  };
  const openDelete = (id: bigint) => {
    setDeleteTarget(id);
    setConfirmOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const imgs = form.images
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (editTarget) {
      await updateListing.mutateAsync({
        id: editTarget.id,
        title: form.title,
        description: form.description,
        propertyType: form.propertyType,
        price: Number(form.price),
        size: Number(form.size),
        location: form.location,
        status: form.status,
        images: imgs,
      });
    } else {
      await createListing.mutateAsync({
        title: form.title,
        description: form.description,
        propertyType: form.propertyType,
        price: Number(form.price),
        size: Number(form.size),
        location: form.location,
        images: imgs,
      });
    }
    setFormOpen(false);
  };

  const handleDelete = async () => {
    if (deleteTarget !== null) await deleteListing.mutateAsync(deleteTarget);
    setConfirmOpen(false);
    setDeleteTarget(null);
  };

  // Show loading spinner only briefly while checking admin status
  if (adminLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Not admin — show combined password + II login form
  if (!isAdmin) {
    return <AdminLoginForm />;
  }

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <span className="text-primary text-sm font-semibold tracking-widest uppercase">
          Administration
        </span>
        <h1 className="font-display text-4xl font-bold text-foreground mt-1">
          Admin Dashboard
        </h1>
      </div>

      <Tabs defaultValue="listings">
        <TabsList className="mb-6">
          <TabsTrigger value="listings" data-ocid="admin.listings.tab">
            Listings
          </TabsTrigger>
          <TabsTrigger value="inquiries" data-ocid="admin.inquiries.tab">
            Inquiries
          </TabsTrigger>
        </TabsList>

        {/* Listings Tab */}
        <TabsContent value="listings">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display text-xl font-semibold">All Listings</h2>
            <Button
              onClick={openAdd}
              data-ocid="admin.add_listing.button"
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" /> Add Listing
            </Button>
          </div>
          {listingsLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <div className="rounded-xl border border-border overflow-hidden shadow-xs">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/40">
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {listings?.map((l, i) => (
                    <TableRow key={l.id.toString()}>
                      <TableCell className="font-medium">{l.title}</TableCell>
                      <TableCell>
                        <TypeBadge type={l.propertyType} />
                      </TableCell>
                      <TableCell>₹{l.price.toLocaleString()}</TableCell>
                      <TableCell>{l.size.toLocaleString()} sqft</TableCell>
                      <TableCell className="max-w-[140px] truncate">
                        {l.location}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={l.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => openEdit(l)}
                            data-ocid={`admin.listing.edit_button.${i + 1}`}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => openDelete(l.id)}
                            data-ocid={`admin.listing.delete_button.${i + 1}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!listings || listings.length === 0) && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-10 text-muted-foreground"
                        data-ocid="admin.listings.empty_state"
                      >
                        No listings yet. Add your first listing.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* Inquiries Tab */}
        <TabsContent value="inquiries">
          <h2 className="font-display text-xl font-semibold mb-4">
            All Inquiries
          </h2>
          {inquiriesLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <div className="rounded-xl border border-border overflow-hidden shadow-xs">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/40">
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inquiries?.map((inq, i) => (
                    <TableRow key={inq.id.toString()}>
                      <TableCell className="font-medium">{inq.name}</TableCell>
                      <TableCell>{inq.email}</TableCell>
                      <TableCell>{inq.phone}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {inq.message}
                      </TableCell>
                      <TableCell>
                        {inq.contacted ? (
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            Contacted
                          </Badge>
                        ) : (
                          <Badge variant="outline">Pending</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {!inq.contacted && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5"
                            onClick={() => markContacted.mutate(inq.id)}
                            data-ocid={`admin.inquiry.contacted_button.${i + 1}`}
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Mark
                            Contacted
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!inquiries || inquiries.length === 0) && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-10 text-muted-foreground"
                        data-ocid="admin.inquiries.empty_state"
                      >
                        No inquiries yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add/Edit Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editTarget ? "Edit Listing" : "Add New Listing"}
            </DialogTitle>
            <DialogDescription>
              Fill in the property details below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                required
                placeholder="Property title"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                required
                rows={3}
                placeholder="Describe the property..."
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Type</Label>
                <Select
                  value={form.propertyType}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, propertyType: v as PropertyType }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="land">Land</SelectItem>
                    <SelectItem value="plot">Plot</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {editTarget && (
                <div>
                  <Label>Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(v) =>
                      setForm((p) => ({ ...p, status: v as ListingStatus }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Price (₹)</Label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, price: e.target.value }))
                  }
                  required
                  placeholder="150000"
                />
              </div>
              <div>
                <Label>Size (sqft)</Label>
                <Input
                  type="number"
                  value={form.size}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, size: e.target.value }))
                  }
                  required
                  placeholder="10000"
                />
              </div>
            </div>
            <div>
              <Label>Location</Label>
              <Input
                value={form.location}
                onChange={(e) =>
                  setForm((p) => ({ ...p, location: e.target.value }))
                }
                required
                placeholder="City, Region"
              />
            </div>
            <div>
              <Label>Image URLs (comma-separated)</Label>
              <Input
                value={form.images}
                onChange={(e) =>
                  setForm((p) => ({ ...p, images: e.target.value }))
                }
                placeholder="https://example.com/img.jpg, ..."
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormOpen(false)}
                data-ocid="admin.listing.form.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90"
                disabled={createListing.isPending || updateListing.isPending}
                data-ocid="admin.listing.form.submit_button"
              >
                {createListing.isPending || updateListing.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : editTarget ? (
                  "Save Changes"
                ) : (
                  "Add Listing"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              Delete Listing
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. The listing will be permanently
              removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              data-ocid="admin.delete.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteListing.isPending}
              data-ocid="admin.delete.confirm_button"
            >
              {deleteListing.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
