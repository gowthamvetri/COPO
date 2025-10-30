import React, { useState , useEffect} from 'react'
import { Link } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import * as XLSX from "xlsx";

const Attainment = () => {

  const [fileName,setFileName] = useState("");

  const [allBatches,setAllBatches] = useState([]);
  const [batchId,setBatchId] = useState("");

  const getAllBatch = async () => {

    try {
        const response = await axiosInstance.get("/get-all-batches");

        if(response.data && response.data.batches) {
            console.log(response.data.batches);
            setAllBatches(response.data.batches);
        }
    }catch(error) {
        console.log("An Unexpected Error : "+error);
    }
  }

  useEffect(()=>{
    getAllBatch()
  },[]);

  useEffect(() => {
      if (allBatches.length > 0) {
        setBatchId(allBatches[0]._id); 
      }
    }, [allBatches]);
  // Students Details fetching from Excel

  const [studentsData,setStudentsData] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Read with header row
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        console.log("Raw Excel data:", jsonData);

        // First row is headers, so we skip it and process from row 1 onwards
        const headers = jsonData[0];
        console.log("Headers:", headers);

        // Find the column indices for Registration Number and Student Name
        const regNumIndex = headers.findIndex(h => 
          h && (h.toString().toLowerCase().includes('registration') || 
                h.toString().toLowerCase().includes('registratic'))
        );
        const studentNameIndex = headers.findIndex(h => 
          h && h.toString().toLowerCase().includes('student')
        );

        console.log("Registration Number column index:", regNumIndex);
        console.log("Student Name column index:", studentNameIndex);

        const processedData = jsonData.slice(1).map((row) => {
          if (!row || row.length === 0) return null;
          
          return {
            registrationNumber: regNumIndex >= 0 ? row[regNumIndex] : row[0],
            studentName: studentNameIndex >= 0 ? row[studentNameIndex] : row[1],
          };
        }).filter(row => row && (row.registrationNumber || row.studentName));

        console.log("Processed data:", processedData);
        setStudentsData(processedData);
        addStudents(processedData);
      };
      reader.readAsArrayBuffer(file);
    }
  };


  const [uploadBtn,setUploadBtn] = useState(true);

  const addStudents = async (data) => {
    if (!data) {
        alert("Can't read unformatted file");
        return;
    }
    console.log("batchId",batchId);
    if(batchId=="") {
      alert("Please Select the batch");
      return;
    }

    try {
        console.log("Sending data:", { batchId, studentsData: data });
        const response = await axiosInstance.post("/add-students", {
            batchId: batchId,
            studentsData: data
        });

        if (response.data && response.data.note) {
            alert("Students List Added successfully");
            setUploadBtn(false);
        }
    } catch (error) {
        console.error("Error Response:", error.response?.data || error);
        alert("Unexpected Error on uploading Students List");
    }
};


  return (
    <>
      <div className='flex gap-2 items-center justify-start'>
          <h2 className='text-green-700'>Select batch</h2>
          <select className='w-50 border rounded p-2 -mt-1' value={batchId} onChange={(e)=>{setBatchId(e.target.value)}}>
            {
                allBatches.map(({_id,name})=> {
                    return <option value={_id}>{name}</option>
                })
            }
          </select>
        </div>
        <div className='flex items-center justify-center w-full mt-10'>
          <div className='flex flex-col items-center justify-center gap-3'>
              <h2 className='font-semibold text-green-500 '>CO-PO Attainment</h2>
              <div className={uploadBtn ? "" : "hidden"}>
                <label htmlFor="excelUpload" className=" w-[100%]  flex items-center justify-center p-3 bg-green-500 text-white rounded shadow-md cursor-pointer font-medium">{fileName || "Upload Students File"}</label>
                <input id="excelUpload" type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="hidden"/>
              </div>
              <Link to='/dashboard/dataEntry' className='bg-green-500 p-3 rounded text-white font-medium'>Attainment Data-Entry</Link>
          </div>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-bold mb-2">Extracted Data</h3>
        {studentsData.length === 0 ? (
          <p className="text-gray-500">No data uploaded yet. Please upload an Excel file.</p>
        ) : (
          <table className="min-w-full border border-gray-300 bg-white rounded-lg shadow-md">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="px-6 py-3 border-b-2">Registration Number</th>
                <th className="px-6 py-3 border-b-2">Student Name</th>
              </tr>
            </thead>
            <tbody>
              {studentsData.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-100">
                  <td className="px-6 py-3 border-b">{row.registrationNumber || 'N/A'}</td>
                  <td className="px-6 py-3 border-b">{row.studentName || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
    
  )
}

export default Attainment;
