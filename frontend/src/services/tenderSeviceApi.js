import axios from "axios";

export const fetchMyTenders = async () => {
  const response = await axios.get("/api/tenders/Mytenders");
  return response.data;
};