import React, { useState, useEffect } from "react";
import Web3 from "web3";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import contract from "../contracts/contract.json";
import { useCookies } from "react-cookie";
import { create } from 'ipfs-http-client';

const Insurance = () => {
  const web3 = new Web3(window.ethereum);
  const mycontract = new web3.eth.Contract(contract["abi"], contract["address"]);
  const [cookies, setCookie] = useCookies();
  const [insurances, setInsurances] = useState([]);

  useEffect(() => {
    if (!cookies["hash"]) return;

    async function fetchInsurances() {
      const res = await mycontract.methods.getPatient().call();
      for (let i = res.length - 1; i >= 0; i--) {
        if (res[i] === cookies["hash"]) {
          try {
            const data = await fetch(`http://localhost:8080/ipfs/${res[i]}`).then(res => res.json());
            setInsurances(data.insurance || []);
          } catch (error) {
            console.error("Error fetching insurance data:", error);
          }
          break;
        }
      }
    }
    fetchInsurances();
  }, [cookies["hash"]]);

  const [formData, setFormData] = useState({ company: "", policyNo: "", expiry: "" });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitInsurance = async () => {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const currentAddress = accounts[0];

    const res = await mycontract.methods.getPatient().call();
    for (let i = res.length - 1; i >= 0; i--) {
      if (res[i] === cookies["hash"]) {
        const data = await fetch(`http://localhost:8080/ipfs/${res[i]}`).then(res => res.json());
        data.insurance.push(formData);

        let client = create(new URL("http://127.0.0.1:5001"));
        const { cid } = await client.add(JSON.stringify(data));
        const hash = cid.toString();

        await mycontract.methods.addPatient(hash).send({ from: currentAddress });
        setCookie("hash", hash);
        alert("Insurance Added");
        setInsurances([...insurances, formData]); // Update UI without reload
      }
    }
  };

  const deleteInsurance = async (policyNo) => {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const currentAddress = accounts[0];

    const res = await mycontract.methods.getPatient().call();
    for (let i = res.length - 1; i >= 0; i--) {
      if (res[i] === cookies["hash"]) {
        const data = await fetch(`http://localhost:8080/ipfs/${res[i]}`).then(res => res.json());
        data.insurance = data.insurance.filter((ins) => ins.policyNo !== policyNo);

        let client = create(new URL("http://127.0.0.1:5001"));
        const { cid } = await client.add(JSON.stringify(data));
        const hash = cid.toString();

        await mycontract.methods.addPatient(hash).send({ from: currentAddress });
        setCookie("hash", hash);
        alert("Insurance Deleted");
        setInsurances(data.insurance); // Update UI without reload
      }
    }
  };

  return (
    <div className="flex relative dark:bg-main-dark-bg">
      <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white">
        <Sidebar />
      </div>

      <div className="dark:bg-main-dark-bg bg-main-bg min-h-screen ml-72 w-full">
        <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
          <Navbar />
        </div>

        <div className="p-10 flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-6">Insurance Policies</h1>
          
          {/* Insurance Table */}
          <table className="w-full border-collapse border border-gray-300 shadow-lg bg-white rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Company</th>
                <th className="border px-4 py-2">Policy Number</th>
                <th className="border px-4 py-2">Expiry</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {insurances.length > 0 ? (
                insurances.map((data, index) => (
                  <tr key={index} className="text-center">
                    <td className="border px-4 py-2">{data.company}</td>
                    <td className="border px-4 py-2">{data.policyNo}</td>
                    <td className="border px-4 py-2">{data.expiry}</td>
                    <td className="border px-4 py-2">
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                        onClick={() => deleteInsurance(data.policyNo)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="border px-4 py-2 text-center text-gray-500">
                    No insurance policies found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Add Insurance Form */}
          <div className="mt-10 p-6 bg-blue-100 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Insurance</h2>
            <input
              className="w-full p-2 mb-3 border rounded"
              type="text"
              name="company"
              placeholder="Company"
              onChange={handleInputChange}
            />
            <input
              className="w-full p-2 mb-3 border rounded"
              type="text"
              name="policyNo"
              placeholder="Policy No."
              onChange={handleInputChange}
            />
            <input
              className="w-full p-2 mb-3 border rounded"
              type="text"
              name="expiry"
              placeholder="Expiry Date"
              onChange={handleInputChange}
            />
            <button
              className="w-full bg-cyan-500 text-white py-2 rounded hover:bg-cyan-600 transition"
              onClick={submitInsurance}
            >
              Save
            </button>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Insurance;
