# AI360 — Enterprise AI Decision & Governance Platform

<div align="center">
  <h3>🤖 AI360</h3>
  <p><em>Helping organisations make smarter AI decisions</em></p>
</div>

---

## 📋 Project Overview

AI360 is a full-stack enterprise web application that helps organisations evaluate, govern, and track their AI initiatives. It covers the complete lifecycle of enterprise AI decision-making: from identifying use cases to assessing feasibility, comparing LLMs, estimating costs and ROI, managing risk, and generating executive reports.

Built as a portfolio project demonstrating skills in **Enterprise AI evaluation, LLM comparison, RAG implementation, AI governance, and cost/ROI analysis**.

---

## 🎯 Problem Statement

Organisations adopting AI face recurring challenges:

- **Which AI use cases should we prioritise?** There are too many options and limited resources.
- **Which LLM is best for our task?** GPT-4o, Gemini, Claude — how do we choose objectively?
- **How much will it cost?** Token costs are complex and hard to estimate at scale.
- **What ROI can we expect?** Leadership needs financial justification before approving AI projects.
- **What are the risks?** Privacy, hallucination, bias, regulatory compliance — what controls do we need?
- **How do we govern AI?** What policies and controls should we put in place?

AI360 answers all of these questions in a single, integrated platform.

---

## ✨ Features

### 🏠 Executive Dashboard
- Live KPI cards: total use cases, high priority count, active PoCs, projected cost, projected benefit, high-risk count
- Portfolio priority bar chart
- Priority, Risk, and Stage distribution charts
- Recent AI initiatives table with search

### 💡 AI Use Case Management
- Full CRUD (Create, Read, Update, Delete)
- Transparent opportunity scoring (0–100) with weighted formula
- Automatic priority classification (High/Medium/Low)
- Automatic recommendation generation
- Search, filter, and sort

### 🧪 LLM Comparison Lab
- Compare GPT-4o, Gemini 1.5 Pro, Claude 3.5 Sonnet, and more
- Configurable evaluation weights (Quality, Cost, Latency, Reliability)
- Side-by-side response comparison
- Automatic model recommendation
- Works in Demo Mode without API keys

### 💰 AI Cost Calculator
- Calculate per-model costs based on usage (users × requests × tokens)
- Side-by-side model cost comparison
- Annual vs monthly breakdown
- Savings comparison

### 📈 ROI Calculator
- Calculate Annual Benefit, Total AI Cost, Net Benefit, ROI%, and Payback Period
- Real mathematical formula (not estimates)
- Multi-year projection chart

### 🛡️ AI Risk & Governance
- 4-category risk assessment: Privacy, Security, Model, Business
- Transparent risk score (0–100) with breakdown
- Automatic governance recommendations based on risk level
- Aligned with responsible AI principles

### 🔍 GenAI Knowledge Assistant (RAG)
- Upload enterprise PDF documents (HR policy, Leave policy, IT security, etc.)
- RAG pipeline: PDF → Text → Chunks → Embeddings → pgvector → Semantic Search → LLM → Answer
- Source citations with document name and page number
- Works in Demo Mode without API keys

### 📄 Executive Report Generator
- Auto-generate executive-quality reports per use case
- Covers: Business problem, financials, ROI, risk, model recommendation, governance
- Final recommendation (Proceed to PoC / Pilot / Production / Reassess / Do Not Proceed)
- Print/Export to PDF

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│            React Frontend               │
│   (Vite + Tailwind CSS + Recharts)      │
└─────────────────┬───────────────────────┘
                  │ Axios / REST API
┌─────────────────▼───────────────────────┐
│          Node.js + Express              │
│   controllers / routes / services /     │
│   middleware / ai / rag / utils         │
└─────────────────┬───────────────────────┘
                  │ Prisma ORM
┌─────────────────▼───────────────────────┐
│             PostgreSQL                  │
│           + pgvector                    │
└─────────────────────────────────────────┘
```

### RAG Architecture

```
PDF Upload
    │
    ▼
Text Extraction (pdf-parse)
    │
    ▼
Text Chunking (500 tokens, 50 overlap)
    │
    ▼
Embedding Generation (OpenAI ada-002 or mock)
    │
    ▼
