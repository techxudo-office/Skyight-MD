import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/components";

const NotFound = () => {
  const navigate = useNavigate();

  const goBackHandler = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="mb-7 text-5xl">404 | Not Found</h2>

        <div>
          <Button text={"Back to Previous"} onClick={goBackHandler} />
        </div>
      </div>
    </>
  );
};

export default NotFound;
