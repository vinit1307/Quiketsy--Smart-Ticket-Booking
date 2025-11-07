// ViewTicket.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, Clock, MapPin, Users, Globe, 
  Ticket, X, AlertCircle, CheckCircle, Building2, 
  User, CreditCard, Receipt
} from 'lucide-react';
import QRCode from 'react-qr-code';

const ViewTicket = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showCancelledConfirmation, setShowCancelledConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Hardcoded ticket data
  const [ticketData, setTicketData] = useState({
    eventImage: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=500',
    status: 'confirmed', // 'confirmed', 'waitlist', 'cancelled'
    eventName: 'Summer Music Festival 2024',
    ticketPrice: 1500,
    eventTime: '18:00',
    eventDate: '2024-02-15',
    eventDuration: '3 hours',
    eventVenue: 'Phoenix Arena',
    eventCity: 'Mumbai',
    ageLimit: '18+',
    language: 'English',
    bookedDate: '2024-01-20',
    bookedTime: '14:30',
    orderId: 'ORD123456789',
    paymentId: 'PAY987654321',
    qrCodeData: 'TICKET-2024-SUMMER-FEST-123456',
    userName: 'John Doe',
    userEmail: 'john.doe@example.com'
  });

  useEffect(() => {
    if (location.state?.eventData) {
      const event = location.state.eventData;
      setTicketData({
        eventImage: event.image || 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=500',
        status: event.status || 'waitlist',
        eventName: event.name,
        ticketPrice: event.price,
        eventTime: event.time,
        eventDate: event.date,
        eventDuration: '3 hours',
        eventVenue: event.venue,
        eventCity: event.location,
        ageLimit: '18+',
        language: 'English',
        bookedDate: event.bookingDate || '2024-01-20',
        bookedTime: '14:30',
        orderId: 'ORD123456789',
        paymentId: 'PAY987654321',
        qrCodeData: `TICKET-${event.id}-${Date.now()}`,
        userName: 'John Doe',
        userEmail: 'john.doe@example.com'
      });
    }
  }, [location]);

  const handleCancelTicket = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setTicketData(prev => ({ ...prev, status: 'cancelled' }));
      setIsLoading(false);
      setShowCancelDialog(false);
      setShowCancelledConfirmation(true);
    }, 1500);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const formatTime = (time) => {
    return time || '18:00';
  };

  const getStatusBadge = () => {
    switch (ticketData.status) {
      case 'confirmed':
        return (
          <div className="absolute top-4 right-4 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold border border-green-300">
            ✓ CONFIRMED
          </div>
        );
      case 'waitlist':
        return (
          <div className="absolute top-4 right-4 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold border border-yellow-300">
            ⏳ WAITLIST
          </div>
        );
      case 'cancelled':
        return (
          <div className="absolute top-4 right-4 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold border border-red-300">
            ✕ CANCELLED
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to History
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Contactless Ticket
        </h1>

        {/* Ticket Card */}
        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Top Decoration Circle */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full"></div>

          {/* Main Content */}
          <div className="relative">
            {/* Event Image Section */}
            <div className="relative h-48 overflow-hidden bg-gradient-to-r from-[#008CFF] to-purple-600">
              <img
                src={ticketData.eventImage}
                alt={ticketData.eventName}
                className="w-full h-full object-cover opacity-90"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              
              {/* Status Badge */}
              {getStatusBadge()}
              
              <div className="absolute bottom-4 left-6 right-6">
                <h2 className="text-2xl font-bold text-white mb-1">
                  {ticketData.eventName}
                </h2>
                <div className="flex items-center text-white/90 text-sm">
                  <Ticket className="w-4 h-4 mr-1" />
                  <span>E-Ticket</span>
                </div>
              </div>
            </div>

            {/* Dotted Line Separator */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center px-0">
                <div className="w-full border-t-7 border-dotted border-white"></div>
              </div>
            </div>

            {/* Ticket Details */}
            <div className="p-6 space-y-4">
              {/* Two Column Layout */}
              <div className="grid grid-cols-2 gap-4">
                {/* Date */}
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-[#008CFF] mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Event Date</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatDate(ticketData.eventDate)}
                    </p>
                  </div>
                </div>

                {/* Time */}
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-[#008CFF] mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Event Time</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatTime(ticketData.eventTime)}
                    </p>
                  </div>
                </div>

                {/* Venue */}
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-[#008CFF] mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Venue</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {ticketData.eventVenue}
                    </p>
                  </div>
                </div>

                {/* City */}
                <div className="flex items-start space-x-3">
                  <Building2 className="w-5 h-5 text-[#008CFF] mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">City</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {ticketData.eventCity}
                    </p>
                  </div>
                </div>

                {/* Duration */}
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-[#008CFF] mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {ticketData.eventDuration}
                    </p>
                  </div>
                </div>

                {/* Language */}
                <div className="flex items-start space-x-3">
                  <Globe className="w-5 h-5 text-[#008CFF] mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Language</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {ticketData.language}
                    </p>
                  </div>
                </div>

                {/* Age Limit */}
                <div className="flex items-start space-x-3">
                  <User className="w-5 h-5 text-[#008CFF] mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Age Limit</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {ticketData.ageLimit}
                    </p>
                  </div>
                </div>

                {/* Booked Date */}
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-[#008CFF] mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Booked On</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatDate(ticketData.bookedDate)} at {ticketData.bookedTime}
                    </p>
                    <p className="text-xs text-gray-600">
                      
                    </p>
                  </div>
                </div>
              </div>

              {/* Price and Booking Info */}
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500">Ticket Price</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{ticketData.ticketPrice}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Booked By</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {ticketData.userName}
                    </p>
                    <p className="text-xs text-gray-600">
                      {ticketData.userEmail}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div className="flex items-start space-x-2">
                  <Receipt className="w-4 h-4 text-[#008CFF] mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Order ID</p>
                    <p className="text-xs font-mono font-semibold text-gray-800">
                      {ticketData.orderId}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <CreditCard className="w-4 h-4 text-[#008CFF] mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Payment ID</p>
                    <p className="text-xs font-mono font-semibold text-gray-800">
                      {ticketData.paymentId}
                    </p>
                  </div>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="flex justify-center pt-4 mb-5 border-t">
                <div className="bg-gray-100 p-3 rounded-lg border-5 border-dotted border-white">
                  {ticketData.status === 'confirmed' ? (
                    <div className="flex flex-col items-center">
                      <div className="bg-white p-3 rounded-lg mb-2">
                        <QRCode value={ticketData.qrCodeData} size={120} />
                      </div>
                      <p className="text-xs text-gray-600 text-center">
                        Show this QR code at the venue for entry
                      </p>
                    </div>
                  ) : ticketData.status === 'waitlist' ? (
                    <div className="flex flex-col items-center p-4">
                      <AlertCircle className="w-10 h-10 text-yellow-600 mb-2" />
                      <p className="text-sm font-semibold text-gray-700">You're on the waitlist</p>
                      <p className="text-xs text-gray-500 mt-1 text-center">
                        QR code will be visible here just after ticket confirmation
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center p-4">
                      <X className="w-10 h-10 text-red-600 mb-2" />
                      <p className="text-sm font-semibold text-gray-700">Ticket Cancelled</p>
                      <p className="text-xs text-gray-500 mt-1 text-center">
                        Your payment will be refunded in 2-3 business days
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Decoration Circle */}
          <div className="absolute -bottom-5 left-1/2 border-gray-700/5 transform -translate-x-1/2 w-10 h-10 bg-gray-800/24 rounded-full"></div>
        </div>

        {/* Cancel Button - Only show for non-cancelled tickets */}
        {ticketData.status !== 'cancelled' && (
          <button
            onClick={() => setShowCancelDialog(true)}
            className="w-full mt-6 py-4 px-6 rounded-lg font-semibold text-white transition-all transform hover:scale-[1.02] bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
          >
            Cancel Ticket
          </button>
        )}

        {/* Refund Message for Cancelled Tickets */}
        {ticketData.status === 'cancelled' && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-800">
                  Refund Processing
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  Your payment will be refunded to your original payment method within 2-3 business days.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-transparent bg-opacity-100 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-800">Cancel Ticket?</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this ticket? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCancelDialog(false)}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                No
              </button>
              <button
                onClick={handleCancelTicket}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Success Dialog */}
      {showCancelledConfirmation && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full. shadow-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-800">Ticket Cancelled Successfully</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Your ticket is cancelled and you will be refunded in 2-3 days.
            </p>
            <button
              onClick={() => setShowCancelledConfirmation(false)}
              className="w-full py-2 bg-[#008CFF] text-white rounded-lg hover:bg-[#008CFF] hover:cursor-pointer transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewTicket;