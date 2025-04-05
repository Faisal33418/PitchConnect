import React, { useState, useEffect } from "react";
import {
  Grid,
  makeStyles,
  Card,
  CardContent,
  MenuItem,
  InputLabel,
  Select,
  CardActions,
  CardHeader,
  FormControl,
} from "@material-ui/core";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { TextField } from "formik-material-ui";
import CloseIcon from "@mui/icons-material/Close";
import APIs from "@/utils/api-handler";
import {
  Button,
  Checkbox,
  IconButton,
  Input,
  ListItemText,
  Modal,
} from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import { AddCircleOutline, AddOutlined } from "@mui/icons-material";

const UserForm = ({
  title,
  isOpen,
  closeHandler,
  activeUser,
  fields,
  data = null,
  updateId = null,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(isOpen);
  const [initialValues, setInitialValues] = useState({});
  const [options, setOptions] = useState([]);
  const [startUp, setStartUp] = useState([]);
  const [investType, setInvestType] = useState([]);
  const [industries, setIndustries] = useState();
  const [entrepreneurs, setEntrepreneurs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [entre, setEntre] = useState(null);
  const [comp, setComp] = useState(null);
  const [user, setUser] = useState([]);
  const [role, setRole] = useState(false);
  const [phone, setPhone] = React.useState(false);
  const [hideEntre, setHideEntre] = React.useState(false);

  const useStyles = makeStyles((theme) => ({
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    card: {
      position: "relative",
      width: "600px",
      maxWidth: "90%",
      outline: "none",
      ...(activeUser?.role === "Investor" && {
        height: "90vh",
        overflowY: "scroll",
      }),
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
    },
    button: {
      margin: theme.spacing(1),
    },
  }));
  const classes = useStyles();

  // const generateValidationSchema = (schemaFields) => {
  //   const schema = {};
  //   schemaFields.forEach((field) => {
  //     switch (field.name) {
  //       case "fullName":
  //         schema[field.name] = Yup.string()
  //           .matches(
  //             /^[a-zA-Z\s]+$/,
  //             `${field.label} must not contain any numbers`
  //           )
  //           .required(`${field.label} is required`);
  //         break;
  //       case "phoneNumber":
  //         schema[field.name] = Yup.string()
  //           .matches(
  //             /^\+?[0-9]+$/,
  //             `${field.label} must be a valid number and may start with a '+'`
  //           )
  //           .required(`${field.label} is required`);
  //         break;
  //       default:
  //         schema[field.name] = Yup.string()
  //           .matches(
  //             /^[a-zA-Z ]*$/,
  //             `${field.label} must not contain any special characters`
  //           )
  //           .required(`${field.label} is required`);
  //     }
  //   });
  //   return Yup.object().shape(schema);
  // };

  // Generate dynamic Yup validation schemaddd
  // const generateValidationSchema = (schemaFields) => {
  //     const schema = {};
  //     schemaFields.forEach((field) => {
  //         switch (field.name) {
  //             case 'fullName':
  //             case 'companyName':
  //             case 'location':
  //             case 'industry':
  //                 schema[field.name] = Yup.string()
  //                     .required(`${field.label} is required`);
  //                 break;

  //             // case 'email':
  //             //     schema[field.name] = Yup.string()
  //             //         .email('Invalid email')
  //             //         .required(`${field.label} is required`);
  //             //     break;

  //             case 'phoneNumber':
  //                 schema[field.name] = Yup.string()
  //                     .matches(/^[0-9]+$/, 'Phone number must be numeric')
  //                     .min(10, 'Phone number must be at least 10 digits')
  //                     .max(15, 'Phone number cannot exceed 15 digits')
  //                     .required(`${field.label} is required`);
  //                 break;

  //             case 'profilePicture':
  //                 schema[field.name] = Yup.mixed()
  //                     .required(`${field.label} is required`)
  //                     .test(
  //                         'fileSize',
  //                         'File size too large (max 5MB)',
  //                         (value) => !value || (value.size <= 5 * 1024 * 1024)
  //                     )
  //                     .test(
  //                         'fileFormat',
  //                         'Unsupported format (JPEG, PNG only)',
  //                         (value) => !value || ['image/jpeg', 'image/png'].includes(value.type)
  //                     );
  //                 break;

  //             case 'status':
  //                 schema[field.name] = Yup.string()
  //                     .oneOf(['active', 'inactive'], 'Status must be either active or inactive')
  //                     .required(`${field.label} is required`);
  //                 break;

  //             case 'industryInterest':
  //             case 'skills':
  //             case 'Bios':
  //             case 'investmentGoals':
  //             case 'investmentHistory':
  //                 schema[field.name] = Yup.string()
  //                     .required(`${field.label} is required`)
  //                 break;

  //             case 'startupStagePreference':
  //             case 'geographicalPreference':
  //             case 'typeOfInvestment':
  //                 schema[field.name] = Yup.string().required(`${field.label} is required`);
  //                 break;

  //             case 'investmentAmountRange':
  //                 schema[field.name] = Yup.string()
  //                     .required(`${field.label} is required`);
  //                 break;
  //             default:
  //                 schema[field.name] = Yup.string().required(`${field.label} is required`);
  //         }
  //     });

  //     return Yup.object().shape(schema);
  // };

  // const validationSchema = activeUser?.role && generateValidationSchema(fields);

  const handleDocuments = (e, setFieldValue) => {
    const files = Array.from(e.target.files); // Convert FileList to Array
    if (files.length > 0) {
      setFieldValue("documents", files); // Store array of files in Formik's state
    }
  };
  const handleFileChange = (e, setFieldValue) => {
    const file = e.target.files[0]; // Get the selected file
    if (!file.type.startsWith("image")) {
      toast.error("File should be an image");
      console.log("error");
    } else {
      if (file) {
        setFieldValue("profilePicture", file); // Store it in Formik's state
      }
    }
  };

  const handleBannerChange = (e, setFieldValue) => {
    const file = e.target.files[0]; // Get the selected file

    console.log(file);

    if (file) {
      setFieldValue("logoBanner", file); // Store it in Formik state
    }
  };

  const handleVideoChange = (e, setFieldValue) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      setFieldValue("video", file); // Store it in Formik's state
    }
  };

  const onSubmit = async (values) => {
    try {
      const formData = new FormData();
      let jsonData = null,
        endPoint: any = null,
        id: any = null,
        method: any = null,
        headers = null,
        reqData = null,
        isFormData = true,
        reqApproval = false;
      const action = localStorage.getItem("action");

      if (activeUser?.role === "Admin") {
        if (
          fields[0].name !== "pitchTitle" &&
          fields[0].name !== "logoBanner" &&
          fields[0].name !== "title" &&
          action !== "investor update" &&
          action !== "entrepreneur update"
        ) {
          endPoint = "admin/update";
          id = activeUser?._id;
          method = "PUT";
        } else if (fields[0].name === "pitchTitle") {
          isFormData = false;
          let existUser = localStorage.getItem("user");
          existUser = JSON.parse(existUser);
          let getEntrepreneurs = localStorage.getItem("entrepreneurData");
          getEntrepreneurs = JSON.parse(getEntrepreneurs);

          let existCompany = localStorage.getItem("action");
          updateId = localStorage.getItem("actionId");

          if (existCompany === "company update") {
            endPoint = `company/update/${updateId}`;
            method = "PUT";
          } else if (existCompany === "company register") {
            endPoint = "company/create";
            method = "POST";
          }
          const token = localStorage.getItem("token");
          headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          };
          values.entrepreneurId = getEntrepreneurs?._id;
          values.email = getEntrepreneurs?.email;
          jsonData = values;

          // Call API
          reqData = fields[0].name !== "pitchTitle" ? formData : jsonData;
          const apiResponse = await APIs(
            endPoint,
            id,
            method,
            headers,
            reqData,
            isFormData
          );
          const act = localStorage.getItem("action");

          if (apiResponse?.status === 201 || apiResponse?.status === 200) {
            toast.success(apiResponse?.data?.message);
            if (reqApproval) {
              localStorage.setItem("authID", apiResponse?.data?.data?.authId);
            }

            if (
              fields[0].name !== "pitchTitle" &&
              fields[0].name !== "logoBanner" &&
              fields[0].name !== "title" &&
              act !== "investor update" &&
              act !== "entrepreneur update"
            ) {
              localStorage.setItem(
                "user",
                JSON.stringify(apiResponse?.data?.data)
              );
            } else if (fields[0].name === "pitchTitle") {
              localStorage.setItem(
                "company",
                JSON.stringify(apiResponse?.data?.data)
              );
            } else {
            }
            setTimeout(() => {
              closeHandler();
            }, 2000);
            return;
          }
        } else if (fields[0].name === "logoBanner") {
          isFormData = true;
          updateId = localStorage.getItem("actionId");
          let existUser = localStorage.getItem("user");
          existUser = JSON.parse(existUser);
          let existCompany = localStorage.getItem("action");

          if (existCompany === "video-image update") {
            endPoint = `video-image/update/${updateId}`;
            method = "PUT";
          } else {
          }
          const token = localStorage.getItem("token");
          headers = {
            // 'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          };

          formData.append("logoBanner", values.logoBanner);
          formData.append("video", values.video);

          // Call API
          reqData = fields[0].name !== "pitchTitle" ? formData : jsonData;
          const apiResponse = await APIs(
            endPoint,
            id,
            method,
            headers,
            reqData,
            isFormData
          );
          const act = localStorage.getItem("action");

          if (apiResponse?.status === 201 || apiResponse?.status === 200) {
            toast.success(apiResponse?.data?.message);
            if (reqApproval) {
              localStorage.setItem("authID", apiResponse?.data?.data?.authId);
            }

            if (
              fields[0].name !== "pitchTitle" &&
              fields[0].name !== "logoBanner" &&
              fields[0].name !== "title" &&
              act !== "investor update" &&
              act !== "entrepreneur update"
            ) {
              localStorage.setItem(
                "user",
                JSON.stringify(apiResponse?.data?.data)
              );
            } else if (fields[0].name === "pitchTitle") {
              localStorage.setItem(
                "company",
                JSON.stringify(apiResponse?.data?.data)
              );
            } else {
            }
            setTimeout(() => {
              closeHandler();
            }, 2000);
            return;
          }
        } else if (fields[0].name === "title") {
          isFormData = true;
          updateId = localStorage.getItem("actionId");
          let existUser = localStorage.getItem("user");
          existUser = JSON.parse(existUser);
          let existCompany = localStorage.getItem("action");

          if (existCompany === "document update") {
            endPoint = `documents/update/${updateId}`;
            method = "PUT";
          } else {
          }
          const token = localStorage.getItem("token");
          headers = {
            Authorization: `Bearer ${token}`,
          };

          values?.documents?.forEach((file, index) => {
            formData.append(`documents`, file);
          });
          formData.append("title", values.title);

          // Call API
          reqData = fields[0].name !== "pitchTitle" ? formData : jsonData;
          const apiResponse = await APIs(
            endPoint,
            id,
            method,
            headers,
            reqData,
            isFormData
          );
          const act = localStorage.getItem("action");

          if (apiResponse?.status === 201 || apiResponse?.status === 200) {
            toast.success(apiResponse?.data?.message);
            if (reqApproval) {
              localStorage.setItem("authID", apiResponse?.data?.data?.authId);
            }

            if (
              fields[0].name !== "pitchTitle" &&
              fields[0].name !== "logoBanner" &&
              fields[0].name !== "title" &&
              act !== "investor update" &&
              act !== "entrepreneur update"
            ) {
              localStorage.setItem(
                "user",
                JSON.stringify(apiResponse?.data?.data)
              );
            } else if (fields[0].name === "pitchTitle") {
              localStorage.setItem(
                "company",
                JSON.stringify(apiResponse?.data?.data)
              );
            } else {
            }
            setTimeout(() => {
              closeHandler();
            }, 2000);
            return;
          }
        } else if (
          fields[0].name === "fullName" &&
          action === "investor update"
        ) {
          let investorExist = localStorage.getItem("user");
          investorExist = JSON.parse(investorExist);
          const actionId = localStorage.getItem("actionId");
          endPoint = `investor/update/${actionId}`;
          method = "PUT";
        } else if (
          fields[0].name === "fullName" &&
          action === "entrepreneur update"
        ) {
          let investorExist = localStorage.getItem("user");
          investorExist = JSON.parse(investorExist);
          const actionId = localStorage.getItem("actionId");
          endPoint = `entrepreneur/update/${actionId}`;
          method = "PUT";
        }
        const token = localStorage.getItem("token");
        headers = {
          Authorization: `Bearer ${token}`,
        };

        formData.append("profilePicture", values.profilePicture);
        // Append any other form fields if needed
        Object.keys(values).forEach((key) => {
          if (key !== "profilePicture") {
            formData.append(key, values[key]);
          }
        });
      } else if (activeUser?.role === "Investor") {
        let investorExist = localStorage.getItem("user");
        investorExist = JSON.parse(investorExist);
        if (!investorExist.Bios) {
          endPoint = "investor/create";
          method = "POST";
          reqApproval = true;
        } else {
          endPoint = `investor/update/${investorExist._id}`;
          method = "PUT";
          reqApproval = true;
        }
        const token = localStorage.getItem("token");
        headers = {
          Authorization: `Bearer ${token}`,
        };

        formData.append("profilePicture", values.profilePicture);
        // Append any other form fields if needed
        Object.keys(values).forEach((key) => {
          if (key !== "profilePicture") {
            formData.append(key, values[key]);
          }
        });
      } else if (activeUser?.role === "Entrepreneur") {
        if (
          fields[0].name !== "pitchTitle" &&
          fields[0].name !== "logoBanner" &&
          fields[0].name !== "title"
        ) {
          let entrepreneurExist = localStorage.getItem("user");
          entrepreneurExist = JSON.parse(entrepreneurExist);
          if (!entrepreneurExist.Bios) {
            endPoint = "entrepreneur/create";
            method = "POST";
            reqApproval = true;
          } else {
            endPoint = `entrepreneur/update/${entrepreneurExist._id}`;
            method = "PUT";
            reqApproval = true;
          }
          const token = localStorage.getItem("token");
          headers = {
            Authorization: `Bearer ${token}`,
          };

          formData.append("profilePicture", values.profilePicture);
          // Append any other form fields if needed
          Object.keys(values).forEach((key) => {
            if (key !== "profilePicture") {
              formData.append(key, values[key]);
            }
          });
        } else if (fields[0].name === "pitchTitle") {
          isFormData = false;
          let existUser = localStorage.getItem("user");
          existUser = JSON.parse(existUser);
          let existCompany = localStorage.getItem("action");
          updateId = localStorage.getItem("actionId");

          if (existCompany === "company update") {
            setHideEntre(true);
            endPoint = `company/update/${updateId}`;
            method = "PUT";
          } else if (existCompany === "company register") {
            endPoint = "company/create";
            method = "POST";
          }
          const token = localStorage.getItem("token");
          headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          };
          values.entrepreneurId = existUser?._id;
          values.email = existUser?.email;
          jsonData = values;
        } else if (fields[0].name === "logoBanner") {
          isFormData = true;
          updateId = localStorage.getItem("actionId");
          let existUser = localStorage.getItem("user");
          existUser = JSON.parse(existUser);
          let existCompany = localStorage.getItem("action");
          if (existCompany === "video-image update") {
            setHideEntre(true);
            endPoint = `video-image/update/${updateId}`;
            method = "PUT";
          } else {
          }
          const token = localStorage.getItem("token");
          headers = {
            // 'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          };

          formData.append("logoBanner", values.logoBanner);
          formData.append("video", values.video);
          // formData.append('entrepreneurId', existUser._id);
          formData.append("companyId", comp);
        } else if (fields[0].name === "title") {
          isFormData = true;
          updateId = localStorage.getItem("actionId");
          let existUser = localStorage.getItem("user");
          existUser = JSON.parse(existUser);
          let existCompany = localStorage.getItem("action");
          if (existCompany === "document update") {
            setHideEntre(true);
            endPoint = `documents/update/${updateId}`;
            method = "PUT";
          } else {
          }
          const token = localStorage.getItem("token");
          headers = {
            Authorization: `Bearer ${token}`,
          };

          values?.documents?.forEach((file, index) => {
            formData.append(`documents`, file);
          });
          formData.append("title", values.title);
          // formData.append('documents', values.documents);
          // formData.append('entrepreneurId', existUser._id);
          formData.append("companyId", comp);
        } else {
        }
      }

      // Call API
      reqData = fields[0].name !== "pitchTitle" ? formData : jsonData;
      const apiResponse = await APIs(
        endPoint,
        id,
        method,
        headers,
        reqData,
        isFormData
      );
      const act = localStorage.getItem("action");

      if (apiResponse?.status === 201 || apiResponse?.status === 200) {
        toast.success(apiResponse?.data?.message);
        if (reqApproval) {
          localStorage.setItem("authID", apiResponse?.data?.data?.authId);
        }

        if (
          fields[0].name !== "pitchTitle" &&
          fields[0].name !== "logoBanner" &&
          fields[0].name !== "title" &&
          act !== "investor update" &&
          act !== "entrepreneur update"
        ) {
          localStorage.setItem("user", JSON.stringify(apiResponse?.data?.data));
        } else if (fields[0].name === "pitchTitle") {
          localStorage.setItem(
            "company",
            JSON.stringify(apiResponse?.data?.data)
          );
        } else {
        }
        setTimeout(() => {
          closeHandler();
        }, 2000);
      } else {
        toast.error("Please fill in all required fields correctly");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleRequestApproval = async () => {
    const token = localStorage.getItem("token");
    let user = localStorage.getItem("user");
    user = JSON.parse(user);

    const endPoint = `approval/send`,
      method = "POST",
      headers = {
        Authorization: `Bearer ${token}`,
      },
      reqData = null;
    const id = user?.authId;
    const apiResponse = await APIs(
      endPoint,
      id,
      method,
      headers,
      reqData,
      false
    );
    if (apiResponse?.status === 201) {
      toast.success(apiResponse?.data?.message);
      localStorage.removeItem("authID");
    }
  };

  useEffect(() => {
    const optionHandler = () => {
      if (activeUser?.role === "Admin") {
        setOptions([
          { label: "Pending", value: "pending" },
          { label: "Rejected", value: "rejected" },
          { label: "Approved", value: "approved" },
        ]);
        const action = localStorage.getItem("action");
        if (action === "investor register" || action === "investor update") {
          setStartUp([
            { label: "Idea", value: "Idea" },
            { label: "Seed", value: "Seed" },
            { label: "Growth", value: "Growth" },
            { label: "Established", value: "Established" },
          ]);
          setInvestType([
            { label: "Equity", value: "Equity" },
            { label: "Convertible Debt", value: "Convertible Debt" },
            { label: "Loans", value: "Loans" },
            { label: "Grants", value: "Grants" },
          ]);
        }
      } else if (activeUser?.role === "Investor") {
        setStartUp([
          { label: "Idea", value: "Idea" },
          { label: "Seed", value: "Seed" },
          { label: "Growth", value: "Growth" },
          { label: "Established", value: "Established" },
        ]);
        setInvestType([
          { label: "Equity", value: "Equity" },
          { label: "Convertible Debt", value: "Convertible Debt" },
          { label: "Loans", value: "Loans" },
          { label: "Grants", value: "Grants" },
        ]);
      }
    };
    optionHandler();
    const existCompany = localStorage.getItem("action");
    existCompany === "company update"
      ? setHideEntre(true)
      : setHideEntre(false);
  }, []);
  const action = localStorage.getItem("action");

  useEffect(() => {
    let user = null;
    if (fields[0].name !== "pitchTitle") {
      user = JSON.parse(localStorage.getItem("user") || "{}");
    } else if (fields[0].name === "pitchTitle") {
      const company = localStorage.getItem("action");
      if (company === "company update") {
        user = data;
      } else if (company === "company register") {
        // user = null;
        user = fields;
      }
    }
    if (
      localStorage.getItem("action") === "investor update" ||
      localStorage.getItem("action") === "entrepreneur update"
    ) {
      user = data;
    }
    setUser(user?.industryInterest);
    setUser(user?.industry);
    setPhone(user?.phoneNumber);
    setRole(user?.role);
    // Set dynamic initial values based on activeUser and fields
    const defaultValues = fields.reduce((acc, field) => {
      if (field.name === "industryInterest" || field.name === "industry") {
        acc[field.name] = [];
      } else if (field.name === "email" && action === "investor register") {
        acc[field.name] = [];
      } else if (field.name === "fullName" && action === "investor register") {
        acc[field.name] = [];
      } else {
        acc[field.name] = user[field.name] || "";
      }
      return acc;
    }, {});
    setInitialValues(defaultValues);
  }, [activeUser, fields]);

  useEffect(() => {
    const getIndustries = async () => {
      try {
        const endPoint = "industry-interest";
        const method = "GET";
        const apiResponse = await APIs(endPoint, null, method, {}, null, false);
        if (apiResponse.status === 200) {
          // Format the data as required
          const formattedData = apiResponse?.data?.data.map((item) => ({
            label: item,
            value: item,
          }));
          setIndustries(formattedData);
        } else {
          console.error("Invalid response format:", apiResponse);
        }
      } catch (error) {
        console.error("Failed to fetch industries:", error);
      }
    };
    getIndustries();
    const getEntrepreneurs = async () => {
      try {
        const endPoint = "entrepreneur/get-entrepreneur";
        const method = "GET";
        const apiResponse = await APIs(endPoint, null, method, {}, null, false);
        if (apiResponse.status === 200) {
          setEntrepreneurs(apiResponse?.data?.data);
        } else {
          console.error("Invalid response format:", apiResponse);
        }
      } catch (error) {
        console.error("Failed to fetch industries:", error);
      }
    };
    getEntrepreneurs();
    const getCompanies = async () => {
      try {
        const endPoint = "company/get-companies";
        const method = "GET";
        const apiResponse = await APIs(endPoint, null, method, {}, null, false);
        if (apiResponse.status === 200) {
          setCompanies(apiResponse?.data?.data);
        } else {
          console.error("Invalid response format:", apiResponse);
        }
      } catch (error) {
        console.error("Failed to fetch industries:", error);
      }
    };
    getCompanies();
  }, []);
  let imageUrl = localStorage.getItem("user");
  imageUrl = JSON.parse(imageUrl);
  imageUrl = imageUrl?.profilePicture;

  let myUser = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <Modal
        open={isModalOpen}
        onClose={closeHandler}
        className={classes.modal}
      >
        <div className={classes.card}>
          <Card className="border relative border-10 bg-black">
            <div className="p-10 bg-gradient-to-r from-green-500 via-teal-500 to-emerald-600 text-white text-center text-2xl font-semibold">
              {myUser?.role == "Entrepreneur" && "Entrepreneur Profile"}
              {myUser?.role == "Admin" && "Admin Profile"}
              {myUser?.role == "Investor" && "Investor Profile"}
            </div>
            <IconButton className={classes.closeButton} onClick={closeHandler}>
              <CloseIcon />
            </IconButton>
            <Toaster />
            {/* <CardHeader title={title} /> */}
            <div className="relative">
              <img
                src={
                  `${process.env.NEXT_PUBLIC_HOSTNAME}${imageUrl}`
                    ? `${process.env.NEXT_PUBLIC_HOSTNAME}${imageUrl}`
                    : "/user.avif"
                }
                alt="Avatar"
                width={120} // Specify width
                height={80} // Specify height
                className="mx-auto relative border-2 rounded-full w-[126px] h-[126px] border-dashed p-2 mt-2"
              />
              <label
                htmlFor="profilePicture"
                className="right-[40%] cursor-pointer bottom-0  absolute"
                style={{
                  transform: "translate(-50%, 50%)", // Center the icon
                }}
              >
                <AddCircleOutline className="cursor-pointer" />
              </label>{" "}
            </div>
            {/* <Image src={`${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/${activeUser?.profilePicture}`} width={100} height={20} alt='admin icon picture' className="mx-auto border-2 border-dashed p-2 rounded-full mt-2" /> */}
            {Object.keys(initialValues).length > 0 && ( // Ensure initialValues are loaded
              <Formik
                initialValues={initialValues}
                // validationSchema={generateValidationSchema(fields)} // Add this line
                // validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {({ dirty, isValid, values, handleChange, handleBlur }) => (
                  <Form>
                    <CardContent>
                      <Grid container spacing={2}>
                        {fields.map((item, key) => (
                          <Grid key={key} item xs={8} sm={6}>
                            <FormControl fullWidth>
                              {/* General Input Fields */}
                              {![
                                "status",
                                "profilePicture",
                                "industryInterest",
                                "entrepreneurId",
                                "companyId",
                                "startupStagePreference",
                                "typeOfInvestment",
                                "industry",
                                "logoBanner",
                                "email",
                                "video",
                                "documents",
                              ].includes(item.name) && (
                                <Field
                                  component={TextField}
                                  label={item.label}
                                  name={item.name}
                                  type={item.type}
                                  fullWidth
                                  value={values[item.name] || ""}
                                  onChange={(event) => {
                                    const value = event.target.value;
                                    const cleanedValue =
                                      item.name === "phoneNumber" ||
                                      item.name === "location"
                                        ? value.replace(/[^a-zA-Z0-9\s]/g, "") // Removes special characters only
                                        : value.replace(/[^a-zA-Z\s]/g, ""); // Keeps letters & spaces only for other fields
                                    handleChange({
                                      target: {
                                        name: item.name,
                                        value: cleanedValue,
                                      },
                                    });
                                  }}
                                  onBlur={handleBlur}
                                />
                              )}

                              {/* Profile Picture Upload */}
                              {item.name === "profilePicture" && (
                                <Field name={item.name}>
                                  {({ form }) => (
                                    <input
                                      type="file"
                                      id="profilePicture"
                                      name="profilePicture"
                                      accept="image/*"
                                      onChange={(e) =>
                                        handleFileChange(e, form.setFieldValue)
                                      }
                                      style={{
                                        display: "block",
                                        visibility: "hidden",
                                        marginTop: "10px",
                                      }}
                                    />
                                  )}
                                </Field>
                              )}

                              {/* Logo Banner Upload */}
                              {item.name === "logoBanner" && (
                                <Field name={item.name}>
                                  {({ form }) => (
                                    <Input
                                      type="file"
                                      accept="image/*"
                                      name="profilePicture"
                                      id="profilePicture"
                                      onChange={(e) =>
                                        handleBannerChange(
                                          e,
                                          form.setFieldValue
                                        )
                                      }
                                      style={{
                                        display: "block",
                                        marginTop: "10px",
                                      }}
                                    />
                                  )}
                                </Field>
                              )}

                              {/* Video Upload */}
                              {item.name === "video" && (
                                <Field name={item.name}>
                                  {({ form }) => (
                                    <Input
                                      type="file"
                                      accept="video/*"
                                      onChange={(e) =>
                                        handleVideoChange(e, form.setFieldValue)
                                      }
                                      style={{
                                        display: "block",
                                        marginTop: "10px",
                                      }}
                                    />
                                  )}
                                </Field>
                              )}

                              {/* Documents Upload */}
                              {item.name === "documents" && (
                                <Field name={item.name}>
                                  {({ form }) => (
                                    <Input
                                      type="file"
                                      inputProps={{
                                        accept:
                                          ".jpeg, .jfif, .png, .webp, .docx, .pdf, .xlsx, .xls, .csv, .txt",
                                        multiple: true,
                                      }}
                                      onChange={(e) =>
                                        handleDocuments(e, form.setFieldValue)
                                      }
                                      style={{
                                        display: "block",
                                        marginTop: "10px",
                                      }}
                                    />
                                  )}
                                </Field>
                              )}

                              {/* Email (Read-Only) */}
                              {item.name === "status" && (
                                <Grid item xs={12} sm={6} md={12}>
                                  <Field
                                    component={TextField}
                                    fullWidth
                                    variant="outlined"
                                    label="Email"
                                    name="email"
                                    value={myUser.email}
                                    InputProps={{ readOnly: true }}
                                  />
                                </Grid>
                              )}

                              {/* {item.name === "profilePicture" && (
                                <Field name={item.name}>
                                  {({ form }) => (
                                    <input
                                      type="file"
                                      name="profilePicture"
                                      id="profilePicture"
                                      accept="image/*"
                                      onChange={(e) =>
                                        handleFileChange(e, form.setFieldValue)
                                      }
                                      style={{
                                        display: "block",
                                        visibility: "",
                                        marginTop: "10px",
                                      }}
                                    />
                                  )}
                                </Field>
                              )} */}

                              {/* Industry Interest Field - Allows letters, spaces, and commas */}
                              {item.name === "industryInterest" && (
                                <Field
                                  component={TextField}
                                  label={item.label}
                                  name={item.name}
                                  type="text"
                                  fullWidth
                                  value={values.industryInterest || ""}
                                  onChange={(e) => {
                                    let value = e.target.value;
                                    value = value.replace(/[^a-zA-Z,\s]/g, ""); // Allow letters, commas, and spaces
                                    handleChange({
                                      target: {
                                        name: "industryInterest",
                                        value,
                                      },
                                    });
                                  }}
                                  onBlur={handleBlur}
                                />
                              )}

                              {/* Industry Field */}
                              {item.name === "industry" && (
                                <Field
                                  component={TextField}
                                  label={item.label}
                                  name={item.name}
                                  type="text"
                                  fullWidth
                                  value={values.industry || ""}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />
                              )}

                              {/* Startup Stage Preference Dropdown */}
                              {item.name === "startupStagePreference" && (
                                <Grid item xs={12} sm={6} md={12}>
                                  <FormControl fullWidth variant="outlined">
                                    <InputLabel>{item.label}</InputLabel>
                                    <Select
                                      label={item.label}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      value={values.startupStagePreference}
                                      name={item.name}
                                    >
                                      <MenuItem value="">None</MenuItem>
                                      {startUp.map((option) => (
                                        <MenuItem
                                          key={option.value}
                                          value={option.value}
                                        >
                                          {option.label}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                </Grid>
                              )}

                              {/* Type of Investment Dropdown */}
                              {item.name === "typeOfInvestment" && (
                                <Grid item xs={12} sm={6} md={12}>
                                  <FormControl fullWidth variant="outlined">
                                    <InputLabel>{item.label}</InputLabel>
                                    <Select
                                      label={item.label}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      value={values.typeOfInvestment || ""}
                                      name={item.name}
                                    >
                                      <MenuItem value="">None</MenuItem>
                                      {investType.map((option) => (
                                        <MenuItem
                                          key={option.value}
                                          value={option.value}
                                        >
                                          {option.label}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                </Grid>
                              )}

                              {/* Company Selection Dropdown */}
                              {item.name === "companyId" && !hideEntre && (
                                <Grid item xs={12} sm={12} md={12}>
                                  <FormControl fullWidth variant="outlined">
                                    <InputLabel>{item.label}</InputLabel>
                                    <Select
                                      label={item.label}
                                      onChange={(event) => {
                                        setComp(event.target.value);
                                        handleChange(event);
                                      }}
                                      onBlur={handleBlur}
                                      value={values.companyId || ""}
                                      name="companyId"
                                    >
                                      {companies.map((company) => (
                                        <MenuItem
                                          key={company._id}
                                          value={company._id}
                                        >
                                          {company.pitchTitle}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                </Grid>
                              )}
                            </FormControl>
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                    <CardActions>
                      <Button
                        disabled={!dirty || !isValid}
                        variant="contained"
                        color="primary"
                        type="submit"
                      >
                        Save
                      </Button>
                      {role !== "Admin" && (
                        <Button
                          disabled={
                            !(
                              localStorage.getItem("authID") &&
                              role !== "Admin" &&
                              phone
                            )
                          }
                          variant="contained"
                          color="primary"
                          onClick={handleRequestApproval}
                        >
                          Request Approval
                        </Button>
                      )}
                    </CardActions>
                  </Form>
                )}
              </Formik>
            )}
          </Card>
        </div>
      </Modal>
    </>
  );
};

export default UserForm;
