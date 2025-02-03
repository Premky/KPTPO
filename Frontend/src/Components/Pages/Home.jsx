import React from 'react'
import Sidenav from '../Nav/Sidenav'
import { Box } from '@mui/material'
import AccidentForm from '../Tango/Accident/AccidentForm'

const Home = () => {
  return (
    <>
    
      <Box sx={{display:'flex'}}>        
        <AccidentForm/>
      </Box>
    </>
  )
}

export default Home


