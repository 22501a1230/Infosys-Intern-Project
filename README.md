# Chatbot NLU Trainer & Evaluator

A comprehensive full-stack MERN application for training, evaluating, and improving Natural Language Understanding (NLU) models for chatbots. This platform supports the complete workflow from data annotation to model deployment with active learning capabilities.

## Features

### Milestone 1: User Management & Dataset Handling

- JWT-based authentication with secure password hashing
- Project workspace creation and management
- Multi-format dataset upload (JSON, CSV, Rasa)
- Dataset overview with intent and entity statistics

### Milestone 2: Annotation & Model Training

- Interactive annotation interface for intent tagging
- Visual entity span highlighting with token-level labeling
- AI-powered auto-suggestions for faster annotation
- Multi-backend NLU model training (Rasa, spaCy, Hugging Face)
- Model versioning and metadata storage

### Milestone 3: Evaluation & Reporting

- Comprehensive model evaluation on test datasets
- Visual metrics: Accuracy, Precision, Recall, F1 Score
- Intent-wise performance charts with Recharts
- Confusion matrix visualization
- Model comparison dashboard
- Export evaluation reports (JSON format)

### Milestone 4: Active Learning & Admin Panel

- Active learning loop for uncertain sample identification
- Configurable confidence thresholds
- Feedback module for model corrections
- Admin dashboard with system-wide statistics
- User management and role-based access control
- Project and dataset monitoring

## Tech Stack

### Frontend

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Recharts** for data visualization
- **Axios** for API communication
- **Lucide React** for icons

### Backend

- **Node.js** with Express
- **MongoDB Atlas** for database
- **Mongoose** ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** enabled

## Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (connection string provided)
- Modern web browser

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd chatbot-nlu-trainer
```

### 2. Backend Setup

```bash
cd backend
npm install
```

The backend uses the following environment variables (already configured in `backend/.env`):

```env
MONGO_URI=mongodb+srv://Jothi:Jothi18@mern2025.ytnsu.mongodb.net/mern-auth?retryWrites=true&w=majority&appName=Mern2025
JWT_SECRET=mySuperSecretKey123
PORT=5000
NODE_ENV=development
```

### 3. Seed Demo Data

```bash
npm run seed
```

This will create:

- Admin user: `admin@example.com` / `admin123`
- Demo user: `demo@example.com` / `demo123`
- Sample projects and datasets

### 4. Start Backend Server

```bash
npm start
```

Backend will run on `http://localhost:5000`

### 5. Frontend Setup

Open a new terminal:

```bash
cd ..
npm install
npm run dev
```

Frontend will run on `http://localhost:5173`

## Usage Guide

### 1. Login

- Navigate to `http://localhost:5173`
- Login with demo credentials:
  - **User**: demo@example.com / demo123
  - **Admin**: admin@example.com / admin123

### 2. Create a Project

- Click "New Project" on the dashboard
- Enter project name and description
- Example: "Travel Bot" or "HR Assistant"

### 3. Upload Dataset

- Open your project
- Click "Upload" in the Datasets section
- Select format (JSON/CSV/Rasa)
- Upload your dataset file

**Sample JSON Format:**

```json
{
  "examples": [
    {
      "text": "I want to book a flight to New York",
      "intent": "book_flight",
      "entities": [
        { "entity": "location", "value": "New York", "start": 26, "end": 34 }
      ]
    }
  ]
}
```

### 4. Annotate Data

- Click on a dataset to open the annotation tool
- Tag intents by clicking intent buttons
- Select text to highlight entity spans
- Use "Auto-Suggest" for AI-powered recommendations
- Save annotations

### 5. Train Model

- Go back to project detail
- Click "Train" in the Models section
- Select training dataset
- Choose NLU backend (Rasa/spaCy/Hugging Face)
- Start training

### 6. Evaluate Model

- Click on a trained model
- Select test dataset
- Run evaluation
- View metrics and predictions
- Export results

### 7. Active Learning

- Navigate to dataset annotation page
- Access uncertain samples
- Review low-confidence predictions
- Correct and re-annotate
- Improve model iteratively

### 8. Admin Panel (Admin only)

- Navigate to Admin from navbar
- View system statistics
- Manage users and roles
- Monitor all projects

## API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Projects

- `GET /api/projects` - List user projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Datasets

- `POST /api/datasets/upload` - Upload dataset
- `GET /api/datasets/project/:projectId` - Get project datasets
- `GET /api/datasets/:id` - Get dataset details
- `DELETE /api/datasets/:id` - Delete dataset

### Annotations

