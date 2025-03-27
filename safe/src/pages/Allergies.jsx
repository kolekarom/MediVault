import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { nanoid } from "nanoid";
import Web3 from "web3";
import { create } from "ipfs-http-client";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import contract from "../contracts/contract.json";

const Allergies = () => {
  const web3 = new Web3(window.ethereum);
  const myContract = new web3.eth.Contract(contract.abi, contract.address);
  const [cookies, setCookie] = useCookies(["hash"]);
  const [allergies, setAllergies] = useState([]);
  const [formData, setFormData] = useState({ name: "", type: "", medication: "" });

  // Fetch Allergies from IPFS
  useEffect(() => {
    const fetchAllergies = async () => {
      try {
        const res = await myContract.methods.getPatient().call();
        for (let i = res.length - 1; i >= 0; i--) {
          if (res[i] === cookies.hash) {
            const response = await fetch(`http://localhost:8080/ipfs/${res[i]}`);
            const data = await response.json();
            setAllergies(data.allergies || []);
            break;
          }
        }
      } catch (error) {
        console.error("Error fetching allergies:", error);
      }
    };

    fetchAllergies();
  }, [cookies.hash]);

  // Handle Form Input Change
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  // Submit Allergy Data
  const handleSubmit = async () => {
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const currentAddress = accounts[0];

      const res = await myContract.methods.getPatient().call();
      for (let i = res.length - 1; i >= 0; i--) {
        if (res[i] === cookies.hash) {
          const response = await fetch(`http://localhost:8080/ipfs/${res[i]}`);
          const data = await response.json();

          data.allergies.push(formData);

          const client = create(new URL("http://127.0.0.1:5001"));
          const { cid } = await client.add(JSON.stringify(data));
          const hash = cid.toString();

          await myContract.methods.addPatient(hash).send({ from: currentAddress });
          setCookie("hash", hash);
          setAllergies([...data.allergies]);
          alert("Allergy added successfully!");
        }
      }
    } catch (error) {
      console.error("Error adding allergy:", error);
    }
  };

  // Delete Allergy
  const handleDelete = async (name) => {
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const currentAddress = accounts[0];

      const res = await myContract.methods.getPatient().call();
      for (let i = res.length - 1; i >= 0; i--) {
        if (res[i] === cookies.hash) {
          const response = await fetch(`http://localhost:8080/ipfs/${res[i]}`);
          const data = await response.json();

          data.allergies = data.allergies.filter((allergy) => allergy.name !== name);

          const client = create(new URL("http://127.0.0.1:5001"));
          const { cid } = await client.add(JSON.stringify(data));
          const hash = cid.toString();

          await myContract.methods.addPatient(hash).send({ from: currentAddress });
          setCookie("hash", hash);
          setAllergies(data.allergies);
          alert("Allergy deleted successfully!");
        }
      }
    } catch (error) {
      console.error("Error deleting allergy:", error);
    }
  };

  return (
    <div className="flex relative dark:bg-main-dark-bg">
      {/* Sidebar */}
      <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white">
        <Sidebar />
      </div>

      <div className="dark:bg-main-dark-bg bg-main-bg min-h-screen ml-72 w-full">
        {/* Navbar */}
        <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
          <Navbar />
        </div>

        {/* Main Content */}
        <div className="p-10 flex flex-col items-center gap-6">
          {/* Allergy List */}
          <div className="w-full">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Type</th>
                  <th className="border p-2">Medication</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allergies.map((allergy, index) => (
                  <tr key={index} className="text-center">
                    <td className="border p-2">{allergy.name}</td>
                    <td className="border p-2">{allergy.type}</td>
                    <td className="border p-2">{allergy.medication}</td>
                    <td className="border p-2">
                      <button
                        onClick={() => handleDelete(allergy.name)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Allergy Form */}
          <div className="bg-teal-500 text-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4 text-center">Add an Allergy</h2>
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="w-full p-2 mb-2 rounded-md text-black"
              onChange={handleChange}
            />
            <input
              type="text"
              name="type"
              placeholder="Type"
              className="w-full p-2 mb-2 rounded-md text-black"
              onChange={handleChange}
            />
            <input
              type="text"
              name="medication"
              placeholder="Medication"
              className="w-full p-2 mb-4 rounded-md text-black"
              onChange={handleChange}
            />
            <button
              onClick={handleSubmit}
              className="w-full bg-black text-white p-2 rounded-md"
            >
              Save
            </button>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Allergies;
