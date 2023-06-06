import React, { useState,useEffect } from "react";
import { CommonProblem } from "./MixedObjectData";
import "./CSS/Book_appointment.css";
import { useDispatch } from "react-redux";
import { AddPatients, CreateBooking } from "../../../../../Redux/Datas/action";
import Sidebar from "../../GlobalFiles/Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
const notify = (text) => toast(text);

const Book_Appointment = () => {
  const dispatch = useDispatch();
  const [Loading, setLoading] = useState(false);

  const InitValue = {
    patientName: "",
    patientAge: "",
    patientGender: "",
    patientMobile: "",
    patientDisease: "",
    patientAddress: "",
    email: "",
    department: "",
    docID:"",
    date: "",
    time: "",

  };

  const [doctors, setDoc] = useState([])
  useEffect(
   ()=>{ 
  axios.get('http://localhost:4000/doctors').then((res)=>{
   
   setDoc(res.data.slice(0, 10))
   console.log(doctors)
   })

  },[])

  const [BookAppoint, setBookAppoint] = useState(InitValue);

  const HandleAppointment = (e) => {
    setBookAppoint({ ...BookAppoint, [e.target.name]: e.target.value });
  };

  const HandleOnsubmitAppointment = (e) => {
    e.preventDefault();

    if (BookAppoint.patientGender === "" || BookAppoint.department === "") {
      return notify("Please fill all the Details");
    }
    setLoading(true);
    axios.post('http://localhost:4000/patient',{...BookAppoint, ID : Date.now()}).then(   
     //console.log(posts);
      (res) => {
        console.log(res.data);
        let data = {
          ID: res.data.ID,
          docID : res.data.docID,
          date : res.data.date,
          time : res.data.time
        };
        let link = 'http://localhost:4000/patientapp/'+res.data.ID;
        axios.post(link, data).then((res)=>{
        notify("Appointment Booked");
        setLoading(false);
      })
        setBookAppoint(InitValue);
      
  });
  }
  return (
    <>
      <ToastContainer />
      <div className="container">
        <Sidebar />
        <div className="AfterSideBar">
          <div className="Main_Add_Doctor_div">
            <h1>Book Appointment</h1>
            <form onSubmit={HandleOnsubmitAppointment}>
              {/* Name PlaceHolder */}
              <div>
                <label>Patient Name</label>
                <div className="inputdiv">
                  <input
                    type="text"
                    placeholder="First Name"
                    name="patientName"
                    value={BookAppoint.patientName}
                    onChange={HandleAppointment}
                    required
                  />
                </div>
              </div>
              {/* AGE PLACEHOLDER  */}
              <div>
                <label>Age</label>
                <div className="inputdiv">
                  <input
                    type="number"
                    placeholder="Age"
                    name="patientAge"
                    value={BookAppoint.patientAge}
                    onChange={HandleAppointment}
                    required
                  />
                </div>
              </div>
              {/* GENDER PLACEHOLDER  */}
              <div>
                <label>Gender</label>
                <div className="inputdiv">
                  <select
                    name="patientGender"
                    value={BookAppoint.patientGender}
                    onChange={HandleAppointment}
                    required
                  >
                    <option value="Choose Blood Group">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              {/* MOBILE PLACEHOLDER */}
              <div>
                <label>Contact Number</label>
                <div className="inputdiv">
                  <input
                    type="number"
                    placeholder="Number"
                    name="patientMobile"
                    value={BookAppoint.patientMobile}
                    onChange={HandleAppointment}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label>Email</label>
                <div className="inputdiv">
                  <input
                    type="email"
                    placeholder="example@email.com"
                    name="email"
                    value={BookAppoint.email}
                    onChange={HandleAppointment}
                    required
                  />
                </div>
              </div>
              {/* PROBLEM PLACEHOLDER */}
              <div>
                <label>Type of Disease</label>
                <div className="inputdiv">
                  <select
                    name="patientDisease"
                    value={BookAppoint.patientDisease}
                    onChange={(e) => {
                      HandleAppointment(e);
                    }}
                    required
                  >
                    <option value="Choose Blood Group">Select Disease</option>
                    {CommonProblem.map((ele, i) => {
                      return (
                        <option key={i} value={ele.title}>
                          {ele.title}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* ENTER SAMPLE DISEASE */}

              {/* ADDRESS SECTION  */}

              <div>
                <label>Address</label>
                <div className="inputdiv">
                  <input
                    type="text"
                    placeholder="Address line 1"
                    name="patientAddress"
                    value={BookAppoint.patientAddress}
                    onChange={HandleAppointment}
                    required
                  />
                </div>
              </div>
              {/* DEPARTMENT SECTION */}

              <div>
                <label>Department</label>
                <div className="inputdiv">
                  <select
                    name="department"
                    value={BookAppoint.department}
                    onChange={HandleAppointment}
                    required
                  >
                    <option value="">Select</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="ENT">ENT</option>
                    <option value="Ophthalmologist">Ophthalmologist</option>
                    <option value="Anesthesiologist">Anesthesiologist</option>
                    <option value="Dermatologist">Dermatologist</option>
                    <option value="Oncologist">Oncologist</option>
                    <option value="Psychiatrist">Psychiatrist</option>
                  </select>
                </div>
              </div>
              <div>
                <label>Doctor</label>
                <div className="inputdiv">
                  <select
                    name="docID"
                    value={BookAppoint.docID}
                    onChange={(e) => {
                      HandleAppointment(e);
                    }}
                    required
                  >
                    <option value="Choose Doctor">Select Dortor</option>
                    {doctors.map((ele) => {
                      return (
                        <option key={ele.ID} value={ele.ID}>
                          {ele.docName}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              {/* APPOINTMENT DATE  */}
              <div className="dateofAppointment">
                <p>Date and Time </p>
                <div className="inputdiv">
                  <input
                    type={"date"}
                    placeholder="Choose Date"
                    name="date"
                    value={BookAppoint.date}
                    onChange={HandleAppointment}
                    required
                  />
                  <input
                    type={"time"}
                    placeholder="Choose Time"
                    name="time"
                    value={BookAppoint.time}
                    onChange={HandleAppointment}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="book_formsubmitbutton">
                {Loading ? "Loading..." : "Book Appointment"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Book_Appointment;
