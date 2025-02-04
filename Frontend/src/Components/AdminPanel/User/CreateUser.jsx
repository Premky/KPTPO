import React, { lazy, Suspense, useEffect, useState, useTransition } from 'react'
import axios from 'axios'
import { useForm, Controller } from 'react-hook-form'
import { Box, Button, Divider, Grid2 } from '@mui/material';
import ReuseInput from '../../ReuseableComponents/ReuseInput';
import ReuseOffice from '../../ReuseableComponents/ReuseOffice';
import ReuseSelect from '../../ReuseableComponents/ReuseSelect';

const CreateUser = () => {
    const { register, handleSubmit, reset, setValue, watch, formState: { errors }, control } = useForm();

    const onFormSubmit = () => {
        console.log('submit is working')
    }
    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <form onSubmit={handleSubmit(onFormSubmit)}>
                    <Grid2 container spacing={1}>
                        <Grid2 size={{xs:12}}>प्रयोगकर्ता </Grid2>
                        <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                            <ReuseInput
                                name='name_np'
                                label='दर्जा नामथर नेपालीमा'
                                control={control}
                                error={errors.name_np}
                                required
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                            <ReuseOffice
                                name='office'
                                label='कार्यालय'
                                control={control}
                                error={errors.office}
                                required
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                            <ReuseInput
                                name='password'
                                type='password'
                                label='Password'
                                control={control}
                                error={errors.password}
                                required
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                            <ReuseInput
                                name='repassword'
                                type='repassword'
                                label='Re-Password'
                                control={control}
                                error={errors.repassword}
                                required
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                            <ReuseSelect
                                name='is_active'
                                label='सक्रिय छ/छैन'
                                control={control}
                                error={errors.is_active}
                                required
                            />
                        </Grid2>
                    </Grid2>
                </form>
            </Box>
        </>
    )
}

export default CreateUser