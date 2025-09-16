import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from "react-router-dom";
import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";
import { PublicRoute } from "./components/wrappers/public-route";
import { AdminRoute } from "./components/wrappers/admin-route";
import { ProtectedRoute } from "./components/wrappers/protected-route";
import NotFoundPage from "./pages/not-found";
import AdminDashboard from "./pages/admin/admin-dashboard";
import UserLayout from "./components/layout/user-layout";
import { ProductsPage } from "./pages/user/product-page";
import { ProductDetailPage } from "./pages/user/product-detail-page";
import { Toaster } from "@/components/ui/sonner";
import OrderPage from "./pages/user/order";
import CartPage from "./pages/user/cart";
import ProfilePage from "./pages/user/profile";

const App = () => {


  const router = createBrowserRouter(
    createRoutesFromElements(
      <>

        {/* User only */}
        <Route path="/" element={<ProtectedRoute />}>
          <Route index element={
            <UserLayout>
              <ProductsPage />
            </UserLayout>
          }
          />

          <Route path="/product/:id" element={
            <UserLayout>
              <ProductDetailPage />
            </UserLayout>
          }
          />

          <Route path='/orders' element={
            <UserLayout>
              <OrderPage />
            </UserLayout>
          } />

          <Route path='/cart' element={
            <UserLayout>
              <CartPage />
            </UserLayout>
          } />

          <Route path='/profile' element={
            <UserLayout>
              <ProfilePage />
            </UserLayout>
          } />

        </Route>

        {/* Public route without login */}
        <Route path="/" element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Admin only */}
        <Route path="/" element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />

      </>
    )
  )

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  )
}

export default App