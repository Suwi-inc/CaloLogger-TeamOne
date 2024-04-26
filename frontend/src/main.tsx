import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import ProtectedRoute from "./components/protected";
import Login from "./pages/login";
import Loading from "./components/loading";
import "./index.css";
import MealTracking from "./pages/meal-tracking";
import WeightTracking from "./pages/weight-tracking";

const App = () => (
  <Suspense fallback={<Loading />}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/meal-tracking/" />} />
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
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<p> Page Not found! </p>} />
      </Routes>
    </BrowserRouter>
  </Suspense>
);

export default App;
