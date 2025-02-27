import { useState, Suspense, lazy } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Atom } from 'react-loading-indicators';
//For Components

const Login = lazy(() => import('./Components/Auth/Login'));
// const Register = lazy(() => import('./Components/Auth/Register'));

const HomeRoute = lazy(() => import('./Components/Nav/Routes/HomeRoute'));
const Sidenav = lazy(() => import('./Components/Nav/Sidenav'));
const Home = lazy(() => import('./Components/Pages/Home'));
const About = lazy(() => import('./Components/Pages/About'));
const Settings = lazy(() => import('./Components/Pages/Settings'));

const Users = lazy(() => import('./Components/AdminPanel/User/CreateUser'));
const OfficeForm = lazy(() => import('./Components/AdminPanel/Office/OfficeForm'));
const OfficeBranchPage = lazy(() => import('./Components/AdminPanel/Office/OfficeBranchPage'));
const Office = lazy(() => import('./Components/AdminPanel/Office/OfficeForm'));
import Navbar from './Components/Nav/Navbar';
import OfficeBranchForm from './Components/AdminPanel/Office/OfficeBranchForm';
import BranchForm from './Components/AdminPanel/Office/BranchForm';
import SuperAdmin from './Components/Auth/middlewares/SuperAdmin';
import LoggedIn from './Components/Auth/middlewares/loggedIn';
const DriverForm = lazy(() => import('./Components/Tango/Driver/DriverForm'));

function App() {
  return (
    <>
      <Suspense fallback={<div><Atom color="#3184cc" size="medium" text="" textColor="#0640ff" /></div>}>
        {/* <Navbar/> */}
        <BrowserRouter>
          <Routes>

            <Route element={<LoggedIn />}>
              <Route path="/login" element={<Login />} />
              {/* <Route path="/register" element={<RegisterPage />} /> */}
            </Route>


            <Route path='/' element={<Sidenav />}>
              <Route index element={<Home />} />
              <Route path='users' element={<Users />} />
              <Route path='office' element={<Office />} />
              <Route path='driver' element={<DriverForm />} />
              <Route path='home' element={<Home />} />
            </Route>

            <Route path='/sadmin' element={<SuperAdmin />}>
              <Route index element={<OfficeBranchForm />} />
              <Route path='branch' element={<OfficeBranchPage />} />
            </Route>

            <Route path='/admin' element={<SuperAdmin />}>
              <Route index element={<OfficeBranchForm />} />
              <Route path='branch' element={<OfficeBranchPage />} />
            </Route>
            
          </Routes>
        </BrowserRouter>
      </Suspense>
    </>
  )
}

export default App;
