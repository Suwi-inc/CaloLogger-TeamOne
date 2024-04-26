import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import ProtectedRoute from "../components/protected";
import Login from "../pages/login";
import Meals from "../pages/meals";
import Loading from "../components/loading";

const App = () => (
  <Suspense fallback={<Loading />}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/meals/" />} />
        <Route
          path="/meals/"
          element={
            <ProtectedRoute>
              <Meals />
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
