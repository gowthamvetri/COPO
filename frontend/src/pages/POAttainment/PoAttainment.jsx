import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import * as XLSX from "xlsx";
import { IoMdCloudUpload } from "react-icons/io";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import Modal from "react-modal";
import { MdClose } from "react-icons/md";


const PoAttainment = () => {

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

//  Co Report From Client Side

    const getCOReport = async (batchId,subjectName)=>{

        try {
            const response = await axiosInstance.get(`/get-reports/${batchId}/${subjectName}`);
            console.log("response data to get CO-report",response.data);

            if (response.data.error) {
              console.error("Error fetching reports:", response.data.message);
              alert("Failed to fetch reports.");
            } else {
              console.log("Fetched reports successfully:", response.data.reports);
              return response.data.reports.filter((item) => item.flag === "2")[0].report;
            }
  
        }catch(error) {
          console.error("Error fetching reports:", error);
          alert("An error occurred while fetching reports.");
        }
    }

//  Po Report from Client Side

    const getPOReport = async (batchId,subjectName)=> {
        try {
            const response = await axiosInstance.get(`/getSubjectPOMapping/${batchId}/${subjectName}`);
            if(response.data.error) {
                console.error("Error fetching reports:", response.data.message);
                alert("Failed to fetch reports.");
            }else  {
                console.log("Fetched reports successfully:", response.data.mappingData);
                return response.data.mappingData.subjectMapData;
            }
        }catch(error) {
            console.error("Error fetching reports:", error);
            alert("An error occurred while fetching reports.");
        }
    }

    const calculateResults = (coObject, poreport) => {
        return poreport.map((poItem, idx) => {
            const coKey = `CO${idx + 1}`;
            const coValue = Number(coObject[coKey]);
            const PoObj = {};
        
            Object.keys(poItem).forEach((key) => {
              if (key.startsWith("PO")) {
                PoObj[key] = Number(poItem[key]) * coValue;
              }
            });
        
            return { ...PoObj, coKey };
        });
    }

    const [result,setResult] = useState();

    const driver = async (e)=>{
        e.preventDefault();

        const coreport = await getCOReport(batchId,subjects[subjectId]);
        const poreport = await getPOReport(batchId,subjects[subjectId]);

        console.log("co-report",poreport);

        setResult(await calculateResults(coreport, poreport));
    }

    

    const ResultTable = ({ result }) => {
        const tableHeaders = result.length > 0 ? Object.keys(result[0]) : [];
        return (
            <div className="container mx-auto p-4">
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    {tableHeaders.map((header, index) => (
                      <th
                        key={index}
                        className="border border-gray-300 px-4 py-2 text-left"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {tableHeaders.map((header, colIndex) => (
                        <td
                          key={colIndex}
                          className="border border-gray-300 px-4 py-2"
                        >
                          {row[header]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        );
    }


    return (
        <>
            <div className="flex  flex-col gap-3 items-center">
                <div className="flex flex-row gap-12 ml-12  justify-evenly w-full">
                    {/* Batch Selection */}
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

                    {/* Subject Selection */}
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

                    {/* Get Report Button */}
                    <button className="p-3 bg-green-500 text-white rounded font-medium text-sm" onClick={(e)=>{driver(e)}}>
                        Get PO Report
                    </button>
                </div>
                {
                    (
                        result!=undefined && result.length>0 ) && (
                            <div>
                                <h1 className="text-xl font-bold mb-4">Results Table</h1>
                                <ResultTable result={result} />
                            </div>
                    )
                }
            </div>
        </>
        
    )
}

export default PoAttainment
