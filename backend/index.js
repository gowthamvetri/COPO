require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

mongoose.connect(config.connectionString).then(()=>console.log("Success on Connection"));

const User = require("./models/user.model");
const Batch = require("./models/batch.model");
const Sem = require("./models/sem.model");
const Subjects = require("./models/subjects.model");
const Students = require("./models/students.model");
const SubjectCO = require("./models/subjectCo.model");
const AttainmentReport = require("./models/attainmentReport.model");
const CopoReports = require("./models/addReports.model");


const express = require("express");
const cors = require("cors");

const app = express();

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.json({ data: "hello" });
});

// Authentication

app.post("/create-user", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName) {
    return res.status(200).json({ error: true, message: "Full Name Required" });
  }

  if (!email) {
    return res
      .status(200)
      .json({ error: true, message: "email Address Required" });
  }

  if (!password) {
    return res
      .status(200)
      .json({ error: true, message: "password is Required" });
  }

  const isUser = await User.findOne({ email: email });

  if (isUser) {
    return res.json({
      error: true,
      message: "User Already Exists",
    });
  }

  const user = new User({
    fullName,
    email,
    password,
  });

  await user.save();

  const accessToken = jwt.sign(
    {
      user,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "36000m",
    }
  );

  return res.json({
    error: false,
    user,
    accessToken,
    message: "Registration Successful",
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ error: true, message: "Email is Required" });
  }

  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: "Password is Required" });
  }

  const userInfo = await User.findOne({ email: email });

  if (!userInfo) {
    return res.status(400).json({ message: "User Not Found" });
  }

  if (userInfo.email === email && userInfo.password === password) {
    const user = { user: userInfo };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "36000m",
    });

    return res.json({
      error: false,
      message: "Login Successful",
      email,
      accessToken,
    });
  } else {
    return res.status(200).json({
      error: true,
      message: "Invalid Credentials",
    });
  }
});

app.get("/get-user", authenticateToken, async (req, res) => {
  const { user } = req.user;
  // console.log(user);
  const isUser = await User.findOne({ _id: user._id });

  if (!isUser) {
    return res.sendStatus(401);
  }

  return res.json({
    user: {
      fullName: isUser.fullName,
      email: isUser.email,
      password: isUser.password,
      createdOn: isUser.createdOn,
      _id: isUser._id,
    },
    message: "",
  });
});

// End of Authentication

// -------------------------------------------------------------------------------------------------------\\

// Batch-data Payload

app.post("/add-batch", authenticateToken, async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("User from token:", req.user);
    
    const { batchName } = req.body;
    const { user } = req.user;

    console.log("Extracted batchName:", batchName);
    console.log("Extracted user:", user);

    if (!batchName) {
      return res.status(400).json({
        error: true,
        message: "batchName is required",
      });
    }

    const batch = new Batch({
      name: batchName,
      userId: user._id,
    });

    console.log("Batch object before save:", batch);
    await batch.save();
    console.log("Batch saved successfully:", batch);

    return res.json({
      error: false,
      batch,
      message: "Batch Added Successfully",
    });
  } catch (error) {
    console.error("Error in add-batch:", error);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
      details: error.message
    });
  }
});



app.get("/get-all-batches", authenticateToken, async (req, res) => {
  const { user } = req.user;

  try {
    const batches = await Batch.find({ userId: user._id });
    return res.json({
      error: false,
      batches,
      message: "All Notes retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// End of Batch-data payloads

//---------------------------------------------------------------------------------------------\\

// Semester-data && batch-data Payloads

app.post("/add-sem", authenticateToken, async (req, res) => {

  const { batchId, semName, subjects } = req.body;
  const { user } = req.user;

  if (!batchId) {
    return res.status(400).json({
      error: true,
      message: "batchId is required",
    });
  }

  if (!semName) {
    return res.status(400).json({
      error: true,
      message: "semName is required",
    });
  }

  if (!subjects) {
    return res.status(400).json({
      error: true,
      message: "subjects is required",
    });
  }

  // console.log("abcd" + JSON.stringify(subjects,null,2));


  try {
    const sem = new Sem({
      userId: user._id,
      batchId: batchId,
      semName: semName,
      subjects: subjects,
    });
  
    // console.log("Saving Sem:", JSON.stringify(sem, null, 2));
  
    const saveSem = await sem.save();
    // console.log("savedSem : ",saveSem);

    const subjectRes = await Promise.all(
      subjects.map(async (subject) => {
        const courseName = subject.courseName;

        if (!courseName) {
          throw new Error("Subject Name is required to add");
        }

        const subjectsCo = new SubjectCO({
          userId: user._id,
          batchId: batchId,
          subjectName: courseName,
        });

        const saveSubjectCO = await subjectsCo.save();

        const attainmentReport = new AttainmentReport({
          userId: user._id,
          batchId: batchId,
          subjectName: courseName,
          isSem: false, // Adjust this value as needed
          report: {
            CO1: [],
            CO2: [],
            CO3: [],
            CO4: [],
            CO5: [],
            CO6: [],
          },
        });

        console.log(attainmentReport);

        const saveAttainmentReport = await attainmentReport.save();
        return { saveSubjectCO, saveAttainmentReport , saveSem};
      })
    );

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// getting batch-data Payloads

app.get("/getSem-data/:batchId", authenticateToken, async (req, res) => {

  const batchId = req.params.batchId;
  // console.log("batchId server",batchId)
  const { user } = req.user;
  // console.log("Authenticated user:", req.user);
  try {
    const batchData = await Sem.find({ batchId:batchId });
    console.log("batchData from server : " + batchData);

    if (!batchData || batchData.length === 0) {
      return res.json({
        error: true,
        message: "No data found for this batch ID",
      });
    }

    return res.json({
      error: false,
      batchData: batchData,
      message: "All batch Data recieved successfully",
    });
  } catch (error) {
    console.log("Server Error : " + error);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error ",
    });
  }
});

// End of batch-data Payloads 
// --------------------------------------------------------------------------------------------\\

// Start of subjects-data payloads

app.get("/get-allSubjects/:batchId", authenticateToken, async (req, res) => {

  const batchId = req.params.batchId;
  const { user } = req.user;

  try {
    const subjectData = await Sem.find({ userId: user._id, batchId: batchId });
    console.log("subjectData",subjectData);

    if (!subjectData || subjectData.length == 0) {
      return res.status(404).json({
        error: true,
        message: "No data found for this batch ID",
      });
    }
    return res.json({
      error: false,
      subjectData: subjectData,
      message: "All subject Data recieved successfully",
    });
  } catch (error) {
    console.log("Server Error : " + error);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error ",
    });
  }
});

app.post("/addSubjectMapping", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const { batchId, subjectName, subjectCode, subjectMapData } = req.body;
  console.log(
    "from server side copo mapping final  : " +
      batchId +
      " " +
      subjectName +
      " " +
      subjectCode +
      " " +
      subjectMapData
  );

  try {
    if (!batchId) {
      return res.status(400).json({
        error: true,
        message: "batchId is required",
      });
    }
    if (!subjectName) {
      return res.status(400).json({
        error: true,
        message: "subject Name is required",
      });
    }
    if (!subjectCode) {
      return res.status(400).json({
        error: true,
        message: "subject code is required",
      });
    }
    if (!subjectMapData) {
      return res.status(400).json({
        error: true,
        message: "subject Mapping Data is required",
      });
    }

    const subjectMapping = new Subjects({
      userId: user._id,
      batchId: batchId,
      subjectName: subjectName,
      subjectCode: subjectCode,
      subjectMapData: subjectMapData,
    });

    await subjectMapping.save();

    return res.json({
      error: false,
      subjectMapping,
      message: "Subject Mapping Added Successfully",
    });
  } catch (error) {
    console.error("Error in addSubjectMapping:", error);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
      details: error.message
    });
  }
});

app.get("/COTable/:batchId/:subjectCode/:subjectName",authenticateToken,
  async (req, res) => {
    console.log("Entered")
    const { user } = req.user;

    try {
      console.log("recieved code : " + req.params.subjectCode);

      const subjectMappingData = await Subjects.find({
        userId: user._id,
        batchId: req.params.batchId,
        subjectCode:req.params.subjectCode,
        subjectName: req.params.subjectName,
      });

      if(subjectMappingData.length==0) {
        console.log("Length - 0")
      }

      console.log(
        "from server Side of Subject Mapping  : " + subjectMappingData
      );
      return res.json({
        error: false,
        subjectMappingData: subjectMappingData,
        message: "All subject Mapping Data recieved successfully",
      });
    } catch (error) {
      console.log("Error from getSubjectMapping " + error);
      return res.status(500).json({
        error: true,
        message: "Internal Server Error",
      });
    }
  }
);

// Students-list creation ---

app.post("/add-students", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const { batchId, studentsData } = req.body;

  if (!batchId) {
    return res.status(400).json({
      error: true,
      message: "batchId is required",
    });
  }

  if (!studentsData) {
    return res.status(400).json({
      error: true,
      message: "students Data not found",
    });
  }

  try {
    const students = new Students({
      userId: user._id,
      batchId: batchId,
      studentsData: studentsData,
    });

    await students.save();
    return res.json({
      error: false,
      note: "Students saved successfully", // Ensure note is defined
      message: "Students List Uploaded successfully",
    });
  } catch (error) {
    console.error("Error saving students:", error);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// fetching students-data 

app.get("/get-students/:batchId", authenticateToken, async (req, res) => {
  const { batchId } = req.params;
  const { user } = req.user;

  try {
    const studentsData = await Students.find({
      userId: user._id,
      batchId: batchId,
    });
    console.log("from server Side of Students data  : " + studentsData);
    return res.json({
      error: false,
      studentsData,
      message: "All student Data received successfully",
    });
  } catch (error) {
    console.log("Error from getStudents " + error);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// End of Students-data Payload 
//------------------------------------------------------------------------------\\

// dashboard/dataEntry ---------------------\\
// Reading the Subject-CO Data \\\
app.get(
  "/getSubjectCo/:batchId/:subjectName",
  authenticateToken,
  async (req, res) => {
    const { batchId, subjectName } = req.params;
    const { user } = req.user;

    try {
      if (!batchId) {
        return res.status(400).json({
          error: true,
          message: "batchId is not found",
        });
      }
      console.log("subjectName ",subjectName)
      const subjectCOData = await SubjectCO.find({
        userId: user._id,
        batchId: batchId,
        subjectName: subjectName,
      });

      console.log("SubjectCO-Data",subjectCOData);

      return res.json({
        error: false,
        subjectCOData,
        message: "subjectCO Mapping Data recieved successfully",
      });

    } catch (error) {
      return res.status(500).json({
        error: true,
        message: "Internal Server Error",
      });
    }
  }
);

// Updating Subject-CO's //dashboard/dataEntry ---> 
// description : After Uploading the data-sheet the CO's are readed 
app.put(
  "/update-subject-co/:batchId/:subjectName",
  authenticateToken,
  async (req, res) => {
    const { batchId, subjectName } = req.params;
    const { user } = req.user;
    const updatedCO = req.body;

    try {

      if (!batchId || !subjectName) {
        return res.status(400).json({
          error: true,
          message: "Batch ID and Subject Name are required.",
        });
      }

      const subjectCO = await SubjectCO.findOneAndUpdate(
        { userId: user._id, batchId: batchId, subjectName: subjectName },
        updatedCO,
        { new: true }
      );

      if (!subjectCO) {
        return res.status(404).json({
          error: true,
          message: "Subject CO not found.",
        });
      }

      res.json({
        error: false,
        message: "Subject CO updated successfully.",
        subjectCO,
      });
    } catch (error) {
      console.error("Error updating Subject CO:", error.message, error.stack);
      res.status(500).json({
        error: true,
        message: "Internal Server Error",
      });
    }
  }
);

//  Report Generation Modal implementation for Sem

app.post("/add-SemAttainmentReport", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const { batchId, subjectName, isSem, report } = req.body;

  try {
    
    if (!batchId || batchId == undefined) {
      return res.status(400).json({
        error: true,
        message: "batchId is required",
      });
    }

    if (!subjectName || subjectName == undefined) {
      return res.status(400).json({
        error: true,
        message: "subjectName is required",
      });
    }
    if (!report || report == undefined) {
      return res.status(400).json({
        error: true,
        message: "report data is required",
      });
    }

    const subjectReport = new AttainmentReport({
      userId: user._id,
      batchId: batchId,
      subjectName: subjectName,
      isSem: isSem,
      report: report,
    });

    await subjectReport.save();

    return res.json({
      error: false,
      note: "Sem Data Report saved successfully", // Ensure note is defined
      message: "sem report List Uploaded successfully",
    });
  } catch (error) {
    console.log("Error from attainmentReport " + error);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Report Generation for Subjects in IAT

app.post(
  "/update-subjectReport",
  authenticateToken,
  async (req, res) => {

    console.log("body",req.body+"Dummy");
    const { batchId, subjectName, report } = req.body;
    const { user } = req.user;

    console.log("Incoming report data:", report);
    console.log("RawBody:", req.body);

    try {
      if (!batchId || !subjectName) {
        return res.status(400).json({
          error: true,
          message: "Batch ID and Subject Name are required.",
        });
      }

      if (!report || Object.keys(report).length === 0) {
        return res.status(400).json({
          error: true,
          message: "Report update not found.",
        });
      }

      // const report = req.body;
      console.log(`report from server side  : ${report}`);
      const subjectReport = new AttainmentReport({
        batchId:batchId,
        subjectName : subjectName,
        report : report,
        userId : user._id
      });

      subjectReport.save();
     
      return res.json({
        error: false,
        message: "Subject IAT report updated successfully.",
        subjectReport,
      });

    } catch (error) {
      console.error(
        "Error updating Subject Report:",
        error.message,
        error.stack
      );
      res.status(500).json({
        error: true,
        message: "Internal Server Error",
      });
    }
  }
);

app.get(
  "/fetch-reports/:batchId/:subjectName",
  authenticateToken,
  async (req, res) => {
    const { batchId, subjectName } = req.params;
    const { user } = req.user;

    console.log("batchId : ",batchId);
    try {
      // Validate required parameters
      
      if (!batchId || !subjectName) {
        return res.status(400).json({
          error: true,
          message: "Batch ID and Subject Name are required.",
        });
      }

      const reports = await AttainmentReport.find({
        userId: user._id,
        batchId: batchId,
        subjectName: subjectName,
      });

      console.log("reports",reports);

      if (!reports || reports.length === 0) {
        return res.status(404).json({
          error: true,
          message: "No reports found for the specified batch and subject.",
        });
      }

      // Return the reports
      res.json({
        error: false,
        message: "Reports fetched successfully.",
        reports,
      });
    } catch (error) {
      console.error("Error fetching reports:", error.message, error.stack);
      res.status(500).json({
        error: true,
        message: "Internal Server Error.",
      });
    }
  }
);

app.post("/add-reports",authenticateToken,async(req,res)=>{
  const {user} = req.user;
  const {batchId,subjectName,flag,report} = req.body;

  
  try {
  
    if (!batchId || batchId == undefined) {
      return res.status(400).json({
        error: true,
        message: "batchId is required",
      });
    }

    if (!subjectName || subjectName == undefined) {
      return res.status(400).json({
        error: true,
        message: "subjectName is required",
      });
    }
    if (!report || report == undefined) {
      return res.status(400).json({
        error: true,
        message: "report data is required",
      });
    }

    const copoReport = new CopoReports({
      userId: user._id,
      batchId: batchId,
      subjectName: subjectName,
      flag: flag,
      report: report,
    });

    await copoReport.save();

    return res.json({
      error: false,
      note: "COPO report saved successfully", // Ensure note is defined
      message: "report List Uploaded successfully",
    });

  }catch(error) {
    console.error("Error fetching reports:", error.message, error.stack);
    res.status(500).json({
      error: true,
      message: "Internal Server Error.",
    });
  }

})


app.get("/get-reports/:batchId/:subjectName", authenticateToken, async (req, res) => {
  const { batchId, subjectName } = req.params;
  const { user } = req.user;

  try {
    if (!batchId || !subjectName) {
      return res.status(400).json({
        error: true,
        message: "Batch ID and Subject Name are required.",
      });
    }

    // Fetch reports based on batchId, subjectName, and userId
    const reports = await CopoReports.find({
      userId: user._id,
      batchId: batchId,
      subjectName: subjectName,
    });

    if (!reports || reports.length === 0) {
      return res.status(404).json({
        error: true,
        message: "No reports found for the provided details.",
      });
    }

    res.json({
      error: false,
      message: "Reports fetched successfully.",
      reports,
    });
  } catch (error) {
    console.error("Error fetching reports:", error.message, error.stack);
    res.status(500).json({
      error: true,
      message: "Internal Server Error.",
    });
  }
});


app.get("/getSubjectPOMapping/:batchId/:subjectName",authenticateToken,async (req,res)=>{
  const {batchId,subjectName} = req.params;
  const {user} = req.user;

  console.log("getSubjectMappingData",batchId,subjectName)

  try {
    if (!batchId || !subjectName) {
      return res.status(400).json({
        error: true,
        message: "Batch ID and Subject Name are required.",
      });
    }

    const mappingData = await Subjects.findOne({
      userId : user._id,
      batchId : batchId,
      subjectName : subjectName
    });

    if (!mappingData || mappingData.length === 0) {
      return res.status(404).json({
        error: true,
        message: "No mappingData found for the provided details.",
      });
    }

    res.json({
      error: false,
      message: "Reports fetched successfully.",
      mappingData,
    });

  }catch(error) {
    console.error("Error fetching reports:", error.message, error.stack);
    res.status(500).json({
      error: true,
      message: "Internal Server Error.",
    });
  }
})



app.listen(8000);

module.exports = app;
