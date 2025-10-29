import React, { useState } from 'react'
import { MdClose } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";

const AddBatchCard = ({type,onClose,getAllBatch}) => {

    const [value,setValue] = useState("");
    const [error,setError] = useState("");

    const handleSubmit = async() => {
        if(!value) {
            setError(`Please Enter your ${type==="batch" ? "Batch Name" : "Sem Name"}`);
            return;
        }
        
        setError("");

        if(type==="batch") {
            try {
                const response = await axiosInstance.post("/add-batch",{
                    batchName : value
                });

                if(response.data && response.data.note) {
                    getAllBatch();
                    onclose();
                }
            }catch(error) {
                if(error.response.data && error.response && error.response.data.message) {
                    setError(error.response.data.message);
                    getAllBatch();
                    onClose();
                }
            }
        }

       
    }

    return (
        <div className='relative'>
            <button className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50" onClick={onClose}>
                <MdClose className="text-xl text-slate-400"/>
            </button>

            <div className="flex flex-col gap-2">
                <label className="input-label text-green-600 font-medium text-lg">{type==="batch" ? "Add Batch" : "Add Sem"}</label>
                <input type="text" className="text-lg text-slate-950 p-1 outline-slate-200" placeholder={type==="batch" ? "eg. 2023-2026" : "eg. sem 1"}
                    value={value}
                    onChange={({target})=> setValue(target.value)}/>
            </div>

            {error && (
                <p className="text-red-500 text-xs pt-4">{error}</p>
            )}

            <button className="btn-primary font-medium mt-5 p-3" onClick={()=>{handleSubmit()}}>
                Add
            </button>
        </div>
    )
}

export default AddBatchCard
