import React from 'react'
import Sidenav from '../Nav/Sidenav'
import { Box } from '@mui/material'
import AccidentForm from '../Tango/Accident/AccidentForm'
import DriverForm from '../Tango/Driver/DriverForm'

import { useAuth } from '../Auth/middlewares/AuthContext'
const Home = () => {
  const {token, setToken} = useAuth();
  return (
    <>
      {token}
      <Box sx={{display:'flex'}}>        
        {/* <AccidentForm/> */}
        <DriverForm/>
      </Box>
    </>
  )
}

export default Home


