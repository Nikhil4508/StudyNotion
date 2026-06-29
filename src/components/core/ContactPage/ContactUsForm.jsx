import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { apiConnector } from "../../../services/apiconnector";
import { contactusEndpoint } from "../../../services/apis";
import CountryCode from "../../../data/CountryCode";

const ContactUsForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm()

  const handleSubmitForm = async (data) => {
    console.log("Logging Data", data)
    try {
      const response = await apiConnector(
        "POST",
        contactusEndpoint.CONTACT_US_API,
        {
          ...data,
          name: `${data.firstName} ${data.lastName}`,
        },
      )
      console.log("Logging response", response)
    } catch (error) {
      console.log("Error: ", error.message)
    }
  }

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        email: "",
        firstName: "",
        lastName: "",
        message: "",
        phoneNo: "",
      });
    }
  }, [reset, isSubmitSuccessful]);

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)}>
      <div className="flex flex-col  gap-2">
        <div className="lg:flex flex-cols gap-4">
          {/* first name */}
          <div className="flex flex-col gap-1">
            <label htmlFor="firstname">First Name</label>
            <input
              className="bg-richblack-700 px-4 py-2 rounded-md"
              type="text"
              name="firstname"
              id="firstname"
              placeholder="Enter your first name"
              {...register("firstName", { required: true })}
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
            />
            {errors.firstname && (
              <span className="">Please enter your name</span>
            )}
          </div>
          {/* last name */}
          <div className="flex flex-col gap-1">
            <label htmlFor="lastname">Last Name</label>
            <input
              className="bg-richblack-700 px-4 py-2 rounded-md"
              type="text"
              name="lastname"
              id="lastname"
              placeholder="Enter your last name"
              {...register("lastName")}
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
            />
          </div>
        </div>
        {/* email */}
        <div className="flex flex-col gap-1">
          <label htmlFor="email">Email Address</label>
          <input
            className="bg-richblack-700 px-4 py-2 rounded-md"
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email address"
            {...register("email", { required: true })}
            style={{
              boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
            }}
          />
          {errors.firstname && (
            <span className="">Please enter your email address</span>
          )}
        </div>
        {/* phone number */}
        <div className="lg:flex flex-col gap-1">
          <label htmlFor="phonenumber">Phone Number</label>
          <div className="lg:flex flex-cols gap-4">
            {/* dropdown */}
            <div className="flex gap-5 ">
              <select
                name="dropdown"
                id="dropdown"
                className="bg-richblack-700 px-4 py-2 rounded-md mb-2 lg:mb-0"
                {...register("countrycode", { required: true })}
                style={{
                  boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                }}
              >
                {CountryCode.map((element, idx) => {
                  return (
                    <option
                      value={element.code}
                      key={idx}
                    >
                      {element.code} - {element.country}
                    </option>
                  );
                })}
              </select>
            </div>
            <input
              type="number"
              name="phonenumber"
              id="phonenumber"
              placeholder="12345 67890"
              className="bg-richblack-700 px-4 py-2 rounded-md w-full"
              {...register("phoneNo", {
                required: { value: true, message: "Please enter phone number" },
                maxLength: { value: 10, message: "Invalid phone number" },
                minLength: { value: 8, message: "Invalid phone number" },
              })}
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
            />
          </div>
        {
          errors.phoneNo && (
            <span className="">
              {errors.phoneNo.message}
            </span>
          )
        }
        </div>
        {/* message */}
        <div className="flex flex-col gap-1">
          <label htmlFor="message">Message</label>
          <textarea
            className="bg-richblack-700 px-4 py-2 rounded-md"
            name="message"
            id="message"
            cols={30}
            rows={7}
            placeholder="Enter your message here"
            {...register("message", { required: true })}
            style={{
              boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
            }}
          />
          {errors.message && (
            <span className="">Please enter your message.</span>
          )}
        </div>
        <button
          type="submit"
          className="bg-yellow-100 text-black shadow-none text-center text-lg px-4 py-2 rounded-md font-semibold "
        >
          Send Message
        </button>
      </div>
    </form>
  );
};
export default ContactUsForm;
