import { useState, useEffect } from "react";
import { firestore } from "./firebase";
import { collection, query, orderBy, limit, getDocs, setDoc, doc, serverTimestamp, where } from "firebase/firestore";
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

export default function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Get the most recent document to determine the highest count
    const q = query(collection(firestore, 'user-email'), orderBy('count', 'desc'), limit(1));
    const querySnapshot = await getDocs(q);
    let newCount = 1;

    if (!querySnapshot.empty) {
      const mostRecentDoc = querySnapshot.docs[0];
      newCount = mostRecentDoc.data().count + 1;
    }

    // Create a new document with the name "user-" followed by the new count
    const newDocRef = doc(collection(firestore, 'user-email'), `user-${newCount}`);
    await setDoc(newDocRef, { name, email, count: newCount, timestamp: serverTimestamp() });

    setName('');
    setEmail('');
    fetchChartData();
  };

  const fetchChartData = async () => {
    const tenMinutesAgo = new Date();
    tenMinutesAgo.setMinutes(tenMinutesAgo.getMinutes() - 10);

    const q = query(
      collection(firestore, 'user-email'),
      where('timestamp', '>=', tenMinutesAgo),
      orderBy('timestamp', 'asc')
    );

    const querySnapshot = await getDocs(q);
    const labels = [];
    const data = [];

    querySnapshot.forEach((doc) => {
      const docData = doc.data();
      labels.push(new Date(docData.timestamp.seconds * 1000).toLocaleTimeString());
      data.push(docData.count);
    });

    // Ensure at least 10 points and at most 20 points
    while (labels.length < 10) {
      labels.unshift('');
      data.unshift(0);
    }
    if (labels.length > 20) {
      labels.splice(0, labels.length - 20);
      data.splice(0, data.length - 20);
    }

    setChartData({
      labels,
      datasets: [
        {
          label: 'Count Over Time',
          data,
          fill: false,
          borderColor: 'rgba(75,192,192,1)',
        },
      ],
    });
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  const chartOptions = {
    scales: {
      y: {
        ticks: {
          stepSize: 5,
        },
      },
    },
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Submit Your Email</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
      <div style={{ marginTop: '40px' }}>
        <h2>Count Over Time (Last 10 Minutes)</h2>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}