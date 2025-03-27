import React, { useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import Navbar from "../components/Navbar";
import Sidebar2 from "../components/Sidebar2";
import contract from "../contracts/contract.json";
import { useCookies } from "react-cookie";
import { create } from 'ipfs-http-client';

const Patients = () => {
    const web3 = new Web3(window.ethereum);
    const mycontract = new web3.eth.Contract(contract.abi, contract.address);
    const [patients, setPatients] = useState([]);
    const [cookies] = useCookies();

    useEffect(() => {
        const getPatients = async () => {
            try {
                const pat = [];
                const vis = new Set();
                const res = await mycontract.methods.getPatient().call();

                for (let i = res.length - 1; i >= 0; i--) {
                    const response = await fetch(`http://localhost:8080/ipfs/${res[i]}`);
                    if (!response.ok) continue;
                    const data = await response.json();
                    
                    if (!vis.has(data.mail)) {
                        vis.add(data.mail);
                        const selected = data.selectedDoctors || [];
                        
                        if (selected.includes(cookies.hash)) {
                            pat.push({ ...data, hash: res[i] });
                        }
                    }
                }
                setPatients(pat);
            } catch (error) {
                console.error("Error fetching patients:", error);
            }
        };

        getPatients();
    }, []); // Only run once on mount

    const view = useCallback((phash) => {
        window.location.href = `/patientData/${phash}`;
    }, []);

    const treated = useCallback(async (phash) => {
        try {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            const currentaddress = accounts[0];

            const response = await fetch(`http://localhost:8080/ipfs/${phash}`);
            if (!response.ok) throw new Error("Failed to fetch patient data");
            const data = await response.json();

            data.selectedDoctors = data.selectedDoctors.filter(dr => dr !== cookies.hash);

            const client = create(new URL("http://127.0.0.1:5001"));
            const { cid } = await client.add(JSON.stringify(data));
            const newHash = cid.toString();

            await mycontract.methods.addPatient(newHash).send({ from: currentaddress });
            alert("Patient Removed");
            window.location.reload();
        } catch (err) {
            console.error("Error treating patient:", err);
        }
    }, [cookies.hash]);

    return (
        <div className="flex relative dark:bg-main-dark-bg">
            <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white">
                <Sidebar2 />
            </div>

            <div className="dark:bg-main-dark-bg bg-main-bg min-h-screen ml-72 w-full">
                <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
                    <Navbar />
                </div>

                <div style={{ display: "flex", flexDirection: "column", padding: "1rem" }}>
                    <table style={{ borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Details</th>
                                <th>Treated?</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.map((patient, index) => (
                                <tr key={index}>
                                    <td>{patient.name}</td>
                                    <td>{patient.mail}</td>
                                    <td>
                                        <button onClick={() => view(patient.hash)}>View</button>
                                    </td>
                                    <td>
                                        <button onClick={() => treated(patient.hash)}>Treated</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Patients;
