import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { routesData } from "../data/routesData";
import Loader from "../components/Loader/Loader";

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {routesData.map((route, index) => {
          if (route.children) {
            return (
              <Route key={index} path={route.path} element={route.element}>
                {route.children.map((child, childIndex) => (
                  <Route
                    key={childIndex}
                    path={child.path}
                    index={child.index}
                    element={child.element}
                  />
                ))}
              </Route>
            );
          }

          return (
            <Route key={index} path={route.path} element={route.element} />
          );
        })}
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
