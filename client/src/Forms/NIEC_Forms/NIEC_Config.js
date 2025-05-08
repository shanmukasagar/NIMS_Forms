import axiosInstance from "../../components/AxiosInstance";

export const getSubmittedData = async (tableName, setData ) => {
    try {
        const response = await axiosInstance.get('/api/niec/formsData', { params: { tableName } });

        if (response.status === 200 && response.data) {
            setData(response.data);
        } 
        else {
            console.warn("Unexpected response format:", response);
        }
    } 
    catch (error) {
        console.error("Error occurred while fetching NIEC forms data:", error.message);
    }
};

// NIEC_Config.js
export const formatDateandTime = (timestamp) => {
    if (!timestamp) return 'N/A';
  
    const date = new Date(timestamp);
  
    // Add 5 hours and 30 minutes (19800 seconds = 5.5 hours)
    const offsetInMs = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(date.getTime() + offsetInMs);
  
    const formattedDate = istDate.toLocaleDateString('en-GB'); // DD/MM/YYYY
    const formattedTime = istDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  
    return `${formattedDate} ${formattedTime}`;
  };
  
