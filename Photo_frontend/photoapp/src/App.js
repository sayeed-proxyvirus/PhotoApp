
import {Route , Routes } from 'react-router-dom'

import Photoapp from './Component/Photoapp'


function App() {
  return (
    <div className="App">
      
        <Routes>
          <Route exact path="/" element={<Photoapp />} />
          
        
        </Routes>
         
    </div>
  )
}

export default App
