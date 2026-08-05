import "../../components/Skeleton/Skeleton.css";

const Skeleton = ({
  width = "100%",
  height = "20px",
  radius = "8px",
  className = "",
}) => {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius: radius,
      }}
    />
  );
};

export default Skeleton;