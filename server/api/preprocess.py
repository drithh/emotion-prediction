import nltk
from nltk.corpus import stopwords
from Sastrawi.Stemmer.StemmerFactory import StemmerFactory


def preprocess(text):
    symbols = '!"#$%&()*+-./:;<=>?@[\]^_`{|}~\n'

    # Hapus tanda baca dari teks
    for punctuation in symbols:
        text = text.replace(punctuation, "").strip()

    # Menghilangkan kata-kata penghubung dan umum
    nltk.download("stopwords")
    stop_words = set(stopwords.words("indonesian"))
    text = " ".join([word for word in text.split() if word.lower() not in stop_words])

    # Lemmatisasi menggunakan Sastrawi Stemmer
    factory = StemmerFactory()
    stemmer = factory.create_stemmer()
    text = stemmer.stem(text)

    return text
