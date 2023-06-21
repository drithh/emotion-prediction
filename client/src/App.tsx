import { useState } from 'react';
import Textarea from './components/textarea';
import Button from './components/button';
import Bar from './components/bar';
import Emoji from './components/emoji';
import DotAnimation from './components/dot-animation';

function App() {
  const [text, setText] = useState('');
  const [isAnimated, setIsAnimated] = useState(false);
  const [emotion, setEmotion] = useState('');

  const getRandomThinkingEmoji = () => {
    const randomImageLoading = Math.floor(Math.random() * 2) + 1;
    const pathImageLoading =
      randomImageLoading === 1
        ? '/emoji/face-with-monocle.png'
        : '/emoji/thinking-face.png';
    return pathImageLoading;
  };
  const [emojiPath, setEmojiPath] = useState(getRandomThinkingEmoji());

  const getLyric = () => {
    const lirik = `Aku mencari cinta Di tempat yang tidak biasa Tepat di antara luka Dan kesunyian tak mereda Telah ku temukan dia Memelukku dalam sepinya Dan ku mencintainya Dalam ruang yang telah terbatas Hanya senandung jiwa Hanya rasa yang seluruhnya Aku mencintainya Menjaganya dalam rahasia Oooo... Oooo... Cinta ini menutup mataku Menggenggam nafasku Membelengguku Katakan padaku ini tak benar Tinggalkan aku cinta Meski luka kian merebak Meski duri merajam Bunga itu tetap mengembang Oooo... Oooo... Cinta ini memeluk jiwaku Menggenggam nafasku Membelengguku Katakan padaku ini tak benar Oooo... Oooo... Cinta ini mendekap tubuhku Katakan hatiku Katakan itu Katakan padaku ini tak benar Aku mencari cinta... Aku mencari cinta...`;

    setText(lirik);
  };

  const predict = () => {
    const timeoutSetEmoji = (emoji: string, emojiPath: string) => {
      if (!currentIsAnimated) return;
      setTimeout(() => {
        setEmotion(emoji);
        setEmojiPath(emojiPath);
      }, 1500);
    };

    const currentIsAnimated = isAnimated;
    setIsAnimated(!currentIsAnimated);

    if (!currentIsAnimated) {
      setEmotion('');
      setEmojiPath(getRandomThinkingEmoji());
    } else {
      const result = 'sad';
      if (result === 'sad') {
        timeoutSetEmoji('sad', 'emoji/crying-face.png');
      } else if (result === 'happy') {
        timeoutSetEmoji('happy', 'happy');
      } else if (result === 'angry') {
        timeoutSetEmoji('happy', 'happy');
      } else if (result === 'fear') {
        timeoutSetEmoji('happy', 'happy');
      }
    }
  };

  return (
    <div className="bg-secondary min-h-screen flex place-items-center ">
      <div className="max-w-screen-lg w-screen mx-auto my-20">
        <header className="w-full mb-12 max-w-[80vw] mx-auto">
          <h1 className="w-full mb-2 text-center font-black uppercase text-[3rem] md:text-[5.7rem] inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary-button to-accent   decoration-gray-200 xl:leading-normal leading-none">
            Emotion Detection
          </h1>
          <h2 className="w-full text-center font-bold text-[1rem] py-2 mt-8 md:py-0 md:mt-0 md:text-[1.5rem] text-primary text-opacity-50 opacity-80 uppercase rounded-3xl px-4 bg-secondary-button">
            Guess the emotions from the lyrics of Indonesian pop music
          </h2>
        </header>
        <main className="flex flex-col gap-y-12">
          <div className="wrapper  bg-secondary rounded-3xl p-8 shadow-lg flex flex-col gap-8">
            <h2 className="w-full text-center font-medium text-xl md:text-2xl text-primary text-opacity-50 ">
              Please enter the lyrics below, then press the predict button.
            </h2>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Masukkan lirik lagu di sini..."
            />
            <div className="w-full flex justify-between my-6 md:flex-row flex-col gap-4">
              <Button type="secondary" onClick={getLyric}>
                Lyric Example
              </Button>
              <Button type="primary" onClick={predict}>
                Predict
              </Button>
            </div>
          </div>
          <div className="wrapper bg-secondary rounded-3xl p-8 shadow-lg flex flex-col gap-8">
            <h2 className="w-full font-medium text-xl md:text-2xl text-primary text-opacity-60 ">
              I guess the emotion from the lyrics of your song is{' '}
              {emotion === '' ? (
                <DotAnimation />
              ) : (
                <span className="text-primary">{emotion}</span>
              )}
            </h2>
            <div className="flex place-content-between flex-col md:flex-row md:gap-0 gap-8">
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
