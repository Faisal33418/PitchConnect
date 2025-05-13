import React, { ReactElement } from "react";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import DribbbleIcon from "@mui/icons-material/Brush"; // No direct Dribbble icon, using Brush as an alternative
import GitHubIcon from "@mui/icons-material/GitHub";

function Footer(): ReactElement {
  return (
    <footer className="relative bg-gradient-to-r from-[#efe9e1] via-[#d8ccc0] to-[#ac9c8d] pt-8 pb-6">
      <div
        className="bottom-auto top-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden -mt-20"
        style={{ height: "80px" }}
      >
        <svg
          className="absolute bottom-0 overflow-hidden"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          version="1.1"
          viewBox="0 0 2560 100"
          x="0"
          y="0"
        >
          <polygon
            className="text-gray-300 fill-current"
            points="2560 0 2560 100 0 100"
          ></polygon>
        </svg>
      </div>
      <div className="container mx-auto px-14 pt-3">
        <div className="flex flex-wrap">
          <div className="w-full lg:w-6/12 px-4">
            <h4 className="text-3xl font-semibold text-black">
              Keep in touch!
            </h4>
            <h5 className="text-lg mt-0 mb-2 text-black">
              We'are 24/7 services providing
            </h5>
            {/* media links */}
            <div className="mt-6 flex gap-4">
              <TwitterIcon className="text-black" />
              <FacebookIcon className="text-black" />
              <DribbbleIcon className="text-black" />
              <GitHubIcon className="text-black" />
            </div>
          </div>
          <div className="w-full lg:w-6/12 px-4">
            <div className="flex flex-wrap items-top mb-6">
              <div className="w-full lg:w-4/12 px-4 ml-auto">
                <span className="block uppercase text-black text-sm font-semibold mb-2">
                  Useful Links
                </span>
                <ul className="list-unstyled">
                  <li>
                    <a
                      className="text-black hover:text-gray-900 font-semibold block pb-2 text-sm"
                      href="https://www.linkedin.comn"
                    >
                      LinkedIn
                    </a>
                  </li>
                  <li>
                    <a
                      className=" text-black font-semibold block pb-2 text-sm"
                      href="https://www.twitter.com"
                    >
                      Twitter
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-black font-semibold block pb-2 text-sm"
                      href="https://www.github.com/"
                    >
                      Github
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-black font-semibold block pb-2 text-sm"
                      href="https://www.teams.com"
                    >
                      Teams
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
