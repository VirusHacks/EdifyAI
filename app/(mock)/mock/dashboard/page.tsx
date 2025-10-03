"use client"; // Ensure this is a client component

import React from "react";
import AddNewInterview from "./_components/AddNewInterview";
import Interviewlist from "./_components/Interviewlist";

function Dashboard() {
  return (
    <div>
      <h2 className="font-bold text-4xl mt-6">Dashboard</h2>
      <h2 className="text-gray-500 my-2 text-xl">
        Create and Start AI Mockup Interview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 my-8">
        <AddNewInterview />
      </div>
      {/* Previous Interview list */}
      <Interviewlist />
    </div>
  );
}

export default Dashboard;
