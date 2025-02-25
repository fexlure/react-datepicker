import './App.css';
import { Datepicker } from './index.ts';
import { useState } from 'react';

function App() {
  const [value, setValue] = useState<Date | undefined>();
  console.log(value);
  return (
    <>
      <Datepicker value={value} onChange={setValue} locale={'ru'} />
    </>
  );
}

export default App;
