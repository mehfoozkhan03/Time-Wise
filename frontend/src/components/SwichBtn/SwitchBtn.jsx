import "../../components/SwichBtn/SwitchBtn.css"

export const SwitchBtn = () => {
  return (
    <>
      <div className="switchBtn-container">
        <label class="switch">
        <input type="checkbox" />
        <span class="switch-slider"></span>
      </label>
      </div>
    </>
  );
};
