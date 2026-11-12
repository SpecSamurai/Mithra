import { Navigate, Route, Routes } from "react-router";
import Layout from "./components/Layout";
import ApplicationPage from "./pages/ApplicationPage";
import EvaluationPage from "./pages/EvaluationPage";
import InterviewPage from "./pages/InterviewPage";
import InterviewReviewPage from "./pages/InterviewReviewPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/application" replace />} />
        <Route path="application" element={<ApplicationPage />} />
        <Route path="interview" element={<InterviewPage />} />
        <Route path="evaluation" element={<EvaluationPage />} />
        <Route path="evaluation/:interviewId" element={<InterviewReviewPage />} />
        <Route path="*" element={<Navigate to="/application" replace />} />
      </Route>
    </Routes>
  );
}
