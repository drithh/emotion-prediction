# Build stage
FROM python:3.10-slim as builder

RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
ENV PIP_DEFAULT_TIMEOUT=100

COPY ./requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir --user -r requirements.txt

# Download NLTK data to a specific location
RUN mkdir -p /app/nltk_data && \
    python -c "import nltk; nltk.download('punkt', download_dir='/app/nltk_data'); nltk.download('stopwords', download_dir='/app/nltk_data')"

# Runtime stage
FROM python:3.10-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /root/.local /root/.local

# Copy NLTK data
COPY --from=builder /app/nltk_data /root/nltk_data

# Copy application code
COPY . /app

# Make sure scripts in .local are usable and set NLTK data path
ENV PATH=/root/.local/bin:$PATH \
    NLTK_DATA=/root/nltk_data

EXPOSE 8000
CMD uvicorn --port 8000 --host 0.0.0.0 main:app
