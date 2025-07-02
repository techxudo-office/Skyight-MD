import { useNavigate } from "react-router-dom";
import Button  from "../../components/Button/Button";

const NotFound = () => {
  const navigate = useNavigate();

  const goBackHandler = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-5xl mb-7">404 | Not Found</h2>

        <div>
          <Button text={"Back to Previous"} onClick={goBackHandler} />
        </div>
      </div>
    </>
  );
};

export default NotFound;
