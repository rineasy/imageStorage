import React from "react";

const Hero = () => {
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">
            Store Image <br />
            to Cloud
          </h1>
          <p className="py-6">
            Securely store, organize, and access your images anytime, anywhere.
            Experience fast uploads, reliable cloud storage, and effortless
            sharing with our platform.
          </p>

          <a href="#pricing" className="btn btn-primary">Get Started</a>
        </div>
      </div>
    </div>
  );
};

export default Hero;
