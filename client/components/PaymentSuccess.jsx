import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router'

function PaymentSuccess() {
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const referenceId = query.get("bookingid");

  const redirectToCreate = () => {
    setTimeout(() => {
      navigate("/history");
    }, 15000);
  }

  useEffect(redirectToCreate, []);

  return (
    <div className='flex flex-col items-center justify-center h-[80vh]'>
        <div className='flex flex-col items-center justify-center border border-gray-100 shadow-md rounded-lg p-7  gap-5'>
            <h1 className='text-green-600 font-semibold text-2xl'>Payment Successful</h1>
            
            <div>
                <p>Tickets will be sent you on your email.</p>
                <p>You will be redirected to bookings soon...</p>
            </div>

            <div className='bg-gray-100 rounded w-full p-1 px-2'>
              <p className='text-center'>Booking Id: {referenceId}</p>
            </div>
        </div>
    </div>
  )
}

export default PaymentSuccess