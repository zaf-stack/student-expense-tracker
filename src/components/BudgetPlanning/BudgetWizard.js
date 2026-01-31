import React, { useState } from 'react';
import { Box, Button, Stepper, Step, StepLabel, Typography, Paper } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { PersonalStep, IncomeLivingStep, FinancialHealthStep, GoalsStep } from './WizardSteps';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAuth } from '../../context/AuthContext';

const steps = ['Profile', 'Income & Living', 'Financial Health', 'Goals'];

const BudgetWizard = ({ onSubmit }) => {
    const { user } = useAuth();
    const [activeStep, setActiveStep] = useState(0);

    // Comprehensive State
    const [budgetData, setBudgetData] = useState({
        // Step 1: Personal
        name: user?.name || '',
        age: '',
        gender: '',
        maritalStatus: '',
        userType: 'Student', // Default
        city: '',
        state: '',
        country: 'India',
        language: 'English',

        // Step 2: Income
        income: 0,
        living: 'Hostel',
        rentAmount: 0,
        utilities: 0,
        transportation: 0,

        // Step 3: Health
        hasDebt: 'no',
        loanEMI: 0,
        emergencyFund: 0,
        spendingHabits: '',

        // Step 4: Goals
        savingGoal: 0,
        goalType: 'Monthly',
        goal: ''
    });

    const updateData = (key, value) => {
        setBudgetData(prev => ({ ...prev, [key]: value }));
    };

    const handleNext = () => {
        if (activeStep === steps.length - 1) {
            onSubmit(budgetData);
        } else {
            setActiveStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        setActiveStep(prev => prev - 1);
    };

    // Basic Validation
    const isStepValid = () => {
        if (activeStep === 0) return budgetData.name && budgetData.age;
        if (activeStep === 1) return budgetData.income > 0;
        return true;
    };

    return (
        <Paper
            elevation={3}
            sx={{
                p: { xs: 2, md: 4 },
                maxWidth: 800,
                mx: 'auto',
                borderRadius: 4,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
        >
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4, display: { xs: 'none', md: 'flex' } }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            {/* Mobile Stepper Text */}
            <Typography sx={{ display: { xs: 'block', md: 'none' }, textAlign: 'center', mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                Step {activeStep + 1} of {steps.length}: {steps[activeStep]}
            </Typography>

            <Box sx={{ minHeight: 300, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={activeStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeStep === 0 && <PersonalStep data={budgetData} updateData={updateData} />}
                        {activeStep === 1 && <IncomeLivingStep data={budgetData} updateData={updateData} />}
                        {activeStep === 2 && <FinancialHealthStep data={budgetData} updateData={updateData} />}
                        {activeStep === 3 && <GoalsStep data={budgetData} updateData={updateData} />}
                    </motion.div>
                </AnimatePresence>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 5 }}>
                    <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        startIcon={<ArrowBackIcon />}
                        sx={{ visibility: activeStep === 0 ? 'hidden' : 'visible' }}
                    >
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleNext}
                        disabled={!isStepValid()}
                        endIcon={activeStep === steps.length - 1 ? <CheckCircleIcon /> : <ArrowForwardIcon />}
                        sx={{
                            px: 4,
                            py: 1,
                            borderRadius: 2,
                            bgcolor: 'primary.main',
                            boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.4)'
                        }}
                    >
                        {activeStep === steps.length - 1 ? 'Generate Plan' : 'Next'}
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};

export default BudgetWizard;
