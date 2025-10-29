import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import * as XLSX from "xlsx";
import { IoMdCloudUpload } from "react-icons/io";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import Modal from "react-modal";
import { MdClose } from "react-icons/md";
import axios from "axios";

const Surveyreport = () => {
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
    const names = allBatch.map((subject) => subject.courseName);
    const cono = allBatch.map((subject) => subject.coNo);
    setCourseNumber(cono);
    setAllSubjects(names);
  };

  useEffect(() => {
    getAllSubjects();
    getSubjects();
  }, [batchId]);

  // File Reading 
  const [openModal,setOpenModal] = useState(false);
  const [showTable,setShowTable] = useState(false);


  const [CO1, setCO1] = useState([]);
  const [CO2, setCO2] = useState([]);
  const [CO3, setCO3] = useState([]);
  const [CO4, setCO4] = useState([]);
  const [CO5, setCO5] = useState([]);
  const [CO6, setCO6] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      console.error("No file selected!");
      return;
    }

    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (evt) => {
      const binaryData = evt.target.result;
      const workbook = XLSX.read(binaryData, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      let rowIdx = 2;

      const columnCData = jsonData.map((row) => row[2]);

      let coType = columnCData[0];

      while (coType != "") {
        let columnData = jsonData.map((row) => row[rowIdx]);
        console.log("ColumnC Data : " + columnData); //
        coType = columnData[0] || "";
        console.log("COtype " , coType) //
        let coData = columnData.slice(1);
        console.log("CO Data : ", coData); //
        if (coData.length > 0 && coType) {
          switch (coType) {
            case "Q1":
              setCO1((prevCO1) =>
                prevCO1.length === 0
                  ? coData
                  : coData.map((val, idx) => Number(val) + (Number(prevCO1[idx]) || 0))
              );
              console.log("Q1",CO1);
              break;
            case "Q2":
              setCO2((prevCO2) =>
                prevCO2.length === 0
                  ? coData
                  : coData.map((val, idx) => Number(val) + (Number(prevCO2[idx]) || 0))
              );
              break;
            case "Q3":
              setCO3((prevCO3) =>
                prevCO3.length === 0
                  ? coData
                  : coData.map((val, idx) => Number(val) + (Number(prevCO3[idx]) || 0))
              );
              break;
            case "Q4":
              setCO4((prevCO4) =>
                prevCO4.length === 0
                  ? coData
                  : coData.map((val, idx) => Number(val) + (Number(prevCO4[idx]) || 0))
              );
              break;
            case "Q5":
              setCO5((prevCO5) =>
                prevCO5.length === 0
                  ? coData
                  : coData.map((val, idx) => Number(val) + (Number(prevCO5[idx]) || 0))
              );
              break;
            case "Q6":
              setCO6((prevCO6) =>
                prevCO6.length === 0
                  ? coData
                  : coData.map((val, idx) => Number(val) + (Number(prevCO6[idx]) || 0))
              );
              break;
            default:
              break;
          }
        }
        rowIdx += 1;
      }
    };
  };

  const helper = (arr) => {
    const sum = arr.reduce((acc, curr) => acc + curr, 0);
    console.log("sum",sum);
    const average = (sum / arr.length);
    const aboveAverageCount = ((arr.filter(value => value > average).length)/arr.length)*100;
    return aboveAverageCount;
  }

  const handleDataUpload = async(e) => {
      e.preventDefault();

      const val1 = helper(CO1);
      const val2 = helper(CO2);
      const val3 = helper(CO3);
      const val4 = helper(CO4);
      const val5 = helper(CO5);
      const val6 = helper(CO6);

      const report = {
        "CO1" : val1,
        "CO2" : val2,
        "CO3" : val3,
        "CO4" : val4,
        "CO5" : val5,
        "CO6" : val6
      };

      try {
        const response = await axiosInstance.post("/add-reports",{
          batchId : batchId,
          subjectName : subjects[subjectId],
          flag : 1,
          report : report
        });
  
        if (response.data && response.data.note) {
          alert("Report Added Successfully");
        }
      }catch(error) {
        console.error("Error Response:", error.response?.data || error);
        alert("Unexpected Error on uploading Students List");
      }

  }

  // generating Excel for final COPO report 

  const generateReport = (report) => {
    const excelHeaders = ["Subject Name", "CO1", "CO2", "CO3", "CO4", "CO5", "CO6"];

    const data = [subjects[subjectId],report.CO1,report.CO2,report.CO3,report.CO4,report.CO5,report.CO6]

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([excelHeaders, data]);
    XLSX.utils.book_append_sheet(wb, ws, 'Reports');
    XLSX.writeFile(wb, 'Reports.xlsx');

  }

  const [openfinal,setOpenFinal] = useState(false);
  const [coTarget,setCoTarget] = useState();
  const [surveyTarget,setSurveyTarget] = useState();

  const fetchReports = async(batchId,subjectName) => {
      try {
          const response = await axiosInstance.get(`/get-reports/${batchId}/${subjectName}`);
          if (response.data.error) {
            console.error("Error fetching reports:", response.data.message);
            alert("Failed to fetch reports.");
          } else {
            console.log("Fetched reports successfully:", response.data.reports);
            return response.data.reports;
          }

      }catch(error) {
        console.error("Error fetching reports:", error);
        alert("An error occurred while fetching reports.");
      }
  }

  const addReport = async (report)=>{

  }

  const finalReport = {};
  const [finalFlagReport, setFinalFlagReport] = useState({});
  const [average, setAverage] = useState(0);

  const getFinalReport = async (arr1,arr2)=> {
    const allKeys = Object.keys(arr1[0].report);

    const report1 = arr1[0].report;
    const report2 = arr2[0].report;

    console.log("report 1 " , report1);
    console.log("Report 2" , report2);


    allKeys.forEach((key)=>{
      finalReport[key] = parseFloat(report1[key]*coTarget) + parseFloat(report2[key]*surveyTarget);
    })

    await handleFinalReport(finalReport) // handle final Report Client Side

    const updateReport = {};

    for (const [key, value] of Object.entries(finalReport)) {
      const percentage = parseInt(value, 10); 
      if (percentage >= 81 && percentage <= 100) {
        updateReport[key] = 3;
      } else if (percentage >= 61 && percentage <=80) {
        updateReport[key] = 2;
      } else {
        updateReport[key] = 1;
      }

      setFinalFlagReport(updateReport);
      const total = Object.values(updateReport).reduce((acc, curr) => acc + curr, 0);
      const avg = total / Object.values(updateReport).length;

      setAverage(avg);
    }
    console.log("finalFlag Report : ",JSON.stringify(finalFlagReport,null,2));
    
    generateReport(finalReport)
  }

  const handleSubmit = async(e) => {
    e.preventDefault();

    const val1 = parseFloat(coTarget);
    const val2 = parseFloat(surveyTarget);

    if(val1+val2 !=100) {
      alert("invalid level entry");
      return;
    }

    const reports = await fetchReports(batchId,subjects[subjectId]);

    console.log("Final Reports  : ",reports)

    const flag0Reports = reports.filter(report => report.flag === "0");
    const flag1Reports = reports.filter(report => report.flag === "1");

    console.log("Flag o reports : ",flag0Reports);
    console.log("Flag 1 reports : ",flag1Reports)

    getFinalReport(flag0Reports,flag1Reports);

    setOpenFinal(false);

  }

  const [showReport,setShowReport] = useState(false);

  const handleFinalReport = async(report) => {
    // e.preventDefault()
    try {
      const response = await axiosInstance.post("/add-reports",{
        batchId : batchId,
        subjectName : subjects[subjectId],
        flag : 2,
        report : report
      });

      if (response.data && response.data.note) {
        alert("Report Added Successfully");
      }
    }catch(error) {
      console.error("Error Response:", error.response?.data || error);
      alert("Unexpected Error on uploading Students List");
    }
}


  return (
    <>
      <div className="flex  flex-col gap-3 items-center">
        <div className="flex flex-row gap-12 ml-12  justify-evenly w-full   ">
          <div className="flex felx-row gap-3 items-center">
            <h2 className="text-green-700">Select batch</h2>
            <select
              className="w-50 border rounded p-2 -mt-2 overflow-auto h-10 overflow-y-auto"
              value={batchId}
              onChange={(e) => {
                setBatchId(e.target.value);
              }}
            >
              {
                allBatches.map(({ _id, batchName }) => {
                  return (
                    <option key={_id} value={_id}>
                      {batchName}
                    </option>
                  );
                })
              }
            </select>
          </div>
          <div className=" flex flex-row gap-2 items-center">
            <h2 className="text-green-700">Select Subject </h2>
            <select
              className="w-50 border rounded p-2 -mt-2 overflow-auto h-10 overflow-y-auto"
              value={subjectId}
              onChange={(e) => {
                setSubjectId(e.target.value);
              }}
            >
              {subjects.map((subject, idx) => {
                return (
                  <option key={idx} value={idx}>
                    {subject}
                  </option>
                );
              })}
            </select>
          </div>
          <button
            className="flex items-center justify-center w-30 gap-3 bg-green-500 p-3 text-white rounded font-medium -mt-3"
            onClick={(e) => {
              setOpenModal(true);
            }}
          >
            <IoMdCloudUpload />
            <h2>Upload</h2>
          </button>
          {openModal && (
            <Modal
              isOpen={openModal}
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
                  <h2>Upload Excel</h2>
                  <button
                    className="w-10 h-10 rounded-full flex items-center justify-center -mt-2 hover:bg-slate-50"
                    onClick={(e) => {
                      setOpenModal(false);
                    }}
                  >
                    <MdClose className="text-xl text-slate-400" />
                  </button>
                </div>
                <div className="flex items-center justify-center w-full ml-5 mt-4">
                  <input
                    type="file"
                    accept=".xlsx, .xls"
                    className="mb-4 "
                    onChange={(e) => {
                      handleFileUpload(e);
                    }}
                  />
                </div>

                <button
                  className="bg-green-500 p-1 px-3 rounded flex items-center justify-center text-white font-medium mt-8 gap-2"
                  onClick={(e) => {
                    handleDataUpload(e);
                    setOpenModal(false)
                    setShowTable(true);
                  }}
                >
                  Upload
                </button>
                <p className="text-red-500 text-sm">
                  Please ensure that uploaded excel is in the required format
                </p>
              </div>
            </Modal>
          )}
          {/* final Report button */}
          <div className="">
            <button
              className="bg-green-500 p-2 text-white font-medium rounded"
              onClick={() => {
                setOpenFinal(true);
              }}
            >
              <h2>Get final Report</h2>
            </button>

            {
              openfinal && (
                <Modal
                  isOpen={openfinal}
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
                            setOpenFinal(false);
                          }}
                        >
                          <MdClose className="text-xl text-slate-400" />
                        </button>
                      </div>

                      <div className="flex flex-col items-center justify-center gap-4">
                          <div className="flex items-center justify-center gap-3 ">
                            <h2>CO Report : </h2>
                            <input
                              type="text"
                              className="block rounded-md border-0 p-1 w-25 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm/6"
                              value={coTarget}
                              onChange={(e) => setCoTarget(e.target.value)}
                              placeholder="eg. 20"
                            />
                          </div>
                          <div className="flex items-center justify-center gap-3 ">
                            <h2>survey Report : </h2>
                            <input
                              type="text"
                              className="block rounded-md border-0 p-1 w-25 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm/6"
                              value={surveyTarget}
                              onChange={(e) => setSurveyTarget(e.target.value)}
                              placeholder="eg. 80"
                            />
                          </div>
                          <button
                            className="bg-green-500 p-3 text-white font-medium rounded mt-2"
                            onClick={(e) => {
                              handleSubmit(e);
                              setShowReport(true);
                            }}
                          >
                              Download
                          </button>
                      </div>

                  </div> 
                </Modal>
              )
            }
          </div>

        </div>


        
        

          {/* Display table */}
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

        {/* Display the final Report table */}
        <div>
          {(!showTable && showReport) && (
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
                    {console.log("Final Repoort in table ",finalFlagReport)}
                    <td className="border border-gray-300 px-4 py-2 text-left">
                      {subjects[subjectId]}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-left">
                      {finalFlagReport.CO1}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-left">
                      {finalFlagReport.CO2}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-left">
                      {finalFlagReport.CO3}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-left">
                      {finalFlagReport.CO4}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-left">
                      {finalFlagReport.CO5}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-left">
                      {finalFlagReport.CO6}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
        {showReport && <h2>Final CO Attainment of {subjects[subjectId]} is {average}</h2>}
      </div>
    </>
  );
};
export default Surveyreport;
