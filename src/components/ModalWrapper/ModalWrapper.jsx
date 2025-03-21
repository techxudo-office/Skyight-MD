import React, { Children } from "react";
import Modal from "react-modal";
import "./ModalWrapper.css";
import { MdCancel } from "react-icons/md";
import { CustomTooltip } from "../components";
export default function ModalWrapper({
  children,
  className,
  isOpen,
  onRequestClose,
  contentLabel,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={contentLabel}
      className={`modal-content relative w-[600px] bg-white text-text border-4 rounded-xl border-primary max-h-[90%] overflow-auto  shadow-lg p-6 ${className}`}
      overlayClassName="modal-overlay fixed inset-0 flex justify-center items-center"
      closeTimeoutMS={300}>
      {onRequestClose && (
        <CustomTooltip content={"Close"}>
          <div
            onClick={onRequestClose}
            className="absolute text-2xl text-redColor cursor-pointer top-2 right-2">
            <MdCancel />
          </div>
        </CustomTooltip>
      )}

      {children}
    </Modal>
  );
}
