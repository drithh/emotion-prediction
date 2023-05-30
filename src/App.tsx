import { useState } from 'react';
import Textarea from './components/textarea';
import Button from './components/button';
import Bar from './components/bar';
import Emoji from './components/emoji';

function App() {
  const [text, setText] = useState('');
  const [isAnimated, setIsAnimated] = useState(false);
  const [emojiPath, setEmojiPath] = useState('');
  const [emotion, setEmotion] = useState('');

  const getLyric = () => {
    const lirik = `Aku mencari cinta Di tempat yang tidak biasa Tepat di antara luka Dan kesunyian tak mereda Telah ku temukan dia Memelukku dalam sepinya Dan ku mencintainya Dalam ruang yang telah terbatas Hanya senandung jiwa Hanya rasa yang seluruhnya Aku mencintainya Menjaganya dalam rahasia Oooo... Oooo... Cinta ini menutup mataku Menggenggam nafasku Membelengguku Katakan padaku ini tak benar Tinggalkan aku cinta Meski luka kian merebak Meski duri merajam Bunga itu tetap mengembang Oooo... Oooo... Cinta ini memeluk jiwaku Menggenggam nafasku Membelengguku Katakan padaku ini tak benar Oooo... Oooo... Cinta ini mendekap tubuhku Katakan hatiku Katakan itu Katakan padaku ini tak benar Aku mencari cinta... Aku mencari cinta...`;

    setText(lirik);
  };

  const predict = () => {
    const currentIsAnimated = isAnimated;
    setIsAnimated(!currentIsAnimated);

    if (!currentIsAnimated) {
      console.log('stop');
      setEmotion('');
      setEmojiPath('');
    } else {
      const result = 'sad';
      if (result === 'sad') {
        setEmotion('sad');
        setEmojiPath('emoji/crying-face.png');
      } else if (result === 'happy') {
        setEmotion('happy');
        setEmojiPath('happy');
      } else if (result === 'angry') {
        setEmotion('angry');
        setEmojiPath('happy');
      } else if (result === 'fear') {
        setEmotion('fear');
        setEmojiPath('happy');
      }
    }
  };

  return (
    <div className="bg-secondary min-h-screen flex place-items-center ">
      <div className="max-w-screen-lg  mx-auto my-20">
        <header className="w-full mb-24">
          <h1 className="w-full text-center font-black uppercase text-[7rem] inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary-button to-accent   decoration-gray-200">
            Prediksi Emosi
          </h1>
          <h2 className="w-full text-center font-bold text-[2.3rem] text-primary text-opacity-50 opacity-80 uppercase rounded-3xl px-4 bg-secondary-button">
            Tebak emosi dari lirik musik pop Indonesia
          </h2>
        </header>
        <main className="flex flex-col gap-y-12">
          <div className="wrapper bg-secondary rounded-3xl p-8 shadow-lg flex flex-col gap-8">
            <h2 className="w-full text-center font-medium text-2xl text-primary text-opacity-50 ">
              Masukkan lirik lagu di bawah ini, kemudian tekan tombol prediksi
            </h2>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Masukkan lirik lagu di sini..."
            />
            <div className="w-full flex justify-between my-6">
              <Button type="secondary" onClick={getLyric}>
                Contoh Lirik
              </Button>
              <Button type="primary" onClick={predict}>
                Prediksi
              </Button>
            </div>
          </div>
          <div className="wrapper bg-secondary rounded-3xl p-8 shadow-lg flex flex-col gap-8">
            <h2 className="w-full font-medium text-2xl text-primary text-opacity-70 ">
              Aku tebak emosi dari lirik lagu kamu adalah {emotion}
            </h2>
            <div className="flex place-content-between ">
              <div className="flex flex-1 flex-col h-full place-content-between gap-3">
                <Bar
                  textClass="text-green-500"
                  barClass="bg-gradient-to-r from-green-300 to-green-500"
                  width={100}
                  isAnimated={isAnimated}
                  label="Bahagia"
                />
                <Bar
                  textClass="text-blue-500"
                  barClass="bg-gradient-to-r from-blue-300 to-blue-500"
                  width={24}
                  isAnimated={isAnimated}
                  label="Sedih"
                />
                <Bar
                  textClass="text-red-500"
                  barClass="bg-gradient-to-r from-red-300 to-red-500"
                  width={32}
                  isAnimated={isAnimated}
                  label="Takut"
                />
                <Bar
                  textClass="text-yellow-500"
                  barClass="bg-gradient-to-r from-yellow-300 to-yellow-500"
                  width={10}
                  isAnimated={isAnimated}
                  label="Marah"
                />
              </div>
              <Emoji src={emojiPath} alt={emojiPath} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
