import { useState } from 'react';
import Textarea from './components/textarea';
import Button from './components/button';

function App() {
  const [text, setText] = useState('');

  return (
    <div className="bg-secondary min-h-screen flex place-items-center ">
      <div className="max-w-screen-lg  mx-auto">
        <header className="w-full mb-24">
          <h1 className="w-full text-center font-black uppercase text-[7rem] inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary-button to-accent   decoration-gray-200">
            Prediksi Emosi
          </h1>
          <h2 className="w-full text-center font-bold text-[2.3rem] text-primary text-opacity-50 opacity-80 uppercase rounded-3xl px-4 bg-secondary-button">
            Tebak emosi dari lirik musik pop Indonesia
          </h2>
        </header>
        <main className=" flex flex-col gap-y-4">
          <h2 className="w-full text-center font-medium text-2xl text-primary ">
            Masukkan lirik lagu di bawah ini, kemudian tekan tombol prediksi
          </h2>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Masukkan lirik lagu di sini..."
          />
          <div className="w-full flex justify-between my-6">
            <Button type="secondary">Contoh Lirik</Button>
            <Button type="primary">Prediksi</Button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
