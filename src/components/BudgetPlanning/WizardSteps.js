import React from 'react';
import {
    Box, Typography, TextField, MenuItem, Grid,
    FormControl, FormLabel, RadioGroup, FormControlLabel, Radio,
    InputAdornment, Paper
} from '@mui/material';
import { motion } from 'framer-motion';

// Animation variants
const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
};

// --- Step 1: Personal Profile ---
export const PersonalStep = ({ data, updateData }) => (
    <Box component={motion.div} variants={itemVariants} initial="hidden" animate="visible">
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1e293b' }}>
            Personal Profile 👤
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Tell us a bit about yourself so we can tailor the advice.
        </Typography>

        <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
                <TextField fullWidth label="Full Name" value={data.name} onChange={(e) => updateData('name', e.target.value)} />
            </Grid>
            <Grid item xs={6} md={3}>
                <TextField fullWidth label="Age" type="number" value={data.age} onChange={(e) => updateData('age', e.target.value)} />
            </Grid>
            <Grid item xs={6} md={3}>
                <TextField select fullWidth label="Gender" value={data.gender} onChange={(e) => updateData('gender', e.target.value)}>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField select fullWidth label="Marital Status" value={data.maritalStatus} onChange={(e) => updateData('maritalStatus', e.target.value)}>
                    <MenuItem value="Single">Single</MenuItem>
                    <MenuItem value="Married">Married</MenuItem>
                </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField select fullWidth label="User Type" value={data.userType} onChange={(e) => updateData('userType', e.target.value)}>
                    <MenuItem value="Student">Student</MenuItem>
                    <MenuItem value="Professional">Professional</MenuItem>
                    <MenuItem value="Business">Business Owner</MenuItem>
                    <MenuItem value="Homemaker">Homemaker</MenuItem>
                </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
                <TextField fullWidth label="City" value={data.city} onChange={(e) => updateData('city', e.target.value)} />
            </Grid>
            <Grid item xs={12} md={4}>
                <TextField fullWidth label="State" value={data.state} onChange={(e) => updateData('state', e.target.value)} />
            </Grid>
            <Grid item xs={12} md={4}>
                <TextField fullWidth label="Country" value={data.country} onChange={(e) => updateData('country', e.target.value)} />
            </Grid>
            <Grid item xs={12}>
                <TextField select fullWidth label="Preferred Language for Advice" value={data.language} onChange={(e) => updateData('language', e.target.value)}>
                    <MenuItem value="English">English</MenuItem>
                    <MenuItem value="Hindi">Hindi</MenuItem>
                    <MenuItem value="Hinglish">Hinglish</MenuItem>
                </TextField>
            </Grid>
        </Grid>
    </Box>
);

// --- Step 2: Income & Living ---
export const IncomeLivingStep = ({ data, updateData }) => (
    <Box component={motion.div} variants={itemVariants} initial="hidden" animate="visible">
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1e293b' }}>
            Income & Living 🏠
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Understand your cash flow and basic needs.
        </Typography>

        <Grid container spacing={3}>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Monthly Income"
                    type="number"
                    value={data.income}
                    onChange={(e) => updateData('income', Number(e.target.value))}
                    InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                />
            </Grid>

            <Grid item xs={12}>
                <FormControl component="fieldset">
                    <FormLabel component="legend">Living Situation</FormLabel>
                    <RadioGroup row value={data.living} onChange={(e) => updateData('living', e.target.value)}>
                        <FormControlLabel value="Hostel" control={<Radio />} label="Hostel" />
                        <FormControlLabel value="Rent" control={<Radio />} label="Rented Flat" />
                        <FormControlLabel value="Family" control={<Radio />} label="With Family (Owned)" />
                    </RadioGroup>
                </FormControl>
            </Grid>

            {(data.living === 'Rent' || data.living === 'Hostel') && (
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label={data.living === 'Hostel' ? "Hostel Fees" : "Monthly Rent"}
                        type="number"
                        value={data.rentAmount}
                        onChange={(e) => updateData('rentAmount', Number(e.target.value))}
                        InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                    />
                </Grid>
            )}

            <Grid item xs={6}>
                <TextField
                    fullWidth
                    label="Utilities (Electricity/Water/Mobile)"
                    type="number"
                    value={data.utilities}
                    onChange={(e) => updateData('utilities', Number(e.target.value))}
                    InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    fullWidth
                    label="Transportation Costs"
                    type="number"
                    value={data.transportation}
                    onChange={(e) => updateData('transportation', Number(e.target.value))}
                    InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                />
            </Grid>
        </Grid>
    </Box>
);

// --- Step 3: Financial Health ---
export const FinancialHealthStep = ({ data, updateData }) => (
    <Box component={motion.div} variants={itemVariants} initial="hidden" animate="visible">
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1e293b' }}>
            Financial Health 🏥
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Let's look at liabilities and safety nets.
        </Typography>

        <Grid container spacing={3}>
            <Grid item xs={12}>
                <FormControl component="fieldset">
                    <FormLabel component="legend">Do you have any Loans/Debt?</FormLabel>
                    <RadioGroup row value={data.hasDebt} onChange={(e) => updateData('hasDebt', e.target.value)}>
                        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                        <FormControlLabel value="no" control={<Radio />} label="No" />
                    </RadioGroup>
                </FormControl>
            </Grid>

            {data.hasDebt === 'yes' && (
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Monthly EMI Amount"
                        type="number"
                        value={data.loanEMI}
                        onChange={(e) => updateData('loanEMI', Number(e.target.value))}
                        InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                    />
                </Grid>
            )}

            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Current Emergency Fund / Savings"
                    type="number"
                    value={data.emergencyFund}
                    onChange={(e) => updateData('emergencyFund', Number(e.target.value))}
                    InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                    helperText="How much cash do you have accessible right now?"
                />
            </Grid>

            <Grid item xs={12}>
                <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Describe your Spending Habits"
                    placeholder="e.g., I spend too much on food, I am frugal, Impulse buyer..."
                    value={data.spendingHabits}
                    onChange={(e) => updateData('spendingHabits', e.target.value)}
                />
            </Grid>
        </Grid>
    </Box>
);

// --- Step 4: Goals ---
export const GoalsStep = ({ data, updateData }) => (
    <Box component={motion.div} variants={itemVariants} initial="hidden" animate="visible">
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1e293b' }}>
            Future Goals 🚀
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            What are we saving for?
        </Typography>

        <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
                <TextField
                    fullWidth
                    label="Target Saving Amount"
                    type="number"
                    value={data.savingGoal}
                    onChange={(e) => updateData('savingGoal', Number(e.target.value))}
                    InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField select fullWidth label="Goal Frequency" value={data.goalType} onChange={(e) => updateData('goalType', e.target.value)}>
                    <MenuItem value="Monthly">Monthly</MenuItem>
                    <MenuItem value="Yearly">Yearly</MenuItem>
                    <MenuItem value="Total Target">Total Target</MenuItem>
                </TextField>
            </Grid>

            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Main Financial Goal"
                    placeholder="e.g., Buy a Laptop, Travel to Goa, Pay off Loan, Retire at 40"
                    value={data.goal}
                    onChange={(e) => updateData('goal', e.target.value)}
                />
            </Grid>

            <Grid item xs={12}>
                <Paper sx={{ p: 2, bgcolor: '#f0f9ff', border: '1px dashed #bae6fd' }}>
                    <Typography variant="caption" color="primary">
                        ✨ Based on all this data, our AI will generate a plan covering:
                        <br />• Budget Allocation (50/30/20)
                        <br />• Risk Management (Emergency Fund)
                        <br />• Investment Strategy
                        <br />• Debt Repayment Plan
                    </Typography>
                </Paper>
            </Grid>
        </Grid>
    </Box>
);
