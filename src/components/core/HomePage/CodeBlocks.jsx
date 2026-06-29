import React, { useState, useEffect } from "react";
import CTAButton from "./CTAButton";
import { FaArrowRight } from "react-icons/fa";
// Import the Syntax Highlighter and the VS Code style
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {dracula} from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeBlocks = ({
  position,
  heading,
  subheading,
  ctabtn1,
  ctabtn2,
  codeblock,
  gradientColor,
}) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      // We take a slice of the string from 0 to current index
      setDisplayedText(codeblock.slice(0, index));
      index++;

      if (index > codeblock.length) {
        clearInterval(interval);
      }
    }, 20); // Typing speed in milliseconds

    return () => clearInterval(interval);
  }, [codeblock]);

  return (
    <div className={`flex ${position} my-5 lg:my-20 justify-between gap-12 lg:gap-10 lg:pl-14`}>
      
      {/* SECTION 1 - TEXT */}
      <div className="lg:w-[50%] flex flex-col gap-6 lg:gap-8">
        {heading}
        <div className="text-richblack-300 font-bold ">{subheading}</div>

        <div className=" flex mt-7 gap-7 ">
          <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto}>
            <div className="flex gap-2 items-center ">
              {ctabtn1.btntext}
              <FaArrowRight />
            </div>
          </CTAButton>
          <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto}>
            {ctabtn2.btntext}
          </CTAButton>
        </div>
      </div>

      {/* SECTION 2 - TYPING CODE BLOCK */}
      <div className="relative h-fit flex flex-row text-[10px] w-full py-4 lg:w-125 bg-white/5 backdrop-blur-xl border border-white/10 rounded-md">
        
        {/* The Glow Effect */}
        <div className={`absolute -left-4 top-0 h-25 w-25 rounded-full opacity-20 blur-[70px] pointer-events-none ${gradientColor}`}></div>

        {/* The Highlighter */}
        <div className="w-full flex flex-col font-bold font-mono pr-2">
          <SyntaxHighlighter
            language="html"
            style={dracula}
            showLineNumbers={true}
            customStyle={{
              background: "transparent",
              fontSize: "14px",
              minHeight: "380px", // Keeps the height stable
            }}
            lineNumberStyle={{ minWidth: "3em", textAlign: "right", paddingRight: "1em", color: "#4B5563" }}
          >
            {displayedText}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default CodeBlocks;

