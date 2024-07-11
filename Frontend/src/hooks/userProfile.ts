import { useEffect, useState, ChangeEvent } from "react";
import axiosJWT from "../utils/axiosService";
import showToast from "../utils/toaster";
import { UserInterface } from "../types/UserInterface";
import { USER_API, nameRegex, phoneRegex } from "../constants";
import {uploadImagesToCloudinary} from "../Api/uploadImages";


const useProfile = () => {
  const [profile, setProfile] = useState<UserInterface | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    gender: string;
    age: number | null;
    phoneNumber: string;
    address: string;
    dateofbirth: string;
    marital_status: string;
    bloodGroup: string;
    height: number | null;
    weight: number | null;
    allergies: string;
    chronicConditions: string;
    
      emergencyContactName: string;
      emergencyContactRelationship: string;
      emergencyContactPhoneNumber: string;
    
    imageFile: File | null;
  }>({
    name: "",
    gender: "",
    age: null,
    phoneNumber: "",
    address: "",
    dateofbirth: "",
    marital_status: "single",
    bloodGroup: "",
    height: null,
    weight: null,
    allergies: "",
    chronicConditions: "",
      emergencyContactName: "",
      emergencyContactRelationship: "",
      emergencyContactPhoneNumber: "",
    imageFile: null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    
    axiosJWT
      .get(USER_API + "/profile")
      .then(({ data }) => {
        const { user } = data;
        setProfile(user);
        setFormData((prev) => ({
          ...prev,
          name: user?.name || "",
          gender: user?.gender || "",
          age: user?.age || null,
          phoneNumber: user?.phoneNumber || "",
          address: user?.address || "",
          dateofbirth: user?.dateofbirth ? new Date(user.dateofbirth).toISOString().split('T')[0] : "",
          marital_status: user?.marital_status || "single",
          bloodGroup: user?.bloodGroup || "",
          height: user?.height || null,
          weight: user?.weight || null,
          allergies: user?.allergies?.join(", ") || "",
          chronicConditions: user?.chronicConditions?.join(", ") || "",
          emergencyContactName: user?.emergencyContactName || "",
          emergencyContactRelationship: user?.emergencyContactRelationship || "",
          emergencyContactPhoneNumber: user?.emergencyContactPhoneNumber || "",
          
        }));
      })
      .catch(() => showToast("Oops! Something went wrong", "error"));
  }, []);


  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let errorMessage = "";

    if (name === "imageFile") { // Handle image file separately
      const fileInput = e.target as HTMLInputElement;
      const file = fileInput.files && fileInput.files[0]; // Type assertion here
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        setFormData((prev) => ({
          ...prev,
          imageFile: file,
        }));
      }
    } else {
      if (name === "name") {
        if (!value.trim()) {
          errorMessage = "Name is required";
        } else if (!nameRegex.test(value)) {
          errorMessage =
            "First letter must be capital and no leading or trailing space";
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
      } else if (name === "dateofbirth") {
        const today = new Date();
        const dob = new Date(value);
        const age = today.getFullYear() - dob.getFullYear();
        if (dob > today) {
          errorMessage = "Date of birth cannot be in the future";
        } else if (age !== formData.age) {
          errorMessage = "Date of birth and age do not match";
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
    const url = await uploadImagesToCloudinary(formData.imageFile); 


    axiosJWT
      .patch(USER_API + "/profile/edit", {
        name: formData.name,
        gender: formData.gender,
        age: formData.age,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
          dateofbirth: formData.dateofbirth,
          marital_status: formData.marital_status,
          bloodGroup: formData.bloodGroup,
          height: formData.height,
          weight: formData.weight,
          allergies: formData.allergies.split(", ").map(a => a.trim()),
          chronicConditions: formData.chronicConditions.split(", ").map(c => c.trim()),
         
          emergencyContactName: formData.emergencyContactName,
          emergencyContactRelationship: formData.emergencyContactRelationship,
          emergencyContactPhoneNumber: formData.emergencyContactPhoneNumber,
          
        profilePicture: url || profile?.profilePicture,
      })
      .then(({ data }) => {
        showToast(data.message);
        setIsSubmitting(false);
      })
      .catch(() => {
        setIsSubmitting(false);
        showToast(
          "Oops! Something went wrong while updating profile",
          "error"
        );
      });
  }
};


  return {
    profile,
    formData,
    imagePreview,
    error,
    isSubmitting,
    handleInputChange,
    handleSubmit,
  };
};

export default useProfile;
