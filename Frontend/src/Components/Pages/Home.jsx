import React from 'react'
import Sidenav from '../Nav/Sidenav'
import { Box } from '@mui/material'
import AccidentForm from '../Tango/Accident/AccidentForm'
import DriverForm from '../Tango/Driver/DriverForm'

import { useAuth } from '../../Context/AuthContext'
const Home = () => {
  const { state } = useAuth();
  return (
    <>

      <Box sx={{ display: 'flex' }}>
        {/* <AccidentForm/> */}        
        <DriverForm />
        
      </Box>
    </>
  )
}

export default Home


