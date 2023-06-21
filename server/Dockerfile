FROM python:3.10-slim

RUN apt-get update && apt-get install -y \
    ffmpeg \
    libsm6 \
    libxext6 \
    wget \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
ENV PIP_DEFAULT_TIMEOUT=100
RUN pip install poetry torch --extra-index-url https://download.pytorch.org/whl/cpu

COPY ./pyproject.toml ./poetry.lock* /app/
RUN poetry config virtualenvs.create false
RUN poetry install --no-root

COPY . /app

CMD uvicorn --port 8000 --host 0.0.0.0 --reload main:app
