export interface DoctorInterface {
    status: string;
    id: any;
    _id:string,
    doctorName:string;
    email:string;
    phone:string;
    department:string;
    description?:string;
    profileImage?:string;
    lisenceCertificate?:string,
    education?:string;
    role:string;
    isVerified?: boolean;
    isApproved?: boolean;
    isBlocked?: boolean;
    cerificateImage?:string;


}