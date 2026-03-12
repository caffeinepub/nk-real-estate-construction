import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Inquiry,
  ListingStatus,
  PropertyListing,
  PropertyType,
} from "../backend.d";
import { useActor } from "./useActor";

export function useAvailableListings() {
  const { actor, isFetching } = useActor();
  return useQuery<PropertyListing[]>({
    queryKey: ["availableListings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAvailableListings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllListings() {
  const { actor, isFetching } = useActor();
  return useQuery<PropertyListing[]>({
    queryKey: ["allListings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllListings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListing(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<PropertyListing>({
    queryKey: ["listing", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) throw new Error("Missing");
      return actor.getListing(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllInquiries() {
  const { actor, isFetching } = useActor();
  return useQuery<Inquiry[]>({
    queryKey: ["allInquiries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllInquiries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitInquiry() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      phone: string;
      message: string;
      propertyId: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitInquiry(
        data.name,
        data.email,
        data.phone,
        data.message,
        data.propertyId,
      );
    },
  });
}

export function useCreateListing() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      propertyType: PropertyType;
      price: number;
      size: number;
      location: string;
      images: string[];
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createListing(
        data.title,
        data.description,
        data.propertyType,
        data.price,
        data.size,
        data.location,
        data.images,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allListings"] }),
  });
}

export function useUpdateListing() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      title: string;
      description: string;
      propertyType: PropertyType;
      price: number;
      size: number;
      location: string;
      status: ListingStatus;
      images: string[];
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateListing(
        data.id,
        data.title,
        data.description,
        data.propertyType,
        data.price,
        data.size,
        data.location,
        data.status,
        data.images,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allListings"] }),
  });
}

export function useDeleteListing() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteListing(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allListings"] }),
  });
}

export function useMarkContacted() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.markInquiryContacted(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allInquiries"] }),
  });
}
