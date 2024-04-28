import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import Loading from "../components/loading";
import MealTracking from "./meal-tracking";
import ProtectedRoute from "../components/protected";
import WeightTracking from "./weight-tracking";
import Dashboard from "./dashboard";
import Login from "../pages/login";
import SignUp from "../pages/signup";
import Header from "../components/header";

const App = () => (
    <Suspense fallback={<Loading />}>
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard/" />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
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
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="*" element={<p> Page Not found! </p>} />
            </Routes>
        </BrowserRouter>
    </Suspense>
);

export default App;
