import { useState, Suspense, lazy } from 'react';
import {Routes, Route, BrowserRouter} from 'react-router-dom';

//For Components
const HomeRoute = lazy(() => import('./Components/Nav/Routes/HomeRoute'));
const Sidenav = lazy(()=>import('./Components/Nav/Sidenav'));
const Home = lazy(()=>import('./Components/Pages/Home'));
const About = lazy(()=>import('./Components/Pages/About'));
const Settings = lazy(()=>import('./Components/Pages/Settings'));


import Navbar from './Components/Nav/Navbar';


function App() {
  return (
    <>
      {/* <Navbar/> */}
    <BrowserRouter>
    <Routes>
      <Route path='/' exact element={<Sidenav/>}>
        <Route index element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/about' exact element={<About/>}></Route>
        <Route path='/setting' exact element={<Settings/>}></Route>
      </Route>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
