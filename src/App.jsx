import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BarcodeScanner } from '@thewirv/react-barcode-scanner'

function App() {
  const [count, setCount] = useState(0)
  const [data, setData] = useState('No result');
  return (
    <>
     <BarcodeScanner
        onSuccess={(text) => setData(text)}
        onError={(error) => {
          if (error) {
            console.error(error.message);
          }
        }}
        onLoad={() => console.log('Video feed has loaded!')}
        containerStyle={{width: '500px'}}
      />
      <p>{data}</p>
    </>
  )
}

export default App
