import React,{ useEffect, useState, useRef} from "react";
import axiosInstance from "../../../components/AxiosInstance"; // adjust path as needed


const useInvestigatorApproval = () => {
  const [message, setMessage] = useState("");
  const fetchOnce = useRef(false);

  const handleApproval = async () => {
    const token = new URLSearchParams(window.location.search).get("token");
    const tableName = new URLSearchParams(window.location.search).get("tableName");

    if (!token) {
      setMessage("❌ No approval token found.");
      return;
    }

    try {
        if(!fetchOnce.current) {
            fetchOnce.current = true;
            const response = await axiosInstance.get("/api/investigator/approve", {params : { token : token, tableName : tableName }});
            setMessage("✅ Approved successfully!");
        }
    } catch (error) {
      setMessage("❌ Invalid or expired approval link.");
    }
  };

  useEffect(() => {
    handleApproval();
  }, []);

  return message;
};

export default useInvestigatorApproval;
