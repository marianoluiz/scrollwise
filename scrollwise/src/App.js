import { useState, useEffect } from "react";
import { firestore } from "./firebase";
import { collection, query, orderBy, limit, getDocs, setDoc, doc, serverTimestamp, where } from "firebase/firestore";
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './assets/App.css';

import phoneMockup from './assets/image/phone-mockup.svg';
import demoVideo from './assets/demo-vid.mp4';

export default function App() {

  /* iwag functions and states */

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

  /* iwag functions and states end*/

  return (
    <>

    <body className="app">

      {/* navbar */}
    <nav className="navbar navbar-expand-lg pt-md-4" id="nav">
    <div className="container-fluid">
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse d-md-flex justify-content-md-between ms-md-5 " id="navbarNav">
        
        <ul className="navbar-nav d-md-flex gap-md-5 px-3 py-1" id="left-nav">
          <li className="nav-item fw-bold mx-md-4">
            <a className="nav-link" aria-current="page" href="#">Home</a>
          </li>
          <li className="nav-item fw-bold mx-md-4">
            <a className="nav-link" href="#">About</a>
          </li>
          <li className="nav-item fw-bold mx-md-4">
            <a className="nav-link" href="#">Sign up</a>
          </li>
        </ul>

        <button className="btn fw-bold" id="right-nav">
            <a className="nav-link">Learn More</a>
        </button>
      </div>
    </div>
    </nav>
  {/* navbar end */}

    {/* landing page design */}
    <div className="container-fluid w-100 mt-4 bg-primary" id="landing-design">
      <div className="scrollwise-set1">
        <div className="scrollwise-style1"></div>
        <div className="scrollwise-style2 top"></div>
      </div>
      <div className="scrollwise-set2">
        <div className="scrollwise-style2 bot"></div>
        <div className="scrollwise-style1"></div>
      </div>
  
    </div>

    {/* fetch the num  */}
    <p className="text-center mt-5" id="headline">Join the growing community of <span id="dynamic-registered">10</span> interested learners</p>

    {/* about */}
    <div className="mt-5">
      <div id="about-title">What is ScrollWise?</div>
      <div className="container" id="about-container">
        <p><strong>ScrollWise</strong> is a web3 platform designed to transform mindless scrolling into purposeful learning. It provides a personalized, next-generation educational experience that leverages adaptive content to engage learners</p>
        <img src={phoneMockup} alt="iphone mockup" />


      </div>


    </div>

    {/* demo */}
    <div id="demo-container">
      <div className="vid-container d-flex justify-content-center">
        <video height="600" id="video-playing" controls autoplay loop muted>
          <source src={demoVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="d-flex flex-column justify-content-center align-items-left" id="more-container" >
        <div className=" d-flex flex-column align-items-left justify-content-center" id="more-container-inner">
          <p id="learn-more">Learn More: </p>
          <button id="main-cto">Download Project Description</button>
        </div>
      </div>
    </div>


    </body>

      <footer className="container py-5">
        <hr/>
        <div className="d-flex justify-content-between mt-2">
          <span>Made with love, purpose, and care</span>
          <span>Hooked Unitour Hackathon 2024</span>
        </div>
        <div>Team Illumin</div>
      </footer>
    </>
  );
}