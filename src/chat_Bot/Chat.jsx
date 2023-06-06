"use client";
import React, {useEffect, useState,useRef } from "react";
import "./Chat.css";
import axios from "axios"
import { useParams } from "react-router-dom";







//import express from "express";
const Chat = ({id}) => {

  console.log(id);
  const[ doctorID , setdocID] =useState("");
  let tempdoc ="";
  let patient= {
    patientName: "",
    patientBloodGroup:"",
    age: "",
    gender: "",
    mobile: "",
    disease: "",
    address: "",
    email: "",
    doctorid: "",
    date: "",
    time: "",
  }; 
  const foramter =(data)=>{
    let format = data.split("\n")
    let str = "";
     format.map((e)=>{str+= e+"\n"})

     return str;
    }
  const manageTime = (time)=>{

    let slots="";
    let booked="";
    axios.get("http://localhost:4000/doctorslot/"+id).then((res) => {
      slots={...res.data}
    })
    axios.get("http://localhost:4000/doctorstime/"+id).then((res) => {
    booked={...res.data}
    })
    const a = slots.days.find(x=> x == time.day )
    const b = slots.time.find(x=> x == time.time )
    if(a && b){
      if(a!=booked.day && b!= booked.time)
      return true;
    }
   return false;
  }
 
  const availableTimes =(data)=>{
    let slots=[];
    console.log(data)
    let pp=false;
    let link ="http://localhost:4000/doctorstimejson/"+data.docID;
    axios.post(link,data).then((res) => {
      console.log(res.data)
      return(res.data);
    })
    
 

    
  }
  const [pat, setPat] =useState(patient);
  //shoyib,A+,23, male,023423,fever,mirpur, mm@gmail.com,aniss,12-3-23,11.30
  const setPatient = (resp)=>{
    console.log(11111);
    console.log(resp[0]);
    patient.patientName = resp[0];
    console.log(patient.patientName);
    patient.bloodGroup=resp[1];
    patient.age=resp[2];
    patient.gender=resp[3];
    patient.mobile=resp[4];
    patient.disease=resp[5];
    patient.address=resp[6];
    patient.email=resp[7];
    patient.doctorid=resp[8];
    patient.date=resp[9];
    patient.time=resp[10];
    console.log(patient);
    axios.post('http://localhost:4000/patient',patient).then((res) => {
      })
 
  }
 
  const [messages,setMessages] = useState([]);
  const[input,setInput] = useState("");
  const [resp, setResp] = useState("");
  const [func, setFunc] = useState(0);
  
  const formRef = useRef(null);

  const handleKeyUp = (e)=>{
    if(e.key === "Enter" && !e.shiftKey){
      formRef.current.dispatchEvent(
        new Event("submit",{ cancelable: true, bubbles: true})
      );
    }
  };

  const sendMessage = async(event)=> {
    event.preventDefault();
    if(input.trim()==="") return;
  
    setMessages([...messages,{isUser:true,text: input.trim() }]);
    let link="";
    let patient = {

    }
    console.log(func);
    if(func==101){
     let temp = input.trim();
     let temp2 =temp.split(",",10);
     
    await setPatient(temp2);
     console.log(patient); 
     
     link = "http://127.0.0.1:5000/message/set Appointment";
     setFunc("0");
    }

    else if(func==102){
      
      let temp = input.trim();
      tempdoc = temp;
       setdocID(temp);
      console.log(doctorID)
     link = "http://127.0.0.1:5000/message/ask doctor";
     
    }
    else if(func==202 || func==103){
      
      let temp = input.trim();
     
      const [day,time] =  temp.split(" ");
      console.log(doctorID);
      const temp2 = {
        docID : doctorID,
        day : day,
        time :time
      }
      let link2="";
      let link3 ="http://localhost:4000/doctorstimejson/"+doctorID;
    axios.post(link3,temp2).then((res) => {
      console.log(res.data)
      if(res.data){   
      link2 = "http://localhost:4000/patientapp/"+id;
      axios.post(link2,temp2).then((res) => {  
        link = "http://127.0.0.1:5000/message/set Appointment";
      })
      
      }
      else {
        console.log("ff")
      link = "http://127.0.0.1:5000/message/again time";
      }
    })
  }
    else 
     link = "http://127.0.0.1:5000/message/"+input.trim();

    setInput("");
  
    
      const response = await fetch(link);
      
      const data = await response.json();
      console.log(data.res);
        
      let fnc = data.func;
      console.log(fnc);
      let aiMessage = data.res || "Sorry,i could't understand your message.";
       
      if(fnc==101 || fnc==102){
        let list="";
        await axios.get("http://localhost:4000/doctorsidlist/").then((res) => {
          list=res.data
          console.log(list);
          aiMessage= aiMessage+ "\n" + list;
          })
     
        console.log(aiMessage);
      }
      else if(fnc ==202){
       let pp =[];
      await axios.get("http://localhost:4000/doctorstimea/"+tempdoc).then((res) => {
       pp=res.data;
        })
      
        console.log(foramter(pp));
        aiMessage= aiMessage+ "\n" + pp;
        console.log(aiMessage);
      }
      else if(fnc==103){
        let pp =[];
       await axios.get("http://localhost:4000/doctorstimea/"+doctorID).then((res) => {
        pp=res.data;
         })
       
         console.log(foramter(pp));
         aiMessage= aiMessage+ "\n" + pp;
         console.log(aiMessage);
       }

      console.log(aiMessage);
      setMessages((previousMessages)=>[
        ...previousMessages,
        {isUser:false, text: aiMessage}
      ])
     
        setFunc(fnc);
              
  };


  return (
  <div className="chat-container open">
    <div className="chat-header">
      <div>Chatbot</div>
    </div>
    <div className="chat-body" id= "chat-body">
      {messages.map((message,index) => (
        <div
        key={index}
        className={`chat-message ${
          message.isUser ? "user-message" : "ai-message"
        }`} >
          <div className="message-user-identification">
            <p>
              {" "}
              <span>&#x1F7E2;</span>
              {message.isUser ? "User" : "Chatbot"}
            </p>
          </div>
          <p> {message.text} </p>
          </div>
     ))}
    </div>
    <form className="chat-input" onSubmit={sendMessage} ref={formRef}>
      <textarea 
      type="text" 
      placeholder="type your message" 
      value={input}
      onKeyUp={(e)=> handleKeyUp(e)}
       onChange={(e)=> setInput(e.target.value)}
       />
       <button className="send-button" type = "submit">
    send
  </button>
    </form>

  </div>
  ); 
  };
export default Chat;