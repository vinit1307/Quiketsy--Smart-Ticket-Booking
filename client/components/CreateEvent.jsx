import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  X,
  Building2
} from "lucide-react";

const CreateEvent = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Redirect if not an organizer
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      toast.error("Please login to create events");
    } else if (user?.accountType !== "ORGANIZER" && user?.role !== "ORGANIZER") {
      navigate("/");
      toast.error("Only organizers can create events");
    }
  }, [isAuthenticated, user, navigate]);

  // Form state - Added eventCity
  const [formData, setFormData] = useState({
    eventName: "",
    eventDescription: "",
    eventVenue: "",
    eventCity: "", // Added city field
    eventDate: "",
    time: "",
    duration: "",
    ticketPrice: "",
    ageLimit: "All Ages",
    imageUrl: "",
    language: "English",
    category: "",
    tags: [],
    totalSlots: ""
  });

  const [currentTag, setCurrentTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Categories options
  const categories = [
    "Music",
    "Sports",
    "Plays",
    "Stand Ups",
    "Conference",
    "Workshop",
    "Art",
    "Food",
    "Technology",
    "Other"
  ];

  // Language options
  const languages = [
    "English",
    "Hindi",
    "Marathi",
    "Tamil",
    "Telugu",
    "Kannada",
    "Bengali",
    "Gujarati",
    "Malayalam",
    "Punjabi",
    "Multiple"
  ];

  // Age limit options
  const ageLimits = [
    "All Ages",
    "5+",
    "12+",
    "16+",
    "18+",
    "21+"
  ];

  // Handle input changes
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

  // Handle tag addition
  const handleAddTag = (e) => {
    e.preventDefault();
    if (currentTag.trim() && formData.tags.length < 5) {
      if (!formData.tags.includes(currentTag.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, currentTag.trim()]
        }));
        setCurrentTag("");
      } else {
        toast.warning("Tag already added");
      }
    } else if (formData.tags.length >= 5) {
      toast.warning("Maximum 5 tags allowed");
    }
  };

  // Handle tag removal
  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Validate form - Added city validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.eventName.trim()) newErrors.eventName = "Event name is required";
    if (!formData.eventDescription.trim()) newErrors.eventDescription = "Description is required";
    if (!formData.eventVenue.trim()) newErrors.eventVenue = "Venue is required";
    if (!formData.eventCity.trim()) newErrors.eventCity = "City is required"; // Added city validation
    if (!formData.eventDate) newErrors.eventDate = "Date is required";
    if (!formData.time) newErrors.time = "Time is required";
    if (!formData.duration || formData.duration <= 0) newErrors.duration = "Valid duration is required";
    if (!formData.ticketPrice || formData.ticketPrice < 0) newErrors.ticketPrice = "Valid price is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.totalSlots || formData.totalSlots <= 0) newErrors.totalSlots = "Valid total slots is required";
    if (!formData.imageUrl.trim()) newErrors.imageUrl = "Event image URL is required";

    // Validate date is in future
    const selectedDate = new Date(formData.eventDate);
    if (selectedDate < new Date()) {
      newErrors.eventDate = "Event date must be in the future";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission - Added city to submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      
      // Format data for backend - Added city
      const eventData = {
        name: formData.eventName,
        description: formData.eventDescription,
        venue: formData.eventVenue,
        city: formData.eventCity, // Added city
        date: formData.eventDate,
        time: formData.time,
        duration: parseInt(formData.duration),
        price: parseFloat(formData.ticketPrice),
        ageLimit: formData.ageLimit,
        imageUrl: formData.imageUrl,
        language: formData.language,
        category: formData.category,
        tags: formData.tags.join(","),
        totalSlots: parseInt(formData.totalSlots),
        organizerId: user?.id || user?.email
      };

      const response = await fetch("http://localhost:9192/api/events/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(eventData)
      });

      if (response.ok) {
        toast.success("Event created successfully!");
        navigate("/your-events");
      } else {
        const error = await response.text();
        toast.error(error || "Failed to create event");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("An error occurred while creating the event");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Event</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Name */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 mr-2" />
                Event Name *
              </label>
              <input
                type="text"
                name="eventName"
                value={formData.eventName}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.eventName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter event name"
              />
              {errors.eventName && (
                <p className="text-red-500 text-sm mt-1">{errors.eventName}</p>
              )}
            </div>

            {/* Event Description */}
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

            {/* Two column layout for smaller fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Event Venue */}
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
                  placeholder="e.g., Mumbai Stadium, Delhi Convention Center"
                />
                {errors.eventVenue && (
                  <p className="text-red-500 text-sm mt-1">{errors.eventVenue}</p>
                )}
              </div>

              {/* Event City - NEW FIELD */}
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
                  placeholder="e.g., Mumbai, Delhi, Bangalore"
                />
                {errors.eventCity && (
                  <p className="text-red-500 text-sm mt-1">{errors.eventCity}</p>
                )}
              </div>

              {/* Event Date */}
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

              {/* Time */}
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

              {/* Duration */}
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

              {/* Ticket Price */}
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
                  placeholder="Enter price (0 for free)"
                />
                {errors.ticketPrice && (
                  <p className="text-red-500 text-sm mt-1">{errors.ticketPrice}</p>
                )}
              </div>

              {/* Total Slots */}
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

              {/* Age Limit */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 mr-2" />
                  Age Limit
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

              {/* Language */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Globe className="w-4 h-4 mr-2" />
                  Language
                </label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {languages.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Hash className="w-4 h-4 mr-2" />
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.category ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>
            </div>

            {/* Image URL */}
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

            {/* Tags */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Tag className="w-4 h-4 mr-2" />
                Tags (Max 5)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag(e);
                    }
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add a tag and press Enter"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 hover:text-blue-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                  isSubmitting 
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed" 
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isSubmitting ? "Creating Event..." : "Create Event"}
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

export default CreateEvent;