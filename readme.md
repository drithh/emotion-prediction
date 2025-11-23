# Emotion Prediction

A web application that predicts emotions from Indonesian text using machine learning models. The application analyzes text input and predicts four emotion categories: sadness, anger, fear, and happiness.

## 🎯 Features

- **Real-time Emotion Prediction**: Analyze text and get instant emotion predictions
- **Multi-Emotion Classification**: Predicts four emotion categories with confidence scores
- **Indonesian Language Support**: Optimized for Indonesian text using `indonesian-roberta-base-emotion-classifier`
- **Interactive UI**: Beautiful, responsive interface with animated visualizations
- **RESTful API**: FastAPI backend with OpenAPI documentation

## 🚀 Demo

- **Frontend**: [https://emotion.adriel.id/](https://emotion.adriel.id/)
- **Backend API**: [https://emotion-server.adriel.id/](https://emotion-server.adriel.id/)
- **API Documentation**: [https://emotion-server.adriel.id/swagger](https://emotion-server.adriel.id/swagger)

## 🛠️ Tech Stack

### Frontend

- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Query** for data fetching
- **Axios** for HTTP requests

### Backend

- **FastAPI** for the REST API
- **Python 3** with machine learning libraries
- **LightGBM** and **XGBoost** for gradient boosting models
- **ONNX Runtime** for optimized model inference
- **Transformers** (Hugging Face) for Indonesian RoBERTa model
- **NLTK** and **Sastrawi** for Indonesian text preprocessing

## 📋 Prerequisites

- **Docker** and **Docker Compose** (recommended)
- Or:
  - **Python 3.8+** (for backend)
  - **Node.js 18+** and **pnpm** or **bun** (for frontend)
  - **NLTK data**: punkt and stopwords
  - **Hugging Face model**: `StevenLimcorn/indonesian-roberta-base-emotion-classifier`

## 🏃 Quick Start

### Using Docker (Recommended)

The easiest way to run the application:

```bash
docker-compose up
```

This will:

- Build and start the backend server on `http://localhost:8000`
- The frontend can be built separately or served via a static file server

### Manual Setup

#### Backend

1. Install Python dependencies:

```bash
cd server
pip install -r requirements.txt
```

2. Download required NLTK data:

```python
import nltk
nltk.download('punkt')
nltk.download('stopwords')
```

3. The Hugging Face model will be downloaded automatically on first use.

4. Run the server:

```bash
uvicorn main:app --reload
```

#### Frontend

1. Install dependencies:

```bash
cd client
bun install  # or pnpm install
```

2. Start the development server:

```bash
bun run dev  # or pnpm dev
```

3. Generate API client (if needed):

```bash
bun run api  # or pnpm api
```

## 📁 Project Structure

```
emotion-prediction/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── api/           # Auto-generated API client
│   │   ├── components/    # React components
│   │   └── page.tsx       # Main page component
│   └── package.json
├── server/                 # Backend FastAPI application
│   ├── api/
│   │   ├── model.py       # ML model inference
│   │   ├── preprocess.py  # Text preprocessing
│   │   └── features.py    # Feature extraction
│   ├── onnx-model/        # ONNX model files
│   ├── main.py            # Application entry point
│   └── requirements.txt
└── docker-compose.yml      # Docker configuration
```

## 🔌 API Usage

### Predict Emotion

```bash
POST /v1/predict
Content-Type: application/json

{
  "text": "Saya sangat senang hari ini!"
}
```

**Response:**

```json
{
  "label": "happy",
  "scores": {
    "sadness": 0.1,
    "anger": 0.05,
    "fear": 0.05,
    "happy": 0.8
  }
}
```

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
PROJECT_NAME=Emotion Prediction API
VERSION=1.0.0
BACKEND_URL=http://localhost:8000
API_PATH=/v1
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.
