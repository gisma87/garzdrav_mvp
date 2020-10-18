import React from "react";

function SvgClose(props) {
  return (
    <svg width={28} height={27} fill="none" {...props}>
      <path
        stroke="#fff"
        strokeWidth={3}
        d="M1.939 25.939l24-24M2.061 1.939l24 24"
      />
    </svg>
  );
}

export default SvgClose;