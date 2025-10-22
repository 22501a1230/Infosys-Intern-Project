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