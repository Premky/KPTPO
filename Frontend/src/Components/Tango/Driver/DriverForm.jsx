import React, { lazy, Suspense, useEffect, useState, useTransition } from 'react'
import { useTheme } from '@emotion/react'
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import NepaliDate from 'nepali-datetime'
import { Box, Divider, Grid2 } from '@mui/material';
import ReuseInput from '../../ReuseableComponents/ReuseInput'
import ReuseSelect from '../../ReuseableComponents/ReuseSelect'
import ReuseDateField from '../../ReuseableComponents/ReuseDateField'


const DriverForm = () => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('token');
    const npToday = new NepaliDate();
    const formattedDateNp = npToday.format('YYYY-MM-DD');
    const { register, handleSubmit, reset, setValue, watch, formState: { errors }, control } = useForm();

    //Variables 
    const [country, setCountry] = useState([]);
    const [province, setProvince] = useState([]);
    const [district, setDistrict] = useState([]);
    const [cities, setCities] = useState([]);

    //Fetch APIs Provinces, District & Ctities 
    const fetchCountry = async () => {
        try {
            const url = `${BASE_URL}/public/get_countries`;
            const response = await axios.get(url, { headers: { Authorization: `Bearer ${token}` }, });
            const { Status, Result, Error } = response.data;

            if (Status) {
                if (Result.length > 0) {
                    console.log("ldksaf")
                    setCountry(Result);
                } else {
                    console.log('Record for Province Not Found');
                }
            } else {
                console.log(Error || 'Failed to fetch Countries.')
            }
        } catch (error) {
            console.error('Error Fetching records:', error);
        }
    };

    const fetchProvince = async () => {
        try {
            const url = `${BASE_URL}/common/get_provinces`;
            const response = await axios.get(url, { headers: { Authorization: `Bearer ${token}` }, });
            const { Status, Result, Error } = response.data;

            if (Status) {
                if (Result.length > 0) {
                    setProvince(Result);
                } else {
                    console.log('Record for Province Not Found');
                }
            } else {
                console.log(Error || 'Failed to fetch provinces.')
            }
        } catch (error) {
            console.error('Error Fetching records:', error);
        }
    };

    //test variables
    const onSubmit = (data) => {
        console.log('From Data:', data)
    }
    //Use Effect:
    useEffect(() => {
        fetchCountry();
        // fetchProvince();
    }, []);

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid2 container spacing={1}>
                        <Grid2 size={12}>
                            सवारी साधनको विरणः
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 6, xl: 3 }}> {/* Use 'xs' instead of 'size' */}
                            <ReuseSelect
                                name='district'
                                label='जिल्ला'
                                required
                                control={control}
                                error={errors.district}
                                options={''}
                            />
                        </Grid2>

                        <Grid2 size={{ xs: 12, md: 6, xl: 3 }}>
                            <ReuseSelect
                                name='vehicle'
                                label='सवारी साधनको नाम'
                                required
                                control={control}
                                error={errors.vehicle}
                                options={''}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 6, xl: 3 }}>
                            <ReuseInput
                                name='vehicle_no'
                                label='सवारी साधनको नं.'
                                required
                                control={control}
                                error={errors.vehicle_no}
                            />
                        </Grid2>
                        <Grid2 container size={{ xs: 12, md: 6, xl: 3 }}>
                            <Grid2 size={12}>सवारी चल्ने रुट</Grid2>
                            <Grid2 size={{ xs: 6, md: 6 }}>
                                <ReuseInput
                                    name='start_route'
                                    placeholder='देखी'
                                    control={control}
                                    error={errors.start_route}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 6, md: 6 }}>
                                <ReuseInput
                                    name='end_route'
                                    placeholder='सम्म'
                                    control={control}
                                    error={errors.start_route}
                                />
                            </Grid2>
                        </Grid2>

                        <Grid2 size={{ xs: 12, md: 6, xl: 3 }}>
                            <ReuseInput label='चालकको नाम' name='drivername' control={control} error={errors.drivername} />
                        </Grid2>
                        <Grid2 container size={{ xs: 6, md: 6, xl: 3 }}>
                            <Grid2 size={9}>
                                <ReuseDateField
                                    name='driverdob'
                                    control={control}
                                    label='जन्म मिति'
                                />
                            </Grid2>
                            <Grid2 size={3}>
                                <ReuseInput readonly
                                    label='उमेर' name='driverage' control={control} error={errors.driverage} />
                            </Grid2>
                        </Grid2>
                        <Grid2 size={{ xs: 6, md: 6, xl: 3 }}>
                            <ReuseSelect
                                name='country'
                                label='देश'
                                required
                                control={control}
                                error={errors.country}
                                options={''}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 6, md: 6, xl: 3 }}>
                            <ReuseSelect
                                name='state'
                                label='प्रदेश'
                                required
                                control={control}
                                error={errors.state}
                                options={''}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 6, md: 6, xl: 3 }}>
                            <ReuseSelect
                                name='district'
                                label='जिल्ला'
                                required
                                control={control}
                                error={errors.district}
                                options={''}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 6, md: 6, xl: 3 }}>
                            <ReuseSelect
                                name='municipality'
                                label='गा.पा./न.पा./उ.न.पा./म.न.पा'
                                required
                                control={control}
                                error={errors.municipality}
                                options={''}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 6, xl: 3 }}>
                            <ReuseInput type='number' label='वडा नं.' name='driverward' control={control} error={errors.driverward} />
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 6, xl: 3 }}>
                            <ReuseInput label='बुबाको नाम' name='driverfather' control={control} error={errors.driverfather} />
                        </Grid2>
                        <Grid2 container size={{ xs: 12, md: 6, xl: 3 }}>
                            <Grid2 size={ 9 }>
                                <ReuseInput label='सवारी चालक प्र.प्र.नं.' name='lisence_no'
                                    control={control} error={errors.lisence_no} />
                            </Grid2>
                            <Grid2 size={3}>
                                <ReuseSelect
                                    name='lisencecategory'
                                    label='वर्ग'
                                    required
                                    control={control}
                                    error={errors.lisencecategory}
                                    options={''}
                                />
                            </Grid2>
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 6, xl: 3 }}>
                            <ReuseInput label='नागरीकता नं.' name='driverctz_no' required control={control} error={errors.driverctz_no} />
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 6, xl: 3 }}>
                            <ReuseSelect
                                name='ctz_iss'
                                label='जारी जिल्ला'
                                required
                                control={control}
                                error={errors.ctz_iss}
                                options={''}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 6, xl: 3 }}>
                            <ReuseSelect
                                name='mentalhealth'
                                label='मानसिक/शारीरिक अवस्था'
                                required
                                control={control}
                                error={errors.mentalhealth}
                                options={''}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 6, xl: 3 }}>
                            <ReuseSelect
                                name='drivereye'
                                label='आँखा देख्‍ने/नदेख्‍ने'
                                required
                                control={control}
                                error={errors.drivereye}
                                options={''}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 6, xl: 3 }}>
                            <ReuseSelect
                                name='driverear'
                                label='कान सुन्ने/नसुन्ने'
                                required
                                control={control}
                                error={errors.driverear}
                                options={''}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 6, xl: 3 }}>
                            <ReuseSelect
                                name='drivermedicine'
                                label='औषधि सेवा गर्ने/नगर्ने'
                                required
                                control={control}
                                error={errors.drivermedicine}
                                options={''}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 6, xl: 3 }}>
                            <ReuseInput label='फोटो' type='file' name='driverphoto' control={control} error={errors.driverphoto} />
                        </Grid2>
                        <Grid2 size={4}>
                            <button type="submit">Submit</button>
                        </Grid2>
                    </Grid2>
                </form>
            </Box>
        </>
    )
}

export default DriverForm
