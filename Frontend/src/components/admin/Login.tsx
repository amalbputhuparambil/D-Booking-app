import { useFormik } from "formik";
import { useState } from "react";
import axios from "axios";
import showToast from "../../utils/toaster";
import { useNavigate } from "react-router-dom";
import { validateLogin } from "../../utils/validation";
import { ADMIN_API } from "../../constants";
import { useAppDispatch } from "../../redux/store/store";
import { setUser } from "../../redux/slices/UserSlice";
import Admin from "../../assets/images/admin.png"
import { setItemToLocalStorage } from "../../utils/setnget";


const Login: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState<Boolean>(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: validateLogin,
    onSubmit: ({ email, password }) => {
      setIsSubmitting(true);
      axios
        .post(ADMIN_API + "/login", { email, password })
        .then(({ data }) => {
          const { name, role } = data.admin;
          const { message, access_token, refresh_token } = data;
          showToast(message, "success");
          setItemToLocalStorage('access_token', access_token); 
          setItemToLocalStorage("refresh_token",refresh_token)
          dispatch(setUser({ isAuthenticated: true, name, role }));
          // dispatch(setTokens({ access_token, refresh_token }));
          navigate("/admin");
        })
        .catch(({ response }) => {
          const { message } = response.data;
          setIsSubmitting(false);
          showToast(message, "error");;
        });
    },
  });

  return (
    <section className="flex items-center justify-center min-h-screen bg-green-400">
    <div className="flex-1  flex flex-col items-center justify-center px-6 py-8 mx-auto md:mx-0 md:ml-8 lg:ml-16 xl:ml-24 ">
      <div className="w-full  bg-emerald-200 rounded-2xl shadow-2xl md:max-w-2xl xl:p-0 flex flex-row md:flex-row">
      <img
    src={Admin}
    alt="Admin"
    className=" w-80 mb-6 lg:mr-8 md:mb-0 "
  />
        <div className="p-6 space-y-4 md:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-headerText md:text-2xl">
             ADMIN LOGG INN ... ... 
          </h1>

          <form className="space-y-4" onSubmit={formik.handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-secondaryColor"
              >
                Email
              </label>
              <input
                type="text"
                id="email"
                placeholder="jhondoe@gmail.com"
                className=" border-b-2 border-b-slate-200 text-gray-900 outline-none sm:text-sm  focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                autoFocus
                {...formik.getFieldProps("email")}
              />
              {formik.errors.email && formik.touched.email && (
                <div className="text-red-500">{formik.errors.email}</div>
              )}
            </div>
            <div className="relative">
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-secondaryColor"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                className=" border-b-2 border-b-slate-200 text-gray-900 outline-none sm:text-sm  focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                {...formik.getFieldProps("password")}
              />
              {formik.errors.password && formik.touched.password && (
                <div className="text-red-500">{formik.errors.password}</div>
              )}
              <div className="absolute top-1/2 right-2 transForm -translate-y-1/2 cursor-pointer"></div>
            </div>
            <button
              type="submit"
              className="w-full px-6 py-2 text-white rounded-lg bg-gradient-to-l bg-green-700 hover:bg-gradient-to-r  transition-all duration-500 "
              disabled={isSubmitting ? true : false}
            >
              <span className="font-semibold"> Log In</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
    
  );
};

export default Login;
