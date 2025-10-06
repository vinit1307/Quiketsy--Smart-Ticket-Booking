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
  AlertCircle
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  // Age limit options
  const ageLimits = [
    "All Ages",
    "5+",
    "12+",
    "16+",
    "18+",
    "21+"
  ];

  // Fetch event details
  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // Replace with your actual API endpoint
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
          eventDate: data.date || "",
          time: data.time || "",
          duration: data.duration || "",
          eventCity: data.city || "",
          language: data.language || "",
          ticketPrice: data.price || "",
          ageLimit: data.ageLimit || "All Ages",
          category: data.category || "",
          imageUrl: data.imageUrl || "",
          totalSlots: data.totalSlots || "",
          remainingSlots: data.remainingSlots || data.totalSlots,
          tags: data.tags ? data.tags.split(",") : []
        });
      } else {
        // Use dummy data for testing
        setFormData(getDummyEventData());
      }
    } catch (error) {
      console.error("Error fetching event details:", error);
      // Use dummy data if API fails
      setFormData(getDummyEventData());
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      
      // Format data for backend - only send editable fields
      const updateData = {
        description: formData.eventDescription,
        venue: formData.eventVenue,
        date: formData.eventDate,
        time: formData.time,
        duration: parseInt(formData.duration),
        city: formData.eventCity,
        price: parseFloat(formData.ticketPrice),
        ageLimit: formData.ageLimit,
        imageUrl: formData.imageUrl,
        totalSlots: parseInt(formData.totalSlots)
      };

      const response = await fetch(`http://localhost:9192/api/events/${id}`, {
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
                  value={formData.ageLimit}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {ageLimits.map(limit => (
                    <option key={limit} value={limit}>{limit}</option>
                  ))}
                </select>
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
                disabled={isSubmitting}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                  isSubmitting 
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed" 
                    : "bg-blue-600 text-white hover:bg-blue-700"
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEvent;