/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  AcademicCapIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import toast from 'react-hot-toast'
export default function Dashboard() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ loading statec
  const [error,setError]=useState(null)
  // Fetch dashboard data
  useEffect(() => {

    const fetchStats = async () => {
      setLoading(true)
      try {
        const res = await axios.get("/api/dashboard/stats");

        setStats([
          {
            name: "Total Votes",
            value: res.data.totalVotes,
            change: "+12.3%",
            changeType: "increase",
            icon: ChartBarIcon,
            color: "text-blue-600",
            bgColor: "bg-blue-100",
          },
          {
            name: "Registered Users",
            value: res.data.totalUsers,
            change: "+5.2%",
            changeType: "increase",
            icon: UserGroupIcon,
            color: "text-green-600",
            bgColor: "bg-green-100",
          },
          {
            name: "Active Elections",
            value: res.data.activeElections,
            change: "-1",
            changeType: "decrease",
            icon: DocumentTextIcon,
            color: "text-purple-600",
            bgColor: "bg-purple-100",
          },
          {
            name: "Candidates",
            value: res.data.totalCandidates,
            change: "+3",
            changeType: "increase",
            icon: AcademicCapIcon,
            color: "text-yellow-600",
            bgColor: "bg-yellow-100",
          },
        ]);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
        setError(err.response?.data?.message)
        // toast.error(err.)
        toast.error(err.response?.data?.message || 'Failed to load dashboard stats');
      } finally {
        setLoading(false); // ✅ stop loading
      }
    };

    fetchStats();
  }, []);

  // if error  error
  if(error){
    return(
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Dashboard</h2> 
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}    
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry Loading
          </button>
        </div>
      </div>  
    )
  }
  // 🔄 Show loading spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-solid"></div>
          <p className="text-gray-600 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

 

  // ✅ Render after loading
  return (
    <>
      {/* Stats Section */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white overflow-hidden shadow rounded-lg animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`p-3 rounded-md ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} aria-hidden="true" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                      <dd>
                        <div className="text-lg font-semibold text-gray-900">{stat.value}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
         {/* <div className="bg-gray-50 px-5 py-3"> 
                 <div className="text-sm">
                  <span
                    className={`flex items-center font-medium ${
                      stat.changeType === "increase" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.changeType === "increase" ? (
                      <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                    )}
                    {stat.change}
                  </span>
                  <span className="text-gray-500 ml-2">since last week</span>
                </div> *
             </div>  */}
            </div>
          );
        })}
      </div>

      {/* Rest of dashboard (recent activity + upcoming events) */}
      {/* ... keep your existing layout here ... */}
    </>
  );
}
