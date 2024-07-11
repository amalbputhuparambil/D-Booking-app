// import React from "react";
// import Success from "../../components/user/SuccessPage";
// import Footer from "../../components/user/Footer/Footer";
// import Navbar from "../../components/user/Navbar/navbar";


// function SuccessPage() {
//   return (
//     <div>
//         <Navbar />
//       <Success />
//       <Footer />
      
//     </div>
//   );
// }

// export default SuccessPage;

import { useParams, useSearchParams } from "react-router-dom";
import Navbar from "../../components/user/Navbar/navbar";
import PaymentMessage from "../../components/user/payment";
import axiosJWT from "../../utils/axiosService";
import { USER_API } from "../../constants";
import Footer from "../../components/user/Footer/Footer";

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const { id } = useParams();

  const status = searchParams.get("success");
  const isSuccess = status === "true" ? true : false;

  if (status) {
    const paymentStatus = isSuccess ? "Paid" : "Failed";
    axiosJWT
      .patch(USER_API + `/payment/status/${id}`, { paymentStatus })
      .then(({ data }) => console.log(data))
      .catch((err: any) => console.log(err));
  }

  return (
    <>
      <Navbar />
      <PaymentMessage isSuccess={isSuccess} />
      <Footer />
    </>
  );
};

export default SuccessPage;