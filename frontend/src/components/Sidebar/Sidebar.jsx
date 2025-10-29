import React from "react";
import logo from "../../assets/sri.png";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="flex flex-col items-center justify-between p-5 bg-white drop-shadow h-full max-h-full min-h-screen">
      <div className="w-full flex items-center justify-evenly gap-2">
        <img src={logo} alt="Logo" className="w-10" />
        <h2 className="text-xs font-medium">Computer Science</h2>
      </div>

      <div className="w-full">
        <div className="w-full text-start bg-slate-50 p-3">
          <Link to="overview" className="text-md font-medium">
            Overview
          </Link>
        </div>
        <div className="w-full text-start bg-slate-50 p-3">
          <Link to="mapping" className="text-md font-medium">
            Mapping
          </Link>
        </div>
        <div className="w-full text-start bg-slate-50 p-3">
          <Link to="Attainment" className="text-md font-medium">
            Attainment
          </Link>
        </div>
        <div className="w-full text-start bg-slate-50 p-3">
          <Link to="surveyreport" className="text-md font-medium">
            Survey Report
          </Link>
        </div>
        <div className="w-full text-start bg-slate-50 p-3">
          <Link to="Po-attainment" className="text-sm font-medium">
            PO-Attainment
          </Link>
        </div>
      </div>

      <div className="border-t-2 w-full flex items-center text-center justify-center pt-3 ">
        <p className="text-sm">2024 copywrite</p>
      </div>
    </div>
  );
};

export default Sidebar;
