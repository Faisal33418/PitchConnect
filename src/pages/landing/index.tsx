import { useEffect } from "react";
import Footer from "../home/footer";

const LandingPage = () => {
  /// Page Sections
  const Hero = () => (
    <div
      className="relative pt-16 pb-32 flex content-center items-center justify-center"
      style={{
        minHeight: "91vh",
      }}
    >
      <div
        className="absolute top-0 w-full h-full  bg-cover"
        style={{
          backgroundImage:
            "url('https://media.istockphoto.com/id/1949502324/photo/portrait-of-mature-indian-or-latin-business-man-ceo-trader-using-laptop-computer-typing.webp?s=1024x1024&w=is&k=20&c=d7AyBOdFrtqOShw3-TNLrjfGwNN2pPQTzqDBoVlbmxE=')",
        }}
      >
        <span
          id="blackOverlay"
          className="w-full h-full absolute opacity-75 bg-black"
        ></span>
      </div>
      <div className="container relative mx-auto">
        <div className="items-center flex flex-wrap">
          <div className="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
            <div className="pr-12">
              <h1 className="text-white font-semibold text-5xl">
                Meet Pitch-Connect
              </h1>
              <p className="mt-4 text-lg text-gray-300">
                Join our platform for Super Administrators, Investors, and
                Entrepreneurs to connect and empower innovative ideas
                seamlessly.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden"
        style={{ height: "70px" }}
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
    </div>
  );

  const Featured = () => (
    <section className="relative py-20">
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
            className="text-white fill-current"
            points="2560 0 2560 100 0 100"
          ></polygon>
        </svg>
      </div>

      <div className="container mx-auto px-4">
        <div className="items-center flex flex-wrap">
          <div className="w-full md:w-5/12 ml-auto mr-auto px-4">
            <div className="md:pr-12">
              <div className="text-pink-600 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-pink-300">
                <i className="fas fa-rocket text-xl"></i>
              </div>
              <h3 className="text-3xl font-semibold">Best Teams</h3>
              <p className="mt-4 text-lg leading-relaxed text-gray-600">
                As an experienced teams, I provide ready-to-use solutions
                designed for rapid investers and entrepreneurs issues.
              </p>
              <ul className="list-none mt-6">
                <li className="py-2">
                  <div className="flex items-center">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-pink-600 bg-pink-200 mr-3">
                        <i className="fas fa-fingerprint"></i>
                      </span>
                    </div>
                    <div>
                      <h4 className="text-gray-600">
                        Carefully analyzed users
                      </h4>
                    </div>
                  </div>
                </li>
                <li className="py-2">
                  <div className="flex items-center">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-pink-600 bg-pink-200 mr-3">
                        <i className="fab fa-html5"></i>
                      </span>
                    </div>
                    <div>
                      <h4 className="text-gray-600">Amazing chance</h4>
                    </div>
                  </div>
                </li>
                <li className="py-2">
                  <div className="flex items-center">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-pink-600 bg-pink-200 mr-3">
                        <i className="far fa-paper-plane"></i>
                      </span>
                    </div>
                    <div>
                      <h4 className="text-gray-600">Bost assets</h4>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const Finisher = () => (
    <section className="pb-20 relative block bg-gray-900">
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
            className="text-gray-900 fill-current"
            points="2560 0 2560 100 0 100"
          ></polygon>
        </svg>
      </div>

      <div className="container mx-auto px-4 lg:pt-24">
        <div className="flex flex-wrap text-center justify-center">
          <div className="w-full lg:w-6/12 px-4">
            <h2 className="text-4xl font-semibold text-white">Something new</h2>
            <p className="text-lg leading-relaxed mt-4 mb-4 text-gray-500">
              Join our platform where Super Administrators, Investors, and
              Entrepreneurs can connect and seamlessly empower innovative ideas.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap mt-12 justify-center">
          <div className="w-full lg:w-3/12 px-4 text-center">
            <div className="text-gray-900 p-3 w-12 h-12 shadow-lg rounded-full bg-white inline-flex items-center justify-center">
              <i className="fas fa-medal text-xl"></i>
            </div>
            <h6 className="text-xl mt-5 font-semibold text-white">
              Excelent Services
            </h6>
            <p className="mt-2 mb-4 text-gray-500">
              Connect with Super Administrators, Investors, and Entrepreneurs to
              empower your innovative ideas with valuable resources.
            </p>
          </div>
          <div className="w-full lg:w-3/12 px-4 text-center">
            <div className="text-gray-900 p-3 w-12 h-12 shadow-lg rounded-full bg-white inline-flex items-center justify-center">
              <i className="fas fa-lightbulb text-xl"></i>
            </div>
            <h5 className="text-xl mt-5 font-semibold text-white">
              Launch time
            </h5>
            <p className="mt-2 mb-4 text-gray-500">
              Engage key stakeholders to transform your ideas into reality and
              drive growth.
            </p>
          </div>
          <div className="w-full lg:w-3/12 px-4 text-center">
            <div className="text-gray-900 p-3 w-12 h-12 shadow-lg rounded-full bg-white inline-flex items-center justify-center">
              <i className="fas fa-poll text-xl"></i>
            </div>
            <h5 className="text-xl mt-5 font-semibold text-white">
              Grow your market
            </h5>
            <p className="mt-2 mb-4 text-gray-500">
              Connect with key stakeholders to accelerate your ideas with the
              support of Super Administrators, Investors, and Entrepreneurs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );

  const teamMembers = [
    {
      name: "M.Faisal Rashid",
      role: "Web Developer",
      image:
        "https://media.istockphoto.com/id/2050253321/photo/happy-businessman-enjoying-on-the-city-street.jpg?s=1024x1024&w=is&k=20&c=PBhpPmm7IqSlN3h4zFaq4rGcJj0d4OCMzh9Dfa89HHU=",
      socialLinks: [
        { icon: "fab fa-twitter", color: "bg-blue-400" },
        { icon: "fab fa-facebook-f", color: "bg-blue-600" },
        { icon: "fab fa-dribbble", color: "bg-pink-500" },
      ],
    },
    {
      name: "M.Ahsan Akmal",
      role: "Marketing Specialist",
      image:
        "https://media.istockphoto.com/id/1940987682/photo/suited-asian-executive-standing-by-corporate-structure-with-arms-crossed.jpg?s=1024x1024&w=is&k=20&c=3SE47KvkY1EhabesR9Xqxo6vbU_m3AVi1EcEbfPE0JY=",
      socialLinks: [
        { icon: "fab fa-google", color: "bg-red-600" },
        { icon: "fab fa-facebook-f", color: "bg-blue-600" },
      ],
    },
    {
      name: "M.Junaid Ul Hassan",
      role: "QA Engineer",
      image:
        "https://plus.unsplash.com/premium_photo-1661284937039-4d00e054d9cc?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      socialLinks: [
        { icon: "fab fa-google", color: "bg-red-600" },
        { icon: "fab fa-twitter", color: "bg-blue-400" },
        { icon: "fab fa-instagram", color: "bg-gray-800" },
      ],
    },
    {
      name: "Muhammad Hassan",
      role: "SEO Specialist",
      image:
        "https://plus.unsplash.com/premium_photo-1661293911329-e2f875089fa5?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      socialLinks: [
        { icon: "fab fa-dribbble", color: "bg-pink-500" },
        { icon: "fab fa-google", color: "bg-red-600" },
        { icon: "fab fa-twitter", color: "bg-blue-400" },
        { icon: "fab fa-instagram", color: "bg-gray-800" },
      ],
    },
  ];

  const Team = () => (
    <section className="pt-20 pb-48">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center text-center mb-12">
          <div className="w-full lg:w-6/12 px-4">
            <h2 className="text-4xl font-semibold">Team Members</h2>
            <p className="text-lg leading-relaxed m-4 text-gray-600">
              According to our platform, Super Administrators and investors are
              essential for unlocking the potential of innovative ideas.{" "}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4"
            >
              <div className="px-6 bg-white shadow-lg rounded-lg p-4">
                <img
                  alt={member.name}
                  src={member.image}
                  className="shadow-lg rounded-md max-w-full mx-auto"
                  style={{ maxWidth: "120px" }}
                />
                <div className="pt-6 text-center">
                  <h5 className="text-xl font-bold">{member.name}</h5>
                  <p className="mt-1 text-sm text-gray-500 uppercase font-semibold">
                    {member.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  useEffect(() => {
    localStorage.removeItem("signup");
  }, []);

  return (
    <>
      <Hero />
      {/* <div className="p-8">
                <h1 className="text-3xl font-bold mb-4">Entrepreneur Testimonials</h1>
                <Testimonials />
            </div> */}
      <Featured />
      <Finisher />
      <Team />
      <Footer />
    </>
  );
};

export default LandingPage;
