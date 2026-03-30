
import { ArrowDown, CreditCard } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import {  stripePromise } from '../lib/stripe';
import { fetchDepartments, fetchLevels, fetchMinimumAmount } from '../api/references';
import { createPayment } from '../api/payment';
import { CheckoutForm } from '../components/CheckoutForm';

const PayScreen = () => {
    
    // Form state
    const [departments, setDepartments] = useState<{id: number, name: string}[]>([]);
    const [levels, setLevels] = useState<{id: number, name: string}[]>([]);
    const [name, setName] = useState("");
    const [matricule, setMatricule] = useState("");
    const [minimumAmount, setMinimumAmount] = useState<number>(0);
    const [amount, setAmount] = useState<number | null>(null);
    const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
    
    
    const [clientSecret, setClientSecret] = useState<string>("");
    const [showPayment, setShowPayment] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const isInvalid = amount !== null && amount < minimumAmount;

  
    useEffect(() => {
        const fetchReferences = async () => {
            try {
                const [deptData, levelData, minAmount] = await Promise.all([
                    fetchDepartments(), 
                    fetchLevels(), 
                    fetchMinimumAmount()
                ]);
                setDepartments(deptData);
                setLevels(levelData);
                setMinimumAmount(minAmount);
            } catch (error) {
                console.error("Error fetching references:", error);
                alert("Failed to load form data");
            }
        };
        fetchReferences();
    }, []);

   
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        
        if (!selectedDepartment || !selectedLevel) {
            alert("Please select both department and level");
            return;
        }
        if (isInvalid) {
            alert(`Amount must be at least ${minimumAmount} XAF`);
            return;
        }
        if (!name || !matricule) {
            alert("Please fill in all required fields");
            return;
        }

        setIsLoading(true);

        try {
            const paymentData = {
                name: name,
                matricule: matricule,
                amount: amount ?? minimumAmount,
                departmentId: selectedDepartment,
                levelId: selectedLevel
            };
            
          
            const response = await createPayment(paymentData);
            
            
            setClientSecret(response.data.clientSecret);
            setShowPayment(true);
            
        } catch (error) {
            console.error("Error creating payment:", error);
            alert("Failed to initialize payment. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    
    const handlePaymentSuccess = () => {
        alert("✅ Payment successful! Your payment has been processed.");
        
        
        setShowPayment(false);
        setClientSecret("");
        setName("");
        setMatricule("");
        setAmount(null);
        setSelectedDepartment(null);
        setSelectedLevel(null);
        
      
    };

    const handlePaymentError = (error: string) => {
        alert(`❌ Payment failed: ${error}`);
        setShowPayment(false);
        setClientSecret("");
    };

    return (
        <main className="bg-[#E5E4E2] min-h-screen w-screen flex flex-col items-center font-primary">
            
            <section className='bg-primary w-screen h-140 pt-15 flex flex-col items-center'>
              
                <h1 className='text-white text-center mt-5 text-4xl font-bold'>STUDENT PAY</h1>
                <p className='text-white text-center mt-5 text-2xl'>
                    Secure and fast payments of student-contributions
                </p>
                <button className='mx-auto py-4 px-6 mt-5 bg-white text-primary rounded-md font-bold cursor-pointer flex items-center'>
                    Proceed to Pay <ArrowDown className='inline-block ml-2 h-5 w-5 animate-bounce' />
                </button>
                <p className='text-white text-center mt-5 flex items-center'>
                    <CreditCard className='inline-block mr-2 h-6 w-6 text-secondary' /> {minimumAmount} XAF/Student
                </p>
            </section>

            
            <section className='my-9 w-[90%] max-w-2xl bg-white rounded-lg p-6 shadow-md'>
                <p className='text-center text-2xl font-bold'>
                    {showPayment ? 'Complete Payment' : 'Payment Form'}
                </p>
                <hr className='my-4 mt-5 border-gray-400' />

                {!showPayment ? (
                    
                    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="name" className='text-sm font-medium'>Full Name *</label>
                            <input
                                type="text"
                                id="name"
                                className='border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary'
                                placeholder='Enter your full name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <label htmlFor="matricule" className='text-sm font-medium'>Matricule Number *</label>
                            <input
                                type="text"
                                id="matricule"
                                className='border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary'
                                placeholder='Enter your matricule number'
                                value={matricule}
                                onChange={(e) => setMatricule(e.target.value)}
                                required
                            />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <label htmlFor="department" className='text-sm font-medium'>Department *</label>
                            <select
                                id="department"
                                className='border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary'
                                value={selectedDepartment ?? ""}
                                onChange={(e) => setSelectedDepartment(Number(e.target.value))}
                                required
                            >
                                <option value="">Select Department</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className='flex flex-col gap-1'>
                            <label htmlFor="level" className='text-sm font-medium'>Level *</label>
                            <select
                                id="level"
                                className='border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary'
                                value={selectedLevel ?? ""}
                                onChange={(e) => setSelectedLevel(Number(e.target.value))}
                                required
                            >
                                <option value="">Select Level</option>
                                {levels.map(level => (
                                    <option key={level.id} value={level.id}>{level.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className='flex flex-col gap-1'>
                            <label htmlFor="amount" className='text-sm font-medium'>
                                Amount (Minimum: {minimumAmount} XAF)
                            </label>
                            <input
                                type="number"
                                id="amount"
                                placeholder={`Enter amount (min ${minimumAmount})`}
                                value={amount ?? ''}
                                onChange={(e) => setAmount(e.target.value === '' ? null : Number(e.target.value))}
                                className={`[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none border rounded-md p-2 focus:outline-none focus:ring-2 ${
                                    isInvalid
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-gray-300 focus:ring-primary'
                                }`}
                            />
                            {isInvalid && (
                                <p className="text-red-500 text-sm mt-1">
                                    Amount must be at least {minimumAmount} XAF
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className='py-3 px-6 bg-primary text-white rounded-md font-bold cursor-pointer mt-4 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            {isLoading ? 'Loading...' : 'Continue to Payment'}
                        </button>
                    </form>
                ) : (
                    
                    <div>
                        <button
                            onClick={() => {
                                setShowPayment(false);
                                setClientSecret("");
                            }}
                            className="mb-6 text-primary hover:underline font-medium"
                        >
                            ← Back to form
                        </button>
                        
                        {clientSecret && (
                            <Elements 
                                stripe={stripePromise} 
                                options={{ 
                                    clientSecret,
                                    appearance: {
                                        theme: 'stripe',
                                        variables: {
                                            colorPrimary: '#000000',
                                        }
                                    }
                                }}
                            >
                                <CheckoutForm
                                    onSuccess={handlePaymentSuccess}
                                    onError={handlePaymentError}
                                    amount={amount ?? minimumAmount}
                                />
                            </Elements>
                        )}
                    </div>
                )}
            </section>
        </main>
    );
};

export default PayScreen;