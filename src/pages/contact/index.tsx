import { Button, TextField, IconButton, InputAdornment } from "@mui/material";
import { useState } from "react";
import { Send, MailOutline, Phone, LocationOn } from "@mui/icons-material";
import Head from "next/head";
import toast, { Toaster } from "react-hot-toast";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent successfully!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <>
      <Head>
        <title>Contact Us | Pitch Connect</title>
      </Head>
      <Toaster />

      <div className="min-h-screen w-full bg-gradient-to-br from-[#050A44] via-[#202E3A] to-[#141619] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Interactive Blobs */}
        <div className="absolute w-full h-full top-0 left-0 pointer-events-none overflow-hidden z-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="blob"
              style={{
                position: "absolute",
                width: `${Math.random() * 300 + 100}px`,
                height: `${Math.random() * 300 + 100}px`,
                background: `radial-gradient(circle, ${
                  i % 3 === 0
                    ? "rgba(179, 132, 189, 0.4)"
                    : i % 3 === 1
                    ? "rgba(10, 33, 192, 0.4)"
                    : "rgba(32, 46, 58, 0.4)"
                }, transparent 70%)`,
                borderRadius: "50%",
                filter: "blur(40px)",
                opacity: 0.6,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${
                  12 + Math.random() * 15
                }s ease-in-out infinite, 
                          pulse ${
                            8 + Math.random() * 10
                          }s ease-in-out infinite alternate`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
          {/* Left Column - Contact Info */}
          <div className="space-y-8 backdrop-blur-sm bg-white/5 p-8 rounded-2xl border border-white/10 shadow-2xl">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Get in Touch
            </h1>

            <p className="text-white/80 text-lg">
              We'd love to hear from you! Whether you have a question about our
              services, want to discuss a project, or just want to say hello,
              drop us a message.
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-full bg-blue-500/20 text-blue-300">
                  <MailOutline className="text-2xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Email Us</h3>
                  <a
                    href="mailto:contact@lusion.com"
                    className="text-blue-300 hover:text-blue-200 transition"
                  >
                    pitchconnect@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-full bg-purple-500/20 text-purple-300">
                  <Phone className="text-2xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Call Us</h3>
                  <a
                    href="tel:+1234567890"
                    className="text-purple-300 hover:text-purple-200 transition"
                  >
                    +92 316 4729597
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-full bg-emerald-500/20 text-emerald-300">
                  <LocationOn className="text-2xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Visit Us</h3>
                  <p className="text-emerald-300">
                    Islamabad
                    <br />
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Connect With Us
              </h3>
              <div className="flex space-x-4">
                {["P", "I", "T", "C", "H"].map((social) => (
                  <div
                    key={social}
                    className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110"
                  >
                    <span className="text-white/80">{social.charAt()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="backdrop-blur-sm bg-white/5 p-8 rounded-2xl border border-white/10 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-6">
              Send Us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <TextField
                fullWidth
                variant="outlined"
                label="Your Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                InputProps={{
                  style: {
                    color: "white",
                    borderRadius: "12px",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                  },
                }}
                InputLabelProps={{
                  style: { color: "rgba(255, 255, 255, 0.7)" },
                }}
              />

              <TextField
                fullWidth
                variant="outlined"
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                InputProps={{
                  style: {
                    color: "white",
                    borderRadius: "12px",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                  },
                }}
                InputLabelProps={{
                  style: { color: "rgba(255, 255, 255, 0.7)" },
                }}
              />

              <TextField
                fullWidth
                variant="outlined"
                label="Your Message"
                name="message"
                multiline
                rows={5}
                value={formData.message}
                onChange={handleChange}
                InputProps={{
                  style: {
                    color: "white",
                    borderRadius: "12px",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                  },
                }}
                InputLabelProps={{
                  style: { color: "rgba(255, 255, 255, 0.7)" },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                endIcon={<Send />}
                sx={{
                  py: 1.5,
                  px: 4,
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: "600",
                  textTransform: "capitalize",
                  background:
                    "linear-gradient(45deg, #B384BD 30%, #0A21C0 90%)",
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #9b59b6 30%, #050A44 90%)",
                  },
                }}
              >
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(5vw, -5vh);
          }
          50% {
            transform: translate(10vw, 0);
          }
          75% {
            transform: translate(5vw, 5vh);
          }
        }

        @keyframes pulse {
          0% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          100% {
            opacity: 0.7;
            transform: scale(1.2);
          }
        }

        .blob:hover {
          opacity: 0.9 !important;
          filter: blur(30px) brightness(1.2) !important;
          transform: scale(1.3) !important;
          transition: all 0.3s ease;
        }

        .MuiOutlinedInput-root {
          fieldset {
            border-color: rgba(255, 255, 255, 0.1) !important;
          }
          &:hover fieldset {
            border-color: rgba(179, 132, 189, 0.5) !important;
          }
          &.Mui-focused fieldset {
            border-color: #b384bd !important;
          }
        }
      `}</style>
    </>
  );
};

export default ContactPage;
