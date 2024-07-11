//src/utils/axios
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { TOKEN_API } from "../constants";
import { Payload } from "../types/propsType";
import logout, { doctorlogout } from "./logout";
import { getItemFromLocalStorage } from "./setnget";

const axiosJWT = axios.create();

const getNewAccessToken = async () => {
  try {
    let refresh_token = getItemFromLocalStorage("refresh_token") as string
    const { data } = await axios.post(TOKEN_API + "/refresh_token", {
      refresh_token,
    });
    // console.log(data,'.............................data new accesstoken')
    // store.dispatch(
    //   setTokens({
    //     access_token: data.access_token,
    //     refresh_token,
    //   })
    // );
    // access_token = data.access_token;
    return data?.access_token;
  } catch (err) {
    logout("Session expired ,please Login");
  }
};

const getAccessToken = async () => {
  try {
    let access_token = getItemFromLocalStorage("access_token") as string

     if (!access_token) {
        console.warn("Access token is missing, requesting new access token");
        const newAccessToken = await getNewAccessToken();
        if (!newAccessToken) throw new Error("Failed to obtain new access token");
        access_token = newAccessToken;
      }


    const { data } = await axios.get(TOKEN_API + `/accessToken?access_token=${access_token}`);
    
    let token = access_token;
    let user = data?.user || data?.doctor;
    // let doctor = data?.doctor


    const decodedToken: Payload = await jwtDecode(token);
    const { role } = decodedToken;
    if (role === "doctor" || role === "user") {
      if (user.isBlocked)
        logout("Your account has been blocked by administrator", "error");
      else if (user?.doctor?.isBlocked)
        doctorlogout("Your account has been blocked by administrator", "error");
    }  
    return token;
  } catch (error) {
    console.log(error, "Error in getting token");
  }
};

axiosJWT.interceptors.request.use(async (config) => {
    let currentDate = new Date();
    let decodedToken;
    let accessToken;
    try {
  
      accessToken = await getAccessToken() as string
     
      // accessToken = access_token
      decodedToken = await jwtDecode(accessToken);
      console.log(decodedToken,"decodedToken")
    } catch (error) {
      console.log("error in decodeToken" + error);
    }
  
    if (decodedToken.exp * 1000 < currentDate.getTime()) {
      for(let i=0;i<100;i++){
      console.log(decodedToken.exp+"  : "+"decoaded token ")
      }
      accessToken = await getNewAccessToken();
      decodedToken = jwtDecode<Payload>(accessToken); 
    }
    config.headers["Authorization"] = "Bearer " + accessToken;
  
    return config;
  });

export default axiosJWT;
