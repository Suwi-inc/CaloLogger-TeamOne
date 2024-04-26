import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import Loading from "../components/loading";
import MealTracking from "./meal-tracking";
import ProtectedRoute from "../components/protected";
import WeightTracking from "./weight-tracking";
import Dashboard from "./dashboard";

const App = () => (
  <Suspense fallback={<Loading />}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard/" />} />
        <Route
          path="/dashboard"
          element={
            // <ProtectedRoute>
              <Dashboard />
            // </ProtectedRoute>
          }
        />
        <Route
          path="/meal-tracking/"
          element={
            <ProtectedRoute>
              <MealTracking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/weight-tracking/"
          element={
            <ProtectedRoute>
              <WeightTracking />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<></>} />
        <Route path="*" element={<p> Page Not found! </p>} />
      </Routes>
    </BrowserRouter>
  </Suspense>
);

export default App;
