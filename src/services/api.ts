import axios, {AxiosInstance} from "axios"

const api: AxiosInstance = axios.create({
  baseURL: "http://api.openweathermap.org/data/2.5/weather",
})

export default api