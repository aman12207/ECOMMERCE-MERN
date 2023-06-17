import React from "react";
import "./aboutSection.css";
import { Button, Typography, Avatar } from "@material-ui/core";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import GitHubIcon from "@material-ui/icons/GitHub";
const About = () => {
  const visitLinkedIn = () => {
    window.location = "https://www.linkedin.com/in/aman-gupta12207/";
  };
  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src="https://res.cloudinary.com/aman10110/image/upload/v1686735889/avatars/bwrwyvrfwqdctga6ix4j.jpg"
              alt="Founder"
            />
            <Typography>Aman Gupta</Typography>
            <Button onClick={visitLinkedIn} color="primary">
              Visit LinkedIn
            </Button>
            <span>
              At ECOMMERCE, we're dedicated to providing a seamless online shopping experience. Browse our diverse range of products and enjoy exceptional customer service every step of the way.
            </span>
          </div>
          <div className="aboutSectionContainer2">
            <Typography component="h2">Our Brands</Typography>
            <a
              href="https://github.com/aman12207"
              target="blank"
            >
              <GitHubIcon className="githubSvgIcon" />
            </a>

            <a href="https://www.linkedin.com/in/aman-gupta12207/" target="blank">
              <LinkedInIcon className="linkedinSvgIcon" />
            </a>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
