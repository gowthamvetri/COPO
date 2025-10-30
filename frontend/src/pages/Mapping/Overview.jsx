import React, { useEffect, useState } from "react";
import { IoIosAddCircle } from "react-icons/io";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import AddBatchCard from "../../components/cards/AddBatchCard";
import axiosInstance from "../../utils/axiosInstance";
import axios from "axios";
import { MdDownload } from "react-icons/md";

const Overview = () => {
  const [openBatch, setOpenBatch] = useState(false);
  const [allBatches, setAllBatches] = useState([]);

  const [batchId, setBatchId] = useState(0);
  const [batchData, setBatchData] = useState([]);

  const getAllBatch = async () => {
    try {
      const response = await axiosInstance.get("/get-all-batches");

      if (response.data && response.data.batches) {
        console.log(response.data.batches);
        setAllBatches(response.data.batches);
      }
    } catch (error) {
      console.log("An Unexpected Error");
    }
  };


  useEffect(() => {
    if (allBatches.length > 0) {
      setBatchId(allBatches[0]._id); 
    }
  }, [allBatches]);

  console.log(
    axiosInstance.defaults.baseURL +
      `/getSem-data/${encodeURIComponent(batchId)}`
  );

  const getSemesterData = async () => {

    try {
      const token = localStorage.getItem("token");
      console.log("token from client Side : " + token);
      console.log("batchId from client side : " + batchId);
      const response = await axiosInstance.get("/getSem-data/" + batchId, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(
        "Batch Data client side :",
        JSON.stringify(response.data.batchData, null, 2)
      );

      if (response.data && response.data.batchData) {
        setBatchData(response.data.batchData);
      }
    } catch (error) {
      console.log("An Unexpected Error from client side : " + error);
    }
  };

  useEffect(() => {
    getAllBatch();
  }, []);

  useEffect(() => {
    if (batchId) {
      getSemesterData();
    }
  }, [batchId]);

  return (
    <div className="flex flex-col p-3 justify-between w-full h-full">
      <div className="flex items-center justify-between w-full">
        <div className="flex gap-3">
          <h2 className="text-green-700">Select batch</h2>
          <select
            className="w-50 border rounded p-2 -mt-2"
            value={batchId}
            onChange={(e) => {
              console.log("batchId : ",e.target.value);
              setBatchId(e.target.value);
            }}
          >
            {allBatches.map(({ _id, name }) => {
              return (
                <option key={_id} value={_id}>
                  {name}
                </option>
              );
            })}
          </select>
          <button className="-mt-2 w-30" onClick={() => setOpenBatch(true)}>
            <IoIosAddCircle className="text-lg text-slate-500" />
          </button>

          <Modal
            isOpen={openBatch}
            onRequestClose={() => {}}
            style={{
              overlay: {
                backgroundColor: "rgba(0,0,0,.2)",
              },
            }}
            contentlabel=""
            className="w-[30%] max-h-3/4 bg-white rounded-md mx-auto mt-36 p-5"
          >
            <AddBatchCard
              type="batch"
              onClose={() => {
                setOpenBatch(false);
              }}
              getAllBatch={getAllBatch}
            />
          </Modal>
        </div>
        {localStorage.setItem("batchId", batchId)}
        <Link
          className="flex bg-green-600 p-2 text-white items-center gap-3 rounded"
          to="/dashboard/addSem"
          state={{ batchId: batchId }}
        >
          <h2>Add </h2>
          <IoIosAddCircle className="text-lg text-white" />
        </Link>
      </div>
      <div className="mt-5 flex flex-col gap-5 ">
        {batchData.length === 0 ? (
          <p> No Data found</p>
        ) : (
          batchData.map((batch, idx) => {
            return (
              <div key={idx}>
                <p className="bg-gray-300 p-2 w-20 rounded font-medium">
                  {batch.semName}
                </p>
                <table className="min-w-full border border-gray-300 bg-white rounded-lg shadow-md overflow-hidden table-fixed">
                  <thead className="bg-gray-200 text-gray-700">
                    <tr>
                      <th className="w-1/4 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        co.no
                      </th>
                      <th className="w-1/4 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Course code
                      </th>
                      <th className="w-1/4 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        course Name
                      </th>
                      <th className="w-1/4 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        staff Name
                      </th>
                      <th className="w-1/4 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        status
                      </th>
                      <th className="w-1/4 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        category
                      </th>
                      <th className="w-1/4 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        L
                      </th>
                      <th className="w-1/4 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        T
                      </th>
                      <th className="w-1/4 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        P
                      </th>
                      <th className="w-1/4 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        C
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    {batch.subjects.map((subject, idx) => {
                      console.log("Subject",JSON.stringify(subject,null,2));
                      return (
                        <tr
                          key={idx}
                          className="hover:bg-gray-100 border-b border-gray-200"
                        >
                          <td className="w-1/4 px-6 py-4">
                            {subject.coNo} 
                          </td>
                          <td className="w-1/4 px-6 py-4">
                            {subject.courseCode}
                          </td>
                          <td className="w-1/4 px-6 py-4">
                            {subject.courseName}
                          </td>
                          <td className="w-1/4 px-6 py-4">
                            {subject.staffName}
                          </td>
                          <td className="w-1/4 px-6 py-4">{subject.status}</td>
                          <td className="w-1/4 px-6 py-4">
                            {subject.category}
                          </td>
                          <td className="w-1/4 px-6 py-4">{subject.L}</td>
                          <td className="w-1/4 px-6 py-4">{subject.T}</td>
                          <td className="w-1/4 px-6 py-4">{subject.P}</td>
                          <td className="w-1/4 px-6 py-4">{subject.C}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })
        )}
      </div>
      <div className="flex w-full items-center justify-end">
        <button className="flex gap-2 items-center p-2 bg-green-600 rounded text-white">
          <h2>Download </h2>
          <MdDownload className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default Overview;
