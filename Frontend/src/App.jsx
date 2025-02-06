import { useState, Suspense, lazy } from 'react';
import {Routes, Route, BrowserRouter} from 'react-router-dom';

//For Components
const HomeRoute = lazy(() => import('./Components/Nav/Routes/HomeRoute'));
const Sidenav = lazy(()=>import('./Components/Nav/Sidenav'));
const Home = lazy(()=>import('./Components/Pages/Home'));
const About = lazy(()=>import('./Components/Pages/About'));
const Settings = lazy(()=>import('./Components/Pages/Settings'));
const OfficeForm = lazy(()=>import('./Components/AdminPanel/Office/OfficeForm'));
const OfficeBranchPage = lazy(()=>import('./Components/AdminPanel/Office/OfficeBranchPage'));
import Navbar from './Components/Nav/Navbar';
import ReuseTable from './Components/ReuseableComponents/ReuseTable';
import OfficeTable from './Components/AdminPanel/User/CreateUser';
import OfficeBranchForm from './Components/AdminPanel/Office/OfficeBranchForm';
import BranchForm from './Components/AdminPanel/Office/BranchForm';

function App() {
  return (
    <>
      {/* <Navbar/> */}
    <BrowserRouter>
    <Routes>
      <Route path='/' exact element={<Sidenav/>}>
        <Route index element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/about' exact element={<OfficeForm/>}></Route>
        <Route path='/setting' exact element={<OfficeBranchPage/>}></Route>
      </Route>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
