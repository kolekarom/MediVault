import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar2 from "../components/Sidebar2";
import Footer from "../components/Footer";
import { useCookies } from "react-cookie";
import Web3 from "web3";
import contract from "../contracts/contract.json";
import { FaEdit } from "react-icons/fa";

const MyProfileDoc = () => {
  const [cookies, setCookie] = useCookies();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [licenseno, setLicenseno] = useState("");
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    const hash = cookies["hash"];
    if (!hash) return;

    fetch(`http://localhost:8080/ipfs/${hash}`)
      .then((res) => res.json())
      .then((res) => {
        setName(res.name);
        setEmail(res.mail);
        setPassword(res.password);
        setLicenseno(res.license);
      })
      .catch((error) => console.error("Error:", error));
  }, [cookies]);

  function handleEditClick() {
    setDisabled(!disabled);
  }

  async function save() {
    setCookie("name", name);
    setCookie("mail", email);
    setCookie("password", password);
    setCookie("licenseno", licenseno);
  }

  return (
    <div className="flex relative dark:bg-gray-900 bg-gray-100 min-h-screen">
      <div className="w-72 fixed sidebar dark:bg-gray-800 bg-white">
        <Sidebar2 />
      </div>
      <div className="ml-72 w-full">
        <div className="fixed md:static bg-white dark:bg-gray-900 navbar w-full">
          <Navbar />
        </div>
        <div className="flex justify-center mt-10">
          <form className="p-5 w-full max-w-lg bg-white dark:bg-gray-800 shadow-lg rounded-lg">
            <h1 className="text-center text-2xl font-bold text-gray-700 dark:text-white mb-5">User Profile</h1>
            <div className="space-y-4">
              {["Name", "Email", "Password", "License No."].map((label, index) => (
                <div key={index} className="relative">
                  <label className="text-gray-600 dark:text-gray-300 text-sm font-medium block mb-1">
                    {label}:
                  </label>
                  <div className="flex items-center border rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <input
                      type={label === "Password" ? "password" : "text"}
                      value={
                        label === "Name" ? name :
                        label === "Email" ? email :
                        label === "Password" ? password : licenseno
                      }
                      onChange={(e) => {
                        if (label === "Name") setName(e.target.value);
                        if (label === "Email") setEmail(e.target.value);
                        if (label === "Password") setPassword(e.target.value);
                        if (label === "License No.") setLicenseno(e.target.value);
                      }}
                      disabled={disabled}
                      className="w-full p-3 bg-transparent focus:outline-none text-gray-700 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={handleEditClick}
                      className="p-3 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                    >
                      <FaEdit className="text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={save}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition shadow-md"
              >
                Save
              </button>
            </div>
          </form>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default MyProfileDoc;