- `GET /api/annotations/dataset/:datasetId` - Get annotations
- `POST /api/annotations` - Create annotation
- `PUT /api/annotations/:id` - Update annotation
- `DELETE /api/annotations/:id` - Delete annotation
- `GET /api/annotations/uncertain/:datasetId` - Get uncertain samples
- `POST /api/annotations/suggest` - Get AI suggestions

### Models

- `POST /api/models/train` - Train new model
- `GET /api/models/project/:projectId` - Get project models
- `GET /api/models/:id` - Get model details
- `DELETE /api/models/:id` - Delete model

### Evaluations

- `POST /api/evaluations/evaluate` - Evaluate model
- `GET /api/evaluations/model/:modelId` - Get model evaluations
- `GET /api/evaluations/:id` - Get evaluation details
- `POST /api/evaluations/compare` - Compare models
- `GET /api/evaluations/:id/export` - Export evaluation

### Admin

- `GET /api/admin/stats` - Get system statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/role` - Update user role
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/projects` - Get all projects
- `GET /api/admin/datasets` - Get all datasets

## Docker Deployment

### Build and Run

```bash
docker-compose up --build
```

The application will be available at `http://localhost:5000`

### Or build manually:

```bash
docker build -t chatbot-nlu-trainer .
docker run -p 5000:5000 chatbot-nlu-trainer
```

## Project Structure

```
chatbot-nlu-trainer/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   ├── datasetController.js
│   │   ├── annotationController.js
│   │   ├── modelController.js
│   │   ├── evaluationController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── Dataset.js
│   │   ├── Annotation.js
│   │   ├── Model.js
│   │   └── Evaluation.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── datasetRoutes.js
│   │   ├── annotationRoutes.js
│   │   ├── modelRoutes.js
│   │   ├── evaluationRoutes.js
│   │   └── adminRoutes.js
│   ├── seed/
│   │   └── seedData.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── src/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   └── PrivateRoute.tsx
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   ├── Dashboard.tsx
│   │   ├── ProjectDetail.tsx
│   │   ├── Annotation.tsx
│   │   ├── ModelTraining.tsx
│   │   ├── ModelEvaluation.tsx
│   │   ├── ActiveLearning.tsx
│   │   ├── Admin.tsx
│   │   └── Documentation.tsx
│   ├── utils/
│   │   └── api.ts
│   ├── App.tsx
│   └── main.tsx
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

## Database Schema

### Users

- email (unique)
- password (hashed)
- role (user/admin)
- createdAt

### Projects

- name
- description
- user (ref)
- createdAt/updatedAt

### Datasets

- name
- project (ref)
- format (JSON/CSV/Rasa)
- data
- intents array
- entities array
- totalSamples

### Annotations

- dataset (ref)
- text
- intent
- entities array
- confidence
- isUncertain
- needsReview

### Models

- name
- project (ref)
- backend (Rasa/spaCy/Hugging Face)
- version
- trainedOn (dataset ref)
- metadata
- status

### Evaluations

- model (ref)
- testSet (ref)
- metrics (accuracy, precision, recall, f1Score)
- confusionMatrix
- intentMetrics array
- predictions array
- timestamp

## Development

### Backend Development

```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development

```bash
npm run dev  # Vite dev server with HMR
```

### Type Checking

```bash
npm run typecheck
```

### Linting

```bash
npm run lint
```

### Build for Production

```bash
npm run build
```

## Features in Detail

### Active Learning

The active learning module identifies samples where the model has low confidence (below configurable threshold). Users can review these samples, correct predictions, and retrain the model for continuous improvement.

### Multi-Backend Support

The platform is designed to work with multiple NLU backends:

- **Rasa**: Open-source conversational AI
- **spaCy**: Industrial-strength NLP
- **Hugging Face**: Transformer-based models

### Model Versioning

Every trained model is versioned automatically, allowing you to track performance improvements over time and compare different model versions.

### Role-Based Access

- **Users**: Can manage their own projects, datasets, and models
- **Admins**: Have full access to all projects and can manage users

## Troubleshooting

### Backend won't start

- Check MongoDB connection string is correct
- Ensure port 5000 is not in use
- Verify all dependencies are installed

### Frontend can't connect to backend

- Ensure backend is running on port 5000
- Check CORS settings in `backend/server.js`
- Verify API URL in `src/utils/api.ts`

### MongoDB connection errors

- Verify MongoDB Atlas credentials
- Check network connectivity
- Ensure IP whitelist in MongoDB Atlas

## Future Enhancements

- Real-time collaboration on annotations
- Advanced entity relationship visualization
- Multi-language support
- Integration with more NLU platforms
- Batch evaluation across multiple datasets
- Advanced analytics and reporting


