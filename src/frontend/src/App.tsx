import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import { useActor } from "./hooks/useActor";
import AdminPage from "./pages/AdminPage";
import Footer from "./pages/Footer";
import HomePage from "./pages/HomePage";
import ListingsPage from "./pages/ListingsPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";

function RootLayout() {
  const { actor } = useActor();

  useEffect(() => {
    if (actor) {
      actor.initialize().catch(console.error);
    }
  }, [actor]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <Toaster />
    </div>
  );
}

const rootRoute = createRootRoute({ component: RootLayout });
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});
const listingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/listings",
  component: ListingsPage,
});
const listingDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/listings/$id",
  component: PropertyDetailPage,
});
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  listingsRoute,
  listingDetailRoute,
  adminRoute,
]);
const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
