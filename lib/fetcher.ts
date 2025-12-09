import axios from "axios";
let fetcher = (url: string)=> axios.get(url).then(res=> res.data)
export default fetcher