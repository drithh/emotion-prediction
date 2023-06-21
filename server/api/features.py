import nltk
import gensim
import numpy as np
from tqdm import tqdm
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
import pandas as pd
from transformers import AutoTokenizer, AutoModelForSequenceClassification

nltk.download("punkt")


# sentiment analysis
inset_pos = pd.read_csv(
    "https://raw.githubusercontent.com/fajri91/InSet/master/positive.tsv", sep="\t"
)
inset_neg = pd.read_csv(
    "https://raw.githubusercontent.com/fajri91/InSet/master/negative.tsv", sep="\t"
)

inset_pos_dict = inset_pos.set_index("word")["weight"].to_dict()
inset_neg_dict = inset_neg.set_index("word")["weight"].to_dict()

#  pretrained model
pretrained_name = "StevenLimcorn/indonesian-roberta-base-emotion-classifier"

tokenizer = AutoTokenizer.from_pretrained(pretrained_name)
model = AutoModelForSequenceClassification.from_pretrained(pretrained_name)

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

    # pretrained model

    def get_emotion_probabilities(text):
        encoded_input = tokenizer(text, return_tensors="pt")
        output = model(**encoded_input)
        logits = output.logits
        probabilities = logits.softmax(dim=1).tolist()[0]

        emotion_probabilities = {
            label_mapping[i]: probabilities[i] for i in range(len(probabilities))
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
