import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { IoIosAddCircle } from "react-icons/io";
import { MdDownload } from "react-icons/md";

const Mapping = () => {

    const batchId = localStorage.getItem("batchId");
    const [allBatch,setAllBatch] = useState([]);
    const [subjectId,setSubjectId] = useState(0);

    console.log("batch Id from mapping page : "+batchId);

    useEffect(()=>{
        getAllSubjects()
    },[batchId]);


    const getAllSubjects = async()=> {

        try {

            
            const token = localStorage.getItem("token"); 
            console.log("token from client Side : "+token);
            console.log("batchId from client Side : "+batchId);

            const response = await axiosInstance.get("/get-allSubjects/"+batchId, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("response",response.data.subjectData);
            
            if(response.data && response.data.subjectData){
                const subjectsData = response.data.subjectData.flatMap(batch => batch.subjects);
                setAllBatch(subjectsData);
            }
            
        }catch(error) {
            console.log("An Unexpected Error from client side : "+error);
        }
    }

   

    console.log("lastCheck",allBatch);

    const [subjects,setAllSubjects] = useState([]);
    const [courseNumber,setCourseNumber] = useState([]);
    
    const getSubjects = () => {
        console.log("allBatch data:", allBatch);
        
        if (!allBatch || allBatch.length === 0) {
            console.log("No batch data available yet");
            return;
        }
        
        const names = allBatch.map(subject => subject.courseName || '').filter(name => name);
        const cono = allBatch.map(subject => subject.courseCode || subject.coNo || '').filter(code => code);
        console.log("Extracted course names:", names);
        console.log("Extracted course codes:", cono);
        setCourseNumber(cono);
        setAllSubjects(names);
    }

    useEffect(()=>{
        if (allBatch && allBatch.length > 0) {
            getSubjects();
        }
    },[allBatch]);

    const [subjectData,setSubjectData] = useState([]);
    const [supportTag,setSupportTag] = useState(false);

    console.log(axiosInstance.defaults.baseURL + `/getSubjectMapping/${encodeURIComponent(batchId)}/${courseNumber[subjectId]}/${subjects[subjectId]}`);

    const getSubjectMapping = async()=>{
        const batchId = localStorage.getItem("batchId"); 
        const encodedCourseNumber = encodeURIComponent(courseNumber[subjectId]); 
        const encodedSubjectName = encodeURIComponent(subjects[subjectId]); 

        try {
            const token = localStorage.getItem("token"); 
            console.log("Params of Subject Mapping Data : "+localStorage.getItem("batchId")+ " " +courseNumber[subjectId] + " "+subjects[subjectId]);

            if (!batchId || !courseNumber[subjectId] || !subjects[subjectId]) {
                setSupportTag(true);
                console.error("One or more parameters are undefined:", { batchId, subjectCode: courseNumber[subjectId], subjectName: subjects[subjectId] });
                return;
            }
            if (!token) {
                console.error("No token found in localStorage. Please log in again.");
                return;
            }
            
            const response = await axiosInstance.get("/COTable/"+batchId+"/"+encodedCourseNumber+"/"+ encodedSubjectName , {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if(response.data && response.data.subjectMappingData) {
                setSupportTag(false);
                setSubjectData(response.data.subjectMappingData);
                console.log("subjectData",response.data.subjectMappingData);
            }

        }catch(error) {
            setSupportTag(true)
            console.log("An Unexpected Error from client side : "+error);
        }
    }
 
    useEffect(()=>{
        console.log("verify Subject Id : " + subjectId);
        console.log("courseNumber[subjectId]:", courseNumber[subjectId]);
        console.log("subjects[subjectId]:", subjects[subjectId]);
        
        if(subjectId !== "" && 
           courseNumber.length > 0 && 
           subjects.length > 0 &&
           courseNumber[subjectId] && 
           subjects[subjectId]) {
            getSubjectMapping();
        } else {
            console.log("Skipping getSubjectMapping - data not ready");
        }
    },[subjectId, courseNumber, subjects]);

    console.log("Subject Data from client Mapping side : "+JSON.stringify(subjectData,null,2));
  return (
    <>
      <div className='flex justify-between items-center'>
            <div className='flex gap-3'>
                <h2 className='text-green-700'>Select Subject</h2>
                {console.log("selected subject : "+subjectId || 0)}
                <select className='w-50 border rounded p-2 -mt-2 overflow-auto h-10 overflow-y-auto' value={subjectId} onChange={(e)=>{setSubjectId(e.target.value || 0)}}>
                    {subjects.length === 0 ? (
                        <option value={0}>Loading subjects...</option>
                    ) : (
                        subjects.map((subject,idx)=> {
                            return <option key={idx} value={idx}>{subject}</option>
                        })
                    )}
                </select>
               
            </div>
            <div>
                {console.log("cono: ",courseNumber[subjectId])}
                <Link className='flex items-center justify-between bg-green-500 p-2 gap-3 text-white rounded' to="/dashboard/addSubject" state={{cono : courseNumber[subjectId],courseName : subjects[subjectId],batchId : batchId}}>
                    <h2 className='font-medium'>Add</h2>
                    <IoIosAddCircle className='text-lg text-white'/>
                </Link>
            </div>
      </div>
      <div>
        {
            
            (supportTag) ? (<p> No Data found</p>) : (
                subjectData.map(({subjectName,subjectCode,subjectMapData},idx)=>{
                    console.log("SubjectMappingData",subjectMapData || null)
                    return <table className="min-w-full border border-gray-300 bg-white rounded-lg shadow-md overflow-hidden table-fixed mt-10">
                                <thead className="bg-gray-200 text-gray-700">
                                    <tr>
                                    <th className="w-1/4 px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">{courseNumber[subjectId]}</th>
                                    <th className="w-3/4 px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">Course outcome</th>
                                    <th className="w-1/4 px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">PO1</th>
                                    <th className="w-1/4 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">PO2</th>
                                    <th className="w-1/4 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">PO3</th>
                                    <th className="w-1/4 px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">PO4</th>
                                    <th className="w-1/4 px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">PO5</th>
                                    <th className="w-1/4 px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">PO6</th>
                                    <th className="w-1/4 px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">PO7</th>
                                    <th className="w-1/4 px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">PO8</th>
                                    <th className="w-1/4 px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">PO9</th>
                                    <th className="w-1/4 px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">PO10</th>
                                    <th className="w-1/4 px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">PO11</th>
                                    <th className="w-1/4 px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">PO12</th>
                                    <th className="w-1/4 px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">PS01</th>
                                    <th className="w-1/4 px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">PS02</th>
                                    <th className="w-1/4 px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">PS03</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        subjectMapData.map(({cono,courseOutcome,PO1,PO2,PO3,PO4,PO5,PO6,PO7,PO8,PO9,PO10,PO11,PO12,PS01,PS02,PS03},idx)=>{
                                            return <tr className="hover:bg-gray-100 border-b border-gray-200">
                                                        <td className="w-1/4 px-6 py-4">{cono}</td>
                                                        <td className="w-1/4 px-6 py-4">{courseOutcome}</td>
                                                        <td className="w-1/4 px-6 py-4">{PO1}</td>
                                                        <td className="w-1/4 px-6 py-4">{PO2}</td>
                                                        <td className="w-1/4 px-6 py-4">{PO3}</td>
                                                        <td className="w-1/4 px-6 py-4">{PO4}</td>
                                                        <td className="w-1/4 px-6 py-4">{PO5}</td>
                                                        <td className="w-1/4 px-6 py-4">{PO6}</td>
                                                        <td className="w-1/4 px-6 py-4">{PO7}</td>
                                                        <td className="w-1/4 px-6 py-4">{PO8}</td>
                                                        <td className="w-1/4 px-6 py-4">{PO9}</td>
                                                        <td className="w-1/4 px-6 py-4">{PO10}</td>
                                                        <td className="w-1/4 px-6 py-4">{PO11}</td>
                                                        <td className="w-1/4 px-6 py-4">{PO12}</td>
                                                        <td className="w-1/4 px-6 py-4">{PS01}</td>
                                                        <td className="w-1/4 px-6 py-4">{PS02}</td>
                                                        <td className="w-1/4 px-6 py-4">{PS03}</td>

                                                    </tr>
                                        })   
                                    }
                                </tbody>
                    </table>
                })
            )
        }
        </div>
        <div className='flex w-full items-center justify-end mt-10'>
            <button className='flex gap-2 items-center p-2 bg-green-600 rounded text-white'>
                <h2>Download </h2>
                <MdDownload className='text-xl'/>
            </button>
        </div>
    </>
  )
}

export default Mapping;
