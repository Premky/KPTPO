import { useState, Suspense, lazy } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from './Context/AuthContext';
import ProtectedRoute from './Context/ProtectedRoute';

// Lazy-loaded components
const Login = lazy(() => import('./Components/Auth/Login'));
// const Sidenav = lazy(() => import('./Components/Nav/Sidenav'));
const CombinedNavBar=lazy(() => import ('./Components/Nav/CombinedNavBar'));
const Home = lazy(() => import('./Components/Pages/Home'));
const Users = lazy(() => import('./Components/AdminPanel/User/CreateUser'));
const OfficeBranchPage = lazy(() => import('./Components/AdminPanel/Office/OfficeBranchPage'));
const Office = lazy(() => import('./Components/AdminPanel/Office/OfficeForm'));
const DriverForm = lazy(() => import('./Components/Tango/Driver/DriverForm'));
const DriverTable = lazy(() => import('./Components/Tango/Driver/DriverTable'));
const ArrestVehicleReport = lazy(() => import('./Components/Tango/ArrestedVehicle/Admin/ArrestVehicleReport'));
const DailyKasurForm = lazy(() => import('./Components/Tango/ArrestedVehicle/Client/DailyKasurForm'));
const ArrestedVehicleForm = lazy(() => import('./Components/Tango/ArrestedVehicle/Client/ArrestedVehicleForm'));
const TangoAdminDashboard = lazy(() => import('./Components/Tango/ArrestedVehicle/Admin/TangoAdminDashboard'));
const TangoHome = lazy(() => import('./Components/Tango/ArrestedVehicle/Admin/TangoHome'));

const AccidentForm = lazy(() => import('./Components/VehicleAccident/AccidentForm'));

// Middleware Components
import SuperAdmin from './Components/Auth/middlewares/SuperAdmin';
import AdminCheck from './Components/Auth/middlewares/AdminCheck';
import UserCheck from './Components/Auth/middlewares/UserCheck';
import AccidentLongTable from './Components/VehicleAccident/AccidentLongTable';
import CreateUser from './Components/AdminPanel/User/CreateUser';
import AssignApps from './Components/AdminPanel/User/AssignApps';

function App() {
  return (
    <AuthProvider> {/* Move AuthProvider to wrap everything */}
      <Suspense fallback={<div>Loading...</div>}>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route path='/' element={<ProtectedRoute />}>
              <Route path='/' element={<CombinedNavBar />}>
                <Route path='/sadmin' element={<SuperAdmin />}>
                  <Route path='branch' element={<OfficeBranchPage />} />
                  <Route path='users' element={<Users />} />
                  <Route path='office' element={<Office />} />
                </Route>

                <Route path ='/su' element={<SuperAdmin />}>
                  <Route index element={<CreateUser/>} />
                  <Route path='apps' element={<AssignApps/>}/>
                  <Route path='branch' element={<OfficeBranchPage />} />
                  <Route path='office' element={<Office />} />
                  <Route path='users' element={<Users />} />
                </Route>

                <Route path='/admin' element={<AdminCheck />}>
                  <Route index element={<DriverTable />} />
                  <Route path='driver' element={<DriverForm />} />
                </Route>

                <Route path='/user' element={<UserCheck />}>
                  <Route index element={<Home />} />
                </Route>

                {/* Secured AV Routes */}
                <Route path='/av'>
                  <Route index element={<TangoHome />} />
                  <Route path='kasur-form' element={<DailyKasurForm />} />
                  <Route path='arrestedvehicle-form' element={<ArrestedVehicleForm />} />
                  <Route path='report' element={<TangoAdminDashboard />} >
                    <Route path='tango-user' element={<Users />} />
                    <Route path='arrest_vehicle-report' element={<ArrestVehicleReport />} />
                  </Route>
                </Route>

                <Route path='/va'>
                  <Route index element={<AccidentForm />} />
                  <Route path='accident-form' element={<AccidentForm/>} />
                  <Route path='accident-report' element={<AccidentLongTable/>} />
                </Route>

              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </Suspense>
    </AuthProvider>
  );
}

export default App;