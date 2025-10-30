import React from "react";
import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Modal from "react-modal";
import { MdClose } from "react-icons/md";
// import { authenticateToken } from "../../../../backend/utilities";

const Coreport = () => {
  const [allBatches, setAllBatches] = useState([]);
  const [batchId, setBatchId] = useState("");

  const getAllBatch = async () => {

    try {

      const response = await axiosInstance.get("/get-all-batches");

      if (response.data && response.data.batches) {
        console.log(response.data.batches);
        setAllBatches(response.data.batches);
      }
    } catch (error) {
      console.log("An Unexpected Error : " + error);
    }
  };

  useEffect(() => {
    getAllBatch();
  }, []);

  useEffect(() => {
    if (allBatches.length > 0) {
      setBatchId(allBatches[0]._id); 
    }
  }, [allBatches]);

  const [allBatch, setAllBatch] = useState([]);
  const [subjectId, setSubjectId] = useState(0);

  const getAllSubjects = async () => {
    
    try {
      const token = localStorage.getItem("token");
      console.log("token from client Side : " + token);
      console.log("batchId from client Side : " + batchId);
      const response = await axiosInstance.get("/get-allSubjects/" + batchId, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.subjectData) {
        const subjectsData = response.data.subjectData.flatMap(
          (batch) => batch.subjects
        );
        setAllBatch(subjectsData);

        console.log(
          "Subjects Data array from client model : " +
            JSON.stringify(subjectsData, null, 2)
        );
      }
    } catch (error) {
      console.log("An Unexpected Error from client side : " + error);
    }
  };


  const [subjects, setAllSubjects] = useState([]);
  const [courseNumber, setCourseNumber] = useState([]);

  const getSubjects = () => {
    if (!allBatch || allBatch.length === 0) {
      console.log("No batch data available yet");
      return;
    }
    
    const names = allBatch.map((subject) => subject.courseName || '').filter(name => name);
    const cono = allBatch.map((subject) => subject.courseCode || subject.coNo || '').filter(code => code);
    setCourseNumber(cono);
    setAllSubjects(names);

  };
  
  useEffect(() => {
    if (batchId) {
      getAllSubjects();
    }
  }, [batchId]);

  useEffect(() => {
    if (allBatch && allBatch.length > 0) {
      getSubjects();
    }
  }, [allBatch]);

  // level Selection
  const [openLvl, setOpenLvl] = useState(false);

  const [iatLevel, setIatLevel] = useState(); 
  const [semLevel, setSemLevel] = useState();

  //   Client Side
  const [reports, setReports] = useState([]);
  const [iatReport, setIatReport] = useState({});
  const [semReport, setSemReport] = useState({});

  const fetchReports = async () => {

    try {

      const response = await axiosInstance.get(
        `/fetch-reports/${batchId}/${subjects[subjectId]}`
      );

      console.log("reports",response);

      if (response.data.error) {
        console.error("Failed to fetch reports:", response.data.message);
        alert("Failed to fetch reports.");
        return;
      } 
      
      if (!response.data.reports || response.data.reports.length === 0) {
        console.error("No reports found");
        alert("No reports found for this subject.");
        return;
      }

      console.log("Reports fetched successfully:", response.data.reports);
      alert("Reports fetched successfully.");
      setReports(response.data.reports);
      
      // Safely access reports with validation
      if (response.data.reports[0] && response.data.reports[0].report) {
        setIatReport(response.data.reports[0].report);
      }
      
      if (response.data.reports[1] && response.data.reports[1].report) {
        setSemReport(response.data.reports[1].report);
      }
      
    } catch (error) {
      console.error("Error fetching reports:", error);
      alert("An error occurred while fetching the reports.");
    }
  };

  const [CO1, setCO1] = useState(0);
  const [CO2, setCO2] = useState(0);
  const [CO3, setCO3] = useState(0);
  const [CO4, setCO4] = useState(0);
  const [CO5, setCO5] = useState(0);
  const [CO6, setCO6] = useState(0);

  const [showTable, setShowTable] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetchReports();
    console.log("Reports:",reports);
    // const firstReport = reports[0].report;
    // const secondReport = reports[1].report;
    // console.log(JSON.stringify(firstReport,null,2));
    // console.log(JSON.stringify(secondReport,null,2));

    const iatLvl = parseFloat(iatLevel);
    const semLvl = parseFloat(semLevel);

    if (iatLvl + semLvl != 100) {
      alert("invalid level entry");
      return;
    }

    // Validate that reports exist before calculating
    if (!iatReport || Object.keys(iatReport).length === 0) {
      alert("IAT report data is missing. Please ensure reports are loaded.");
      return;
    }

    if (!semReport || Object.keys(semReport).length === 0) {
      alert("SEM report data is missing. Please ensure reports are loaded.");
      return;
    }

    console.log("CO1:",semReport.CO1);
    
    setCO1((iatReport.CO1 || 0) * (iatLvl / 100) + (semReport.CO1 || 0) * (semLvl / 100));
    setCO2((iatReport.CO2 || 0) * (iatLvl / 100) + (semReport.CO2 || 0) * (semLvl / 100));
    setCO3((iatReport.CO3 || 0) * (iatLvl / 100) + (semReport.CO3 || 0) * (semLvl / 100));
    setCO4((iatReport.CO4 || 0) * (iatLvl / 100) + (semReport.CO4 || 0) * (semLvl / 100));
    setCO5((iatReport.CO5 || 0) * (iatLvl / 100) + (semReport.CO5 || 0) * (semLvl / 100));
    setCO6((iatReport.CO6 || 0) * (iatLvl / 100) + (semReport.CO6 || 0) * (semLvl / 100));

    console.log("CO1 : ",CO1);
    setOpenLvl(false);
    setShowTable(true);

    const report = {
      "CO1" : CO1,
      "CO2" : CO2,
      "CO3" : CO3,
      "CO4" : CO4,
      "CO5" : CO5,
      "CO6" : CO6,
    }

    try {
      const response = await axiosInstance.post("/add-reports",{
        batchId : batchId,
        subjectName : subjects[subjectId],
        flag : 0,
        report : report
      });

      if (response.data && response.data.note) {
        alert("Report Added Successfully");
      }

    }catch(error) {
      console.error("Error Response:", error.response?.data || error);
      alert("Unexpected Error on uploading Students List");
    }

  };



  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      <div className="flex items-center gap-6 justify-between w-full">
        {/* Batch Selection phrase */}
        <div className="flex gap-2 items-center justify-between">
          <h2 className="text-green-700">Select batch</h2>
          <select
            className="w-50 border rounded p-2 -mt-1"
            value={batchId}
            onChange={(e) => {
              setBatchId(e.target.value);
            }}
          >
            {allBatches.map(({ _id, name }) => {
              return <option value={_id}>{name}</option>;
            })}
          </select>
        </div>

        {/* Subject Selection phrase */}
        <div className="flex gap-3">
          <h2 className="text-green-700">Select Subject</h2>
          {console.log("selected subject : " + subjectId)}
          <select
            className="w-50 border rounded p-2 -mt-2 overflow-auto h-10 overflow-y-auto"
            value={subjectId}
            onChange={(e) => {
              setSubjectId(e.target.value);
            }}
          >
            {subjects.map((subject, idx) => {
              return <option value={idx}>{subject}</option>;
            })}
          </select>
        </div>

        {/*Level adding phrase  */}
        <div>
          <button
            className="bg-green-500 p-2 text-white font-medium rounded"
            onClick={() => {
              setOpenLvl(true);
            }}
          >
            <h2>set Level</h2>
          </button>
          {openLvl && (
            <Modal
              isOpen={openLvl}
              onRequestClose={() => {}}
              ariaHideApp={false}
              style={{
                overlay: {
                  backgroundColor: "rgba(0,0,0,.2)",
                },
              }}
              contentlabel=""
              className="w-[30%] max-h-2/4 bg-white rounded-md mx-auto mt-40 p-5"
            >
              <div className="flex flex-col p-1 gap-2">
                <div className="w-full flex items-center justify-between">
                  <h2>Set Level</h2>
                  <button
                    className="w-10 h-10 rounded-full flex items-center justify-center -mt-2 hover:bg-slate-50"
                    onClick={(e) => {
                      setOpenLvl(false);
                    }}
                  >
                    <MdClose className="text-xl text-slate-400" />
                  </button>
                </div>
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="flex gap-3 items-center justify-center">
                    <h2 className="mr-2">IAT</h2>
                    <input
                      type="text"
                      className="block rounded-md border-0 p-1 w-25 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm/6"
                      value={iatLevel}
                      onChange={(e) => setIatLevel(e.target.value)}
                      placeholder="eg. 20"
                    />
                  </div>
                  <div className="flex gap-3 items-center justify-center">
                    <h2>Sem </h2>
                    <input
                      type="text"
                      className="block rounded-md border-0 p-1 w-25 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm/6"
                      value={semLevel}
                      onChange={(e) => setSemLevel(e.target.value)}
                      placeholder="eg. 80"
                    />
                  </div>
                  <button
                    className="bg-green p-3 text-white font-medium rounded mt-2"
                    onClick={(e) => {
                      handleSubmit(e);
                    }}
                  >
                    set Level
                  </button>
                </div>
              </div>
            </Modal>
          )}
        </div>
      </div>

      <div>
        {showTable && (
          <div className="overflow-x-auto p-4">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Subject Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    CO1
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    CO2
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    CO3
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    CO4
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    CO5
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    CO6
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-left">
                    {subjects[subjectId]}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-left">
                    {CO1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-left">
                    {CO2}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-left">
                    {CO3}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-left">
                    {CO4}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-left">
                    {CO5}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-left">
                    {CO6}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Coreport;
