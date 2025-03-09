import axios from "axios";

const configApi = axios.create({
    baseURL: "http://localhost:3000/api",
    headers: {
        "Content-type": "application/json"
    }
});

export default {
    async getCategory() {
        const response = await configApi.get("/search-stock/category");
        return response.data;
    },

    async getStock(requestData) {
        const response = await configApi.post("/search-stock/search", requestData);
        return response.data;
    },
}; 