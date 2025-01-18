import React, { useState, useEffect, useRef } from "react";
import { firestore } from "./firebaseConfig";
import { collection, query, orderBy, limit, getDocs, setDoc, doc, serverTimestamp } from "firebase/firestore";
import './assets/css/App.css';
import "./assets/css/media-query.css";

import demoVideo from './assets/demo-vid.mp4';
import phoneMockup from "./assets/image/phone-mockup.png";
import circle1 from "./assets/image/circle-bg/circle-design-1.png";
import circle2 from "./assets/image/circle-bg/circle-design-2.png";
import circle3 from "./assets/image/circle-bg/ellipse-24.png";
import circle4 from "./assets/image/circle-bg/ellipse-25.png";
import circle5 from "./assets/image/circle-bg/ellipse-27.png";
import circle6 from "./assets/image/circle-bg/ellipse-28.png";
import circle7 from "./assets/image/circle-bg/ellipse-22.png";
import pdf from "./assets/scrollwise.pdf"

export default function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [registeredCount, setRegisteredCount] = useState(0);
  const modalRef = useRef();

  useEffect(() => {
    fetchRegisteredCount();
  }, []);

  // fetch number of registered email
  const fetchRegisteredCount = async () => {
    const q = query(
      collection(firestore, "user-email"),
      orderBy("count", "desc"), // descending
      limit(1)
    );

    const querySnapshot = await getDocs(q); // gets the latest user
    if (!querySnapshot.empty) {
      const mostRecentDoc = querySnapshot.docs[0];
      setRegisteredCount(mostRecentDoc.data().count);
      // .data() -> gets the data
      // .count -> is a property in my document (db)
    }
  };

  // register email
  const handleSubmit = async (event) => {
    event.preventDefault();

    const q = query(
      collection(firestore, "user-email"), // Target the 'user-email' collection
      orderBy("count", "desc"), // Order by 'count' field in descending order
      limit(1) // Limit the query to 1 result
    );

    const querySnapshot = await getDocs(q);

    // create newCount
    let newCount = 1;

    // newCount becomes latest count + 1
    if (!querySnapshot.empty) {
      const mostRecentDoc = querySnapshot.docs[0];
      newCount = mostRecentDoc.data().count + 1; // count is a property in my document
    }

    const newDocRef = doc(
      collection(firestore, "user-email"),
      `user-${newCount}`
    ); // doc template

    await setDoc(newDocRef, {
      name,
      email,
      count: newCount,
      timestamp: serverTimestamp(),
    }); // create new doc

    setName("");
    setEmail("");
    setShowModal(false);
    setRegisteredCount(newCount);
  };

  // close when user clicks outside of the modal content
  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      setShowModal(false);
    }
  };

  const modalStyles = {
    modal: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: "#FDFFEA",
      padding: "30px",
      borderRadius: "10px",
      maxWidth: "400px",
      width: "100%",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    closeButton: {
      float: "right",
      fontSize: "1.5rem",
      fontWeight: "bold",
      cursor: "pointer",
      color: "#333",
      border: "none",
      background: "none",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
    },
    input: {
      padding: "10px",
      fontSize: "1rem",
      borderRadius: "5px",
      border: "1px solid #ccc",
    },
    submitButton: {
      padding: "12px",
      fontSize: "1rem",
      backgroundColor: "#9BEC00",
      color: "#1E400F",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "background-color 0.3s",
    },
  };

  return (
    <div className="app">
      {/* navbar */}
      <nav className="navbar navbar-expand-md pt-md-4 " id="nav">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse d-md-flex justify-content-md-between ms-md-5 "
            id="navbarNav"
          >
            <ul
              className="navbar-nav d-md-flex gap-md-5 px-3 py-1"
              id="left-nav"
            >
              <li className="nav-item fw-bold mx-md-4">
                <a className="nav-link" aria-current="page" href="#">
                  Home
                </a>
              </li>
              <li className="nav-item fw-bold mx-md-4">
                <a className="nav-link" href="#about-page">
                  About
                </a>
              </li>
            </ul>
            <button className="btn fw-bold nav-item" id="right-nav">
              <a className="nav-link" href="#demo-container">
                Learn More
              </a>
            </button>
          </div>
        </div>
      </nav>
      {/* navbar end */}

      {/* landing page design */}
      <div
        className="container-fluid w-100 mt-4"
        id="landing-design"
      >
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
      <p className="text-center mt-5" id="headline">
        Join the growing community of{" "}
        <span id="dynamic-registered">{registeredCount}</span> interested
        learners
      </p>

      <button
        onClick={() => setShowModal(true)}
        className="cta-btn nav-link btn btn-link"
      >
        Sign Up
      </button>

      {/* about */}
      <div id="about-page" className="mt-5">
        <div id="about-title">What is ScrollWise?</div>
        <div className="container" id="about-container">
          <p>
            <strong>ScrollWise</strong> is a web3 platform designed to transform
            mindless scrolling into purposeful learning. It provides a
            personalized, next-generation educational experience that leverages
            adaptive content to engage learners
          </p>
          <img src={phoneMockup} alt="iphone mockup" id="iphone-mockup" />
        </div>

        <img className="circle circle-1" src={circle1} alt="circle bg" />
        <img className="circle circle-2" src={circle2} alt="circle bg" />
        <img className="circle circle-3" src={circle3} alt="circle bg" />
        <img className="circle circle-4" src={circle4} alt="circle bg" />
        <img className="circle circle-5" src={circle5} alt="circle bg" />
        <img className="circle circle-6" src={circle6} alt="circle bg" />
        <img className="circle circle-7" src={circle7} alt="circle bg" />
      </div>

      {/* demo */}
      <div id="demo-container">
        <div className="vid-container d-flex justify-content-center">
          <video height="600" id="video-playing" autoPlay loop muted>
            <source src={demoVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div
          className="d-flex flex-column justify-content-center align-items-left"
          id="more-container"
        >
          <div
            className=" d-flex flex-column align-items-left justify-content-center"
            id="more-container-inner"
          >
            <p id="learn-more">Learn More: </p>
            <a id="main-cto" href={pdf} download="./assets/scrollwise.pdf">
              <button>Download Project Description</button>
            </a>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={modalStyles.modal} ref={modalRef} onClick={closeModal}>
          <div style={modalStyles.modalContent}>
            <button
              style={modalStyles.closeButton}
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h2
              style={{
                color: "#1E400F",
                fontFamily: "helvetica",
                fontWeight: "bolder",
                marginBottom: "0px",
              }}
            >
              Interested?
            </h2>
            <h3
              style={{
                color: "#1E400F",
                opacity: "80%",
                marginBottom: "30px",
                fontSize: "1.25rem",
                fontFamily: "helvetica",
                fontWeight: "bold",
              }}
            >
              Let us know.
            </h3>
            <form onSubmit={handleSubmit} style={modalStyles.form}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                required
                style={modalStyles.input}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail"
                required
                style={modalStyles.input}
              />
              <button type="submit" style={modalStyles.submitButton}>
                Join ScrollWise
              </button>
            </form>
          </div>
        </div>
      )}

      <footer className="container py-5">
        <hr />
        <div className="d-flex justify-content-between flex-column flex-md-row mt-2 gap-sm-3 gap-md-0">
          <span>Made with love, purpose, and care</span>
          <span>Hooked Unitour Hackathon 2024</span>
        </div>
        <div>Team Illumin</div>
      </footer>
    </div>
  );
}