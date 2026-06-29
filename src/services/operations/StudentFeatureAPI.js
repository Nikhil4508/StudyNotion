import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { studentEndpoints } from "../apis";
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";



const {COURSE_PAYMENT_API,COURSE_VERIFY_API,SEND_PAYMENT_SUCCESS_EMAIL_API} = studentEndpoints;

function loadScript(src) {

  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;

    script.onload = () => {
      resolve(true);
    }

    script.onerror = () => {
      resolve(false);
    }

    document.body.appendChild(script);

  })
}


export async function buyCourse(token,courses,userDetails,navigate,dispatch) {
  const toastId = toast.loading("Loading...");

  try {
    // load script  
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if(!res) {
      toast.error("Razorpay SDK failed to load.");
      return;
    }

    // initiate the order
    const orderResponse = await apiConnector("POST",COURSE_PAYMENT_API,
      {courses},
      {
        Authorization:`Bearer ${token}`,

      });

    if(!orderResponse.data.success){
      // If already enrolled, show specific message
      if(orderResponse.data.message === "Student is Already Enrolled.") {
        toast.dismiss(toastId);
        toast.success("You are already enrolled in this course!");
        navigate("/dashboard/enrolled-courses");
        return;
      }
      throw new Error(orderResponse.data.message);
    }
    
    // options
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      currency:orderResponse.data.data.currency,
      amount:`${orderResponse.data.data.amount}`, 
      order_id:orderResponse.data.data.id,
      name:"StudyNotion",
      description:"Thank You for Purchasing the Course", 
      prefill:{
        name:`${userDetails.firstName}`,
        email:userDetails.email,
      },
      handler: function(response){
        // send successful wala mail
        sendPaymentSuccessEmail(response, orderResponse.data.data.amount,token);

        // verifyPayment
        VerifyPayment({...response,courses},token,navigate,dispatch);

      },
    }

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    paymentObject.on("payment.failed", function(response){
      toast.error("Oops, payment failed");
      console.log(response.error);
    });

  } catch (error) {
    console.log("PAYMENT API ERROR...",error);
    toast.error(error.message || "Could not make Payment");
  }
  toast.dismiss(toastId);
}

async function sendPaymentSuccessEmail(response,amount,token) {
  try {
    await apiConnector("POST",SEND_PAYMENT_SUCCESS_EMAIL_API,{
      orderId:response.razorpay_order_id,
      paymentId:response.razorpay_payment_id,
      amount,
    },{
      Authorization:`Bearer ${token}`
    })
  } catch (error) {
    console.log("PAYMENT SUCCESS EMAIL ERROR....",error);
  }
}

// verify payment
async function VerifyPayment(bodyData,token,navigate,dispatch) {
  const toastId = toast.loading("Verifying Payment...");
  dispatch(setPaymentLoading(true));

  try {
    const response = await apiConnector("POST",COURSE_VERIFY_API,bodyData,{
      Authorization:`Bearer ${token}`,
    })
    
    if(!response.data.success){
      throw new Error(response.data.message);
    }
    toast.success("Payment Successful, you are added to the Course.");
    navigate("/dashboard/enrolled-courses");
    dispatch(resetCart());

  } catch (error) {
    console.log("PAYMENT VERIFY ERROR...",error);
    toast.error("Could not verify Payment")
  }
  toast.dismiss(toastId);
  dispatch(setPaymentLoading(false));
}