import React, { useEffect, useRef, useState } from "react";
import { Button, ModalWrapper, SecondaryButton } from "../components";

const ConfirmModal = ({ status, onAbort, onConfirm, text, loading }) => {
  const modalRef = useRef();
  useEffect(() => {
    const outsideClickHandler = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onAbort;
      }
    };

    document.addEventListener("mousedown", outsideClickHandler);
    return () => {
      document.removeEventListener("mousedown", outsideClickHandler);
    };
  }, [modalRef]);

  return (
    <>
      <ModalWrapper
        ref={modalRef}
        isOpen={status}
        // className={`transition-all absolute z-10 ${status ? "top-16" : "top-[-100%]"
        //   } left-[50%] translate-x-[-50%]`}
      >
        <div className={" flex flex-col gap-3 "}>
          <h2 className="px-4 text-2xl font-semibold text-primary ">
            Confirmation
          </h2>

          <h2 className="px-4 py-3 text-xl text-text border-t border-b border-background">
            {text}
          </h2>

          <div className={"gap-2 flex justify-end px-4 "}>
            <div>
              <SecondaryButton
                text="Confirm"
                onClick={onConfirm}
                loading={loading}
                disabled={loading}
              />
            </div>
            <div>
              <Button text="Cancel" className="bg-redColor" onClick={onAbort} />
            </div>
          </div>
        </div>
      </ModalWrapper>
    </>
  );
};

export default ConfirmModal;
