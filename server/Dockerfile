# Build stage
FROM python:3.10-slim as builder

RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
ENV PIP_DEFAULT_TIMEOUT=100

# Copy requirements and install packages (excluding onnxruntime for now)
COPY ./requirements.txt /app/requirements.txt
RUN grep -v "^onnxruntime" requirements.txt > /tmp/requirements_no_onnx.txt && \
    pip install --no-cache-dir --user -r /tmp/requirements_no_onnx.txt

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

# Install ONNX Runtime directly in runtime stage for correct target platform
# This ensures it's built/installed for the platform specified in --platform flag
COPY ./requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir --user onnxruntime==1.16.3

# Copy NLTK data
COPY --from=builder /app/nltk_data /root/nltk_data

# Copy application code
COPY . /app

# Make sure scripts in .local are usable and set NLTK data path
# Set GLIBC tunable to allow loading libraries with executable stack requirement
ENV PATH=/root/.local/bin:$PATH \
    NLTK_DATA=/root/nltk_data \
    GLIBC_TUNABLES=glibc.rtld.execstack=2

EXPOSE 8000
CMD uvicorn --port 8000 --host 0.0.0.0 main:app
