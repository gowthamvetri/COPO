import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoIosAddCircle } from "react-icons/io";
import { useState } from "react";
import Modal from "react-modal";
import { MdClose } from "react-icons/md";
import { FiUpload } from "react-icons/fi";
import axiosInstance from "../../utils/axiosInstance";

const AddSubject = () => {
  const location = useLocation();
  const { cono, courseName, batchId } = location.state || "";
  console.log("From Add Subjects Page: " + cono + " " + courseName);
  console.log("LocationState",location.state);

  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [courseCount, setCourseCount] = useState(1);
  const [conoCount, setConoCount] = useState(cono || "");
  const [error, setError] = useState("");
  const [courseOutcome, setCourseOutcome] = useState("");
  const [PO1, setPo1] = useState(0);
  const [PO2, setPo2] = useState(0);
  const [PO3, setPo3] = useState(0);
  const [PO4, setPo4] = useState(0);
  const [PO5, setPo5] = useState(0);
  const [PO6, setPo6] = useState(0);
  const [PO7, setPo7] = useState(0);
  const [PO8, setPo8] = useState(0);
  const [PO9, setPo9] = useState(0);
  const [PO10, setPo10] = useState(0);
  const [PO11, setPo11] = useState(0);
  const [PO12, setPo12] = useState(0);
  const [PS01, setPS01] = useState(0);
  const [PS02, setPS02] = useState(0);
  const [PS03, setPS03] = useState(0);

  const [subjectData, setSubjectData] = useState([]);

  const handleSubjectData = (e) => {
    e.preventDefault();

    if (courseOutcome == "") {
      setError("Course number is required");
      return;
    }

    setError("");

    const subjectEntry = {
      cono: conoCount + "." + courseCount,
      courseOutcome,
      PO1,
      PO2,
      PO3,
      PO4,
      PO5,
      PO6,
      PO7,
      PO8,
      PO9,
      PO10,
      PO11,
      PO12,
      PS01,
      PS02,
      PS03
    };
    console.log("Subject Entry : " + JSON.stringify(subjectData, null, 2));
    setSubjectData([...subjectData, subjectEntry]);
    setCourseOutcome("");
    setPo1(0);
    setPo2(0);
    setPo3(0);
    setPo4(0);
    setPo5(0);
    setPo6(0);
    setPo7(0);
    setPo8(0);
    setPo9(0);
    setPo10(0);
    setPo11(0);
    setPo12(0);
    setPS01(0);
    setPS02(0);
    setPS03(0);
    setOpenModal(false);
    setCourseCount((pre) => pre + 1);
  };

  const subjectApi = async (e) => {
    e.preventDefault();
    console.log("function called from subjectApi");
    try {
      const response = await axiosInstance.post("/addSubjectMapping", {
        batchId,
        subjectName: courseName,
        subjectCode: cono,
        subjectMapData: subjectData,
      });

      console.log("Entered into main from subjectApi");
      if (response.data && response.data.note) {
        alert("Data Added Successfully");
        navigate("/dashboard/mapping");
      }
      
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(error.response.data.message);
        navigate("/dashboard/mapping");
      } else {
        alert("An unexpected error occured Please try again");
      }
    }
  };

  console.log("CONO",cono);


  return (
    <>
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center justify-center gap-10">
          <h2 className="bg-white p-3 rounded font-medium shadow-md">{`Course No  : ${cono}`}</h2>
          <h2 className="bg-white p-3 rounded font-medium shadow-md">{`Course Name : ${courseName}`}</h2>
        </div>
        <div>
          <button
            className="flex items-center justify-center gap-4 bg-green-500 p-3 text-white rounded font-medium"
            onClick={() => {
              setOpenModal(true);
            }}
          >
            <h2>Add</h2>
            <IoIosAddCircle className="text-lg text-white" />
          </button>
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
            className="w-[50%] max-h-2/4 bg-white rounded-md mx-auto mt-5 p-5 "
          >
            <div className="flex flex-col p-1 gap-2">
              <div className="w-full flex items-center justify-between">
                <h2>Add Subject</h2>
                <button
                  className="w-10 h-10 rounded-full flex items-center justify-center -mt-2 hover:bg-slate-50"
                  onClick={(e) => {
                    setOpenModal(false);
                  }}
                >
                  <MdClose className="text-xl text-slate-400" />
                </button>
              </div>
              <form>
                {/* <div className='flex flex-col gap-2 mt-1'>
                                <h3 className='text-sm text-slate-400 font-medium'>{cono}</h3>
                                <input type="text" className='block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm/6' value={conoCount} onChange={(e)=>{setConoCount(e.target.value)}} placeholder="eg c101.1"/>
                            </div> */}
                <div className="flex flex-col gap-2 mt-3">
                  <h3 className="text-sm text-slate-400 font-medium">
                    Course outcome
                  </h3>
                  <input
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm/6"
                    value={courseOutcome}
                    onChange={(e) => {
                      setCourseOutcome(e.target.value);
                    }}
                    placeholder="eg. speak clearly ..."
                  />
                </div>
                <div className="flex items-center justify-center w-full ml-10 mt-10">
                  <div className="grid grid-rows-3 grid-cols-3 w-full gap-3">
                    <div className="flex items-center gap-3">
                      <h2>PO1</h2>
                      <input
                        type="text"
                        className="w-16 rounded-md border-0 py-1 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm/6"
                        value={PO1}
                        onChange={(e) => {
                          setPo1(e.target.value);
                        }}
                        placeholder="eg. 0"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <h2>PO2</h2>
                      <input
                        type="text"
                        className="w-16 rounded-md border-0 py-1 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm/6"
                        value={PO2}
                        onChange={(e) => {
                          setPo2(e.target.value);
                        }}
                        placeholder="eg. 0"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <h2>PO3</h2>
                      <input
                        type="text"
                        className="w-16 rounded-md border-0 py-1 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm/6"
                        value={PO3}
                        onChange={(e) => {
                          setPo3(e.target.value);
                        }}
                        placeholder="eg. 0"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <h2>PO4</h2>
                      <input
                        type="text"
                        className="w-16 rounded-md border-0 py-1 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm/6"
                        value={PO4}
                        onChange={(e) => {
                          setPo4(e.target.value);
                        }}
                        placeholder="eg. 0"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <h2>PO5</h2>
                      <input
                        type="text"
                        className="w-16 rounded-md border-0 py-1 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm/6"
                        value={PO5}
                        onChange={(e) => {
                          setPo5(e.target.value);
                        }}
                        placeholder="eg. 0"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <h2>PO6</h2>
                      <input
                        type="text"
                        className="w-16 rounded-md border-0 py-1 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm/6"
                        value={PO6}
                        onChange={(e) => {
                          setPo6(e.target.value);
                        }}
                        placeholder="eg. 0"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <h2>PO7</h2>
                      <input
                        type="text"
                        className="w-16 rounded-md border-0 py-1 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm/6"
                        value={PO7}
                        onChange={(e) => {
                          setPo7(e.target.value);
                        }}
                        placeholder="eg. 0"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <h2>PO8</h2>
                      <input
                        type="text"
                        className="w-16 rounded-md border-0 py-1 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm/6"
                        value={PO8}
                        onChange={(e) => {
                          setPo8(e.target.value);
                        }}
                        placeholder="eg. 0"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <h2>PO9</h2>
                      <input
                        type="text"
                        className="w-16 rounded-md border-0 py-1 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm/6"
                        value={PO9}
                        onChange={(e) => {
                          setPo9(e.target.value);
                        }}
                        placeholder="eg. 0"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <h2>PO10</h2>
                      <input
                        type="text"
                        className="w-16 rounded-md border-0 py-1 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm/6"
                        value={PO10}
                        onChange={(e) => {
                          setPo10(e.target.value);
                        }}
                        placeholder="eg. 0"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <h2>PO11</h2>
                      <input
                        type="text"
                        className="w-16 rounded-md border-0 py-1 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm/6"
                        value={PO11}
                        onChange={(e) => {
                          setPo11(e.target.value);
                        }}
                        placeholder="eg. 0"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <h2>PO12</h2>
                      <input
                        type="text"
                        className="w-16 rounded-md border-0 py-1 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm/6"
                        value={PO12}
                        onChange={(e) => {
                          setPo12(e.target.value);
                        }}
                        placeholder="eg. 0"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <h2>PS01</h2>
                      <input
                        type="text"
                        className="w-16 rounded-md border-0 py-1 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm/6"
                        value={PS01}
                        onChange={(e) => {
                          setPS01(e.target.value);
                        }}
                        placeholder="eg. 0"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <h2>PS02</h2>
                      <input
                        type="text"
                        className="w-16 rounded-md border-0 py-1 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm/6"
                        value={PS02}
                        onChange={(e) => {
                          setPS02(e.target.value);
                        }}
                        placeholder="eg. 0"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <h2>PS03</h2>
                      <input
                        type="text"
                        className="w-16 rounded-md border-0 py-1 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm/6"
                        value={PS03}
                        onChange={(e) => {
                          setPS03(e.target.value);
                        }}
                        placeholder="eg. 0"
                      />
                    </div>
                  </div>
                </div>
                {error && <p className="text-red-500 text-xs pt-4">{error}</p>}
                <div className="w-full flex items-center justify-end mt-10">
                  <button
                    className="px-10flex bg-green-500 p-2 text-white rounded"
                    onClick={(e) => {
                      handleSubjectData(e);
                    }}
                  >
                    Add data
                  </button>
                </div>
              </form>
            </div>
          </Modal>
        </div>
      </div>
      <div>
        <table className="min-w-full border border-gray-300 bg-white rounded-lg shadow-md overflow-hidden table-fixed mt-10">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="w-1/4 px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">
                {cono}
              </th>
              <th className="w-3/4 px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Course outcome
              </th>
              <th className="w-1/4 px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">
                PO1
              </th>
              <th className="w-1/4 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                PO2
              </th>
              <th className="w-1/4 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                PO3
              </th>
              <th className="w-1/4 px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">
                PO4
              </th>
              <th className="w-1/4 px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">
                PO5
              </th>
              <th className="w-1/4 px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">
                PO6
              </th>
              <th className="w-1/4 px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">
                PO7
              </th>
              <th className="w-1/4 px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">
                PO8
              </th>
              <th className="w-1/4 px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">
                PO9
              </th>
              <th className="w-1/4 px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">
                PO10
              </th>
              <th className="w-1/4 px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">
                PO11
              </th>
              <th className="w-1/4 px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">
                PO12
              </th>
              <th className="w-1/4 px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">
                PS01
              </th>
              <th className="w-1/4 px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">
                PS02
              </th>
              <th className="w-1/4 px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">
                PS03
              </th>

            </tr>
          </thead>
          <tbody className="text-gray-600">
            {subjectData.map(
              (
                {
                  cono,
                  courseOutcome,
                  PO1,
                  PO2,
                  PO3,
                  PO4,
                  PO5,
                  PO6,
                  PO7,
                  PO8,
                  PO9,
                  PO10,
                  PO11,
                  PO12,
                  PS01,
                  PS02,
                  PS03
                },
                idx
              ) => {
                return (
                  <tr
                    key={idx}
                    className="hover:bg-gray-100 border-b border-gray-200"
                  >
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
                );
              }
            )}
          </tbody>
        </table>
      </div>
      <div className="flex w-full items-center justify-end mt-10">
        <button
          className="flex items-center justify-center gap-3 bg-green-600 p-2 text-white rounded font-medium"
          onClick={(e) => {
            subjectApi(e);
          }}
        >
          <FiUpload />
          <h2>Upload Data</h2>
        </button>
      </div>
    </>
  );
};

export default AddSubject;
