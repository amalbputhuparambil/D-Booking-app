import { useEffect, useState } from "react";
import axiosJWT from "../utils/axiosService";
import { UserInterface } from "../types/UserInterface";
import { ADMIN_API } from "../constants";

const useDepartments = () => {
  const [departments, setDepartments] = useState<UserInterface[]>([]);

  useEffect(() => {
    axiosJWT
      .get(ADMIN_API + "/department")
      .then(({ data }) => {
        setDepartments(data.departments)
      })
      .catch((error: any) => console.log(error));
  }, [setDepartments]);

  return { departments, setDepartments };
};

export default useDepartments;