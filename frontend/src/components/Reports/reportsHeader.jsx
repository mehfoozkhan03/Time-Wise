// import { useDispatch } from "react-redux";
// import { setDateRange } from "../../store/reportsSlice";

// export function ReportsHeader({ dateRange, ranges }) {
//   const dispatch = useDispatch();

//   return (
//     <div
//       style={{
//         padding: "36px 15px 28px",
//         display: "flex",
//         flexWrap: "wrap",
//         gap: 20,
//         alignItems: "flex-start",
//         justifyContent: "space-between",
//       }}
//     >
//       <div>
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 10,
//             marginBottom: 6,
//           }}
//         >
//           <div
//             style={{
//               width: 34,
//               height: 34,
//               borderRadius: 9,
//               background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               fontSize: 16,
//               boxShadow: "0 4px 14px rgba(99,102,241,.4)",
//             }}
//           >
//             📊
//           </div>

//           <h1
//             style={{
//               margin: 0,
//               fontFamily: "Outfit,sans-serif",
//               fontSize: 26,
//               fontWeight: 700,
//               letterSpacing: "-0.02em",
//             }}
//           >
//             My Reports
//           </h1>
//         </div>

//         <p
//           style={{
//             margin: 0,
//             fontSize: 14,
//             maxWidth: 420,
//           }}
//         >
//           Personal attendance, productivity & performance analytics — track your
//           progress and celebrate achievements.
//         </p>
//       </div>

//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           gap: 10,
//           flexWrap: "wrap",
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             borderRadius: 10,
//             padding: 3,
//             gap: 5,
//           }}
//         >
//           {ranges.map((r) => (
//             <button
//               key={r.id}
//               onClick={() => dispatch(setDateRange(r.id))}
//               style={{
//                 padding: "6px 12px",
//                 borderRadius: 7,
//                 border: "none",
//                 cursor: "pointer",
//                 fontSize: 12.5,
//                 fontWeight: 500,
//                 transition: "all .15s",
//               }}
//             >
//               {r.label}
//             </button>
//           ))}
//         </div>

//         <button
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 6,
//             padding: "8px 14px",
//             borderRadius: 9,
//             border: "1px solid rgba(255,255,255,.08)",
//             fontSize: 12.5,
//             fontWeight: 500,
//             cursor: "pointer",
//           }}
//         >
//           📄 PDF
//         </button>

//         <button
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 6,
//             padding: "8px 14px",
//             borderRadius: 9,
//             border: "1px solid rgba(16,185,129,.2)",
//             fontSize: 12.5,
//             fontWeight: 500,
//             cursor: "pointer",
//           }}
//         >
//           📊 Excel
//         </button>
//       </div>
//     </div>
//   );
// }


import { useDispatch } from "react-redux";
import { setDateRange } from "../../store/reportsSlice";
import { useState, useEffect } from "react";
import Skeleton from "../../components/Skeleton/Skeleton";


export function ReportsHeader({ dateRange, ranges }) {
  const dispatch = useDispatch();

  const [showSkeleton, setShowSkeleton] = useState(true);

useEffect(() => {
  const timer = setTimeout(() => {
    setShowSkeleton(false);
  }, 1500);

  return () => clearTimeout(timer);
}, []);

  return (
  <div
    style={{
      padding: "36px 15px 28px",
      display: "flex",
      flexWrap: "wrap",
      gap: 20,
      alignItems: "flex-start",
      justifyContent: "space-between",
    }}
  >
    {showSkeleton ? (
      <>
        {/* Left */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 10,
            }}
          >
            <Skeleton
              width="34px"
              height="34px"
              radius="9px"
            />

            <Skeleton
              width="180px"
              height="30px"
            />
          </div>

          <Skeleton
            width="420px"
            height="16px"
          />

          <div style={{ marginTop: 8 }}>
            <Skeleton
              width="320px"
              height="16px"
            />
          </div>
        </div>

        {/* Right */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          {[...Array(4)].map((_, i) => (
            <Skeleton
              key={i}
              width="70px"
              height="34px"
              radius="8px"
            />
          ))}

          <Skeleton
            width="80px"
            height="36px"
            radius="8px"
          />

          <Skeleton
            width="90px"
            height="36px"
            radius="8px"
          />
        </div>
      </>
    ) : (
      <>
        {/* ---------Original Code ---------- */}

        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 6,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                boxShadow: "0 4px 14px rgba(99,102,241,.4)",
              }}
            >
              📊
            </div>

            <h1
              style={{
                margin: 0,
                fontFamily: "Outfit,sans-serif",
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              My Reports
            </h1>
          </div>

          <p
            style={{
              margin: 0,
              fontSize: 14,
              maxWidth: 420,
            }}
          >
            Personal attendance, productivity & performance analytics — track
            your progress and celebrate achievements.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              borderRadius: 10,
              padding: 3,
              gap: 5,
            }}
          >
            {ranges.map((r) => (
              <button
                key={r.id}
                onClick={() => dispatch(setDateRange(r.id))}
                style={{
                  padding: "6px 12px",
                  borderRadius: 7,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12.5,
                  fontWeight: 500,
                }}
              >
                {r.label}
              </button>
            ))}
          </div>

          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 14px",
              borderRadius: 9,
              border: "1px solid rgba(255,255,255,.08)",
            }}
          >
            📄 PDF
          </button>

          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 14px",
              borderRadius: 9,
              border: "1px solid rgba(16,185,129,.2)",
            }}
          >
            📊 Excel
          </button>
        </div>
<<<<<<< HEAD

        <p
          style={{
            margin: 0,
            fontSize: 14,
            maxWidth: 420,
          }}
        >
          Personal attendance, productivity & performance analytics — track your
          progress and celebrate achievements.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            borderRadius: 10,
            padding: 3,
            gap: 5,
          }}
          className="reports_button_flex"
        >
          {ranges.map((r) => (
            <button
              key={r.id}
              onClick={() => dispatch(setDateRange(r.id))}
              style={{
                padding: "6px 12px",
                borderRadius: 7,
                border: "none",
                cursor: "pointer",
                fontSize: 12.5,
                fontWeight: 500,
                transition: "all .15s",
              }}
            >
              {r.label}
            </button>
          ))}
        </div>

        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            borderRadius: 9,
            border: "1px solid rgba(255,255,255,.08)",
            fontSize: 12.5,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          📄 PDF
        </button>

        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            borderRadius: 9,
            border: "1px solid rgba(16,185,129,.2)",
            fontSize: 12.5,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          📊 Excel
        </button>
      </div>
    </div>
  );
=======
      </>
    )}
  </div>
);
>>>>>>> b189887813a27ca225b3bc23cbbd51af9525b193
}
