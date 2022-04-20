import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Login, Register } from './pages';

const Routers = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={ <Login /> }/>
        <Route path='/register' element={ <Register /> }/>
      </Routes>
    </BrowserRouter>
  );
}

export default Routers;