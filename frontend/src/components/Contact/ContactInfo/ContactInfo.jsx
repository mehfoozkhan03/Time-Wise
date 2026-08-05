// import { useState } from "react";

// import "./ContactInfo.css";
// import { FaEnvelope, FaPhone, FaLocationDot, FaClock } from "react-icons/fa6";

// const infoItems = [
//   {
//     icon: <FaEnvelope />,
//     label: "Email",
//     detail: "support@timewise.com",
//   },
//   {
//     icon: <FaPhone />,
//     label: "Call",
//     detail: "+91 98765 43210",
//   },
//   {
//     icon: <FaLocationDot />,
//     label: "Location",
//     detail: "Mumbai, India",
//   },
//   {
//     icon: <FaClock />,
//     label: "Working Hours",
//     detail: "9AM - 6PM",
//   },
// ];

// function ContactInfo() {
//   const [activeIndex, setActiveIndex] = useState(null);

//   const handleToggle = (index) => {
//     setActiveIndex((prev) => (prev === index ? null : index));
//   };

//   return (
//     <div className="contactInfo">
//       <div className="head">
//         <h1>GET IN TOUCH WITH US</h1>
//         <p>At TimeWise, we value every user.</p>
//       </div>

//       <div className="info_parent">
//         {infoItems.map((item, index) => {
//           const isActive = activeIndex === index;

//           return (
//             <div
//               key={index}
//               className={`infoItem ${isActive ? "infoItem--active" : ""}`}
//               onClick={() => handleToggle(index)}
//             >
//               <span className="infoItem_icon">{item.icon}</span>
//               <div className="infoItem_body">
//                 <h2>{item.label}</h2>
//                 <p className="infoItem_detail">{item.detail}</p>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// export default ContactInfo;


import { useEffect, useState } from "react";

import "./ContactInfo.css";
import { FaEnvelope, FaPhone, FaLocationDot, FaClock } from "react-icons/fa6";
import Skeleton from "../../../components/Skeleton/Skeleton";


const infoItems = [
  {
    icon: <FaEnvelope />,
    label: "Email",
    detail: "support@timewise.com",
  },
  {
    icon: <FaPhone />,
    label: "Call",
    detail: "+91 98765 43210",
  },
  {
    icon: <FaLocationDot />,
    label: "Location",
    detail: "Mumbai, India",
  },
  {
    icon: <FaClock />,
    label: "Working Hours",
    detail: "9AM - 6PM",
  },
];


function ContactInfo() {

  const [activeIndex, setActiveIndex] = useState(null);

  const [loading, setLoading] = useState(true);



  useEffect(() => {

    const timer = setTimeout(() => {

      setLoading(false);

    },1500);


    return () => clearTimeout(timer);

  },[]);



  const handleToggle = (index) => {

    setActiveIndex((prev) => 
      prev === index ? null : index
    );

  };



  return (

    <div className="contactInfo">


      <div className="head">

        {
          loading ?

          <>
            <Skeleton
              width="350px"
              height="35px"
              radius="8px"
            />

            <Skeleton
              width="250px"
              height="20px"
              radius="8px"
            />
          </>

          :

          <>
            <h1>
              GET IN TOUCH WITH US
            </h1>

            <p>
              At TimeWise, we value every user.
            </p>
          </>

        }

      </div>



      <div className="info_parent">


        {

        loading ?

        Array.from({length:4}).map((_,index)=>(

          <div 
            className="infoItem"
            key={index} 
          >

            <Skeleton
              width="50px"
              height="50px"
              radius="50%"
            />


            <div className="infoItem_body">

              <Skeleton
                width="120px"
                height="20px"
              />


              <Skeleton
                width="170px"
                height="15px"
              />

            </div>


          </div>

        ))

        :

        infoItems.map((item,index)=>{

          const isActive = activeIndex === index;


          return (

            <div
              key={index}
              className={`infoItem ${
                isActive ? "infoItem--active" : ""
              }`}
              onClick={()=>handleToggle(index)}
            >

              <span className="infoItem_icon">
                {item.icon}
              </span>


              <div className="infoItem_body">

                <h2>
                  {item.label}
                </h2>


                <p className="infoItem_detail">
                  {item.detail}
                </p>

              </div>

            </div>

          );

        })

        }


      </div>


    </div>

  );
}


export default ContactInfo;