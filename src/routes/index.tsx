import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  Agenda,
  Bills,
  Debts,
  Hero,
  Home,
  Incomes,
  Login,
  Register,
  Supplies,
} from "../pages";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/home" replace /> : <>{children}</>;
}

const privatePages = [
  { path: "/home", element: <Home /> },
  { path: "/entradas", element: <Incomes /> },
  { path: "/contas", element: <Bills /> },
  { path: "/dividas", element: <Debts /> },
  { path: "/agenda", element: <Agenda /> },
  { path: "/compras", element: <Supplies /> },
];

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PublicOnlyRoute>
              <Hero />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          }
        />
        {privatePages.map((p) => (
          <Route
            key={p.path}
            path={p.path}
            element={<PrivateRoute>{p.element}</PrivateRoute>}
          />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
