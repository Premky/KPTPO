import React, { lazy, Suspense, useEffect, useState, useTransition } from 'react'
import { useTheme } from '@emotion/react'
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import NepaliDate from 'nepali-datetime'
import { Box, Grid2 } from '@mui/material';
import ReuseInput from '../../CustomComponents/ReuseInput'
import ReuseDateField from '../../CustomComponents/ReuseDateField'
import ReuseSelect from '../../CustomComponents/ReuseSelect'

const DriverForm = () => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('token');
    const npToday = new NepaliDate();
    const formattedDateNp = npToday.format('YYYY-MM-DD');
    const { register, handleSubmit, reset, setValue, watch, formState: { errors }, control } = useForm();

       //Variables 
    const [country, setCountry]=useState([]);
    const [province, setProvince]=useState([]);
    const [district, setDistrict ] = useState([]);
    const [cities, setCities] = useState([]);

    //Fetch APIs Provinces, District & Ctities 
    const fetchCountry=async()=>{
        try{
            const url=`${BASE_URL}/public/get_countries`;
            const response = await axios.get(url, {headers:{Authorization:`Bearer ${token}`},});
            const {Status, Result, Error} = response.data;
            
            if(Status){
                if(Result.length>0){
                    console.log("ldksaf")
                    setCountry(Result);
                }else{
                    console.log('Record for Province Not Found');
                }
            } else{
                console.log(Error||'Failed to fetch Countries.')
            }
        } catch(error){
            console.error('Error Fetching records:', error);
        }
    };

    const fetchProvince=async()=>{
        try{
            const url=`${BASE_URL}/common/get_provinces`;
            const response = await axios.get(url, {headers:{Authorization:`Bearer ${token}`},});
            const {Status, Result, Error} = response.data;

            if(Status){
                if(Result.length>0){
                    setProvince(Result);
                }else{
                    console.log('Record for Province Not Found');
                }
            } else{
                console.log(Error||'Failed to fetch provinces.')
            }
        } catch(error){
            console.error('Error Fetching records:', error);
        }
    };

    //test variables
    const onSubmit = (data) => {
        console.log('From Data:', data)
    }
//Use Effect:
    useEffect(()=>{
        fetchCountry();
        // fetchProvince();
    },[]);

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid2 container spacing={1}>
                        <Grid2 size={12}>
                            सवारी साधनको विरणः
                        </Grid2>
                        <Grid2 size={4}>  {/* Use 'xs' instead of 'size' */}
                            <ReuseSelect
                                name='province'
                                label='प्रदेश'
                                required
                                control={control}
                                error={errors.province}
                                options={''}
                            />
                        </Grid2>
                        <Grid2 size={4}>
                            <ReuseDateField
                                name='Date'
                                label='Dob'
                                required
                                control={control}
                                error={errors.Date} />
                        </Grid2>
                        <Grid2 size={4}>
                            <ReuseSelect
                                name='Country'
                                label='Country'
                                required
                                control={control}
                                error={errors.Country}
                                options={''}
                            />
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
