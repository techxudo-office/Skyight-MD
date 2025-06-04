import { useEffect, useRef } from "react";
import { Button, ModalWrapper, SecondaryButton } from "../components";

const ConfirmModal = ({ status, onAbort, onConfirm, text, loading }) => {
  const modalRef = useRef();

  useEffect(() => {
    // This effect adds a listener to detect clicks outside the modal content.
    const outsideClickHandler = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        // This line doesn't call `onAbort`, it just references it.
        // It should be corrected to `onAbort()` to trigger the abort action.
        onAbort();
      }
    };

    document.addEventListener("mousedown", outsideClickHandler);

    // Cleanup to remove the event listener when modal unmounts or ref changes.
    return () => {
      document.removeEventListener("mousedown", outsideClickHandler);
    };
  }, [modalRef]);

  return (
    <>
      {/* Main modal wrapper - `ref` is passed to detect outside clicks */}
      <ModalWrapper ref={modalRef} isOpen={status}>
        <div className={"flex flex-col gap-3"}>
          <h2 className="px-4 text-2xl font-semibold text-primary">
            Confirmation
          </h2>

          {/* Message text provided by parent, commonly a confirmation prompt */}
          <h2 className="px-4 py-3 text-xl border-t border-b text-text border-background">
            {text}
          </h2>

          {/* Action buttons: Confirm and Cancel */}
          <div className="flex justify-end gap-2 px-4">
            <div>
              <Button
                text="Confirm"
                onClick={onConfirm}
                loading={loading} // Optional loading spinner
              />
            </div>
            <div>
              <Button
                text="Cancel"
                className="bg-redColor"
                onClick={onAbort} // Cancels and closes modal
              />
            </div>
          </div>
        </div>
      </ModalWrapper>
    </>
  );
};

export default ConfirmModal;
