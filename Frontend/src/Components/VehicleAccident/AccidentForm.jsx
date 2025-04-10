import React, { useEffect, useState } from 'react'
import { Box, Divider, Grid2 } from '@mui/material'

import ReuseDateField from '../ReuseableComponents/ReuseDateField'

import { useForm, Controller } from 'react-hook-form'
import ReuseState from '../ReuseableComponents/ReuseState'
import ReuseDistrict from '../ReuseableComponents/ReuseDistrict'
import ReuseMunicipality from '../ReuseableComponents/ReuseMunicipality'
import ReuseInput from '../ReuseableComponents/ReuseInput'
import ReuseVehicles from '../ReuseableComponents/ReuseVehciles'
import ReuseSelect from '../ReuseableComponents/ReuseSelect'
const AccidentForm = () => {
    const { register, handleSubmit, reset, setValue, watch, formState: { errors }, control } = useForm();
    const selectedState = watch("state"); // Get the selected state value
    const selectedDistrict = watch("district"); // Get the selected district value
    return (
        <>
            <Box sx={{ flexGrow: 1, margin: 2 }}>
                <Grid2>
                    <h4>दैनिक सवारी दुर्घटना विवरण</h4>
                </Grid2>
                <Grid2 container spacing={1}>
                    <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                        <ReuseDateField
                            name='date'
                            label='दुर्घटना मिति'
                            placeholder={'YYYY-MM-DD'}
                            required={true}
                            control={control}
                            error={errors.date}
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
                            selectedState={selectedState}
                        />
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 6, md: 3 }}> {/* Use 'xs' instead of 'size' */}
                        <ReuseMunicipality
                            required
                            name='municipality'
                            label='गा.पा./न.पा./उ.न.पा./म.न.पा.'
                            control={control}
                            error={errors.municipality}
                            options={''}
                            selectedDistrict={selectedDistrict}
                        />
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                        <ReuseInput type='number' label='वडा नं.' name='driverward' control={control} error={errors.driverward} />
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                        <ReuseInput type='text' label='सडकको नाम' name='road_name' control={control} error={errors.road_name} />
                    </Grid2>
                    <Grid2>
                        <ReuseInput type='text' label='दुर्घटनाको स्थान' name='accidentlocation' control={control} error={errors.accidentlocation} />
                    </Grid2>
                    <Grid2>
                        <ReuseInput type='time' label='दुर्घटनाको समय' name='accidenttime' control={control} error={errors.accidenttime} />
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                        <ReuseVehicles name='vehicle_name' label='सवारीको नाम' required control={control} error={errors.vehicle_name} options={''} />
                    </Grid2>
                </Grid2>
                <Grid2 container spacing={1} marginTop={2}>
                    मानविय क्षतीको विवरणः
                </Grid2>
                <Grid2 container spacing={1} marginTop={2}>
                    <Grid2 size={{ xs: 12, sm: 4, md: 4 }}>
                        <ReuseInput type='number' label='पुरुष मृतक संख्या' name='death_male' control={control} error={errors.death_male} />
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 4, md: 4 }}>
                        <ReuseInput type='number' label='महिला मृतक संख्या' name='death_female' control={control} error={errors.death_female} />
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 4, md: 4 }}>
                        <ReuseInput type='number' label='अन्य मृतक संख्या' name='death_other' control={control} error={errors.death_other} />
                    </Grid2>

                    <Grid2 size={{ xs: 12, sm: 4, md: 4 }}>
                        <ReuseInput type='number' label='पुरुष गम्भिर घाइते संख्या' name='gambhir_male' control={control} error={errors.gambhir_male} />
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 4, md: 4 }}>
                        <ReuseInput type='number' label='महिला गम्भिर घाइते संख्या' name='gambhir_female' control={control} error={errors.gambhir_female} />
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 4, md: 4 }}>
                        <ReuseInput type='number' label='अन्य गम्भिर घाइते संख्या' name='gambhir_other' control={control} error={errors.gambhir_other} />
                    </Grid2>

                    <Grid2 size={{ xs: 12, sm: 4, md: 4 }}>
                        <ReuseInput type='number' label='पुरुष साधारण घाइते संख्या' name='general_male' control={control} error={errors.general_male} />
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 4, md: 4 }}>
                        <ReuseInput type='number' label='महिला साधारण घाइते संख्या' name='general_female' control={control} error={errors.general_female} />
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 4, md: 4 }}>
                        <ReuseInput type='number' label='अन्य साधारण घाइते संख्या' name='general_other' control={control} error={errors.general_other} />
                    </Grid2>

                    <Grid2 container spacing={1} marginTop={2}>
                        सवारी दुर्घटनाको विवरणः
                    </Grid2>
                    <Grid2 container spacing={1} marginTop={2}>
                        
                    </Grid2>
                </Grid2>
            </Box>
        </>
    )
}

export default AccidentForm
