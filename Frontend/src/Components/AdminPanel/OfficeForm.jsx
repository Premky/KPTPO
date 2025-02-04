import React, { lazy, Suspense, useEffect, useState, useTransition } from 'react'
import axios from 'axios'
import { useForm, Controller } from 'react-hook-form'
import { Box, Button, Divider, Grid2 } from '@mui/material';


import ReuseDistrict from '../ReuseableComponents/ReuseDistrict';
import ReuseInput from '../ReuseableComponents/ReuseInput';
import ReuseState from '../ReuseableComponents/ReuseState';
import ReuseMunicipality from '../ReuseableComponents/ReuseMunicipality';
import ReuseOffice from '../ReuseableComponents/ReuseOffice';
const OfficeForm = () => {
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
                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                            <ReuseInput
                                name='name_np'
                                label='कर्यालयको नाम नेपालीमा'
                                required
                                control={control}
                                error={errors.name_np}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                            <ReuseInput
                                name='name_en'
                                label='Office Name (In English)'
                                control={control}
                                error={errors.name_en}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}> {/* Use 'xs' instead of 'size' */}
                            <ReuseState
                                required
                                name='state'
                                label='प्रदेश'
                                control={control}
                                error={errors.state}
                                options={''}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}> {/* Use 'xs' instead of 'size' */}
                            <ReuseDistrict
                                required
                                name='district'
                                label='जिल्ला'
                                control={control}
                                error={errors.district}
                                options={''}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}> {/* Use 'xs' instead of 'size' */}
                            <ReuseMunicipality
                                required
                                name='municipality'
                                label='जिल्ला'
                                control={control}
                                error={errors.municipality}
                                options={''}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                            <ReuseInput
                                name='ward'
                                label='वडा नं.'
                                control={control}
                                error={errors.ward}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                            <ReuseInput
                                type='email'
                                name='email'
                                label='Email'
                                control={control}
                                error={errors.email}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                            <ReuseInput
                                type='number'
                                name='contact'
                                label='सम्पर्क नं.'
                                control={control}
                                error={errors.contact}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}> {/* Use 'xs' instead of 'size' */}
                            <ReuseOffice
                                required
                                name='headoffice'
                                label='तालुक कार्यालय'
                                control={control}
                                error={errors.headoffice}
                                options={''}
                            />
                        </Grid2>
                        <Grid2 container size={12}>
                            <Grid2 size={6}>
                                <Button variant='contained'>Submit</Button>
                            </Grid2>
                            <Grid2 size={6}>
                                <Button variant='contained' color="error">Clear</Button>
                            </Grid2>
                        </Grid2>
                    </Grid2>
                </form>
            </Box>
        </>
    )
}

export default OfficeForm
