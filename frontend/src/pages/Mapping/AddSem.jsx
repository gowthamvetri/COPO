import React, { useEffect, useState } from 'react'
import { IoIosAddCircle } from "react-icons/io";;
import Modal from "react-modal";
import { MdClose } from "react-icons/md";
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';


const AddSem = () => {

    const location = useLocation();
    const {batchId} = location.state || "";

    const navigate = useNavigate();

    console.log(batchId+ " from Add Sem Page");

    const [semName,setSemName] = useState("");
    const [openSem,setOpenSem] = useState(false);
    const [closeBtn,setCloseBtn] = useState(false);


    const [subjects,setSubjects] = useState([]);
    const [openSub,setOpenSub] = useState(false);

    const [coNo,setCoNo] = useState("");
    const [courseCode,setCourseCode] = useState("");
    const [courseName,setCourseName] = useState("");
    const [staffName,setStaffName] = useState("");
    const [status,setStatus] = useState("");
    const [category,setCategory] = useState("");
    const [l,setL] = useState(0);
    const [t,setT] = useState(0);
    const [p,setP] = useState(0);
    const [c,setC] = useState(0);

    const [error,setError] = useState("");

    
    const handleSem = () => {
        if(semName=="") {
            return;
        }
        setOpenSem(false);
        setCloseBtn(true);
    }

    const AddSubject = (e) => {
        e.preventDefault();

        if(coNo=="") {
            setError("Enter Course Number");
            return;
        }
        if(courseCode=="") {
            setError("Enter courseCode");
            return;
        }
        if(courseName=="") {
            setError("Enter courseName");
            return;
        }
        if(staffName=="") {
            setError("Enter staffName");
            return;
        }
        
        setError("");

        const subject = {
            coNo,
            courseCode,
            courseName,
            staffName,
            status,
            category,
            L : l,
            T : t,
            P : p,
            C : c
        };

        setSubjects([...subjects,subject]);
        setCoNo("");
        setCategory("");
        setStatus("");
        setCourseCode("");
        setCourseName("");
        setL("");
        setT("");
        setP("");
        setC("");
        setStaffName("");
        setOpenSub(false);
    }

    useEffect(()=>{
        console.log(subjects);
    },[subjects]);


    const submitSem = async (e) => {
        e.preventDefault();

        if(batchId==="" || semName == "" || subjects.length==0) {
            alert("Please do add data");
            return;
        }

        try {
            const response = await axiosInstance.post("/add-sem",{
                batchId,
                semName,
                subjects,
            });

            if(response.data && response.data.note) {
                alert("Data Added Successfully");
                navigate("/dashboard/overview");
            }
            
        }catch(error) {
            if(error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
                navigate("/dashboard/overview");
            }else {
                alert("An unexpected error occured Please try again");
            }
        }

    }


    return (
        <>
            <div className='w-full flex items-end justify-end'>
                <button className={!closeBtn ? "bg-green-500 p-1 flex items-center gap-3 rounded text-white" : "hidden"} onClick={()=>{setOpenSem(true)}}>
                    <h2>Add Sem</h2>
                    <IoIosAddCircle className='text-lg text-white'/>
                </button>
                <Modal 
                    isOpen={openSem}
                    onRequestClose={()=>{}}
                    style={
                        {
                            overlay:{
                                backgroundColor : "rgba(0,0,0,.2)",
                            },

                        }
                    }
                    contentlabel=""
                    className="w-[30%] max-h-3/4 bg-white rounded-md mx-auto mt-36 p-5">
                        <div className='flex flex-col gap-2 p-1'>
                            <button className='w-full h-10 rounded-full flex items-center justify-end -mt-3 hover:bg-slate-50' onClick={(e)=>{setOpenSem(false)}}>
                                <MdClose className="text-xl text-slate-400"/>
                            </button>

                            <h2 className='font-medium'>Add Sem </h2>
                            <input type="text" className='block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm/6' placeholder="eg Sem 1" value={semName} onChange={(e)=>{setSemName(e.target.value)}}/>
                            <button className={ "btn-primary font-medium mt-5 p-3"} onClick={()=>{handleSem()}}>
                                Add
                            </button>
                        </div>
                </Modal>
            </div>
            <div className={closeBtn ? "flex items-center justify-between" : "hidden"}>
                <h2>{semName}</h2>
                <button className='flex items-center p-1 bg-green-500 text-white rounded gap-3' onClick={()=>{setOpenSub(true)}}>
                    <p>Add Sub</p>
                    <IoIosAddCircle className='text-lg text-white'/>
                </button>
                <Modal 
                    isOpen={openSub}
                    onRequestClose={()=>{}}
                    ariaHideApp={false}
                    style={
                        {
                            overlay:{
                                backgroundColor : "rgba(0,0,0,.2)",
                            },

                        }
                    }
                    contentlabel=""
                    className="w-[50%] max-h-2/4 bg-white rounded-md mx-auto mt-0 p-5 overflow-scroll">
                    <div className='flex flex-col p-1 gap-2'>
                        <div className='w-full flex items-center justify-between'>
                            <h2>Add Subject</h2>
                            <button className='w-10 h-10 rounded-full flex items-center justify-center -mt-2 hover:bg-slate-50' onClick={(e)=>{setOpenSub(false)}}>
                                <MdClose className="text-xl text-slate-400"/>
                            </button>
                        </div>

                        <form className='mt-0'>
                            <div className='flex flex-col gap-1 mt-1'>
                                <h3 className='text-sm text-slate-400 font-medium'>CO.NO</h3>
                                <input type="text" className='block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm/6' value={coNo} onChange={(e)=>{setCoNo(e.target.value)}} placeholder="eg c101"/>
                            </div>
                            <div className='flex flex-col gap-1 mt-3'>
                                <h3 className='text-sm text-slate-400 font-medium'>course code</h3>
                                <input type="text" className='block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm/6' value={courseCode} onChange={(e)=>{setCourseCode(e.target.value)}} placeholder="eg. HS6151"/>
                            </div>
                            <div className='flex flex-col gap-1 mt-3'>
                                <h3 className='text-sm text-slate-400 font-medium'>course Name</h3>
                                <input type="text" className='block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm/6' value={courseName} onChange={(e)=>{setCourseName(e.target.value)}} placeholder="course Name"/>
                            </div>
                            <div className='flex flex-col gap-1 mt-3'>
                                <h3 className='text-sm text-slate-400 font-medium'>Staff in charge</h3>
                                <input type="text" className='block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm/6' value={staffName} onChange={(e)=>{setStaffName(e.target.value)}} placeholder="staff Name"/>
                            </div>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-3 mt-3'>
                                    <h3 className='text-sm text-slate-400 font-medium'>Status</h3>
                                    <select className='w-50 border rounded p-2 -mt-0' value={status} onChange={(e)=>{setStatus(e.target.value)}}>
                                        <option value="">Select Status</option>
                                        <option value="Not recieved">Not Recieved</option>
                                        <option value="Recieved">Recieved</option>
                                    </select>
                                </div>

                                <div className='flex items-center gap-3 mt-3'>
                                    <h3 className='text-sm text-slate-400 font-medium'>Category</h3>
                                    <select className='w-50 border rounded p-2 -mt-0' value={category} onChange={(e)=>{setCategory(e.target.value)}}>
                                        <option value="">Select Category</option>
                                        <option value="HS">HS</option>
                                        <option value="BS">BS</option>
                                        <option value="PC">PC</option>
                                        <option value="ES">ES</option>
                                    </select>
                                </div>
                            </div>

                            <div className='flex items-center justify-evenly gap-3'>
                                <div className='flex items-center gap-3 mt-5'>
                                    <h3 className='text-sm text-slate-400 font-medium'>L</h3>
                                    <input type="text" className='w-10 rounded-md border-0 py-1 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm/6' value={l} onChange={(e)=>{setL(e.target.value)}} placeholder="0"/>
                                </div>

                                <div className='flex items-center gap-3 mt-5'>
                                    <h3 className='text-sm text-slate-400 font-medium'>T</h3>
                                    <input type="text" className='w-10 rounded-md border-0 py-1 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm/6' value={t} onChange={(e)=>{setT(e.target.value)}} placeholder="0"/>
                                </div>

                                <div className='flex items-center gap-3 mt-5'>
                                    <h3 className='text-sm text-slate-400 font-medium'>P</h3>
                                    <input type="text" className='w-10 rounded-md border-0 py-1 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm/6' value={p} onChange={(e)=>{setP(e.target.value)}} placeholder="0"/>
                                </div>

                                <div className='flex items-center gap-3 mt-5'>
                                    <h3 className='text-sm text-slate-400 font-medium'>C</h3>
                                    <input type="text" className='w-10 rounded-md border-0 py-1 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm/6' value={c} onChange={(e)=>{setC(e.target.value)}} placeholder="0"/>
                                </div>
                            </div>
                            {error && (<p className='text-red-500 text-xs pt-4'>{error}</p>)}
                            <div className='mt-6 w-full flex items-center justify-center rounded text-white'>
                                <button className='bg-green-500 p-3 rounded' onClick={(e)=>{AddSubject(e)}}>Add Subject</button>
                            </div>
                            

                        </form>
                        
                    </div>
                </Modal>
            </div>
            <div className='mt-10'>
                {/* <h2 className='p-2 bg-gray-500 w-20 rounded text-white text-sm'>Subjects</h2> */}
                <table className="min-w-full border border-gray-300 bg-white rounded-lg shadow-md overflow-hidden table-fixed">
                    <thead className="bg-gray-200 text-gray-700">
                        <tr>
                        <th className="w-1/4 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">co.no</th>
                        <th className="w-1/4 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Course code</th>
                        <th className="w-1/4 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">course Name</th>
                        <th className="w-1/4 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">staff Name</th>
                        <th className="w-1/4 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">status</th>
                        <th className="w-1/4 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">category</th>
                        <th className="w-1/4 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">L</th>
                        <th className="w-1/4 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">T</th>
                        <th className="w-1/4 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">P</th>
                        <th className="w-1/4 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">C</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600">
                        {
                            subjects.map(({coNo,courseCode,courseName,staffName,status,category,L,T,P,C})=>{
                                return (
                                    <tr className="hover:bg-gray-100 border-b border-gray-200">
                                        <td className="w-1/4 px-6 py-4">{coNo}</td>
                                        <td className="w-1/4 px-6 py-4">{courseCode}</td>
                                        <td className="w-1/4 px-6 py-4">{courseName}</td>
                                        <td className="w-1/4 px-6 py-4">{staffName}</td>
                                        <td className="w-1/4 px-6 py-4">{status}</td>
                                        <td className="w-1/4 px-6 py-4">{category}</td>
                                        <td className="w-1/4 px-6 py-4">{L}</td>
                                        <td className="w-1/4 px-6 py-4">{T}</td>
                                        <td className="w-1/4 px-6 py-4">{P}</td>
                                        <td className="w-1/4 px-6 py-4">{C}</td>
                                    </tr>
                                );
                            })
                        }
                        
                    </tbody>
                </table>
            </div>
            <div className='flex w-full items-center justify-end mt-10' onClick={(e)=>{submitSem(e)}}>
                <button className='p-2 bg-green-500 text-white rounded'>Upload</button>
            </div>
        </>
    )
}

export default AddSem;
