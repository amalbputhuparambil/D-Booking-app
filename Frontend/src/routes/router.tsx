import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute, { AdminProtectedRoute, DoctorProtectedRoute } from "./ProtectedRoute";
import { DoctorPublicRoute, PublicRoute } from "./PublicRoue";


const Register = lazy (()=>import('../pages/user/Register'))
const Login = lazy (()=>import('../pages/user/Login'))
const VerifyOtp = lazy(()=>import("../pages/user/VerifyOTP"));
const Home = lazy(() => import("../pages/Home"));
const ForgotPassword = lazy(()=>import('../pages/user/ForgotPassword'))
const ResetPassword = lazy(()=>import('../pages/user/ResetPassword'))
const DoctorList = lazy(()=>import("../pages/user/DoctorPage"));
const ProfileUser = lazy(()=>import("../pages/user/Profile"));
const AboutPage = lazy (()=> import('../pages/user/AboutPage'))
const ContactPage = lazy (()=> import('../pages/user/ContactPage'))
const DoctorDetailsUser = lazy(()=>import("../pages/user/singleDoctorDetails"));
const AppoinmentBookingPage = lazy(()=>import("../pages/user/Appointment"));
const CheckoutPage = lazy(()=>import('../pages/user/CheckOutPage'))
const SuccessPage = lazy(()=>import('../pages/user/SuccessPage'));
const AppoinmentDetails = lazy(()=>import("../pages/user/AppointmentDetails"));
const AppoinmentListPage = lazy(()=>import("../pages/user/getAppoinmentsAll"));
const WalletPage = lazy(()=>import("../pages/user/wallet"));
const Transaction = lazy(()=>import("../pages/user/walletTransation"));
const Chat = lazy(()=>import("../pages/user/Chat"));




// const AppointmentDetailsPage = lazy(() => import('../pages/user/'));


const DoctorhomePage = lazy(()=>import("../pages/doctor/doctorDashbord"))
const DoctorSignup = lazy(()=>import("../pages/doctor/doctorSignup"))
const DoctorLogin = lazy(()=>import("../pages/doctor/doctorLogin"))  
const EmailVerificationPage = lazy(() => import("../pages/doctor/emailVerification")); 
const ProfileDoctor = lazy(()=>import("../pages/doctor/Profile"));
const DoctorSlotPage = lazy(()=>import("../pages/doctor/slotPage"));
const DoctorChat=lazy(()=>import("../pages/doctor/Chat"));


const AdminLogin = lazy(()=> import('../pages/admin/AdminLogin'));
const AdminDashboard = lazy(()=>import ("../pages/admin/AdminDashboard"));
const AdminUserList = lazy(()=>import ("../pages/admin/UserList"));
const AdminDoctorList = lazy(()=>import ("../pages/admin/DoctorList"));
const RequestedDoctors = lazy(()=>import("../pages/admin/ReqDoctorList"))
const AdminDoctorDetails = lazy(()=>import ("../pages/admin/doctorDetails"));
const AdminDepartmentList = lazy(()=>import ("../pages/admin/DepartmentList"));
const AddDepartmentList = lazy(()=>import ("../pages/admin/AddDepartmentPage"));
const PatientListPage = lazy(()=>import("../pages/doctor/patientListPages"));
const SinglePagePatient =lazy(()=>import("../pages/doctor/singlePagePatient"));
const Advertisement = lazy(() => import("../pages/admin/AdminBanner"))





export const MainRouter = () => {
    return (
        <>
        <Suspense fallback ={<h1>Loading</h1>}>
            <Routes>
            {/* public routes for user */}
            <Route path="/" element={<Home />} />
            <Route path="/user/aboutus" element={<AboutPage />} />
            <Route path="/user/contact" element={<ContactPage />} />
            {/* <Route path="/user/doctor" element={<DoctorList />} /> */}

            <Route path="" element={<PublicRoute />}>
                <Route path="/user/register" element={<Register />} />
                <Route path ="/user/verify_otp" element={<VerifyOtp/>}/>
                <Route path="/user/login" element={<Login/>}/>
                <Route path ='/user/forgot_password' element ={<ForgotPassword/>}/>
                <Route path ='/user/reset_password/:id' element ={<ResetPassword/>}/>
            </Route>

            {/* private routes for user */}
            <Route path="/" element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/user/doctor" element={<DoctorList />} />
            <Route path="/user/Profile" element={<ProfileUser />} />
            <Route path="/user/doctor/:id" element={<DoctorDetailsUser />} />
            <Route path="/user/appoinment/:id" element={<AppoinmentBookingPage />} />       
            <Route path="/user/checkout/:id" element={<CheckoutPage />} />
            <Route path='/payment_status/:id' element={<SuccessPage/>}/>
            <Route path="/appoinmentDetails/:id" element={<AppoinmentDetails/>} />
            <Route path ="/user/appoinmentlist" element={<AppoinmentListPage/>}/>
            <Route path="/user/wallet" element={<WalletPage/>}/>
            <Route path="/user/walletHistory" element={<Transaction/>}/>
            <Route path="/user/chat" element={<Chat />} />
            </Route>


            {/******************* Doctor routes *****************/}
            <Route path="/doctor" element={<DoctorhomePage/>}/>
             {/*Doctor Routes - public*/ }
            <Route path="" element={<DoctorPublicRoute />}>
            <Route path="/doctor" element={<DoctorhomePage/>}/>
            <Route path="/doctor/register" element={<DoctorSignup/>}/>
            <Route path="/doctor/verify-token/:token" element ={<EmailVerificationPage/>}/>
            <Route path="/doctor/login" element={<DoctorLogin/>}/>
            </Route>
            {/*Doctor Routes - private*/ }
            <Route path="" element={<DoctorProtectedRoute />}>
            <Route path="/doctor" element={<DoctorhomePage/>}/>
            <Route path="/doctor/profile" element ={<ProfileDoctor/>}/>
            <Route path="/doctor/slot" element ={<DoctorSlotPage/>}/>
            <Route path="/doctor/patientList" element={<PatientListPage/>}/>
            <Route path="/patient_details/:id" element={<SinglePagePatient/>} />
            <Route path="/doctor/chat" element={<DoctorChat/>}/>
            </Route>



            {/******************* Admin routes *****************/}
            <Route path="" element={<PublicRoute />}>
            <Route path="/admin/login" element={<AdminLogin />} />
            </Route>
             {/* admin protected Route  */}
            <Route path="" element={<AdminProtectedRoute />}>
            <Route path="/admin" element={<AdminDashboard/>}/>
            <Route path="/admin/users" element={<AdminUserList/>}/>
            <Route path="/admin/doctors" element={<AdminDoctorList/>}/>
            <Route path="/admin/doctors/:id" element={<AdminDoctorDetails/>}/>
            <Route path="/admin/requesteddoctors" element={<RequestedDoctors/>}/>
            <Route path="/admin/department" element ={<AdminDepartmentList/>}/>
            <Route path="/admin/addDepartment" element ={<AddDepartmentList/>}/>
            <Route path="/admin/banners" element ={<Advertisement/>}/>

        
            </Route>
           
            </Routes>   
        </Suspense>
        </>
    )
}