pgvector Storage (PostgreSQL)
    │
    ▼ (at query time)
User Question → Query Embedding
    │
    ▼
pgvector Similarity Search (top 5 chunks)
    │
    ▼
Context + Question → LLM
    │
    ▼
Answer + Source Citations
```

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, JavaScript, Vite 5, Tailwind CSS 3 |
| Routing | React Router v6 |
| Charts | Recharts |
| HTTP Client | Axios |
| Icons | Lucide React |
| Backend | Node.js, Express.js |
| ORM | Prisma |
| Database | PostgreSQL |
| Vector DB | pgvector (PostgreSQL extension) |
| Auth | JWT + bcryptjs |
| File Upload | Multer |
| PDF Processing | pdf-parse |
| AI | OpenAI API (optional) |
| AI | Google Gemini API (optional) |

---

## 🗄️ Database Schema

```
User               ─┐
AIUseCase           ├──── RiskAssessment
AIUseCase           ├──── ROICalculation
AIUseCase           ├──── CostCalculation
LLMEvaluation       │
Document           ─┴──── DocumentChunk (with pgvector embedding)
```

Key models:
- **User**: authentication and role management
- **AIUseCase**: the core entity with scoring inputs and computed scores
- **LLMEvaluation**: records from model comparison runs
- **RiskAssessment**: risk scores linked to use cases
- **Document**: uploaded PDF metadata
- **DocumentChunk**: text chunks with vector embeddings for RAG

---

## 🧮 AI Opportunity Scoring Formula

The priority score (0–100) uses a transparent weighted formula:

| Dimension | Weight | Input | Notes |
|-----------|--------|-------|-------|
| Business Impact | 30% | 1–10 | Direct input from user |
| ROI | 25% | Calculated | From financial inputs, normalized |
| Technical Feasibility | 20% | Inverse of complexity (1–10) | |
| Data Availability | 10% | 1–10 | |
| User Adoption | 10% | 1–10 | |
| Implementation Effort | 5% | Inverse of effort (1–10) | |

**Classification:**
- 90–100 → High Priority
- 70–89 → Medium Priority
- 0–69 → Low Priority

---

## 💸 Cost Calculation Formula

```
Monthly Requests      = Users × Requests/Day × Working Days/Month
Monthly Input Tokens  = Monthly Requests × Avg Input Tokens
Monthly Output Tokens = Monthly Requests × Avg Output Tokens
Monthly Cost (USD)    = (Input Tokens/1000 × Input Rate) + (Output Tokens/1000 × Output Rate)
Monthly Cost (INR)    = Monthly Cost (USD) × 83.5
Annual Cost (INR)     = Monthly Cost (INR) × 12
```

---

## 📊 ROI Calculation Formula

```
Annual Benefit      = Users × Manual Hrs/Month × 12 × (Automation%) × Hourly Cost (INR)
Total Annual AI Cost = (Implementation Cost / 3) + Annual Operating Cost
Net Annual Benefit  = Annual Benefit − Total Annual AI Cost
ROI %               = (Net Annual Benefit / Total Annual AI Cost) × 100
Payback Period      = Implementation Cost / (Annual Benefit / 12)  [months]
```

---

## 🛡️ AI Risk Scoring Framework

Risk is assessed across 4 categories, each contributing 0–25 points:

| Category | Max Score | Factors |
|----------|-----------|---------|
| Privacy | 25 | Data sensitivity classification |
| Security | 25 | Data leakage, prompt injection, access control |
| Model | 25 | Hallucination, bias, reliability, explainability |
| Business | 25 | Financial, customer, regulatory impact |

**Risk Levels:**
- 0–30: Low Risk
- 31–60: Medium Risk
- 61–100: High Risk

---

## ⚖️ LLM Evaluation Methodology

```
Overall Score = (Quality × 0.50) + (Cost Score × 0.20) + (Latency Score × 0.15) + (Reliability × 0.15)
```

Weights are configurable in the UI. All scores normalized to 0–100.

---

## 🚀 Installation

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- pgvector extension (`CREATE EXTENSION vector;`)

### 1. Clone the repository

```bash
git clone https://github.com/yourname/ai360.git
cd ai360
```

### 2. Set up environment variables

```bash
cp .env.example backend/.env
# Edit backend/.env with your database URL and secrets
```

### 3. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 4. Set up the database

```bash
cd backend

