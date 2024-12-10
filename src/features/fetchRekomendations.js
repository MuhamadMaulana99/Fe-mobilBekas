import axios from "axios";

const fetchRecommendations = async (filters) => {
  try {
    const response = await axios.post(
      "http://localhost:3200/recommendations",
      filters
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching recommendations:", error.message);
    throw error;
  }
};

export default fetchRecommendations;
