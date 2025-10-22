import { BookOpen, Database, Brain, BarChart3, RefreshCw, UserCog } from 'lucide-react';

const Documentation = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center mb-8">
            <BookOpen className="w-10 h-10 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-slate-800">Documentation</h1>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Getting Started</h2>
            <p className="text-slate-600 mb-4">
              The Chatbot NLU Trainer & Evaluator is a comprehensive platform for training and evaluating
              Natural Language Understanding models. This tool supports the complete workflow from data
              annotation to model deployment.
            </p>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Demo Credentials:</strong><br />
                User: demo@example.com / demo123<br />
                Admin: admin@example.com / admin123
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
              <Database className="w-6 h-6 mr-2" />
              Milestone 1: User Management & Dataset Handling
            </h2>
            <div className="space-y-4 text-slate-600">
              <div className="p-4 bg-slate-50 rounded-md">
                <h3 className="font-semibold text-slate-800 mb-2">Authentication</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>JWT-based authentication with secure password hashing (bcrypt)</li>
                  <li>Sign up and login functionality</li>
                  <li>Role-based access control (user/admin)</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-md">
                <h3 className="font-semibold text-slate-800 mb-2">Project Workspaces</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Create multiple project workspaces (e.g., HR Bot, Travel Bot)</li>
                  <li>Organize datasets and models by project</li>
                  <li>Project overview with statistics</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-md">
                <h3 className="font-semibold text-slate-800 mb-2">Dataset Upload</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Support for multiple formats: JSON, CSV, Rasa</li>
                  <li>Automatic intent and entity extraction</li>
                  <li>Dataset statistics and overview</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              Milestone 2: Annotation & Model Training
            </h2>
            <div className="space-y-4 text-slate-600">
              <div className="p-4 bg-slate-50 rounded-md">
                <h3 className="font-semibold text-slate-800 mb-2">Annotation Interface</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Visual interface for tagging intents</li>
                  <li>Text selection for entity span highlighting</li>
                  <li>Token-level entity labeling</li>
                  <li>Navigation between samples</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-md">
                <h3 className="font-semibold text-slate-800 mb-2">Auto-Suggestions</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>AI-powered intent and entity suggestions</li>
                  <li>Speed up annotation process</li>
                  <li>Based on pretrained models</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-md">
                <h3 className="font-semibold text-slate-800 mb-2">Model Training</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Support for multiple NLU backends: Rasa, spaCy, Hugging Face</li>
                  <li>Train models from annotated datasets</li>
                  <li>Model versioning and metadata storage</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
              <BarChart3 className="w-6 h-6 mr-2" />
              Milestone 3: Evaluation & Reporting
            </h2>
            <div className="space-y-4 text-slate-600">
              <div className="p-4 bg-slate-50 rounded-md">
                <h3 className="font-semibold text-slate-800 mb-2">Model Evaluation</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Run evaluations on test datasets</li>
                  <li>View predictions with confidence scores</li>
                  <li>Identify misclassifications</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-md">
                <h3 className="font-semibold text-slate-800 mb-2">Visual Metrics</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Accuracy, Precision, Recall, F1 Score</li>
                  <li>Intent-wise performance charts</li>
                  <li>Confusion matrix visualization</li>
                  <li>Entity recognition metrics</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-md">
                <h3 className="font-semibold text-slate-800 mb-2">Model Comparison</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Compare multiple model versions</li>
                  <li>Side-by-side metric comparison</li>
                  <li>Track model performance over time</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-md">
                <h3 className="font-semibold text-slate-800 mb-2">Export Options</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Download evaluation reports (JSON)</li>
                  <li>Export predictions for analysis</li>
                  <li>Model metadata export</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
              <RefreshCw className="w-6 h-6 mr-2" />
              Milestone 4: Active Learning & Admin Panel
            </h2>
            <div className="space-y-4 text-slate-600">
              <div className="p-4 bg-slate-50 rounded-md">
                <h3 className="font-semibold text-slate-800 mb-2">Active Learning Loop</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Identify low-confidence predictions</li>
                  <li>Configurable confidence threshold</li>
                  <li>Review and correct uncertain samples</li>
                  <li>Improve model with feedback</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-md">
                <h3 className="font-semibold text-slate-800 mb-2">Feedback Module</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Correct misclassified samples</li>
                  <li>Update intent labels</li>
                  <li>Re-annotation workflow</li>
                  <li>Iterative model improvement</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-md">
                <h3 className="font-semibold text-slate-800 mb-2">Admin Panel</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>User management and role assignment</li>
                  <li>System-wide statistics dashboard</li>
                  <li>Monitor all projects and datasets</li>
                  <li>Platform health metrics</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Tech Stack</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-md">
                <h3 className="font-semibold text-blue-800 mb-2">Frontend</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>React 18</li>
                  <li>TypeScript</li>
                  <li>Tailwind CSS</li>
                  <li>React Router</li>
                  <li>Recharts</li>
                  <li>Axios</li>
                </ul>
              </div>

              <div className="p-4 bg-green-50 rounded-md">
                <h3 className="font-semibold text-green-800 mb-2">Backend</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>Node.js + Express</li>
                  <li>MongoDB Atlas</li>
                  <li>JWT Authentication</li>
                  <li>bcryptjs</li>
                  <li>Mongoose ODM</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">API Endpoints</h2>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-slate-50 rounded border-l-4 border-blue-600">
                <code className="text-blue-700">/api/auth/signup</code> - User registration
              </div>
              <div className="p-3 bg-slate-50 rounded border-l-4 border-blue-600">
                <code className="text-blue-700">/api/auth/login</code> - User login
              </div>
              <div className="p-3 bg-slate-50 rounded border-l-4 border-green-600">
                <code className="text-green-700">/api/projects</code> - Project management
              </div>
              <div className="p-3 bg-slate-50 rounded border-l-4 border-purple-600">
                <code className="text-purple-700">/api/datasets</code> - Dataset operations
              </div>
              <div className="p-3 bg-slate-50 rounded border-l-4 border-orange-600">
                <code className="text-orange-700">/api/annotations</code> - Annotation CRUD
              </div>
              <div className="p-3 bg-slate-50 rounded border-l-4 border-red-600">
                <code className="text-red-700">/api/models</code> - Model training
              </div>
              <div className="p-3 bg-slate-50 rounded border-l-4 border-teal-600">
                <code className="text-teal-700">/api/evaluations</code> - Model evaluation
              </div>
              <div className="p-3 bg-slate-50 rounded border-l-4 border-slate-600">
                <code className="text-slate-700">/api/admin</code> - Admin operations
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Setup Instructions</h2>
            <div className="p-4 bg-slate-900 text-slate-100 rounded-md font-mono text-sm space-y-2">
              <div># Backend setup</div>
              <div>cd backend</div>
              <div>npm install</div>
              <div>npm run seed  # Seed demo data</div>
              <div>npm start     # Start server on port 5000</div>
              <div></div>
              <div># Frontend setup</div>
              <div>cd ..</div>
              <div>npm install</div>
              <div>npm run dev   # Start Vite dev server</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
