import nltk
import gensim
import numpy as np
from tqdm import tqdm
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
import pandas as pd
from transformers import AutoTokenizer
import onnxruntime as ort
import os

nltk.download("punkt")


# sentiment analysis
inset_pos = pd.read_csv("api/model/inset/positive.tsv", sep="\t")
inset_neg = pd.read_csv("api/model/inset/negative.tsv", sep="\t")

inset_pos_dict = inset_pos.set_index("word")["weight"].to_dict()
inset_neg_dict = inset_neg.set_index("word")["weight"].to_dict()

# ONNX model
CURRENT_PATH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
onnx_model_path = os.path.join(CURRENT_PATH, "onnx-model", "model.onnx")
tokenizer_path = os.path.join(CURRENT_PATH, "onnx-model")

tokenizer = AutoTokenizer.from_pretrained(tokenizer_path, local_files_only=True)
onnx_session = ort.InferenceSession(onnx_model_path)

label_mapping = {
    0: "sadness",
    1: "anger",
    2: "love",
    3: "fear",
    4: "happy",
}


def process_input(preprocessed_text):
    # Buat dataframe dengan satu baris yang berisi teks hasil preprocessing
    df = pd.DataFrame({"text": [preprocessed_text]})

    tokenized_texts = [nltk.word_tokenize(text) for text in df["text"]]
    df["token"] = tokenized_texts

    tfidf_count_vectorizer = TfidfVectorizer(
        analyzer="word",
        tokenizer=nltk.word_tokenize,
        preprocessor=None,
        stop_words=None,
        max_features=None,
    )

    tfidf = tfidf_count_vectorizer.fit_transform(df["text"])

    # Get the feature names
    feature_names = tfidf_count_vectorizer.get_feature_names_out()

    # Get the IDF values
    idf_values = tfidf_count_vectorizer.idf_

    # Create a dictionary mapping feature names to IDF values
    feature_idf_dict = dict(zip(feature_names, idf_values))

    # Train Word2Vec model
    sentences = [nltk.word_tokenize(text) for text in df["text"]]
    w2v_model = gensim.models.Word2Vec(
        sentences, min_count=2, vector_size=100, window=2, sg=1
    )

    tfidf_weight_w2v = []
    row = 0
    w2v_words = list(w2v_model.wv.key_to_index)
    for sent in tqdm(df["text"]):  # for each review/sentence
        sent_vec = np.zeros(100)  # as word vectors are of zero length
        weight_sum = 0
        # num of words with a valid vector in the sentence/review
        for word in sent.split():  # for each word in a review/sentence
            if word in w2v_words and word in feature_names:
                vec = w2v_model.wv[word]
                tf_idf = feature_idf_dict[word] * (sent.count(word) / len(sent))
                sent_vec += vec * tf_idf

                weight_sum += tf_idf
        if weight_sum != 0:
            sent_vec /= weight_sum
        tfidf_weight_w2v.append(sent_vec)
        row += 1

    num_features = len(tfidf_weight_w2v[0])
    tfidf_w2v_features = pd.DataFrame(
        tfidf_weight_w2v, columns=["feature_" + str(i) for i in range(num_features)]
    )
    df = pd.concat([df, tfidf_w2v_features], axis=1)

    words_to_count = [
        "cinta",
        "kesepian",
        "terluka",
        "tulus",
        "bahagia",
        "sedih",
        "marah",
        "gembira",
        "cemburu",
        "takut",
        "kecewa",
        "malu",
    ]
    count_vectorizer = CountVectorizer(
        vocabulary=words_to_count,
        analyzer="word",
        tokenizer=nltk.word_tokenize,
        preprocessor=None,
        stop_words=None,
        max_features=None,
    )

    bag_of_words = count_vectorizer.transform(df["text"])
    count_array = bag_of_words.toarray()
    bow_emotion = pd.DataFrame(
        data=count_array, columns=count_vectorizer.get_feature_names_out()
    )

    features = pd.concat([df, bow_emotion], axis=1)

    # sentiment analysis

    def sentiment_analysis_lexicon_indonesia(text):
        score = sum(inset_pos_dict.get(word, 0) for word in text) + sum(
            inset_neg_dict.get(word, 0) for word in text
        )
        polarity = 1 if score > 0 else -1 if score < 0 else 0
        return score, polarity

    features["sentiment"] = (
        features["token"]
        .apply(sentiment_analysis_lexicon_indonesia)
        .apply(lambda x: x[1])
    )

    # ONNX model

    def get_emotion_probabilities(text):
        # Tokenize input
        encoded_input = tokenizer(
            text,
            return_tensors="np",
            padding=True,
            truncation=True,
            max_length=512
        )
        
        # Prepare inputs for ONNX
        inputs = {
            "input_ids": encoded_input["input_ids"].astype(np.int64),
            "attention_mask": encoded_input["attention_mask"].astype(np.int64)
        }
        
        # Run inference
        outputs = onnx_session.run(None, inputs)
        logits = outputs[0]
        
        # Apply softmax
        exp_logits = np.exp(logits - np.max(logits, axis=1, keepdims=True))
        probabilities = exp_logits / np.sum(exp_logits, axis=1, keepdims=True)
        probabilities = probabilities[0]

        emotion_probabilities = {
            label_mapping[i]: float(probabilities[i]) for i in range(len(probabilities))
        }
        del emotion_probabilities["love"]

        for emotion in ["sadness", "anger", "fear", "happy"]:
            if emotion not in emotion_probabilities:
                emotion_probabilities[emotion] = 0.0
        return pd.Series(emotion_probabilities)

    features[["sadness", "anger", "fear", "happy"]] = features["text"].apply(
        get_emotion_probabilities
    )

    return features
