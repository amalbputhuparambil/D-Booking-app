  // src/hooks/doctorProfile.ts
  import { useEffect, useState, ChangeEvent } from "react";
  import axiosJWT from "../utils/axiosService";
  import showToast from "../utils/toaster";
  import { DoctorInterface } from "../types/doctoInterface";
  import { DOCTOR_API, nameRegex, phoneRegex } from "../constants";
  import { uploadImagesToCloudinary, uploadCertificateToCloudinary } from "../Api/uploadImages";
  // import axios from "axios";
  import { useNavigate } from 'react-router-dom';


  const useDoctorProfile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<DoctorInterface | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isVerified, setIsVerified] = useState<boolean>(false);
    const [departments, setDepartments] = useState<string[]>([]);
    const [formData, setFormData] = useState<{
      doctorName: string;
      gender: string;
      email: string;
      age: number | null;
      phoneNumber: string;
      department: any;
      education: string;
      consultationType:string,
      status: string;
      description: string;
      imageFile: File | null;
      lisenceCertificate: File | null;
    }>({
      doctorName: "",
      gender: "",
      email: "",
      age: null,
      department: "",
      description: "",
      phoneNumber: "",
      education: "",
      consultationType:"",
      status: "pending",
      imageFile: null,
      lisenceCertificate: null,
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [certificatePreview, setCertificatePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
      const fetchProfile = async () => {
        try {
          const { data } = await axiosJWT.get(DOCTOR_API + "/profile");
          const { doctor } = data;
          console.log(doctor,"qwertyuioasdfghjklzxcvbnmwertyuiosdfghjklzxcvbnm,qwertyuioasdfghjklzxcvbnm,qwertyuiosdfghjkzxcvbn")
          setFormData((prev) => ({
            ...prev,
            doctorName: doctor?.doctorName,
            age: doctor?.age,
            gender: doctor?.gender,
            department: doctor?.department?._id,
            description: doctor?.description,
            education: doctor?.education,
            consultationType:doctor?.consultationType,
            email: doctor?.email,
            phoneNumber: doctor?.phoneNumber,
            lisenceCertificate: doctor?.lisenceCertificate,
            status: doctor?.status
          }));
          setImagePreview(doctor?.profileImage || "");
          setCertificatePreview(doctor?.lisenceCertificate || "");
        } catch (error) {
          console.error("Error fetching profile data:", error);
          showToast("Oops! Something went wrong", "error");
        }
      };

      const fetchDepartments = async () => {
        try {
          const { data } = await axiosJWT.get(DOCTOR_API + "/department/list");
          console.log("Fetched departments:", data.departments);
    
          setDepartments(data.departments);
        } catch (error) {
          console.error("Error fetching departments:", error);
          showToast("Oops! Something went wrong while fetching departments", "error");
        }
      };

      fetchProfile();
      fetchDepartments();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
      const { name, value } = e.target;
      let errorMessage = "";

      if (name === "imageFile" || name === "lisenceCertificate") {
        const fileInput = e.target as HTMLInputElement;
        const file = fileInput.files && fileInput.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (name === "imageFile") setImagePreview(reader.result as string);
            else setCertificatePreview(reader.result as string);
          };
          reader.readAsDataURL(file);
          setFormData((prev) => ({
            ...prev,
            [name]: file,
          }));
        }
      } else {
        if (name === "doctorName") {
          if (!value.trim()) {
            errorMessage = "Name is required";
          } else if (!nameRegex.test(value)) {
            errorMessage = "First letter must be capital and no leading or trailing space";
          }
        } else if (name === "age") {
          const ageValue = parseInt(value, 10);
          if (isNaN(ageValue) || ageValue < 0) {
            errorMessage = "Age must be a positive number";
          }
        } else if (name === "phoneNumber") {
          if (!value.trim()) {
            errorMessage = "Phone number is required";
          } else if (!phoneRegex.test(value)) {
            errorMessage = "Phone number must have 10 numbers";
          }
        }
        setFormData((prev) => ({
          ...prev,
          [name]: name === "age" ? parseInt(value, 10) : value,
        }));
      }

      setError(errorMessage);
    };

    const handleSubmit = async () => {
      if (!error) {
        setIsSubmitting(true);
        try {
          const imageUrl = await uploadImagesToCloudinary(formData.imageFile);
          const certificateUrl = await uploadCertificateToCloudinary(formData.lisenceCertificate);

          const response = await axiosJWT.patch(DOCTOR_API + "/profile/edit", {
            doctorName: formData.doctorName,
            gender: formData.gender,
            age: formData.age,
            phoneNumber: formData.phoneNumber,
            department: formData.department,
            education: formData.education,
            consultationType:formData.consultationType,
            description: formData.description,
            profileImage: imageUrl || profile?.profileImage,
            lisenceCertificate: certificateUrl || profile?.lisenceCertificate,
          });

          showToast(response.data.message);

          setIsSubmitting(false);
          navigate('/doctor');
        } catch (error) {
          setIsSubmitting(false);
          console.error("Error updating profile:", error);
          showToast("Oops! Something went wrong while updating profile", "error");
        }
      }
    };

    const handleVerify = () => {
      setIsVerified(true);
    };

    return {
      
      profile,
      formData,
      imagePreview,
      certificatePreview,
      error,
      isSubmitting,
      departments,
      handleInputChange,
      handleSubmit,
      handleVerify,
    };
  };

  export default useDoctorProfile;
