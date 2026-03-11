import logo from '../assets/images.jfif'
import { ArrowDown, CreditCard } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchDepartments, fetchLevels, fetchMinimumAmount } from '../api/references';
import { createPayment } from '../api/payment';

const PayScreen = () => {

    
    
    const [departments, setDepartments] = useState<{id: number, name: string}[]>([]);
    const [levels, setLevels] = useState<{id: number, name: string}[]>([]);
    const [name, setName] = useState("");
    const [matricule, setMatricule] = useState("");
     const [minimumAmount, setMinimumAmount] = useState<number>(0);
    const [amount, setAmount] = useState<number | null>(null);   
    const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
    const isInvalid = amount !== null && amount < minimumAmount;
   


    useEffect(() => {
        const fetchReferences = async () => {
            try {
                const [deptData, levelData, minAmount] = await Promise.all([fetchDepartments(), fetchLevels(), fetchMinimumAmount()]);
                setDepartments(deptData);
                setLevels(levelData);
                setMinimumAmount(minAmount);
            } catch (error) {
                console.error("Error fetching references:", error);
            }
        };

        fetchReferences();
    }, []);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!selectedDepartment || !selectedLevel){
            alert("Please select both department and level");
            return;
        }
        if(isInvalid){
            alert(`Amount must be at least ${minimumAmount}`);
            return;
        }   
        try {
            const paymentData = {
                name: name,
                matricule: matricule,
                amount: amount ?? minimumAmount,
                departmentId: selectedDepartment,
                levelId: selectedLevel
            }
            const response = await createPayment(paymentData);
            console.log("Payment created successfully:", response);
        } catch (error) {
            console.error("Error creating payment:", error);
        }
    }

     return (
        <main
        className="bg-[#E5E4E2] min-h-screen w-screen flex flex-col items-center font-primary">
        <section className='bg-primary w-screen h-140 pt-15 flex flex-col items-center'>
            <img src={logo} alt="uba logo" className='h-35 w-35' />
            <h1 className='text-white text-center mt-5 text-4xl font-bold'>HTTC PAY</h1>
            <p className='text-white text-center mt-5 text-2xl'>
                Secure and fast payments of student-dues
            </p>
            <button className='mx-auto py-4 px-6 mt-5 bg-white text-primary rounded-md font-bold cursor-pointer flex items-center'>
                Proceed to Pay <ArrowDown className='inline-block ml-2 h-5 w-5 animate-bounce' />
            </button>
            <p className='text-white text-center mt-5 text flex items-center'>
                <CreditCard className='inline-block mr-2 h-6 w-6 text-secondary' /> {minimumAmount}/Student
            </p>
        </section>
        <section className='my-9 w-[90%] bg-white rounded-lg p-6 shadow-md'>
            <p className='text-center text-2xl font-bold'>Payment Form</p>
            <hr className='my-4 mt-5 border-gray-400'></hr>
            <form className='flex flex-col gap-4'>
                <div className='flex flex-col gap-1'>
                    <label htmlFor="name" className='text-sm font-medium'>Full Name</label>
                    <input
                     type="text" id="name" 
                     className='border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary' 
                     placeholder='Enter your full name'
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                     required
                      />
                </div>
                <div className='flex flex-col gap-1'>
                    <label htmlFor="matricule" className='text-sm font-medium'>Matricule Number</label>
                    <input
                     type="text" id="matricule" 
                     className='border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary' 
                     placeholder='Enter your matricule number'
                     value={matricule}
                     onChange={(e) => setMatricule(e.target.value)}
                     required
                      />
                </div>
                <div className='flex flex-col gap-1'>
                    <label htmlFor="department" className='text-sm font-medium'>Department</label>
                    <select 
                    id="department" 
                    className='border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary'
                    onChange={(e) => setSelectedDepartment(Number(e.target.value))}
                    required>
                        <option value="" disabled>Select Department</option>
                        {departments.map(dept => (
                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                    </select>
                </div>
                <div className='flex flex-col gap-1'>
                    <label htmlFor="level" className='text-sm font-medium'>Level</label>
                    <select 
                     id="level" 
                     className='border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary'
                     onChange={(e) => setSelectedLevel(Number(e.target.value))}
                     required>
                        <option value="" disabled>Select Level</option>
                        {levels.map(level => (
                            <option key={level.id} value={level.id}>{level.name}</option>
                        ))}
                    </select>
                </div>
                <div className='flex flex-col gap-1'>
                    <label htmlFor="amount" className='text-sm font-medium'>Amount</label>
                    <input 
                    type="number" 
                    id="amount" 
                    placeholder='Enter amount to pay'
                    value={amount ?? ''}
                    onChange={(e) => setAmount(e.target.value === '' ? null : Number(e.target.value))}
                  className={`[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none border rounded-md p-2 focus:outline-none focus:ring-2 ${
                            isInvalid 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-primary'
                            }`}
                      />
                </div>
                <button 
                type="submit" 
                className='py-3 px-6 bg-primary text-white rounded-md font-bold cursor-pointer mt-4'
                onClick={handleSubmit}>
                    Pay Now</button>
            </form>
        </section>
        </main>
     )
}

export default PayScreen