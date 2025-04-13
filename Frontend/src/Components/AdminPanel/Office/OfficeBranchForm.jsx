import React, { lazy, Suspense, useEffect, useState, useTransition } from 'react'
import axios from 'axios'
import { useForm, Controller } from 'react-hook-form'
import { Box, Button, Divider, Grid2 } from '@mui/material';


import ReuseDistrict from '../../ReuseableComponents/ReuseDistrict';
import ReuseInput from '../../ReuseableComponents/ReuseInput';
import ReuseState from '../../ReuseableComponents/ReuseState';
import ReuseMunicipality from '../../ReuseableComponents/ReuseMunicipality';
import ReuseOffice from '../../ReuseableComponents/ReuseOffice';
const OfficeBranchForm = () => {
    
    const { register, handleSubmit, reset, setValue, watch, formState: { errors }, control } = useForm();

    const onFormSubmit = () => {
        console.log('submit is working')
    }

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <form onSubmit={handleSubmit(onFormSubmit)}>
                    <Grid2 container spacing={1}>
                        <Grid2 size={12}>
                            कार्यालयको विवरणः
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 4, md: 3 }}> {/* Use 'xs' instead of 'size' */}
                            <ReuseOffice
                                required
                                name='office'
                                label='कार्यालय'
                                control={control}
                                error={errors.office}
                                options={''}
                            />
                        </Grid2>
                        
                        <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                            <ReuseInput
                                type='email'
                                name='email'
                                label='Branch Email'
                                control={control}
                                error={errors.email}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                            <ReuseInput
                                type='number'
                                name='contact'
                                label='शाखाको सम्पर्क नं.'
                                control={control}
                                error={errors.contact}
                            />
                            
                        </Grid2>
                            <Grid2 container size={{ xs: 12, sm: 6, md: 3 }}>
                                <Button variant='contained'>Submit</Button>
                                
                            </Grid2>
                    </Grid2>
                </form>
            </Box>
        </>
    )
}

export default OfficeBranchForm
