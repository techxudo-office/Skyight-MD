import { Routes, Route } from "react-router-dom";
import { routesData } from "../data/routesData";

const AppRoutes = () => {
  return (
    <Routes>
      {routesData.map((route, index) => {
        if (route.children) {
          return (
            <Route key={index} path={route.path} element={route.element}>
              {route.children.map((child, childIndex) => (
                <Route
                  key={childIndex}
                  index={child.index}
                  path={child.path}
                  element={child.element}
                />
              ))}
            </Route>
          );
        }

        return <Route key={index} path={route.path} element={route.element} />;
      })}
    </Routes>
  );
};

export default AppRoutes;
