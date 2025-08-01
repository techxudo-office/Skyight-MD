import Spinner  from "../Spinner/Spinner";

const SecondaryButton = ({
  text,
  onClick,
  type = "button",
  className = "",
  styles,
  disabled,
  id,
  textColorHover,
  icon,
  loading,
}) => {
  return (
    <>
      <button
        type={type}
        onClick={onClick}
        disabled={disabled || loading}
        className={`group ${
          disabled || loading
            ? "cursor-not-allowed text-text bg-lightgray border-gray "
            : "bg-bluebg text-primary hover:text-secondary border-primary"
        }  w-fit py-2 px-4 border-[1px]   font-semibold rounded-md transition duration-300 ease-in-out transform focus:outline-none ${className} `}
        style={styles}
        id={id}
      >
        {loading ? (
          <Spinner />
        ) : (
          <div className="flex items-center justify-center gap-1 ">
            <span
              className={`${
                disabled || loading ? "text-text" : "text-primary"
              } text-xl pb-[2px] `}
            >
              {icon}
            </span>
            <span className={` hover:${textColorHover} max-md:text-sm`}>
              {text}
            </span>
          </div>
        )}
      </button>
    </>
  );
};

export default SecondaryButton;
