import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProjectDetail from './pages/ProjectDetail';
import Annotation from './pages/Annotation';
import ModelTraining from './pages/ModelTraining';
import ModelEvaluation from './pages/ModelEvaluation';
import ActiveLearning from './pages/ActiveLearning';
import Admin from './pages/Admin';
import Documentation from './pages/Documentation';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/project/:id"
              element={
                <PrivateRoute>
                  <ProjectDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/dataset/:datasetId/annotate"
              element={
                <PrivateRoute>
                  <Annotation />
                </PrivateRoute>
              }
            />
            <Route
              path="/project/:projectId/train"
              element={
                <PrivateRoute>
                  <ModelTraining />
                </PrivateRoute>
              }
            />
            <Route
              path="/model/:modelId/evaluate"
              element={
                <PrivateRoute>
                  <ModelEvaluation />
                </PrivateRoute>
              }
            />
            <Route
              path="/dataset/:datasetId/active-learning"
              element={
                <PrivateRoute>
                  <ActiveLearning />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute adminOnly={true}>
                  <Admin />
                </PrivateRoute>
              }
            />
            <Route
              path="/documentation"
              element={
                <PrivateRoute>
                  <Documentation />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
