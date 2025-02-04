import React, { lazy, Suspense, useEffect, useState, useTransition } from 'react'
import { useTheme } from '@emotion/react'
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import NepaliDate from 'nepali-datetime'
import { Box, Button, Divider, Grid2 } from '@mui/material';
import ReuseInput from '../../ReuseableComponents/ReuseInput'
import ReuseSelect from '../../ReuseableComponents/ReuseSelect'
import ReuseDateField from '../../ReuseableComponents/ReuseDateField'
import ReuseCountry from '../../ReuseableComponents/ReuseCountry'
import ReuseState from '../../ReuseableComponents/ReuseState'
import ReuseDistrict from '../../ReuseableComponents/ReuseDistrict'
import ReuseMunicipality from '../../ReuseableComponents/ReuseMunicipality'
import ReuseVehicles from '../../ReuseableComponents/ReuseVehciles'
import ReuseLisenceCategory from '../../ReuseableComponents/ReuseLisenceCategory'


const DriverForm = () => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('token');
    const npToday = new NepaliDate();
    const formattedDateNp = npToday.format('YYYY-MM-DD');
    const { register, handleSubmit, reset, setValue, watch, formState: { errors }, control } = useForm();

    //Required Variables 
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);

    //Variables
    const [currentDriver, setCurrentDriver] = useState(null);

    const mentalOptions = [{ label: 'ठिक', value: '1' }, { label: 'बेठिक', value: '0' }];
    const eyeOptions = [{ label: 'देख्‍ने', value: '1' }, { label: 'नदेख्‍ने', value: '0' }];
    const earOptions = [{ label: 'सुन्ने', value: '1' }, { label: 'नसुन्ने', value: '0' }];
    const medicineOptions = [{ label: 'गर्ने', value: '1' }, { label: 'नगर्ने', value: '0' }];

    //test variables
    const onFormSubmit = async (data) => {
        setLoading(true);
        try {
            // const formData = new FormData();
            // formData.append('driverphoto', data.photo[0]);
            // Object.keys(data).forEach(key => formData.append(key, data[key]));

            // if (data.file && data.file.length > 0) {
            //     formData.append('file', data.file[0]);
            // }
            const url = editing ? `${BASE_URL}/driver/update_driver/${currentDriver.id}` : `${BASE_URL}/driver/add_driver`;
            const method = editing ? 'PUT' : 'POST';
            const response = await axios({
                method, url, data: data,
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            });
            const { Status, Result, Error } = response.data;
            if (Status) {
                alert(`Record ${editing ? 'updated' : 'added'} successfylly!`);
                reset();
                setEditing(false);

            }
        } catch (err) {
            console.error(err);
            alert('Failed to Save',err)
        } finally {
            setLoading(false);
        }
        console.log('From Data:', data)
    };
    //Use Effect:
    // useEffect(() => {


    // }, []);

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <form onSubmit={handleSubmit(onFormSubmit)}>
                    <Grid2 container spacing={1}>
                        <Grid2 size={12}>
                            सवारी साधनको विरणः
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}> {/* Use 'xs' instead of 'size' */}
                            <ReuseDistrict
                                name='vehicledistrict'
                                label='जिल्ला'
                                required
                                control={control}
                                error={errors.district}
                                options={''}
                            />
                        </Grid2>

                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                            <ReuseVehicles
                                name='vehicle_name'
                                label='सवारी साधनको नाम'
                                required
                                control={control}
                                error={errors.vehicle_name}
                                options={''}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                            <ReuseInput
                                name='vehicle_no'
                                label='सवारी साधनको नं.'
                                required
                                control={control}
                                error={errors.vehicle_no}
                            />
                        </Grid2>
                        <Grid2 container size={{ xs: 12, sm: 6, md: 3 }}>

                            <Grid2 size={{ xs: 6, sm: 6 }}>
                                <ReuseInput
                                    name='start_route'
                                    placeholder='देखी'
                                    control={control}
                                    error={errors.start_route}
                                    label='सवारी चल्ने रुट(देखी)'
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 6, sm: 6 }}>
                                <ReuseInput
                                    name='end_route'
                                    placeholder='सम्म'
                                    control={control}
                                    error={errors.end_route}
                                    label='(सम्म)'
                                />
                            </Grid2>
                        </Grid2>

                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                            <ReuseInput label='चालकको नाम' name='drivername' control={control} error={errors.drivername} />
                        </Grid2>
                        <Grid2 container size={{ xs: 6, sm: 6, md: 3 }}>
                            <Grid2 size={9}>
                                <ReuseDateField
                                    name='driverdob'
                                    label='जन्म मिति'
                                    placeholder='YYYY-MM-DD'
                                    control={control}
                                    required
                                    error={errors.driverdob}
                                />
                            </Grid2>
                            <Grid2 size={3}>
                                <ReuseInput readonly
                                    label='उमेर' name='driverage' control={control} error={errors.driverage} />
                            </Grid2>
                        </Grid2>
                        <Grid2 size={{ xs: 6, sm: 6, md: 3 }}>
                            <ReuseCountry
                                name='country'
                                label='देश'
                                required
                                control={control}
                                error={errors.country}

                            />
                        </Grid2>
                        <Grid2 size={{ xs: 6, sm: 6, md: 3 }}>
                            <ReuseState
                                name='state'
                                label='प्रदेश'
                                required
                                control={control}
                                error={errors.state}

                            />
                        </Grid2>
                        <Grid2 size={{ xs: 6, sm: 6, md: 3 }}>
                            <ReuseDistrict
                                name='district'
                                label='जिल्ला'
                                required
                                control={control}
                                error={errors.district}

                            />
                        </Grid2>
                        <Grid2 size={{ xs: 6, sm: 6, md: 3 }}>
                            <ReuseMunicipality
                                name='municipality'
                                label='गा.पा./न.पा./उ.न.पा./म.न.पा'

                                control={control}
                                error={errors.municipality}

                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                            <ReuseInput type='number' label='वडा नं.' name='driverward' control={control} error={errors.driverward} />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                            <ReuseInput label='बुबाको नाम' name='driverfather' control={control} error={errors.driverfather} />
                        </Grid2>
                        <Grid2 container size={{ xs: 12, sm: 6, md: 3 }}>
                            <Grid2 size={8}>
                                <ReuseInput label='सवारी चालक प्र.प्र.नं.' name='lisence_no'
                                    control={control} error={errors.lisence_no} />
                            </Grid2>
                            <Grid2 size={4}>
                                <ReuseLisenceCategory
                                    name='lisencecategory'
                                    label='वर्ग'
                                    required
                                    control={control}
                                    error={errors.lisencecategory}
                                    options={''}
                                />
                            </Grid2>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                            <ReuseInput label='नागरीकता नं.' name='driverctz_no' required control={control} error={errors.driverctz_no} />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                            <ReuseDistrict
                                name='ctz_iss'
                                label='जारी जिल्ला'
                                required
                                control={control}
                                error={errors.ctz_iss}
                                options={''}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                            <ReuseSelect
                                name='mentalhealth'
                                label='मानसिक/शारीरिक अवस्था'
                                required
                                control={control}
                                error={errors.mentalhealth}
                                options={mentalOptions}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                            <ReuseSelect
                                name='drivereye'
                                label='आँखा देख्‍ने/नदेख्‍ने'
                                required
                                control={control}
                                error={errors.drivereye}
                                options={eyeOptions}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                            <ReuseSelect
                                name='driverear'
                                label='कान सुन्ने/नसुन्ने'
                                required
                                control={control}
                                error={errors.driverear}
                                options={earOptions}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                            <ReuseSelect
                                name='drivermedicine'
                                label='औषधि सेवा गर्ने/नगर्ने'
                                required
                                control={control}
                                error={errors.drivermedicine}
                                options={medicineOptions}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                            <ReuseInput label='फोटो' type='file' name='driverphoto' control={control} error={errors.driverphoto} />
                        </Grid2>

                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                            <ReuseInput
                                name='remarks'
                                label='कैफियत'
                                control={control}
                                error={errors.remarks}
                            />
                        </Grid2>
                        <Grid2 size={12}>
                            <Grid2 size={4}>
                                <Button size="medium" variant="contained" type="submit">
                                    {loading ? 'Saving...' : editing ? 'Update' : 'Add'}
                                </Button>
                            </Grid2>
                        </Grid2>
                    </Grid2>
                </form>
            </Box>
        </>
    )
}

export default DriverForm
