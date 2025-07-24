import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import {
  ArrowPathIcon,
  ClipboardDocumentListIcon,
  ExclamationCircleIcon,
  HeartIcon,
  UsersIcon,
  CheckCircleIcon,
  UserPlusIcon,
  UserGroupIcon,
  XCircleIcon,
  BuildingOffice2Icon,
  BeakerIcon
} from "@heroicons/react/24/outline";
import StatCard from "./helpers/StatCard";

const DashboardOverview = ({ theme }) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsersThisMonth: 0,
    totalDonations: 0,
    successfulDonations: 0,
    totalRequests: 0,
    pendingRequests: 0,
    cancelledRequests: 0,
    availableDonors: 0,
    unavailableDonors: 0,
    adminUsers: 0,
    topCities: [],
    commonBloodGroup: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          usersRes,
          donationsRes,
          successfulDonationsRes,
          requestsRes,
          pendingRequestsRes,
          cancelledRequestsRes,
          availableDonorsRes,
          unavailableDonorsRes,
          newUsersThisMonthRes,
          adminUsersRes,
          topCitiesRes,
          commonBloodGroupRes,
        ] = await Promise.all([
          axiosInstance.get("/users/count"),
          axiosInstance.get("/donations/count"),
          axiosInstance.get("/donations/count?status=Success"),
          axiosInstance.get("/requests/count"),
          axiosInstance.get("/requests/count?status=Pending"),
          axiosInstance.get("/requests/count?status=Cancelled"),
          axiosInstance.get("/users/count?available=true"),
          axiosInstance.get("/users/count?available=false"),
          axiosInstance.get("/users/count?newMonth=true"),
          axiosInstance.get("/users/count?admin=true"),
          axiosInstance.get("/users/top-cities"),
          axiosInstance.get("/users/common-bloodgroup"),
        ]);

        setStats({
          totalUsers: usersRes.data.count,
          newUsersThisMonth: newUsersThisMonthRes.data.count,
          totalDonations: donationsRes.data.count,
          successfulDonations: successfulDonationsRes.data.count,
          totalRequests: requestsRes.data.count,
          pendingRequests: pendingRequestsRes.data.count,
          cancelledRequests: cancelledRequestsRes.data.count,
          availableDonors: availableDonorsRes.data.count,
          unavailableDonors: unavailableDonorsRes.data.count,
          adminUsers: adminUsersRes.data.count,
          topCities: topCitiesRes.data.cities,
          commonBloodGroup: commonBloodGroupRes.data.bloodGroup,
        });
      } catch (err) {
        setError("Failed to fetch dashboard statistics.");
        console.error("Dashboard Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center py-10">
        <ArrowPathIcon className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    );

  if (error)
    return (
      <div className={`text-center py-10 ${theme === "dark" ? "text-red-400" : "text-red-600"}`}>
        {error}
      </div>
    );

  return (
    <div className="space-y-8 p-4 md:p-6">
      {/* Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={stats.totalUsers} icon={<UsersIcon className="h-8 w-8" />} theme={theme} />
        <StatCard title="New Users (This Month)" value={stats.newUsersThisMonth} icon={<UserPlusIcon className="h-8 w-8" />} theme={theme} />
        <StatCard title="Total Donations" value={stats.totalDonations} icon={<HeartIcon className="h-8 w-8" />} theme={theme} />
        <StatCard title="Successful Donations" value={stats.successfulDonations} icon={<CheckCircleIcon className="h-8 w-8" />} theme={theme} />
        <StatCard title="Total Requests" value={stats.totalRequests} icon={<ClipboardDocumentListIcon className="h-8 w-8" />} theme={theme} />
        <StatCard title="Pending Requests" value={stats.pendingRequests} icon={<ExclamationCircleIcon className="h-8 w-8" />} theme={theme} />
        <StatCard title="Cancelled Requests" value={stats.cancelledRequests} icon={<XCircleIcon className="h-8 w-8" />} theme={theme} />
        <StatCard title="Available Donors" value={stats.availableDonors} icon={<UserGroupIcon className="h-8 w-8" />} theme={theme} />
        <StatCard title="Unavailable Donors" value={stats.unavailableDonors} icon={<UserGroupIcon className="h-8 w-8 text-red-500" />} theme={theme} />
        <StatCard title="Admin Users" value={stats.adminUsers} icon={<UserGroupIcon className="h-8 w-8 text-yellow-600" />} theme={theme} />
        <StatCard title="Most Common Blood Group" value={stats.commonBloodGroup || "N/A"} icon={<BeakerIcon className="h-8 w-8" />} theme={theme} />
      </div>

      {/* Top Cities */}
      <div className={`rounded-xl shadow-lg p-6 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
          <BuildingOffice2Icon className="h-6 w-6" /> Top Cities by Donors
        </h2>
        {stats.topCities?.length > 0 ? (
          <ul className="space-y-3">
            {stats.topCities.map((city, idx) => (
              <li key={idx} className={`flex justify-between items-center p-3 rounded-lg transition-all ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}>
                <span className="font-medium text-lg">{city.name}</span>
                <span className="font-bold text-xl text-blue-500">{city.count}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center py-4 text-gray-500">No data available.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardOverview;