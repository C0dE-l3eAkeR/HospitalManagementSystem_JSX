import { Table } from "antd";
import { useEffect, useState } from "react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  DeleteAppointment,
  GetAllAppointment,
} from "../../../../../Redux/Datas/action";
import Sidebar from "../../GlobalFiles/Sidebar";

const Check_Appointment = () => {
  const { data } = useSelector((store) => store.auth);
  const id = data.user.ID;
  const disptach = useDispatch();
  const navigate = useNavigate();
  const columns = [
    { title: "Patient Name", dataIndex: "patientName", key: "patientName" },
    { title: "Mobile", dataIndex: "mobile", key: "mobile" },
    { title: "Disease", dataIndex: "disease", key: "disease" },
    { title: "Department", dataIndex: "department", key: "department" },
    { title: "Date", dataIndex: "date", key: "date" },
  ];
  

 const [AllAppointment, setApp] = useState([]); 
useEffect(() => {
  console.log(1);
  
  axios.get('http://localhost:4000/doctorapp/'+id).then((res) => {
    console.log(res.data)
      setApp(res.data.slice(0, 10));
    //  console.log(posts);
  })
},[]);

const handl = (e)=>{
  console.log("dfdf");
  let patientid = "/patient/"+e;
  if (data?.user.userType !== "doctor") {
    return <Navigate to={"/dashboard"} />;
  }
 
 }

  const DeleteAppoint = (id) => {
    disptach(DeleteAppointment(id));
  };
  useEffect(() => {
    disptach(GetAllAppointment());
  }, []);

  if (data?.isAuthticated === false) {
    return <Navigate to={"/"} />;
  }

  if (data?.user.userType !== "doctor") {
    return <Navigate to={"/dashboard"} />;
  }
 
  return (
    <>
      <div className="container">
        <Sidebar />
        <div className="AfterSideBar">
          <div className="Payment_Page">
            <h1 style={{ marginBottom: "2rem" }}>Appointment Details</h1>
            <div className="patientBox">
              <table>
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Mobile</th>
                    <th>Disease</th>
                    <th>Department</th>
                    <th>Time</th>
                    <th>Resolve</th>
                  </tr>
                </thead>
                <tbody>
                  {AllAppointment?.map((ele) => {
                    return (
                      <tr onClick={()=> navigate("/patient/"+ele.ID)}>
                        <td>{ele.patientName}</td>
                        <td>{ele.patientMobile}</td>
                        <td>{ele.patientDisease}</td>
                        <td>{ele.docDepartment}</td>
                        <td>{ele.time}</td>
                        <td>
                          <button
                            style={{
                              border: "none",
                              color: "red",
                              outline: "none",
                              background: "transparent",
                              cursor: "pointer",
                            }}
                            onClick={() => DeleteAppoint(ele.ID)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Check_Appointment;
