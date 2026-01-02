import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute wraps children and redirects if not authenticated.
 * It checks auth context (user) and if missing, navigates to /login:contentReference[oaicite:27]{index=27}.
 */
// const ProtectedRoute = ({ children }) => {
//   const { user } = useAuth();
//   if (!user) {
//     return <Navigate to="/login" />;
//   }
//   return children;
// };
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Checking authentication...</div>;

  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
