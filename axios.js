import axios from "axios";
const token = localStorage.getItem("token");
const url = "http://localhost:3000/user/your_username"
const headers = {
    "Authorization": token,
    "Content-Type": "application/json",
    Accept: "application/json",
};
const getUserInfo = () => {
    axios.get(url, { headers: headers })
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.log(error);
        });
}