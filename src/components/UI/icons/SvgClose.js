import React from "react";

function SvgClose(props) {
  return (
    <svg
      aria-hidden="true"
      data-prefix="far"
      data-icon="times"
      viewBox="0 0 320 512"
      className="svgClose_svg__svg-inline--fa svgClose_svg__fa-times svgClose_svg__fa-w-10 svgClose_svg__fa-9x"
      width="1em"
      height="1em"
      {...props}
    >
      <path
        // stroke='currentColor'
        fill="currentColor"
        d="M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34 0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4 256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34 0-22.58L207.6 256z"
      />
    </svg>
  );
}

export default SvgClose;