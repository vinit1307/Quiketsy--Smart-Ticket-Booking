import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { MdAccountCircle } from "react-icons/md";
import LoadingSpinner from "./LoadingSpinner"; // Import your loading spinner

const Account = () => {
  const { user, isAuthenticated, loading: authLoading, isInitialized } = useAuth();
  const navigate = useNavigate();

  // State for password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);

  // State for password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // User details state
  const [userDetails, setUserDetails] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    accountType: "Standard",
  });

  useEffect(() => {
    // Wait for auth to initialize before checking authentication
    if (!authLoading && isInitialized) {
      if (!isAuthenticated) {
        console.log("Not authenticated, redirecting to signin");
        navigate("/signin");
      } else {
        // User is authenticated, fetch their details
        fetchUserDetails();
      }
    }
  }, [isAuthenticated, authLoading, isInitialized, navigate]);

  const fetchUserDetails = async () => {
    try {
      setIsLoadingDetails(true);
      const token = localStorage.getItem("token");
      
      // First, try to use data from the user context
      if (user) {
        setUserDetails({
          fullName: user.name || user.fullName || "User",
          email: user.email || "",
          phoneNumber: user.phoneNumber || "Not provided",
          dateOfBirth: user.dob || user.dateOfBirth || "Not provided",
          accountType: user.role || user.accountType || "Standard",
        });
      }

      // Then try to fetch fresh data from backend
      const response = await fetch("http://localhost:9192/api/user/account", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserDetails({
          fullName: data.name || data.fullName || user?.name || "User",
          email: data.email || user?.email || "",
          phoneNumber: data.phoneNumber || "Not provided",
          dateOfBirth: data.dob || data.dateOfBirth || "Not provided",
          accountType: data.role || data.accountType || "Standard",
        });
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      // Use fallback data from localStorage or user context
      if (user) {
        setUserDetails({
          fullName: user.name || localStorage.getItem("fullName") || "User",
          email: user.email || localStorage.getItem("email") || "",
          phoneNumber: localStorage.getItem("phoneNumber") || "Not provided",
          dateOfBirth: localStorage.getItem("dob") || "Not provided",
          accountType: user.role || user.accountType || "Standard",
        });
      }
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsChangingPassword(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:9192/api/user/change-password",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
            confirmPassword,
          }),
        }
      );

      if (response.ok) {
        toast.success("Password changed successfully!");
        // Clear form
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const error = await response.text();
        toast.error(error || "Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("An error occurred while changing password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Show loading while auth is initializing or details are loading
  if (authLoading || !isInitialized || isLoadingDetails) {
    return <LoadingSpinner fullPage />;
  }

  // If not authenticated after loading, return null (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 pt-24 pb-15 sm:px-15 lg:px-8">
      <div className="max-w-4xl mx-auto sm:max-w-3xl">
        {/* Account Details Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mt-7">
            <MdAccountCircle className="mb-5.5 mr-2 text-bold h-7.5 w-7.5" />
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Account Details
            </h2>
          </div>
          <hr className=" mb-8 border-black" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <User className="w-4 h-4 mr-2" />
                Full Name
              </label>
              <input
                type="text"
                value={userDetails.fullName}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </label>
              <input
                type="email"
                value={userDetails.email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Phone className="w-4 h-4 mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                value={userDetails.phoneNumber}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Calendar className="w-4 h-4 mr-2" />
                Date of Birth
              </label>
              <input
                type="text"
                value={userDetails.dateOfBirth}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
              />
            </div>

            {/* Account Type */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Shield className="w-4 h-4 mr-2" />
                Account Type
              </label>
              <input
                type="text"
                value={userDetails.accountType}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
              />
            </div>
          </div>
          
          <hr className="mt-10 mb-7 border-black" />
          
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Lock className="w-6 h-6 mr-2 text-bold font-bold" />
            Change Password
          </h2>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-4 py-2 pr-10 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-5 h-5 mt-1" />
                    ) : (
                      <Eye className="w-5 h-5 mt-1" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-4 py-2 pr-10 border mt-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5 mt-1" />
                    ) : (
                      <Eye className="w-5 h-5 mt-1" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-4 py-2 pr-10 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5 mt-1" />
                    ) : (
                      <Eye className="w-5 h-5 mt-1" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isChangingPassword}
              className={`w-full mt-2 mb-7 py-2 px-4 rounded-lg font-medium transition-colors ${
                isChangingPassword
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isChangingPassword ? "Changing Password..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Account;

// import React, { useState, useEffect } from "react";
// import { useAuth } from "../contexts/AuthContext";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import {
//   User,
//   Mail,
//   Phone,
//   Calendar,
//   Shield,
//   Lock,
//   Eye,
//   EyeOff,
// } from "lucide-react";
// import { MdAccountCircle } from "react-icons/md";

// const Account = () => {
//   const { user, isAuthenticated } = useAuth();
//   const navigate = useNavigate();

//   // State for password change
//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [isChangingPassword, setIsChangingPassword] = useState(false);

//   // State for password visibility
//   const [showCurrentPassword, setShowCurrentPassword] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   // Mock user data - replace with actual data from backend
//   const [userDetails, setUserDetails] = useState({
//     fullName: "",
//     email: "",
//     phoneNumber: "",
//     dateOfBirth: "",
//     accountType: "Standard",
//   });

//   useEffect(() => {
//     // Redirect if not authenticated
//     if (!isAuthenticated) {
//       navigate("/signin");
//       return;
//     }

//     // Fetch user details from backend or use stored data
//     fetchUserDetails();
//   }, [isAuthenticated, navigate]);

//   const fetchUserDetails = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch("http://localhost:9192/api/user/account", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setUserDetails({
//           fullName: data.name || user?.name || "User",
//           email: data.email || user?.email || "",
//           phoneNumber: data.phoneNumber || "",
//           dateOfBirth: data.dob || "",
//           accountType: data.role || "Standard",
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching user details:", error);
//       // Use fallback data from localStorage
//       setUserDetails({
//         fullName: user?.name || localStorage.getItem("fullName") || "User",
//         email: user?.email || localStorage.getItem("email") || "",
//         phoneNumber: localStorage.getItem("phoneNumber") || "Not provided",
//         dateOfBirth: localStorage.getItem("dob") || "Not provided",
//         accountType: "Standard",
//       });
//     }
//   };

//   const handlePasswordChange = async (e) => {
//     e.preventDefault();

//     // Validation
//     if (!currentPassword || !newPassword || !confirmPassword) {
//       toast.error("Please fill all password fields");
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       toast.error("New passwords do not match");
//       return;
//     }

//     if (newPassword.length < 6) {
//       toast.error("Password must be at least 6 characters long");
//       return;
//     }

//     setIsChangingPassword(true);

//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(
//         "http://localhost:9192/api/user/change-password",
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             currentPassword,
//             newPassword,
//             confirmPassword,
//           }),
//         }
//       );

//       if (response.ok) {
//         toast.success("Password changed successfully!");
//         // Clear form
//         setCurrentPassword("");
//         setNewPassword("");
//         setConfirmPassword("");
//       } else {
//         const error = await response.text();
//         toast.error(error || "Failed to change password");
//       }
//     } catch (error) {
//       console.error("Error changing password:", error);
//       toast.error("An error occurred while changing password");
//     } finally {
//       setIsChangingPassword(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4 pt-24 pb-15 sm:px-15 lg:px-8">
//       <div className="max-w-4xl mx-auto sm:max-w-3xl">
//         {/* Account Details Section */}
//         <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//           <div className="flex items-center mt-7">
//             <MdAccountCircle className="mb-5.5 mr-2 text-bold h-7.5 w-7.5" />
//             <h2 className="text-2xl font-bold text-gray-900 mb-6">
//               Account Details
//             </h2>
//           </div>
//           <hr className=" mb-8 border-black" />
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Full Name */}
//             <div className="space-y-2">
//               <label className="flex items-center text-sm font-medium text-gray-700">
//                 <User className="w-4 h-4 mr-2" />
//                 Full Name
//               </label>
//               <input
//                 type="text"
//                 value={userDetails.fullName}
//                 disabled
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
//               />
//             </div>

//             {/* Email */}
//             <div className="space-y-2">
//               <label className="flex items-center text-sm font-medium text-gray-700">
//                 <Mail className="w-4 h-4 mr-2" />
//                 Email
//               </label>
//               <input
//                 type="email"
//                 value={userDetails.email}
//                 disabled
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
//               />
//             </div>

//             {/* Phone Number */}
//             <div className="space-y-2">
//               <label className="flex items-center text-sm font-medium text-gray-700">
//                 <Phone className="w-4 h-4 mr-2" />
//                 Phone Number
//               </label>
//               <input
//                 type="tel"
//                 value={userDetails.phoneNumber}
//                 disabled
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
//               />
//             </div>

//             {/* Date of Birth */}
//             <div className="space-y-2">
//               <label className="flex items-center text-sm font-medium text-gray-700">
//                 <Calendar className="w-4 h-4 mr-2" />
//                 Date of Birth
//               </label>
//               <input
//                 type="text"
//                 value={userDetails.dateOfBirth}
//                 disabled
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
//               />
//             </div>

//             {/* Account Type */}
//             <div className="space-y-2">
//               <label className="flex items-center text-sm font-medium text-gray-700">
//                 <Shield className="w-4 h-4 mr-2" />
//                 Account Type
//               </label>
//               <input
//                 type="text"
//                 value={userDetails.accountType}
//                 disabled
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
//               />
//             </div>
//           </div>
//           <hr className="mt-10 mb-7 border-black" />
//           <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
//             <Lock className="w-6 h-6 mr-2 text-bold font-bold" />
//             Change Password
//           </h2>

//           <form onSubmit={handlePasswordChange} className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* New Password */}
//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-gray-700">
//                   New Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={showNewPassword ? "text" : "password"}
//                     value={newPassword}
//                     onChange={(e) => setNewPassword(e.target.value)}
//                     placeholder="Enter new password"
//                     className="w-full px-4 py-2 pr-10 border mt-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowNewPassword(!showNewPassword)}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                   >
//                     {showNewPassword ? (
//                       <EyeOff className="w-5 h-5 mt-1" />
//                     ) : (
//                       <Eye className="w-5 h-5 mt-1" />
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {/* Confirm New Password */}
//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-gray-700">
//                   Confirm New Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={showConfirmPassword ? "text" : "password"}
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                     placeholder="Confirm new password"
//                     className="w-full px-4 py-2 pr-10 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                   >
//                     {showConfirmPassword ? (
//                       <EyeOff className="w-5 h-5 mt-1" />
//                     ) : (
//                       <Eye className="w-5 h-5 mt-1" />
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {/* Current Password */}
//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-gray-700">
//                   Current Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={showCurrentPassword ? "text" : "password"}
//                     value={currentPassword}
//                     onChange={(e) => setCurrentPassword(e.target.value)}
//                     placeholder="Enter current password"
//                     className="w-full px-4 py-2 pr-10 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowCurrentPassword(!showCurrentPassword)}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                   >
//                     {showCurrentPassword ? (
//                       <EyeOff className="w-5 h-5 mt-1" />
//                     ) : (
//                       <Eye className="w-5 h-5 mt-1" />
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={isChangingPassword}
//               className={`w-full mt-2 mb-7 py-2 px-4 rounded-lg font-medium transition-colors ${
//                 isChangingPassword
//                   ? "bg-gray-400 text-gray-200 cursor-not-allowed"
//                   : "bg-blue-600 text-white hover:bg-blue-700"
//               }`}
//             >
//               {isChangingPassword ? "Changing Password..." : "Change Password"}
//             </button>
//           </form>
//         </div>

//         {/* Password Change Section */}
//         {/* <div className="bg-white rounded-lg shadow-md p-6">
          
//         </div> */}
//       </div>
//     </div>
//   );
// };

// export default Account;
