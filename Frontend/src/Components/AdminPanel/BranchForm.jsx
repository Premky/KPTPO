import React, { lazy, Suspense, useEffect, useState, useTransition } from 'react'
import axios from 'axios'
import { useForm, Controller } from 'react-hook-form'
import { Box, Button, Divider, Grid2 } from '@mui/material';


import ReuseDistrict from '../ReuseableComponents/ReuseDistrict';
import ReuseInput from '../ReuseableComponents/ReuseInput';
import ReuseState from '../ReuseableComponents/ReuseState';
import ReuseMunicipality from '../ReuseableComponents/ReuseMunicipality';
import ReuseOffice from '../ReuseableComponents/ReuseOffice';


const BranchForm = () => {
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
                            शाखाहरु थप्नुहोस्
                        </Grid2>
                        <Grid2 size={{ md: 5 }}>
                            <ReuseInput
                                name='name_np'
                                label='शाखाको नाम नेपालीमा'
                                required
                                control={control}
                                error={errors.name_np}
                            />
                        </Grid2>
                        <Grid2 size={{ md: 5 }}>
                            <ReuseInput
                                name='name_en'
                                label='Branch Name (In English)'
                                control={control}
                                error={errors.name_en}
                            />
                        </Grid2>
                        <Grid2 container size={{ md: 2 }}>
                            <Button variant='contained'>Add</Button>
                        </Grid2>

                        <Grid2 container size={12}>
                        </Grid2>
                    </Grid2>
                </form>
            </Box>
        </>
    )
}

export default BranchForm