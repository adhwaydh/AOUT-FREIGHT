import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";


// =========================================================
// PUBLIC PAGES
// =========================================================

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";


// =========================================================
// LAYOUT
// =========================================================

import Layout from "./components/layout/Layout";


// =========================================================
// APPLICATION PAGES
// =========================================================

import Dashboard from "./pages/Dashboard";
import Ports from "./pages/Ports";
import Chartering from "./pages/Chartering";
import Vessels from "./pages/Vessels";
import VesselComparison from "./pages/VesselComparison";
import Forecast from "./pages/Forecast";
import NewAnalysis from "./pages/NewAnalysis";
import RouteIntelligence from "./pages/RouteIntelligence";
import Reports from "./pages/Reports";
import RiskIntelligence from "./pages/RiskIntelligence";


// =========================================================
// AUTHENTICATION CHECK
// =========================================================
//
// For now we use localStorage.
//
// Your Login page should save:
//
// localStorage.setItem(
//   "aout_freight_token",
//   token
// );
//
// Later this can be replaced with proper JWT authentication.
// =========================================================

function isAuthenticated() {
  return Boolean(
    localStorage.getItem("aout_freight_token")
  );
}


// =========================================================
// PROTECTED APPLICATION
// =========================================================
//
// If the user is not logged in, they cannot access
// Dashboard, Route Intelligence, Risk Intelligence,
// Chartering, etc.
//
// They will be redirected to /login.
// =========================================================

function ProtectedApp() {

  if (!isAuthenticated()) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }

  return (
    <Layout>

      <Routes>

        {/* =================================================
            DASHBOARD
        ================================================= */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />


        {/* =================================================
            ROUTE INTELLIGENCE
        ================================================= */}

        <Route
          path="/route-intelligence"
          element={<RouteIntelligence />}
        />


        {/* =================================================
            FREIGHT FORECAST
        ================================================= */}

        <Route
          path="/forecast"
          element={<Forecast />}
        />


        {/* =================================================
            NEW ANALYSIS
        ================================================= */}

        <Route
          path="/analysis"
          element={<NewAnalysis />}
        />


        {/* =================================================
            CHARTERING
        ================================================= */}

        <Route
          path="/chartering"
          element={<Chartering />}
        />


        {/* =================================================
            VESSELS
        ================================================= */}

        <Route
          path="/vessels"
          element={<Vessels />}
        />


        {/* =================================================
            VESSEL COMPARISON
        ================================================= */}

        <Route
          path="/vessel-comparison"
          element={<VesselComparison />}
        />


        {/* =================================================
            PORTS
        ================================================= */}

        <Route
          path="/ports"
          element={<Ports />}
        />


        {/* =================================================
            REPORTS
        ================================================= */}

        <Route
          path="/reports"
          element={<Reports />}
        />


        {/* =================================================
            RISK INTELLIGENCE
        ================================================= */}

        <Route
          path="/risk"
          element={<RiskIntelligence />}
        />


        {/* =================================================
            UNKNOWN APPLICATION PAGE
        ================================================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>

    </Layout>
  );
}


// =========================================================
// MAIN APP
// =========================================================

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* =================================================
            LANDING PAGE
        =================================================
        
        This is now the first page users see.
        
        URL:
        http://localhost:5173/
        
        ================================================= */}

        <Route
          path="/"
          element={<Landing />}
        />


        {/* =================================================
            LOGIN
        ================================================= */}

        <Route
          path="/login"
          element={<Login />}
        />


        {/* =================================================
            REGISTER
        ================================================= */}

        <Route
          path="/register"
          element={<Register />}
        />


        {/* =================================================
            PROTECTED APPLICATION
        ================================================= */}

        <Route
          path="/*"
          element={<ProtectedApp />}
        />

      </Routes>

    </BrowserRouter>

  );
}


export default App;