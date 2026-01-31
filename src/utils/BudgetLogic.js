export const calculateBudget = (income, needs, wants, savings) => {
    const total = parseFloat(income) || 0;

    // 50/30/20 Rule benchmarks
    const idealNeeds = total * 0.50;
    const idealWants = total * 0.30;
    const idealSavings = total * 0.20;

    return {
        income: total,
        needs: {
            actual: parseFloat(needs) || 0,
            ideal: idealNeeds,
            diff: (parseFloat(needs) || 0) - idealNeeds
        },
        wants: {
            actual: parseFloat(wants) || 0,
            ideal: idealWants,
            diff: (parseFloat(wants) || 0) - idealWants
        },
        savings: {
            actual: parseFloat(savings) || 0,
            ideal: idealSavings,
            diff: (parseFloat(savings) || 0) - idealSavings
        }
    };
};

export const calculateProjection = (monthlySavings, years = 10, annualRate = 0.07) => {
    const months = years * 12;
    const monthlyRate = annualRate / 12;
    const pmt = parseFloat(monthlySavings) || 0;

    // Future Value formula for a series of payments: FV = PMT * (((1 + r)^n - 1) / r)
    if (monthlyRate === 0) return pmt * months;

    const futureValue = pmt * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);

    return {
        years,
        totalRate: annualRate * 100,
        futureValue: Math.round(futureValue),
        totalContributed: pmt * months,
        interestEarned: Math.round(futureValue - (pmt * months))
    };
};
