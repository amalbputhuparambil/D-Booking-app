import { useFormik } from "formik";
import { ChevronDown } from "lucide-react";
import { ButtonHTMLAttributes, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import BannerData from "../../components/admin/BannerData";
import { ADMIN_API, IMAGEUPLOADCONFIG } from "../../constants";
import CloudinaryUploadWidget from "../../redux/Context/UploadwidgetContext";
import { BannerInterface } from "../../types/BannerInterface";
import axiosJWT from "../../utils/axiosService";
import showToast from "../../utils/toaster";
import AdminHeader from "../../components/admin/HeadernSidebar/Header";
import AdminSidebar from "../../components/admin/HeadernSidebar/Sidebar";

// Button Component
interface ButtonPropsInterface extends ButtonHTMLAttributes<HTMLButtonElement> {
  handleButtonclick?: () => void;
  label: string;
  className?: string;
  isDisabled?: boolean;
  buttontype?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonPropsInterface> = ({
  handleButtonclick,
  label,
  isDisabled,
  className,
  buttontype,
}) => {
  const defaultClassStyle =
    "py-2 px-5 rounded-md text-white font-semibold transition duration-150";
  return (
    <button
      className={`${defaultClassStyle} ${className}`}
      onClick={handleButtonclick}
      disabled={isDisabled ?? false}
      type={`${buttontype ?? "button"}`}
    >
      {label}
    </button>
  );
};

// Banner Modal Component
interface BannerModalProps {
  setModalOpen: (isOpen: boolean) => void;
  handleAddedBanner: (bannerdata: BannerInterface) => void;
}

const BannerModal: React.FC<BannerModalProps> = ({
  setModalOpen,
  handleAddedBanner,
}) => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const validate = (values: any) => {
    const errors: any = {};
    if (!values.title) {
      errors.title = "Title is required";
    }
    if (!values.description) {
      errors.description = "Description is required";
    }
    if (!values.advertisementUrl) {
      errors.advertisementUrl = "Advertisement URL is required";
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      advertisementUrl: "",
      image: "",
    },
    validate,
    onSubmit: (values) => {
      setIsSubmitting(true);
      values.image = imageUrl;
      axiosJWT
        .post(ADMIN_API + "/banners/add", values)
        .then(({ data }) => {
          handleAddedBanner(data.newBanner);
          setModalOpen(false);
        })
        .catch(() => showToast("Oops! Something went wrong", "error"))
        .finally(() => setIsSubmitting(false));
    },
  });

  return (
    <>
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-2">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Add Banner</h3>
          <button
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto flex justify-center items-center"
            onClick={() => setModalOpen(false)}
          >
            <IoClose className="w-6 h-6" />
          </button>
        </div>
        <div className="p-4 md:p-5">
          <form className="grid grid-cols-2 gap-4 mb-4" onSubmit={formik.handleSubmit}>
            <div className="col-span-2">
              <label
                htmlFor="title"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Title
              </label>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-none block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                {...formik.getFieldProps("title")}
              />
              {formik.errors.title && (
                <p className="col-span-2 mt-1 text-red-500">{formik.errors.title}</p>
              )}
            </div>
            <div className="col-span-2">
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Description
              </label>
              <textarea
                rows={1}
                className="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                {...formik.getFieldProps("description")}
              />
              {formik.errors.description && (
                <p className="col-span-2 mt-1 text-red-500">{formik.errors.description}</p>
              )}
            </div>
            <div className="col-span-2">
              <label
                htmlFor="advertisementUrl"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Advertisement URL
              </label>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-none block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                {...formik.getFieldProps("advertisementUrl")}
              />
              {formik.errors.advertisementUrl && (
                <p className="col-span-2 mt-1 text-red-500">{formik.errors.advertisementUrl}</p>
              )}
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <p className="font-medium">Upload images</p>
              <CloudinaryUploadWidget
                uwConfig={IMAGEUPLOADCONFIG}
                setImageUrl={setImageUrl}
              />
              {imageUrl && (
                <img src={imageUrl} alt="image preview" width={100} height={100} />
              )}
            </div>
            <div className="col-span-2">
              <button
                type="submit"
                className="text-white w-full disabled:cursor-wait bg-green-500 hover:bg-green-600 focus:ring-green-400 focus:ring-2 focus:outline-none font-medium rounded-lg text-sm px-5 py-2 text-center"
                disabled={isSubmitting}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};

// Main Banners Component
const Banners = () => {
  const [banners, setBanners] = useState<BannerInterface[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    axiosJWT
      .get(ADMIN_API + "/banners")
      .then(({ data }) => setBanners(data.banners))
      .catch(() => showToast("Oops! Something went wrong", "error"));
  }, []);

  const handleDeleteImg = (id: string) => {
    axiosJWT
      .delete(ADMIN_API + `/banners/remove/${id}`)
      .then(({ data }) => {
        showToast(data.message);
        setBanners(banners.filter((b) => b._id !== id));
      })
      .catch((err) => console.log(err));
  };

  const addNewBanner = (newBanner: BannerInterface) => {
    setBanners((prev) => [...prev, newBanner]);
  };

  return (
    <>
  
      <div className="flex justify-between items-center my-2">
        <div className="justify-center flex items-center">
        <h1 className="mb-2 text-xl font-semibold mt-2  text-center">Banners</h1>
        </div>
        <Button
          label="Add"
          className="bg-green-800 hover:bg-green-700"
          handleButtonclick={() => setShowModal(true)}
        />
      </div>
      {banners.length ? (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg custom-vh">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">SL:no</th>
                <th scope="col" className="px-6 py-3">Image</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {banners.map((banner, index) => (
                <BannerData
                  {...banner}
                  key={banner._id}
                  index={index + 1}
                  handleDeleteImg={handleDeleteImg}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <h1 className="flex justify-center items-center text-xl font-bold">No banners</h1>
      )}
      {showModal && <BannerModal setModalOpen={setShowModal} handleAddedBanner={addNewBanner} />}
    </>
  );
};

export default Banners;
