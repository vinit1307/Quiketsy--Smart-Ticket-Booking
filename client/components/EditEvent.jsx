import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import {
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Users,
  Image,
  Tag,
  Globe,
  FileText,
  User,
  Hash,
  Building2,
  ChevronLeft,
  Lock,
  Save,
  AlertCircle,
  XCircle
} from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";

const EditEvent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();

  // Redirect if not an organizer
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      toast.error("Please login to edit events");
    } else if (user?.accountType !== "ORGANIZER" && user?.role !== "ORGANIZER") {
      navigate("/");
      toast.error("Only organizers can edit events");
    }
  }, [isAuthenticated, user, navigate]);

  // Form state
  const [formData, setFormData] = useState({
    eventName: "",
    eventDescription: "",
    eventVenue: "",
    eventDate: "",
    time: "",
    duration: "",
    eventCity: "",
    language: "",
    ticketPrice: "",
    ageLimit: "",
    category: "",
    imageUrl: "",
    totalSlots: "",
    remainingSlots: "",
    tags: []
  });

  const [eventStatus, setEventStatus] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  // Age limit options
  // const ageLimits = [
  //   "All Ages",
  //   "5+",
  //   "12+",
  //   "16+",
  //   "18+",
  //   "21+"
  // ];
  
  const ageLimits = [
    { label: "All Ages", value: 0 },
    { label: "5+", value: 5 },
    { label: "12+", value: 12 },
    { label: "16+", value: 16 },
    { label: "18+", value: 18 },
    { label: "21+", value: 21 }
  ];

  // Fetch event details
  useEffect(() => {
    if (id) fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await fetch(`http://localhost:9192/api/events/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();

        setFormData({
          eventName: data.name || "",
          eventDescription: data.description || "",
          eventVenue: data.venue || "",
          eventDate: data.eventDate || "", // API returns eventDate
          time: (data.startTime || "").slice(0, 5), // "HH:mm:ss" -> "HH:mm"
          duration: (typeof data.duration === "string"
            ? (data.duration.match(/\d+/)?.[0] || "")
            : (data.duration ?? "")).toString(),
          eventCity: data.city || "",
          language: data.language || "",
          ticketPrice: data.ticketPrice ?? "",
          // Map numeric to label like "18+" if needed, else show as-is
          ageLimit: data.ageLimit != null ? `${data.ageLimit}+` : "All Ages",
          category: data.category || "",
          imageUrl: data.imageUrl || "",
          totalSlots: data.totalSlots ?? "",
          remainingSlots: data.availableSlots ?? data.remainingSlots ?? data.totalSlots,
          tags: typeof data.tags === "string"
            ? data.tags.split(",").map(t => t.trim()).filter(Boolean)
            : (data.tags || [])
        });

        setEventStatus(data.status || "");
      } else {
        // Use dummy data for testing
        setFormData(getDummyEventData());
        setEventStatus("UPCOMING");
      }
    } catch (error) {
      console.error("Error fetching event details:", error);
      // Use dummy data if API fails
      setFormData(getDummyEventData());
      setEventStatus("UPCOMING");
    } finally {
      setLoading(false);
    }
  };

  // Dummy data for testing
  const getDummyEventData = () => ({
    eventName: "Tech Summit 2025",
    eventDescription: "Join us for the biggest tech conference of the year featuring industry leaders, workshops, and networking opportunities.",
    eventVenue: "Mumbai Convention Center",
    eventDate: "2025-03-15",
    time: "10:00",
    duration: "8",
    eventCity: "Mumbai",
    language: "English",
    ticketPrice: "2500",
    ageLimit: "18+",
    category: "Technology",
    imageUrl: "https://example.com/tech-summit.jpg",
    totalSlots: "500",
    remainingSlots: "350",
    tags: ["technology", "conference", "networking", "workshop", "innovation"]
  });

  // Handle input changes (only for editable fields)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.eventDescription.trim()) newErrors.eventDescription = "Description is required";
    if (!formData.eventVenue.trim()) newErrors.eventVenue = "Venue is required";
    if (!formData.eventCity.trim()) newErrors.eventCity = "City is required";
    if (!formData.eventDate) newErrors.eventDate = "Date is required";
    if (!formData.time) newErrors.time = "Time is required";
    if (!formData.duration || formData.duration <= 0) newErrors.duration = "Valid duration is required";
    if (!formData.ticketPrice || formData.ticketPrice < 0) newErrors.ticketPrice = "Valid price is required";
    if (!formData.totalSlots || formData.totalSlots <= 0) newErrors.totalSlots = "Valid total slots is required";
    if (!formData.imageUrl.trim()) newErrors.imageUrl = "Event image URL is required";

    // Validate date is in future
    const selectedDate = new Date(formData.eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      newErrors.eventDate = "Event date must be in the future";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission (update details)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      
      // Format data for backend - only send editable fields (kept as in your original)
      const updateData = {
        description: formData.eventDescription,
        venue: formData.eventVenue,
        date: formData.eventDate, // if your API expects eventDate, switch key here
        time: formData.time,      // if your API expects startTime, switch key here
        duration: parseInt(formData.duration),
        city: formData.eventCity,
        price: parseFloat(formData.ticketPrice),
        ageLimit: formData.ageLimit, // kept as-is to not affect current flow
        imageUrl: formData.imageUrl,
        totalSlots: parseInt(formData.totalSlots)
      };

      const response = await fetch(`http://localhost:9192/api/events/edit/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        toast.success("Event updated successfully!");
        navigate("/your-events");
      } else {
        const error = await response.text();
        toast.error(error || "Failed to update event");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("An error occurred while updating the event");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancel event (set status to CANCELLED)
  const handleCancelEvent = async () => {
    if (eventStatus === "CANCELLED") {
      toast.info("This event is already cancelled");
      return;
    }

    const confirmed = window.confirm(
      "⚠️ Are you sure you want to cancel this event? ⚠️"
    );
    if (!confirmed) return;

    setIsCancelling(true);
    try {
      const token = localStorage.getItem("token");

      // If your backend uses a different route, adjust here (e.g., POST /api/events/:id/cancel)
      const res = await fetch(`http://localhost:9192/api/events/cancel/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: "CANCELLED" })
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to cancel event");
      }

      toast.success("Event cancelled");
      setEventStatus("CANCELLED");
      navigate("/your-events");
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Failed to cancel event");
    } finally {
      setIsCancelling(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
            <div className="mt-5 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <p className="text-sm text-yellow-800">
                Some fields cannot be changed after event creation for consistency reasons.
              </p>
            </div>

            {eventStatus && (
              <div
                className={`mt-4 p-3 rounded-lg border ${
                  eventStatus === "CANCELLED"
                    ? "bg-red-50 border-red-200 text-red-700"
                    : "bg-blue-50 border-blue-200 text-[#008CFF]"
                }`}
              >
                <span className="font-medium">Status:</span> {eventStatus}
                {eventStatus === "CANCELLED" && (
                  <span className="ml-2">
                    Editing is disabled for cancelled events.
                  </span>
                )}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Non-editable Event Name */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4 mr-2" />
                Event Name (Cannot be changed)
              </label>
              <input
                type="text"
                value={formData.eventName}
                disabled
                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>

            {/* Editable Event Description */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 mr-2" />
                Event Description *
              </label>
              <textarea
                name="eventDescription"
                value={formData.eventDescription}
                onChange={handleChange}
                rows="4"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.eventDescription ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Describe your event..."
                disabled={eventStatus === "CANCELLED"}
              />
              {errors.eventDescription && (
                <p className="text-red-500 text-sm mt-1">{errors.eventDescription}</p>
              )}
            </div>

            {/* Two column layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Editable Event Venue */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 mr-2" />
                  Event Venue *
                </label>
                <input
                  type="text"
                  name="eventVenue"
                  value={formData.eventVenue}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.eventVenue ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter venue location"
                  disabled={eventStatus === "CANCELLED"}
                />
                {errors.eventVenue && (
                  <p className="text-red-500 text-sm mt-1">{errors.eventVenue}</p>
                )}
              </div>

              {/* Editable Event City */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Building2 className="w-4 h-4 mr-2" />
                  Event City *
                </label>
                <input
                  type="text"
                  name="eventCity"
                  value={formData.eventCity}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.eventCity ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter city"
                  disabled={eventStatus === "CANCELLED"}
                />
                {errors.eventCity && (
                  <p className="text-red-500 text-sm mt-1">{errors.eventCity}</p>
                )}
              </div>

              {/* Editable Event Date */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  Event Date *
                </label>
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.eventDate ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={eventStatus === "CANCELLED"}
                />
                {errors.eventDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.eventDate}</p>
                )}
              </div>

              {/* Editable Time */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 mr-2" />
                  Event Time *
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.time ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={eventStatus === "CANCELLED"}
                />
                {errors.time && (
                  <p className="text-red-500 text-sm mt-1">{errors.time}</p>
                )}
              </div>

              {/* Editable Duration */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 mr-2" />
                  Duration (hours) *
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  min="1"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.duration ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., 2"
                  disabled={eventStatus === "CANCELLED"}
                />
                {errors.duration && (
                  <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
                )}
              </div>

              {/* Non-editable Language */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Lock className="w-4 h-4 mr-2" />
                  Language (Cannot be changed)
                </label>
                <input
                  type="text"
                  value={formData.language}
                  disabled
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>

              {/* Editable Ticket Price */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Ticket Price (₹) *
                </label>
                <input
                  type="number"
                  name="ticketPrice"
                  value={formData.ticketPrice}
                  onChange={handleChange}
                  min="0"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.ticketPrice ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter price"
                  disabled={eventStatus === "CANCELLED"}
                />
                {errors.ticketPrice && (
                  <p className="text-red-500 text-sm mt-1">{errors.ticketPrice}</p>
                )}
              </div>

              {/* Editable Age Limit */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 mr-2" />
                  Age Limit *
                </label>
                <select
                  name="ageLimit"
                  value={formData.ageLimit || 0} // fallback if null
                  onChange={(e) =>
                  setFormData({
                  ...formData,
                  ageLimit: parseInt(e.target.value) // always number
    })
  }
  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  disabled={eventStatus === "CANCELLED"}
>
  {ageLimits.map((limit) => (
    <option key={limit.value} value={limit.value}>
      {limit.label}
    </option>
  ))}
</select>
                {/* <select
                  name="ageLimit"
                  value={formData.ageLimit}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={eventStatus === "CANCELLED"}
                >
                  {ageLimits.map(limit => (
                    <option key={limit} value={limit}>{limit}</option>
                  ))}
                </select> */}
              </div>

              {/* Non-editable Category */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Lock className="w-4 h-4 mr-2" />
                  Category (Cannot be changed)
                </label>
                <input
                  type="text"
                  value={formData.category}
                  disabled
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>

              {/* Editable Total Slots */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4 mr-2" />
                  Total Slots *
                </label>
                <input
                  type="number"
                  name="totalSlots"
                  value={formData.totalSlots}
                  onChange={handleChange}
                  min="1"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.totalSlots ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Total available slots"
                  disabled={eventStatus === "CANCELLED"}
                />
                {errors.totalSlots && (
                  <p className="text-red-500 text-sm mt-1">{errors.totalSlots}</p>
                )}
              </div>

              {/* Non-editable Remaining Slots */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4 mr-2" />
                  Remaining Slots
                </label>
                <input
                  type="number"
                  value={formData.remainingSlots}
                  disabled
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Editable Cover Image URL */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Image className="w-4 h-4 mr-2" />
                Event Cover Image URL *
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.imageUrl ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="https://example.com/event-image.jpg"
                disabled={eventStatus === "CANCELLED"}
              />
              {errors.imageUrl && (
                <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>
              )}
              {formData.imageUrl && (
                <div className="mt-2">
                  <img 
                    src={formData.imageUrl} 
                    alt="Event preview" 
                    className="w-32 h-20 object-cover rounded"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Non-editable Tags */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4 mr-2" />
                Tags (Cannot be changed)
              </label>
              <div className="flex flex-wrap gap-2">
                {formData.tags.length > 0 ? (
                  formData.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 border border-gray-300"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">No tags added</span>
                )}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={isSubmitting || eventStatus === "CANCELLED"}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                  isSubmitting || eventStatus === "CANCELLED" 
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed" 
                    : "bg-blue-600 text-white hover:bg-[#008CFF]"
                }`}
              >
                <Save className="w-5 h-5" />
                {isSubmitting ? "Updating Event..." : "Update Event Details"}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>

            {/* Danger zone */}
            <div className="mt-6 border-t pt-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-xl text-red-700 mb-5 font-bold">
                  Cancel this Event
                </p>
                
                <button
                  type="button"
                  onClick={handleCancelEvent}
                  disabled={isCancelling || eventStatus === "CANCELLED"}
                  className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                    isCancelling || eventStatus === "CANCELLED"
                      ? "bg-red-300 text-white cursor-not-allowed"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  <XCircle className="w-5 h-5" />
                  {eventStatus === "CANCELLED"
                    ? "Event Cancelled"
                    : isCancelling
                      ? "Cancelling..."
                      : "Cancel Event"}
                </button>
                <p className="text-sm text-red-700 mt-2 font-bold">
                  (This action will CANCLE the event and users will not able to book this event.)
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEvent;

// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";
// import { toast } from "react-toastify";
// import {
//   Calendar,
//   Clock,
//   MapPin,
//   DollarSign,
//   Users,
//   Image,
//   Tag,
//   Globe,
//   FileText,
//   User,
//   Hash,
//   Building2,
//   ChevronLeft,
//   Lock,
//   Save,
//   AlertCircle
// } from "lucide-react";
// import LoadingSpinner from "./LoadingSpinner";

// const EditEvent = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const { user, isAuthenticated } = useAuth();

//   // Redirect if not an organizer
//   React.useEffect(() => {
//     if (!isAuthenticated) {
//       navigate("/");
//       toast.error("Please login to edit events");
//     } else if (user?.accountType !== "ORGANIZER" && user?.role !== "ORGANIZER") {
//       navigate("/");
//       toast.error("Only organizers can edit events");
//     }
//   }, [isAuthenticated, user, navigate]);

//   // Form state
//   const [formData, setFormData] = useState({
//     eventName: "",
//     eventDescription: "",
//     eventVenue: "",
//     eventDate: "",
//     time: "",
//     duration: "",
//     eventCity: "",
//     language: "",
//     ticketPrice: "",
//     ageLimit: "",
//     category: "",
//     imageUrl: "",
//     totalSlots: "",
//     remainingSlots: "",
//     tags: []
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [errors, setErrors] = useState({});

//   // Age limit options
//   const ageLimits = [
//     "All Ages",
//     "5+",
//     "12+",
//     "16+",
//     "18+",
//     "21+"
//   ];

//   // Fetch event details
//   useEffect(() => {
//     fetchEventDetails();
//   }, [id]);

//   const fetchEventDetails = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
      
//       // Replace with your actual API endpoint
//       const response = await fetch(`http://localhost:9192/api/events/${id}`, {
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json"
//         }
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setFormData({
//           eventName: data.name || "",
//           eventDescription: data.description || "",
//           eventVenue: data.venue || "",
//           eventDate: data.date || "",
//           time: data.time || "",
//           duration: data.duration || "",
//           eventCity: data.city || "",
//           language: data.language || "",
//           ticketPrice: data.price || "",
//           ageLimit: data.ageLimit || "All Ages",
//           category: data.category || "",
//           imageUrl: data.imageUrl || "",
//           totalSlots: data.totalSlots || "",
//           remainingSlots: data.remainingSlots || data.totalSlots,
//           tags: data.tags ? data.tags.split(",") : []
//         });
//       } else {
//         // Use dummy data for testing
//         setFormData(getDummyEventData());
//       }
//     } catch (error) {
//       console.error("Error fetching event details:", error);
//       // Use dummy data if API fails
//       setFormData(getDummyEventData());
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Dummy data for testing
//   const getDummyEventData = () => ({
//     eventName: "Tech Summit 2025",
//     eventDescription: "Join us for the biggest tech conference of the year featuring industry leaders, workshops, and networking opportunities.",
//     eventVenue: "Mumbai Convention Center",
//     eventDate: "2025-03-15",
//     time: "10:00",
//     duration: "8",
//     eventCity: "Mumbai",
//     language: "English",
//     ticketPrice: "2500",
//     ageLimit: "18+",
//     category: "Technology",
//     imageUrl: "https://example.com/tech-summit.jpg",
//     totalSlots: "500",
//     remainingSlots: "350",
//     tags: ["technology", "conference", "networking", "workshop", "innovation"]
//   });

//   // Handle input changes (only for editable fields)
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     // Clear error for this field
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ""
//       }));
//     }
//   };

//   // Validate form
//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.eventDescription.trim()) newErrors.eventDescription = "Description is required";
//     if (!formData.eventVenue.trim()) newErrors.eventVenue = "Venue is required";
//     if (!formData.eventCity.trim()) newErrors.eventCity = "City is required";
//     if (!formData.eventDate) newErrors.eventDate = "Date is required";
//     if (!formData.time) newErrors.time = "Time is required";
//     if (!formData.duration || formData.duration <= 0) newErrors.duration = "Valid duration is required";
//     if (!formData.ticketPrice || formData.ticketPrice < 0) newErrors.ticketPrice = "Valid price is required";
//     if (!formData.totalSlots || formData.totalSlots <= 0) newErrors.totalSlots = "Valid total slots is required";
//     if (!formData.imageUrl.trim()) newErrors.imageUrl = "Event image URL is required";

//     // Validate date is in future
//     const selectedDate = new Date(formData.eventDate);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     if (selectedDate < today) {
//       newErrors.eventDate = "Event date must be in the future";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       toast.error("Please fill all required fields correctly");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const token = localStorage.getItem("token");
      
//       // Format data for backend - only send editable fields
//       const updateData = {
//         description: formData.eventDescription,
//         venue: formData.eventVenue,
//         date: formData.eventDate,
//         time: formData.time,
//         duration: parseInt(formData.duration),
//         city: formData.eventCity,
//         price: parseFloat(formData.ticketPrice),
//         ageLimit: formData.ageLimit,
//         imageUrl: formData.imageUrl,
//         totalSlots: parseInt(formData.totalSlots)
//       };

//       const response = await fetch(`http://localhost:9192/api/events/${id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`
//         },
//         body: JSON.stringify(updateData)
//       });

//       if (response.ok) {
//         toast.success("Event updated successfully!");
//         navigate("/your-events");
//       } else {
//         const error = await response.text();
//         toast.error(error || "Failed to update event");
//       }
//     } catch (error) {
//       console.error("Error updating event:", error);
//       toast.error("An error occurred while updating the event");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (loading) {
//     return <LoadingSpinner fullPage />;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-4xl mx-auto">
//         <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
//           {/* Header */}
//           <div className="mb-8">
//             <button
//               onClick={() => navigate(-1)}
//               className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
//             >
//               <ChevronLeft className="w-5 h-5 mr-1" />
//               Back
//             </button>
//             <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
//             <div className="mt-5 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
//               <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
//               <p className="text-sm text-yellow-800">
//                 Some fields cannot be changed after event creation for consistency reasons.
//               </p>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Non-editable Event Name */}
//             <div>
//               <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                 <Lock className="w-4 h-4 mr-2" />
//                 Event Name (Cannot be changed)
//               </label>
//               <input
//                 type="text"
//                 value={formData.eventName}
//                 disabled
//                 className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
//               />
//             </div>

//             {/* Editable Event Description */}
//             <div>
//               <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                 <FileText className="w-4 h-4 mr-2" />
//                 Event Description *
//               </label>
//               <textarea
//                 name="eventDescription"
//                 value={formData.eventDescription}
//                 onChange={handleChange}
//                 rows="4"
//                 className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                   errors.eventDescription ? "border-red-500" : "border-gray-300"
//                 }`}
//                 placeholder="Describe your event..."
//               />
//               {errors.eventDescription && (
//                 <p className="text-red-500 text-sm mt-1">{errors.eventDescription}</p>
//               )}
//             </div>

//             {/* Two column layout */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Editable Event Venue */}
//               <div>
//                 <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                   <MapPin className="w-4 h-4 mr-2" />
//                   Event Venue *
//                 </label>
//                 <input
//                   type="text"
//                   name="eventVenue"
//                   value={formData.eventVenue}
//                   onChange={handleChange}
//                   className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                     errors.eventVenue ? "border-red-500" : "border-gray-300"
//                   }`}
//                   placeholder="Enter venue location"
//                 />
//                 {errors.eventVenue && (
//                   <p className="text-red-500 text-sm mt-1">{errors.eventVenue}</p>
//                 )}
//               </div>

//               {/* Editable Event City */}
//               <div>
//                 <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                   <Building2 className="w-4 h-4 mr-2" />
//                   Event City *
//                 </label>
//                 <input
//                   type="text"
//                   name="eventCity"
//                   value={formData.eventCity}
//                   onChange={handleChange}
//                   className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                     errors.eventCity ? "border-red-500" : "border-gray-300"
//                   }`}
//                   placeholder="Enter city"
//                 />
//                 {errors.eventCity && (
//                   <p className="text-red-500 text-sm mt-1">{errors.eventCity}</p>
//                 )}
//               </div>

//               {/* Editable Event Date */}
//               <div>
//                 <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                   <Calendar className="w-4 h-4 mr-2" />
//                   Event Date *
//                 </label>
//                 <input
//                   type="date"
//                   name="eventDate"
//                   value={formData.eventDate}
//                   onChange={handleChange}
//                   min={new Date().toISOString().split('T')[0]}
//                   className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                     errors.eventDate ? "border-red-500" : "border-gray-300"
//                   }`}
//                 />
//                 {errors.eventDate && (
//                   <p className="text-red-500 text-sm mt-1">{errors.eventDate}</p>
//                 )}
//               </div>

//               {/* Editable Time */}
//               <div>
//                 <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                   <Clock className="w-4 h-4 mr-2" />
//                   Event Time *
//                 </label>
//                 <input
//                   type="time"
//                   name="time"
//                   value={formData.time}
//                   onChange={handleChange}
//                   className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                     errors.time ? "border-red-500" : "border-gray-300"
//                   }`}
//                 />
//                 {errors.time && (
//                   <p className="text-red-500 text-sm mt-1">{errors.time}</p>
//                 )}
//               </div>

//               {/* Editable Duration */}
//               <div>
//                 <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                   <Clock className="w-4 h-4 mr-2" />
//                   Duration (hours) *
//                 </label>
//                 <input
//                   type="number"
//                   name="duration"
//                   value={formData.duration}
//                   onChange={handleChange}
//                   min="1"
//                   className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                     errors.duration ? "border-red-500" : "border-gray-300"
//                   }`}
//                   placeholder="e.g., 2"
//                 />
//                 {errors.duration && (
//                   <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
//                 )}
//               </div>

//               {/* Non-editable Language */}
//               <div>
//                 <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                   <Lock className="w-4 h-4 mr-2" />
//                   Language (Cannot be changed)
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.language}
//                   disabled
//                   className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
//                 />
//               </div>

//               {/* Editable Ticket Price */}
//               <div>
//                 <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                   <DollarSign className="w-4 h-4 mr-2" />
//                   Ticket Price (₹) *
//                 </label>
//                 <input
//                   type="number"
//                   name="ticketPrice"
//                   value={formData.ticketPrice}
//                   onChange={handleChange}
//                   min="0"
//                   className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                     errors.ticketPrice ? "border-red-500" : "border-gray-300"
//                   }`}
//                   placeholder="Enter price"
//                 />
//                 {errors.ticketPrice && (
//                   <p className="text-red-500 text-sm mt-1">{errors.ticketPrice}</p>
//                 )}
//               </div>

//               {/* Editable Age Limit */}
//               <div>
//                 <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                   <User className="w-4 h-4 mr-2" />
//                   Age Limit *
//                 </label>
//                 <select
//                   name="ageLimit"
//                   value={formData.ageLimit}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   {ageLimits.map(limit => (
//                     <option key={limit} value={limit}>{limit}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Non-editable Category */}
//               <div>
//                 <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                   <Lock className="w-4 h-4 mr-2" />
//                   Category (Cannot be changed)
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.category}
//                   disabled
//                   className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
//                 />
//               </div>

//               {/* Editable Total Slots */}
//               <div>
//                 <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                   <Users className="w-4 h-4 mr-2" />
//                   Total Slots *
//                 </label>
//                 <input
//                   type="number"
//                   name="totalSlots"
//                   value={formData.totalSlots}
//                   onChange={handleChange}
//                   min="1"
//                   className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                     errors.totalSlots ? "border-red-500" : "border-gray-300"
//                   }`}
//                   placeholder="Total available slots"
//                 />
//                 {errors.totalSlots && (
//                   <p className="text-red-500 text-sm mt-1">{errors.totalSlots}</p>
//                 )}
//               </div>

//               {/* Non-editable Remaining Slots */}
//               <div>
//                 <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                   <Users className="w-4 h-4 mr-2" />
//                   Remaining Slots
//                 </label>
//                 <input
//                   type="number"
//                   value={formData.remainingSlots}
//                   disabled
//                   className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
//                 />
//               </div>
//             </div>

//             {/* Editable Cover Image URL */}
//             <div>
//               <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                 <Image className="w-4 h-4 mr-2" />
//                 Event Cover Image URL *
//               </label>
//               <input
//                 type="url"
//                 name="imageUrl"
//                 value={formData.imageUrl}
//                 onChange={handleChange}
//                 className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                   errors.imageUrl ? "border-red-500" : "border-gray-300"
//                 }`}
//                 placeholder="https://example.com/event-image.jpg"
//               />
//               {errors.imageUrl && (
//                 <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>
//               )}
//               {formData.imageUrl && (
//                 <div className="mt-2">
//                   <img 
//                     src={formData.imageUrl} 
//                     alt="Event preview" 
//                     className="w-32 h-20 object-cover rounded"
//                     onError={(e) => {
//                       e.target.style.display = 'none';
//                     }}
//                   />
//                 </div>
//               )}
//             </div>

//             {/* Non-editable Tags */}
//             <div>
//               <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                 <Lock className="w-4 h-4 mr-2" />
//                 Tags (Cannot be changed)
//               </label>
//               <div className="flex flex-wrap gap-2">
//                 {formData.tags.length > 0 ? (
//                   formData.tags.map(tag => (
//                     <span
//                       key={tag}
//                       className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 border border-gray-300"
//                     >
//                       <Tag className="w-3 h-3 mr-1" />
//                       {tag}
//                     </span>
//                   ))
//                 ) : (
//                   <span className="text-gray-500 text-sm">No tags added</span>
//                 )}
//               </div>
//             </div>

//             {/* Submit Buttons */}
//             <div className="flex gap-4 pt-6">
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
//                   isSubmitting 
//                     ? "bg-gray-400 text-gray-200 cursor-not-allowed" 
//                     : "bg-blue-600 text-white hover:bg-[#008CFF]"
//                 }`}
//               >
//                 <Save className="w-5 h-5" />
//                 {isSubmitting ? "Updating Event..." : "Update Event Details"}
//               </button>
//               <button
//                 type="button"
//                 onClick={() => navigate(-1)}
//                 className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditEvent;