import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../App.css";
const newFile = () => {
  const [stats, setStats] = useState([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const userEmail = localStorage.getItem("email"); // email from login
    if (!userEmail) return;

    setEmail(userEmail);

    const fetchStats = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/form-stats/email/${userEmail}`);
        setStats(res.data.stats);
      } catch (err) {
        console.error("Failed to load form stats", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-4">
      <h2 className="user-email">User: {email}</h2>
      <ul className="list-disc pl-5">
        {stats.map(({ table, count }) => (
          <li key={table}>{table.toUpperCase()}: {count} forms filled</li>
        ))}
      </ul>
    </div>
  );
};

export default newFile;
