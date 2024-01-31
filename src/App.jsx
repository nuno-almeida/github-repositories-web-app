import { Suspense, lazy, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import AuthContext, { AuthProvider } from "./contexts/AuthContext";
import Loading from "./components/utils/Loading";

const Login = lazy(() => import("./components/pages/Login"));
const Register = lazy(() => import("./components/pages/Register"));
const Home = lazy(() => import("./components/pages/Home"));
const Discovery = lazy(() => import("./components/pages/Discovery"));
const MyAccount = lazy(() => import("./components/pages/MyAccount"));

const NavigateTo = ({ children, isAuth, requiresAuth = true }) => {
  const location = useLocation();

  if (requiresAuth) {
    if (isAuth) {
      return children;
    }

    const replaceUrl = location.pathname + location.search;
    return <Navigate to="/login" state={{ replaceUrl }} />;
  }

  // if does not requires auth (like login or register new account)
  // but user is loggedIn, then go to /
  return isAuth ? <Navigate to="/" /> : children;
};

const AppRoutes = () => {
  const { isAuth, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <div
        className="align-items-center d-flex justify-content-center"
        style={{ height: "100vh" }}
      >
        <Loading />
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <NavigateTo isAuth={isAuth} requiresAuth={false}>
            <Login />
          </NavigateTo>
        }
      />

      <Route
        path="/register"
        element={
          <NavigateTo isAuth={isAuth} requiresAuth={false}>
            <Register />
          </NavigateTo>
        }
      />

      <Route path="/" element={<Home />}>
        <Route
          index
          element={
            <NavigateTo isAuth={isAuth} requiresAuth={true}>
              <Discovery />
            </NavigateTo>
          }
        />

        <Route
          path="/my-account"
          element={
            <NavigateTo isAuth={isAuth} requiresAuth={true}>
              <MyAccount />
            </NavigateTo>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App = () => (
  <AuthProvider>
    <Router>
      <Suspense fallback={<></>}>
        <AppRoutes />
      </Suspense>
    </Router>
  </AuthProvider>
);

export default App;
