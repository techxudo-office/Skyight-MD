import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
  CardLayoutFooter,
} from "../../../components/CardLayout/CardLayout";
import {
  Input,
  Button,
  Spinner,
  ModalWrapper,
  Select,
  Switch,
} from "../../../components/components";
import { useDispatch, useSelector } from "react-redux";
import { getUserRoles } from "../../../_core/features/roleSlice";
import { editUser } from "../../../_core/features/userSlice";

Modal.setAppElement("#root");

const inputFields = [
  {
    name: "first_name",
    label: "First Name*",
    type: "text",
    placeholder: "Enter First Name",
  },
  {
    name: "last_name",
    label: "Last Name*",
    type: "text",
    placeholder: "Enter Last Name",
  },
  {
    name: "email",
    label: "Email*",
    type: "text",
    placeholder: "Enter Email",
  },
  {
    name: "password",
    label: "Password*",
    type: "password",
    placeholder: "Enter New Password",
  },
  {
    name: "mobile_number",
    label: "Mobile Number*",
    type: "text",
    placeholder: "Enter Mobile Number",
  },
];

const initialState = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  mobile_number: "",
  role_id: "",
};

const EditTransactionModal = ({ isOpen, onClose, transactionId }) => {
  const dispatch = useDispatch();
  const [toggle, setToggle] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const { userData } = useSelector((state) => state.auth);
  const { isEditingUser } = useSelector((state) => state.user);
  const { userRoles, isLoadingUserRoles } = useSelector((state) => state.reasons);

  useEffect(() => {
    dispatch(getUserRoles(userData?.token));
  }, [dispatch]);

  // const handleRoleSelect = (role) => {
  //   let data = {
  //     id: role.value,
  //     role: role.lable,
  //   };
  //   setSelectedRole(data);
  //   setFormData((prev) => ({ ...prev, role_id: data.role }));
  // };

  const handleSubmit = () => {
    // if (!editUserValidation(formData, setErrors)) {
    //   toast.error("Please fix the errors before submitting.");
    //   return;
    // }

    const payload = {
      status: toggle ? "approved" : "rejected",
      transaction_id: transactionId,
      reasonIds: [1],
    };

    dispatch(editUser({ data: payload, token: userData?.token })).then(() => {
      onClose();
    });
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Edit Transaction"
    >
      <CardLayoutContainer>
        <CardLayoutHeader heading="Edit Transaction" />
        <CardLayoutBody>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* <Select
              id="userRoles"
              label="Role"
              height="h-12"
              value={selectedRole ? selectedRole.role : ""}
              onChange={handleRoleSelect}
              options={userRoles?.map((role) => ({
                value: role.id,
                label: role.role,
              }))}
              placeholder="Select a Role"
              isLoading={isLoadingUserRoles}
            /> */}
          </div>
          <div className="mt-4">
            <Switch label={"Status:"} setToggle={setToggle} />
          </div>
        </CardLayoutBody>
        <CardLayoutFooter>
          <Button
            text={isEditingUser ? <Spinner /> : "Update User"}
            onClick={handleSubmit}
            disabled={isEditingUser}
          />
          <Button
            text="Cancel"
            className="ml-3 bg-redColor hover:bg-red-600"
            onClick={onClose}
          />
        </CardLayoutFooter>
      </CardLayoutContainer>
    </ModalWrapper>
  );
};

export default EditTransactionModal;
