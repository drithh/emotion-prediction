FROM python:3.10-slim

RUN apt-get update && apt-get install -y \
    ffmpeg \
    libsm6 \
    libxext6 \
    wget \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
ENV PIP_DEFAULT_TIMEOUT=100
RUN pip install torch --extra-index-url https://download.pytorch.org/whl/cpu

COPY ./requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt

RUN python -c "import nltk;nltk.download('punkt');nltk.download('stopwords')"
RUN python -c "from transformers import AutoTokenizer, AutoModelForSequenceClassification; AutoTokenizer.from_pretrained('StevenLimcorn/indonesian-roberta-base-emotion-classifier').save_pretrained('./api/model/pretrained/tokenizer'); AutoModelForSequenceClassification.from_pretrained('StevenLimcorn/indonesian-roberta-base-emotion-classifier').save_pretrained('./api/model/pretrained/model')"

COPY . /app
EXPOSE 8000
CMD uvicorn --port 8000 --host 0.0.0.0 --reload main:app
