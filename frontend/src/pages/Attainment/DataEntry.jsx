import React from "react";
import * as XLSX from "xlsx";
import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { IoMdCloudUpload } from "react-icons/io";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import Modal from "react-modal";
import { MdClose } from "react-icons/md";
import { IoIosAdd } from "react-icons/io";
import { IoIosAddCircle } from "react-icons/io";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Link } from "react-router-dom";

const DataEntry = () => {
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
    
    if (!batchId) {
      console.log("BatchId is not set yet, skipping getAllSubjects");
      return;
    }

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

  // -------------------------------------------------//
  // End of Subjects \\
  //-----------------------------------------\\

  // Handling Generate Excel Sheet concept
  const [Iat, setIat] = useState(["IAT 1", "IAT 2", "IAT 3", "SEM"]);
  const [selectIat, setSelectIat] = useState("");

  const [selectedCO, setSelectedCO] = useState("");
  const [marks, setMarks] = useState(0);

  const [generatemodel, setgeneratemodel] = useState(false);

  const [headers, setHeaders] = useState([]);

  const handleNextColumn = (e) => {
    e.preventDefault();
    const data = {
      CO: selectedCO,
      marks,
    };

    setHeaders((prevHeaders) => {
      const updatedHeaders = [...prevHeaders, data];
      return updatedHeaders;
    });

    setSelectedCO("");
    setMarks(0);

    setTimeout(() => {
      console.log("Excel Headers will be: ", headers);
    }, 0);
  };

  const [assignmentCo, setAssignmentCo] = useState("");
  const [assignmentMarks, setAssignmentMarks] = useState(0);

  const [assignmentHeaders, setAssignmentHeaders] = useState([]);

  const handleAddColumn = (e) => {
    e.preventDefault();

    const data = {
      CO: assignmentCo,
      marks: assignmentMarks,
    };

    setAssignmentHeaders((prevHeaders) => {
      const updatedHeaders = [...prevHeaders, data];
      return updatedHeaders;
    });

    setAssignmentCo("");
    setAssignmentMarks(0);
  };

  const [studentsData, setStudentsData] = useState([]);

  const [studentsCount,setStudentsCount] = useState(0);


//Students-data Payload
  const getStudentsData = async () => {
    if (!batchId) {
      console.log("BatchId is not set yet, skipping getStudentsData");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      console.log("token from client Side : " + token);
      console.log("batchId from client Side : " + batchId);
      const response = await axiosInstance.get("/get-students/" + batchId, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.studentsData) {
        setStudentsData(response.data.studentsData);
      }
    } catch (error) {
      console.error("Error fetching students' data:", error);
    }
  };

  const [studentsArray, setStudentsArray] = useState([]);

  useEffect(() => {
    if (studentsData && studentsData.length > 0) {
      // Get the studentsData array from the first object
      const students = studentsData[0]?.studentsData || [];
      console.log("Setting studentsArray:", students);
      setStudentsArray(students);
      
      // Show table when students data is loaded
      if (students.length > 0) {
        showtable(true);
      }
    }
  }, [studentsData]);

  // console.log("Students Data : " + JSON.stringify(studentsArray, null, 2));
  

  useEffect(() => {
    if (batchId) {
      getStudentsData();
    }
  }, [batchId]);

  useEffect(() => {
    setStudentsCount(studentsArray.length);
    console.log("StudentsCount",studentsCount);
  }, [studentsArray]);

  // End of Students-data payload ------------------------------\\\

  // Excel Sheet Generation \\
  // setStudentsCount(studentsArray.length);

  const generateExcel = (e) => {
    e.preventDefault();
    try {
      setStudentsCount(studentsArray.length);
      if (Iat[selectIat] == "SEM") {
        const ExcelHeader = [
          ["", subjects[subjectId], "", "", "", ""],
          ["CO's in SEM ", "", ""],
          ["", "", "", "", "", "", ""],
          [
            "Registration Number ",
            "Students Name",
            "CO1",
            "CO2",
            "CO3",
            "CO4",
            "CO5",
            "CO6",
          ],
          ...studentsArray.map((student) => [
            student.registrationNumber,
            student.studentsName,
          ]),
        ];
        const worksheet = XLSX.utils.json_to_sheet(ExcelHeader);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Students Data");

        const excelData = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });

        const blob = new Blob([excelData], {
          type: "application/octet-stream",
        });

        saveAs(blob, "Sem_data.xlsx");
        console.log("Excel sheet generated successfully!");
      } else {
        const assignmentCOs = assignmentHeaders.map((item) => item.CO);
        const headerCOs = headers.map((item) => item.CO);
        const allCOs = [...headerCOs, ...assignmentCOs];
        const excelHeaders = [`CO's of ${Iat[selectIat]}`, "", ...allCOs];
        const headerMarks = headers.map((item) => item.marks);
        const assignmentMarks = assignmentHeaders.map((item) => item.marks);
        const ExcelHeader = [
          ["", subjects[subjectId], "", Iat[selectIat], "Assignment", ""],
          excelHeaders,
          ["Total Marks for each CO's", "", ...headerMarks, ...assignmentMarks],
          ["Registration Number ", "Students Name"],
          ...studentsArray.map((student) => [
            student.registrationNumber,
            student.studentsName,
          ]),
        ];

        const worksheet = XLSX.utils.json_to_sheet(ExcelHeader);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Students Data");

        const excelData = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });

        const blob = new Blob([excelData], {
          type: "application/octet-stream",
        });

        saveAs(blob, "Student_Data.xlsx");
        setgeneratemodel(false)
        console.log("Excel sheet generated successfully!");
      }
    } catch (error) {
      console.error("Error generating Excel sheet:", error);
    }
  };

  // Reading Excel Sheet // 
  //------------Start-------------------------------\\
  const [openUpload, setOpenUpload] = useState(false);
 
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

    console.log("Entered File Upload");

    const reader = new FileReader();
    reader.readAsBinaryString(file);

    reader.onload = (evt) => {
      const binaryData = evt.target.result;
      const workbook = XLSX.read(binaryData, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      let rowIdx = 2;
      console.log("Here");
      const columnCData = jsonData.map((row) => row[2]);
      console.log("columnCData",columnCData);
      let coType = "";
      if(Iat[selectIat] === "SEM") {
        coType = columnCData[rowIdx+2];
      }else {
        coType = columnCData[rowIdx];
      }
      
      console.log("coType",coType);

      while (coType != "") {
        let columnData = jsonData.map((row) => row[rowIdx]);
        console.log("ColumnC Data : " + columnData + rowIdx);
        if(Iat[selectIat] === "SEM") {
          coType = columnData[4] || "";
        }else {
          coType = columnData[2] || "";
        }

        console.log("coType",coType)
        let coData = columnData.slice(5);
        console.log("coData", coData);
        if (coData.length > 0) {
          console.log("check",coType);
          switch (coType) {
            
            case "CO1":
              console.log("coData-CO1",coData);
              setCO1((prevCO1) =>
                prevCO1.length === 0
                  ? coData
                  : coData.map((val, idx) => val + (prevCO1[idx] || 0))
              );
              console.log("setco1",CO1);
              break;
            case "CO2":
              
              setCO2((prevCO2) =>
                prevCO2.length === 0
                  ? coData
                  : coData.map((val, idx) => val + (prevCO2[idx] || 0))
              );
              break;
            case "CO3":
              setCO3((prevCO3) =>
                prevCO3.length === 0
                  ? coData
                  : coData.map((val, idx) => val + (prevCO3[idx] || 0))
              );
              break;
            case "CO4":
              setCO4((prevCO4) =>
                prevCO4.length === 0
                  ? coData
                  : coData.map((val, idx) => val + (prevCO4[idx] || 0))
              );
              break;
            case "CO5":
              setCO5((prevCO5) =>
                prevCO5.length === 0
                  ? coData
                  : coData.map((val, idx) => val + (prevCO5[idx] || 0))
              );
              break;
            case "CO6":
              setCO6((prevCO6) =>
                prevCO6.length === 0
                  ? coData
                  : coData.map((val, idx) => val + (prevCO6[idx] || 0))
              );
              break;
            default:
              break;
          }
        }
        rowIdx += 1;
        console.log("Row Index : ", CO1);
      }
      
      // Show table after file upload
      showtable(true);
    };
   
  };

  // const SemDataAnalysis = async (e) => {
  //   e.preventDefault();

  //   const totalCO1 = CO1.reduce((sum, val) => sum + val, 0);
  //   const totalCO2 = CO2.reduce((sum, val) => sum + val, 0);
  //   const totalCO3 = CO3.reduce((sum, val) => sum + val, 0);
  //   const totalCO4 = CO4.reduce((sum, val) => sum + val, 0);
  //   const totalCO5 = CO5.reduce((sum, val) => sum + val, 0);
  //   const totalCO6 = CO6.reduce((sum, val) => sum + val, 0);

  //   const report = {
  //     CO1 : totalCO1,
  //     CO2 : totalCO2,
  //     CO3 : totalCO3,
  //     CO4 : totalCO4,
  //     CO5 : totalCO5,
  //     CO6 : totalCO6
  //   }

  //   console.log("TotalCO values:" ,totalCO1);

  //   try {
  //     const response = await axiosInstance.post("/semReportAvg",{
  //       batchId : batchId,
  //       subjectName : subjects[subjectId],
  //       report : report
  //     });
  
  //     if(response.data && response.data.report) {
  //       alert("SemReport Added Successfully");
  //     }

  //   }catch(error) {
  //     console.error("Error Response:", error.response?.data || error);
  //     alert("Unexpected Error on uploading Students List");
  //   }
    

  // }

  console.log("CO 1 in Sem : " + CO3);

  const [avgs, setavg] = useState([]);
  const [maxavg, setmaxavg] = useState([]);
  const [belowavg, setbelowavg] = useState([]);
  const [subjectCOData, setSubjectCOData] = useState([]);

  const generatexl = () => {
    try {
      console.log("The averageeee", avgs);
      console.log("The Max-average", maxavg);
      console.log("The Below-average", belowavg);
      const excelHeaders = ["", "CO1", "CO2", "CO3", "CO4", "CO5", "CO6"];
      const avgRow = ["Avg Marks", ...Object.values(avgs)];
      const aboveAvgRow = ["Above Avg", ...Object.values(maxavg)];
      const belowAvgRow = ["Below Avg", ...Object.values(belowavg)];
      const ExcelHeader = [excelHeaders, avgRow, aboveAvgRow, belowAvgRow];
      const worksheet = XLSX.utils.aoa_to_sheet(ExcelHeader);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Average Data");

      const excelData = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelData], {
        type: "application/octet-stream",
      });

      saveAs(blob, "CO_Analysis.xlsx");

      console.log("Excel sheet generated successfully!");
    } catch (error) {
      console.error("Error generating Excel sheet:", error);
    }
  };

  // Fetching COData ---> Process 1 of Updation
  const getSubjectCoData = async (req, res) => {
    try {
      if (!batchId) {
        alert("Select the Batch");
        return;
      }

      if (!subjects[subjectId]) {
        alert("Select the Subject");
        return;
      }

      console.log("subjectName-check",subjects[subjectId]);
      const subjectName = subjects[subjectId];
      const response = await axiosInstance.get(
        "/getSubjectCo/" + batchId + "/" + subjectName
      );

      console.log("reading-process-1",response.data);

      if (response.data && response.data.subjectCOData) {
        setSubjectCOData(response.data.subjectCOData);
        console.log("getSubjectsCOData " + JSON.stringify(subjectCOData,null,2)+subjectCOData.length);
      }

    } catch (error) {
      console.log("An Unexpected Error : " + error);
    }
  };

  useEffect(()=>{
    getSubjectCoData(); 
  },[subjectId]);



  const handleUpload = (e) => {
    e.preventDefault();
    getSubjectCoData();
    setOpenUpload(true);
  };

  console.log(
    `CO Attainment for ${subjects[subjectId]} ${JSON.stringify(
      subjectCOData,
      null,
      2
    )}`
  );

  // End of Reading SubjectCO-data process-1

  const addArrays = (arr1, arr2) => {
    console.log("From AddArrays",arr1,arr2);
    const maxLength = Math.max(arr1.length, arr2.length);
    const result = Array(maxLength).fill(0);
    for (let i = 0; i < maxLength; i++) {
      result[i] = (arr1[i] || 0) + (arr2[i] || 0);
    }
    return result;
  };

  // console.log("subjectCOData[0].CO1",subjectCOData[0].CO1);
  const [updatedCO,setUpdateCO] = useState({});

  const updateSubjectCO = async (e) => {
    e.preventDefault();

    console.log("Entered UpdateSubjectCO",subjectCOData);
    
    if(subjectCOData.length==1) {
      console.log(CO1,CO2,CO3);
      setUpdateCO({
        CO1 : CO1,
        CO2 : CO2,
        CO3 : CO3,
        CO4 : CO4,
        CO5 : CO5,
        CO6 : CO6
      })
    }else {
      getSubjectCoData();
      setUpdateCO({
        CO1: addArrays(CO1, subjectCOData[0].CO1),
        CO2: addArrays(CO2, subjectCOData[0].CO2),
        CO3: addArrays(CO3, subjectCOData[0].CO3),
        CO4: addArrays(CO4, subjectCOData[0].CO4),
        CO5: addArrays(CO5, subjectCOData[0].CO5),
        CO6: addArrays(CO6, subjectCOData[0].CO6),
      });
    }
    

    console.log("After Pay",updatedCO);

    console.log(`UpdatedCO :  ${JSON.stringify(updatedCO, null, 2)}`);

    if (Iat[selectIat] != "SEM") {

      try {
        console.log(`Update Subject CO Data : ${updatedCO}`);
        const response = await axiosInstance.put(
          `/update-subject-co/${batchId}/${subjects[subjectId]}`,
          updatedCO
        );
        console.log("Update-CO-data",JSON.stringify(response,null,2));
        if (response.data.error) {
          console.error("Failed to update subject CO:", response.data.message);
          alert("Failed to update subject CO.");
        } else {
          console.log(
            "Subject CO updated successfully:",
            response.data.updatedSubject
          );
          alert("Subject CO updated successfully.");
        }
      } catch (error) {
        console.error("Error updating subject CO:", error);
        alert("An error occurred while updating the subject CO.");
      }
    }
  };

  // End of Updation Process

  const [updateco, setupdateco] = useState([]);
  const fetchupdateco = async () => {
    if (!batchId || !subjects[subjectId]) {
      console.log("BatchId or subject is not set yet, skipping fetchupdateco");
      return;
    }

    try {
      const response = await axiosInstance.get(
        `/getSubjectCo/${batchId}/${subjects[subjectId]}`
      );
      if (response.data && response.data.subjectCOData) {
        console.log(
          "updaetco from server fetched data" +
            JSON.stringify(response.data.subjectCOData, null, 2)
        );
        setupdateco(response.data.subjectCOData);
        
        // Show table when CO data is loaded from database
        if (response.data.subjectCOData.length > 0) {
          showtable(true);
        }
      }
    } catch (error) {
      console.log("Erro from fetchupdatco " + error);
    }
  };

  console.log("Fetched updateco data:", updateco);

  useEffect(() => {
    console.log("Fetched updateco data:", updateco);
    console.log("The average", avgs);
    console.log("The Max-average", maxavg);
    console.log("The Below-average", belowavg);
    
    if (batchId && subjects[subjectId]) {
      fetchupdateco();
    }
  }, [batchId, subjectId, subjects]);

  useEffect(() => {
    setStudentsCount(studentsArray.length);
  }, [studentsArray]);

  const [table, showtable] = useState(false);
  
  const loop = () => {
    for(let k=1;k<=6;k++) {
      console.log("Entered Loop");
      maxavg[`CO${k}`] = (aboveavg[`CO${k}`]/studentsCount)*100;
      console.log("Hello-check",`maxAvg${k} : ${maxavg[`CO${k}`]}`);
    }
  }

  const Avgfunction = async (e) => {
    e.preventDefault();
    handleSubmit();
  
    // console.log("The averageeeeeee", avgs);
    // console.log("The Max-average", maxavg);
    // console.log("The Below-average", belowavg);
  
    const avg = {};
    const aboveavg = {};
    const belowavg = {};
    const maxAvgObj = {}; // Initialize maxavg as an object
  
    console.log("enter into avgfunction");
    const codoc = updateco[0];
    console.log("Code Oc : " + JSON.stringify(codoc, null, 2));
  
    for (let i = 1; i <= 6; i++) {
      console.log("ans-codOc", codoc);
      const currentco = codoc[`CO${i}`];
      console.log("CurrentCO-avg " + currentco);
  
      if (currentco && currentco.length > 0) {
        const total = currentco.reduce((sum, value) => sum + value, 0);
        const average = total / currentco.length;
        avg[`CO${i}`] = average.toFixed(2);
  
        const lenaboveavg = currentco.filter(value => value >= average).length;
        aboveavg[`CO${i}`] = lenaboveavg;
        belowavg[`CO${i}`] = currentco.length - lenaboveavg;
  
        // Calculate max average percentage for each CO
        maxAvgObj[`CO${i}`] = ((lenaboveavg / studentsCount) * 100).toFixed(2);
      } else {
        avg[`CO${i}`] = "0.00";
        aboveavg[`CO${i}`] = "0";
        belowavg[`CO${i}`] = "0";
        maxAvgObj[`CO${i}`] = "0.00"; // Ensure maxavg is initialized
      }
    }
  
    // Update the state correctly
    setavg(avg);
    setbelowavg(belowavg);
    setmaxavg(maxAvgObj); // Store max averages in state
  
    console.log("Final Max Average:", maxAvgObj);
  
    // await loop();
    generatexl();
  
    if (Iat[selectIat] === "SEM") {
      addSemReport(maxAvgObj);
    } else {
      updateIatReport(maxAvgObj);
    }
  };
  

  console.log("OutSide Function");
  console.log("Students Above Avg : " + JSON.stringify(maxavg, null, 2));

  const addSemReport = async (report) => {

    console.log("Entered",report,"null");

    if (!report) {
      alert("Report is not generated yet :)");
      return;
    }

    if (!batchId) {
      alert("batchId is not generated yet :)");
      return;
    }

    if (!subjects[subjectId]) {
      alert("Select the Subject");
      return;
    }

    try {

      console.log(
        `Report Client Data : ${batchId} ${subjects[subjectId]} ${JSON.stringify(report,null,2)}`
      );
      
      const response = await axiosInstance.post("/add-SemAttainmentReport", {
        batchId: batchId,
        subjectName: subjects[subjectId],
        isSem: true,
        report: report,
      });

      if (response.data && response.data.note) {
        alert("Report Added Successfully");
        // setUploadBtn(false);
      }

    } catch (error) {
      console.error("Error Response:", error.response?.data || error);
      alert("Unexpected Error on uploading Students List");
    }
  };


  const updateIatReport = async (report) => {

    console.log("Entered UpdateIatReport");

    try {
      console.log("Report being sent:", report);
      console.log("ReportbatchId:",subjects[subjectId],"Hello");

      if (!report || Object.keys(report).length === 0) {
        console.error("Report object is empty or undefined.");
        alert("Invalid report data.");
        return;
      }

      const response = await axiosInstance.post("/update-subjectReport",
        {
          batchId : batchId,
          subjectName : subjects[subjectId],
          report : report
        }
      );
      if (response.data && response.data.subjectReport) {
        alert("Report Added Successfully");
      }

    } catch (error) {
      console.error("Error updating subject CO:", error);
      alert("An error occurred while updating the subject CO.");
    }
  };

  const handleSubmit = (e) => {
    if(Iat[selectIat] === "SEM") {
      addSemReport(e);
    }
    fetchupdateco(e);
    // getSubjectCoData();
    updateSubjectCO(e);
    showtable(true);
  }

  return (
    <>
      <div className="flex gap-4 items-center justify-between">
        <div className="flex gap-2 items-center justify-center">
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

        <div className="flex gap-3">
          <h2 className="text-green-700">Select Subject</h2>
          {/* {console.log("selected subject : " + subjectId)} */}
          <select
            className="w-50 border rounded p-2 -mt-2 overflow-auto h-10 overflow-y-auto"
            value={subjectId}
            onChange={(e) => {
              setSubjectId(e.target.value || 0);
            }}
          >
            {subjects.map((subject, idx) => {
              return <option value={idx}>{subject}</option>;
            })}
          </select>
        </div>
        <div className="flex gap-3">
          <h2 className="text-green-700">Select IAT</h2>
          <select
            className="w-50 border rounded p-2 -mt-2 overflow-auto h-10 overflow-y-auto"
            value={selectIat}
            onChange={(e) => {
              setSelectIat(e.target.value);
            }}
          >
            {Iat.map((iat, idx) => {
              return <option value={idx}>{iat}</option>;
            })}
          </select>
        </div>

        <button
          className="flex items-center justify-center w-30 gap-3 bg-green-500 p-3 text-white rounded font-medium"
          onClick={(e) => {
            handleUpload(e);
          }}
        >
          <IoMdCloudUpload />
          <h2>Upload</h2>
        </button>

        {openUpload && (
          <Modal
            isOpen={openUpload}
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
                    setOpenUpload(false);

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
                  handleSubmit(e)
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
        {/* Generate Modal */}
        <button
          className="flex items-center justify-center w-30 gap-3 bg-green-500 p-3 text-white rounded font-medium"
          onClick={() => setgeneratemodel(true)}
        >
          <MdOutlineCreateNewFolder className="text-lg" />
          <h2>generate</h2>
        </button>
      </div>
      <div>
        {generatemodel && (
          <Modal
            isOpen={generatemodel}
            onRequestClose={() => setgeneratemodel(false)}
            ariaHideApp={false}
            style={{
              overlay: {
                backgroundColor: "rgba(0,0,0,.2)",
              },
            }}
            className="w-[65%] max-h-2/4 bg-white rounded-md mx-auto mt-10 p-5"
          >
            <div className="flex flex-col p-1 gap-3">
              <div className="w-full flex items-center justify-between">
                <h2>Enter Data</h2>
                <button
                  className="w-10 h-10 rounded-full flex items-center justify-center -mt-2 hover:bg-slate-50"
                  onClick={() => setgeneratemodel(false)}
                >
                  <MdClose className="text-xl text-slate-400" />
                </button>
              </div>

              <form className="mt-2">
                {/* Input Form Box */}
                <div className="flex flex-col w-full items-center justify-center gap-4">
                  <div className="flex items-center justify-center w-full gap-10">
                    <div className="flex flex-col gap-1 mt-3">
                      <h3 className="text-sm text-slate-400 font-medium">
                        CO.NO
                      </h3>
                      <select
                        className="block rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm/6"
                        value={selectedCO}
                        onChange={(e) => setSelectedCO(e.target.value)}
                      >
                        <option value="">Select CO</option>
                        <option value="CO1">CO1</option>
                        <option value="CO2">CO2</option>
                        <option value="CO3">CO3</option>
                        <option value="CO4">CO4</option>
                        <option value="CO5">CO5</option>
                        <option value="CO6">CO6</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1 mt-3">
                      <h3 className="text-sm text-slate-400 font-medium">
                        Marks
                      </h3>
                      <input
                        type="text"
                        className="block rounded-md border-0 p-1 w-25 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm/6"
                        value={marks}
                        onChange={(e) => setMarks(e.target.value)}
                        placeholder="Enter marks"
                      />
                    </div>

                    <button
                      className="bg-green-500 p-1 px-3 rounded flex items-center justify-center text-white font-medium mt-8 gap-2"
                      onClick={(e) => {
                        handleNextColumn(e);
                      }}
                    >
                      <IoIosAddCircle />
                      <h2>Add</h2>
                    </button>
                  </div>
                  {/* //here */}

                  {headers && (
                    <div className="flex items-center justify-center gap-6">
                      <h2>Added Columns </h2>
                      {headers &&
                        headers.map((object, idx) => {
                          return (
                            <div className="flex items-center justify-center gap-2 bg-gray-100 rounded p-2">
                              <p>{object.CO} : </p>
                              <p>{object.marks}</p>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>

                <hr className="mt-5 font-medium" />

                <div className="flex w-full flex-col items-start justify-center mt-3 gap-3">
                  <h2 className="">Assignment Entry</h2>
                  <div className="flex items-center justify-center w-full gap-10">
                    <div className="flex flex-col gap-1 mt-3">
                      <h3 className="text-sm text-slate-400 font-medium">
                        CO.NO
                      </h3>
                      <select
                        className="block rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm/6"
                        value={assignmentCo}
                        onChange={(e) => setAssignmentCo(e.target.value)}
                      >
                        <option value="">Select CO</option>
                        <option value="CO1">CO1</option>
                        <option value="CO2">CO2</option>
                        <option value="CO3">CO3</option>
                        <option value="CO4">CO4</option>
                        <option value="CO5">CO5</option>
                        <option value="CO6">CO6</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1 mt-3">
                      <h3 className="text-sm text-slate-400 font-medium">
                        Marks
                      </h3>
                      <input
                        type="text"
                        className="block rounded-md border-0 p-1 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm/6"
                        value={assignmentMarks}
                        onChange={(e) => setAssignmentMarks(e.target.value)}
                        placeholder="Enter marks"
                      />
                    </div>

                    <button
                      className="bg-green-500 p-1 px-3 rounded flex items-center justify-end text-white font-normal mt-8 gap-3"
                      onClick={(e) => {
                        handleAddColumn(e);
                      }}
                    >
                      <IoIosAddCircle />
                      <h2>Add</h2>
                    </button>
                  </div>
                </div>
                {
                  <div className="flex items-center justify-center gap-6 mt-4">
                    <h2>Added Columns </h2>
                    {assignmentHeaders &&
                      assignmentHeaders.map((object, idx) => {
                        return (
                          <div className="flex items-center justify-center gap-2 bg-gray-100 rounded p-2">
                            <p>{object.CO} : </p>
                            <p>{object.marks}</p>
                          </div>
                        );
                      })}
                  </div>
                }

                <div className="mt-6 w-full flex gap-16 items-center justify-around rounded text-white">
                  <button
                    className="bg-green-500 p-2 rounded"
                    onClick={(e) => {
                      generateExcel(e);
                    }}
                  >
                    <h2>Generate Sheet</h2>
                  </button>
                </div>
              </form>
            </div>
          </Modal>
        )}
      </div>
      {/* End Here */}

      <div className="flex items-center justify-between gap-10">
        <button
          onClick={(e) => {
            Avgfunction(e);
          }}
          className="flex  mt-6 items-center justify-center w-30 gap-3 bg-green-500 p-3 text-white rounded font-medium"
        >
          <h2>Generate Avg</h2>
        </button>
        {/* <button
              className="flex items-center justify-center w-30 gap-3 bg-green-500 p-3 text-white rounded font-medium mt-6"
            >
              <MdOutlineCreateNewFolder className="text-lg" />
              <h2>get final Report</h2>
            </button> */}

        <Link
          to={`/dashboard/COreport`}
          className="bg-green-500 p-3 text-white rounded font-medium"
        >
          get final Report
        </Link>
      </div>

      {/* <button
        onClick={(e) => {
          Avgfunction(e);
          generatexl();
        }}
        className="flex  mt-6 items-center justify-center w-30 gap-3 bg-green-500 p-3 text-white rounded font-medium"
      >
        <h2>Generate Avg</h2>
      </button> */}

      {table && (
        <table className="table-auto border-collapse border mt-8 border-gray-300 w-full text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2 text-left">
                Register Number
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Name
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                CO1
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                CO2
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                CO3
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                CO4
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                CO5
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                CO6
              </th>
            </tr>
          </thead>
          <tbody>
            {studentsArray.map((student, index) => (
              <tr
                key={student.registrationNumber}
                className="odd:bg-white even:bg-gray-50"
              >
                <td className="border border-gray-300 px-4 py-2">
                  {student.registrationNumber}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {student.studentName || student.studentsName}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {updateco[0]?.CO1[index] || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {updateco[0]?.CO2[index] || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {updateco[0]?.CO3[index] || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {updateco[0]?.CO4[index] || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {updateco[0]?.CO5[index] || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {updateco[0]?.CO6[index] || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default DataEntry;
