import AppRoutes from "./routes/routes";
import SessionManager from "./components/SessionManager/SessionManager";

const Main = () => {
  console.log("CICD Test 1");
  return (
    <>
      <SessionManager />
      <AppRoutes />
    </>
  );
};

export default Main;
