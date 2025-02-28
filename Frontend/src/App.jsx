import { useState, Suspense, lazy } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext';
import ProtectedRoute from './Context/ProtectedRoute';
// import { Atom } from 'react-atomic-molecule';
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
const DriverForm = lazy(() => import('./Components/Tango/Driver/DriverForm'));
const DriverTable = lazy(() => import('./Components/Tango/Driver/DriverTable'));

import SuperAdmin from './Components/Auth/middlewares/SuperAdmin';
import AdminCheck from './Components/Auth/middlewares/AdminCheck';
import UserCheck from './Components/Auth/middlewares/UserCheck';
import LoggedIn from './Components/Auth/middlewares/loggedIn';

function App() {
  return (
    <>
      <Suspense fallback={
        <div>
          {/* <Atom color="#3184cc" size="medium" text="" textColor="#0640ff" /> */}
        </div>}
      >
        {/* <Navbar/> */}
        <BrowserRouter>
          <AuthProvider>
            <Routes>

              <Route element={<LoggedIn />}>
                <Route path="/login" element={<Login />} />
                {/* <Route path="/register" element={<RegisterPage />} /> */}
              </Route>

              <Route path='/' element={<ProtectedRoute />}>

                <Route path='/' element={<Sidenav />}>

                  {/* <Route path='home' element={<Home />} /> */}


                  {/* All protected routes are here */}

                  <Route path='/sadmin' element={<SuperAdmin />}>
                    <Route index element={<OfficeBranchForm />} />
                    <Route path='users' element={<Users />} />
                    <Route path='office' element={<Office />} />
                    <Route path='branch' element={<OfficeBranchPage />} />
                  </Route>

                  <Route path='/admin' element={<AdminCheck />}>
                    <Route index element={<DriverTable />} />
                    <Route path='driver' element={<DriverForm />} />
                  </Route>

                  <Route path='/user' element={<UserCheck />}>
                    <Route index element={<Home />} />
                  </Route>
                </Route>
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </Suspense>
    </>
  )
}

export default App;
