import * as React from "react"
import "./Navbar.css"
import logo from "../images/sample_logo.webp"

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="logo">
                <a href="/">
                    <img src={logo} alt="Superhero Matchmaker Logo" className="logo-image" />
                </a>
            </div>
        </nav>
    );

}