import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { useCookies } from "react-cookie";
import Web3 from "web3";
import contract from "../contracts/contract.json";
import { FaEdit } from "react-icons/fa";

const MyProfile = () => {
  const web3 = window.ethereum ? new Web3(window.ethereum) : null;
  const mycontract = web3 ? new web3.eth.Contract(contract["abi"], contract["address"]) : null;
  const [cookies] = useCookies();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [editMode, setEditMode] = useState({ name: false, email: false, password: false });

  useEffect(() => {
    if (!cookies["hash"]) return;
    fetch(`http://localhost:8080/ipfs/${cookies["hash"]}`)
      .then(res => res.json())
      .then(res => {
        setName(res.name || "");
        setEmail(res.mail || "");
        setPassword(res.password || "");
      })
      .catch(err => console.error("Error fetching data:", err));
  }, [cookies["hash"]]);

  const toggleEdit = (field) => {
    setEditMode(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const save = async () => {
    console.log("Saving user data:", { name, email, password });
    // Implement blockchain or backend saving logic
  };

  return (
    <div className="flex relative dark:bg-main-dark-bg min-h-screen">
      <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white">
        <Sidebar />
      </div>

      <div className="dark:bg-main-dark-bg bg-main-bg min-h-screen ml-72 w-full">
        <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
          <Navbar />
        </div>

        <div className="flex justify-center mt-16">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-[400px]">
            <h1 className="text-center text-2xl font-semibold text-gray-800 dark:text-white mb-6">
              User Profile
            </h1>

            {[
              { label: "Name", value: name, setter: setName, field: "name" },
              { label: "Email", value: email, setter: setEmail, field: "email" },
              { label: "Password", value: password, setter: setPassword, field: "password" },
            ].map(({ label, value, setter, field }, index) => (
              <div key={index} className="mb-4 relative">
                <label className="text-gray-700 dark:text-gray-300 font-medium block mb-2">
                  {label}
                </label>
                <div className="flex items-center">
                  <input
                    type={field === "password" ? "password" : "text"}
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    disabled={!editMode[field]}
                    className={`w-full p-3 text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg border focus:ring-2 focus:ring-cyan-400 outline-none transition-all ${
                      editMode[field] ? "border-cyan-500" : "border-gray-300"
                    }`}
                  />
                  <button onClick={() => toggleEdit(field)} className="ml-3 text-cyan-500 hover:text-cyan-700 transition-all">
                    <FaEdit size={20} />
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={save}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium p-3 rounded-lg transition-all transform hover:scale-105"
            >
              Save Changes
            </button>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default MyProfile;
