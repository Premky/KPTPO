import React, { lazy, Suspense, useEffect, useState, useTransition } from 'react'
import axios from 'axios'
import { useForm, Controller } from 'react-hook-form'
import { Box, Button, Divider, Grid2 } from '@mui/material';
import Swal from 'sweetalert2'
import NepaliDate from 'nepali-datetime'
import sha256 from "crypto-js/sha256";

import ReuseInput from '../../ReuseableComponents/ReuseInput';
import ReuseOffice from '../../ReuseableComponents/ReuseOffice';
import ReuseSelect from '../../ReuseableComponents/ReuseSelect';
import UserTable from './UserTable';

const CreateUser = () => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('token');
    const npToday = new NepaliDate();
    const formattedDateNp = npToday.format('YYYY-MM-DD');

    //Required Variables 
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);

    const { register, handleSubmit, reset, setValue, watch, formState: { errors }, control } = useForm();
    const defaultOptions = [
        { code: '', label: 'छ', phone: '', value: '1' },
        { code: '', label: 'छैन', phone: '', value: '0' }
    ];
    const [usertypes, setUsertypes] = useState([]);

    const fetchUsertype = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/public/get_usertypes`);            
            const { Status, Result, Error } = response.data;
            if (Status) {
                const formatted = Result.map((opt) => ({
                    label: opt.name_en, // Use Nepali name
                    value: opt.id, // Use ID as value
                }));
                setUsertypes(formatted);
            } else {
                console.log(Error);
            }
        } catch (error) {
            console.error("Error fetching user types:", error);
        }
    };
    

    const onFormSubmit = async (data) => {
        setLoading(true);
        console.log(data)
        try {
            if (!data.password || !data.repassword || data.password !== data.repassword) {
                Swal.fire({
                    icon: "error",
                    title: "ओहो...",
                    text: "पासवर्ड मिलेन",
                });
                return;
            }
            const hashedPassword = sha256(data.password).toString();
            const hashedrePassword = sha256(data.repassword).toString();
            const userData = {
                name_np: data.name_np, usertype:data.usertype,  username: data.username, password: hashedPassword,repassword:hashedrePassword,
                office: data.office, branch:data.branch, is_active: data.is_active
            };
            const url = editing ? `${BASE_URL}/auth/update_user` : `${BASE_URL}/auth/create_user`;
            const method = editing ? 'PUT' : 'POST';
            const response = await axios({
                method, url, data: userData,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                withCredentials: true
            })
            const { Status, Result, Error } = response.data;
            if (Status) {
                Swal.fire({
                    title: `User ${editing?'updated':'created'} successfully!`,
                    icon: "success",
                    draggable: true
                  });
                  reset();
                  setEditing(false);

            }
        } catch (err) {
            console.error(err);
            Swal.fire({
                title:err.response.data.message,
                icon:'error',
                draggable:true
            });
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        fetchUsertype();
    },[])

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <form onSubmit={handleSubmit(onFormSubmit)}>
                    <Grid2 container spacing={1}>
                        <Grid2 size={{ xs: 12 }}>प्रयोगकर्ता </Grid2>
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
                            <ReuseInput
                                name='username'
                                label='Username'
                                control={control}
                                error={errors.username}
                                required
                            />
                        </Grid2>
                        <Grid2 size={{xs:12, sm:4, md:3}}>
                            <ReuseSelect
                                name='usertype'
                                label='प्रयोगकर्ताको प्रकार'
                                control={control}
                                error={errors.usertype}
                                required
                                options={usertypes}
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
                            <ReuseSelect
                                name='branch'
                                label='शाखा'
                                control={control}
                                error={errors.office}
                                options={usertypes}
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
                                options={defaultOptions}
                                required
                            />
                        </Grid2>
                        <Grid2 container size={{ xs: 12 }}>
                            <Grid2 size={{ xs: 3 }}>
                                <Button variant='contained' type='submit'>Save</Button>
                            </Grid2>
                            <Grid2 size={{ xs: 3 }}>
                                <Button variant='contained' color='error'>Clear</Button>
                            </Grid2>
                        </Grid2>
                    </Grid2>
                </form>
            </Box>
            <Box>
                <UserTable/>
            </Box>
        </>
    )
}

export default CreateUser