# Generate Prisma client
npm run db:generate

# Push schema to database (creates tables)
npm run db:push

# Seed with demo data
npm run db:seed
```

### 5. Run the application

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open http://localhost:5173

**Demo credentials:**
- Email: `admin@ai360.demo`
- Password: `Demo@1234`

---

## 🔐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `JWT_SECRET` | ✅ | Secret for JWT signing |
| `JWT_EXPIRES_IN` | Optional | JWT expiry (default: 7d) |
| `PORT` | Optional | Backend port (default: 5000) |
| `NODE_ENV` | Optional | development/production |
| `OPENAI_API_KEY` | Optional | Enables real OpenAI calls |
| `GEMINI_API_KEY` | Optional | Enables real Gemini calls |
| `ANTHROPIC_API_KEY` | Optional | Enables real Claude calls |
| `FORCE_DEMO_MODE` | Optional | true = always use mock responses |
| `UPLOAD_DIR` | Optional | File upload directory |

---

## 🎭 Demo Mode

The application runs in **Demo Mode** when no API keys are configured.

In Demo Mode:
- LLM comparison uses realistic predefined responses per model
- RAG assistant uses predefined Q&A for common policy questions
- All business calculations (cost, ROI, scoring, risk) run normally
- A yellow "Demo Mode" banner is shown in relevant sections

To enable real AI: add your API key(s) to `backend/.env`.

---

## 📡 API Documentation

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with email + password |
| POST | `/api/auth/register` | Register new account |
| GET | `/api/auth/me` | Get current user |

### AI Use Cases
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/use-cases` | List all use cases |
| POST | `/api/use-cases` | Create use case |
| GET | `/api/use-cases/stats` | Aggregated statistics |
| GET | `/api/use-cases/:id` | Get use case details |
| PUT | `/api/use-cases/:id` | Update use case |
| DELETE | `/api/use-cases/:id` | Delete use case |

### LLM Comparison
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/llm/evaluate` | Run multi-model evaluation |
| GET | `/api/llm/evaluations` | Evaluation history |
| GET | `/api/llm/models` | Available models |

### Cost & ROI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/cost/calculate` | Calculate AI costs |
| POST | `/api/roi/calculate` | Calculate ROI |

### Risk & Governance
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/risk/assess` | Assess risk |
| GET | `/api/risk/use-case/:id` | Risk for a use case |

### Knowledge Assistant
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/documents/upload` | Upload PDF |
| GET | `/api/documents` | List documents |
| DELETE | `/api/documents/:id` | Delete document |
| POST | `/api/chat` | Ask a question (RAG) |

### Dashboard & Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Dashboard KPIs |
| GET | `/api/reports/:useCaseId` | Generate report |

---

## 🔮 Future Improvements

1. **Real-time collaboration** — Multiple users working on the same use case
2. **Approval workflows** — Multi-level sign-off for AI deployments
3. **Model performance monitoring** — Track live model performance in production
4. **Integration with cloud AI services** — AWS Bedrock, Azure OpenAI
5. **Automated PoC generation** — Generate starter code for approved use cases
6. **Compliance frameworks** — DPDP, GDPR, ISO 42001 alignment
7. **Audit trail** — Full audit log of all decisions
8. **Email notifications** — Alerts for high-risk use cases
9. **Mobile app** — React Native companion
10. **Multi-tenancy** — Support multiple organisations

---

## 📝 Project Story

> "I built AI360, an enterprise AI decision and governance platform. It helps organisations evaluate AI use cases based on business impact, technical feasibility, cost, ROI, and risk using a transparent weighted scoring system. I implemented an LLM comparison module to objectively evaluate AI models on quality, latency, and cost using configurable weights. I also built a RAG-based knowledge assistant using pgvector for semantic search, enabling employees to ask questions about company policies with source citations. Finally, I added a comprehensive AI governance module to assess privacy, security, model, and business risks with automatic control recommendations."

---

## 👤 Author

Built as a portfolio project demonstrating Enterprise AI skills for an AI/IT internship application.

---

*AI360 — Powering Enterprise AI Decisions* 🚀
