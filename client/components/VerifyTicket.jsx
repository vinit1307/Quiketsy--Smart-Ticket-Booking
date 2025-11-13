import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Scanner } from "@yudiel/react-qr-scanner";
import { ChevronLeft } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

function VerifyTicket() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(true);
  const [ticketDetails, setTicketDetails] = useState({name: "Yashraj", ticketId: "abc123xyz"});

  async function handleScan(result) {
    const ticketHash = result[0]?.rawValue;
    // console.log(result[0]?.rawValue);
    setScanning(false);

    const response = await axios.post("http://localhost:9192/api/booking/verify-ticket", {
      eventId: id,
      ticketHash
    },{
      headers : {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    });

    // console.log(response);

    if(response.data.status === "VERIFIED_OK"){
      setTicketDetails({name: response.data.data.verifiedAt , ticketId: response.data.data.bookingId})
      toast.success(response.data.message);
    } else {
      setScanning(true);
      toast.error(response.data.message)
    }
  }

  return (
    <div className="px-[10vw] py-[5vh]">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ChevronLeft className="w-5 h-5 mr-1" /> Back
        </button>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Verify Tickets</h1>
            {scanning ? (
              <p className="text-gray-600 mt-2">
                Place the QR code inside red box to verify
              </p>
            ) : (
              <></>
            )}
          </div>
          {scanning ? (
            <></>
          ) : (
            <button
              onClick={() => setScanning(true)}
              className="px-6 py-2 bg-[#008CFF] opacity-90 text-white rounded-lg hover:opacity-100 transition-colors"
            >
              Verify other Ticket
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center justify-center w-full ">
        {scanning ? (
          <div className="w-[80vw] md:w-[30vw] bg-gray-50 rounded-xl overflow-hidden shadow-sm shadow-gray-400 ">
            <Scanner
              onScan={handleScan}
              onError={(error) => console.error(error?.message)}
              paused={!scanning}
            />
          </div>
        ) : (
          <div className="relative w-[400px] bg-white text-gray-800 rounded-2xl shadow-2xl overflow-hidden ">
            {/* Top banner */}
            <div className="bg-[#008cff] text-white py-4 px-6 flex justify-between items-center">
              <h2 className="text-xl font-bold tracking-wide">
                🎟 Ticket Verified
              </h2>
              <span className="text-sm font-semibold bg-white text-[#008cff] px-3 py-1 rounded-full">
                SUCCESS
              </span>
            </div>

            {/* Ticket body */}
            <div className="p-6 flex flex-col gap-3">
              <p className="text-gray-500 text-sm uppercase tracking-wide">
                Ticket Id
              </p>
              <h3 className="text-2xl font-semibold text-[#008cff]">
                {ticketDetails?.ticketId}
              </h3>

              <div className="mt-4 border-t border-dashed border-gray-300 pt-4">
                <p className="text-gray-500 text-sm">Verified At</p>
                <p className="text-lg font-medium">{ticketDetails?.name}</p>
              </div>
            </div>

            {/* Bottom ribbon */}
            <div className="bg-[#008cff] py-3 px-6 text-center text-white text-sm font-medium tracking-wider">
              VERIFIED SUCCESSFULLY
            </div>

            {/* Decorative punch holes */}
            <div className="absolute left-0 top-1/2 w-6 h-6 bg-[#ededed] rounded-full transform -translate-y-1/2 -translate-x-1/2 border border-gray-300"></div>
            <div className="absolute right-0 top-1/2 w-6 h-6 bg-[#ededed] rounded-full transform -translate-y-1/2 translate-x-1/2 border border-gray-300"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerifyTicket;
