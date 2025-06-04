import "./Switch.css";

const Switch = ({ onChange, label, disabled = false, value = true }) => {
  return (
    <div className="flex items-center gap-3 ">
      <p className="text-xl font-semibold capitalize">{label}</p>
      <label className="switch">
        <input
          type="checkbox"
          checked={value}
          className="checkbox"
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className="slider"></div>
      </label>
    </div>
  );
};

export default Switch;
