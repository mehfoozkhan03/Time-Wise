import "../styles/Loader.css";

function Loader() {
  return (
    <div className="loader-container">
      <div className="loader-circle">
        <div className="loader-inner"></div>
      </div>

      <h2 className="loader-logo">
        TIME<span>WISE</span>
      </h2>

      {/* <p>Loading...</p> */}
    </div>
  );
}

export default Loader;