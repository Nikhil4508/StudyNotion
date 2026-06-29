import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";

const ErrorPage = () => {
  const canvasRef = useRef(null);

  // Floating particles animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 214, 10, ${p.alpha})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] bg-richblack-900 flex items-center justify-center overflow-hidden">
      {/* Animated particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.6 }}
      />

      {/* Radial glow blobs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255,214,10,0.07) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(71,165,197,0.07) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Main card */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center max-w-2xl">
        {/* 404 giant number */}
        <div className="relative select-none">
          <span
            className="text-[10rem] sm:text-[14rem] font-bold leading-none tracking-tighter"
            style={{
              background: "linear-gradient(135deg, #FFD60A 0%, #47A5C5 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 40px rgba(255,214,10,0.25))",
            }}
          >
            404
          </span>
          {/* Ghost icon overlay */}
          <span
            className="absolute inset-0 flex items-center justify-center text-[5rem] sm:text-[7rem] pointer-events-none"
            style={{ animation: "float 3s ease-in-out infinite" }}
          >
            👻
          </span>
        </div>

        {/* Divider */}
        <div
          className="w-24 h-0.5 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, #FFD60A, transparent)",
          }}
        />

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-richblack-5 leading-snug">
          Oops! Page Not Found
        </h1>

        {/* Sub-text */}
        <p className="text-richblack-300 text-base sm:text-lg  leading-relaxed text-center">
          Looks like this page took a wrong turn somewhere in the cosmos. The
          page you're looking for doesn't exist or has been moved.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <Link to="/">
            <button
              className="px-8 py-3 rounded-md font-semibold text-richblack-900 cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #FFD60A 0%, #E7C009 100%)",
                boxShadow: "0 4px 24px rgba(255,214,10,0.3)",
              }}
            >
              🏠 Back to Home
            </button>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="px-8 py-3 rounded-md font-semibold text-richblack-100 border border-richblack-600 bg-richblack-800 cursor-pointer transition-all duration-200 hover:bg-richblack-700 hover:border-richblack-500 hover:scale-105 active:scale-95 flex items-center gap-x-2"
          >
            <FaArrowLeft />
            Go Back
          </button>
        </div>

        {/* Footer hint */}
        <p className="text-richblack-500 text-sm mt-2">
          Error code:{" "}
          <code className="text-yellow-50 bg-richblack-800 px-2 py-0.5 rounded font-mono text-xs">
            404_NOT_FOUND
          </code>
        </p>
      </div>

      {/* Float keyframe via inline style tag */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-18px); }
        }
      `}</style>
    </div>
  );
};

export default ErrorPage;
