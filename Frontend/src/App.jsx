import { useState, Suspense, lazy } from 'react';
import {Routes, Route, BrowserRouter} from 'react-router-dom';

//For Components
const HomeRoute = lazy(() => import('./Components/Nav/Routes/HomeRoute'));
const Sidenav = lazy(()=>import('./Components/Nav/Sidenav'));
const Home = lazy(()=>import('./Components/Pages/Home'));
const About = lazy(()=>import('./Components/Pages/About'));
const Settings = lazy(()=>import('./Components/Pages/Settings'));

const Users = lazy(()=>import('./Components/AdminPanel/User/CreateUser'));
const OfficeForm = lazy(()=>import('./Components/AdminPanel/Office/OfficeForm'));
const OfficeBranchPage = lazy(()=>import('./Components/AdminPanel/Office/OfficeBranchPage'));
const Office = lazy(()=>import('./Components/AdminPanel/Office/OfficeForm'));
import Navbar from './Components/Nav/Navbar';
import OfficeBranchForm from './Components/AdminPanel/Office/OfficeBranchForm';
import BranchForm from './Components/AdminPanel/Office/BranchForm';
const DriverForm= lazy(()=>import('./Components/Tango/Driver/DriverForm'));

function App() {
  return (
    <>
      {/* <Navbar/> */}
    <BrowserRouter>
    <Routes>
      <Route path='/' exact element={<Sidenav/>}>
        <Route index element={<Home />} />
        <Route path='/users' exact element={<Users/>}></Route>
        <Route path='/office' exact element={<Office/>}></Route>
        <Route path='/driver' exact element={<DriverForm/>}></Route>
        <Route path='/home' element={<Home />} />
        <Route path='/branch' exact element={<OfficeBranchPage/>}></Route>
      </Route>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
