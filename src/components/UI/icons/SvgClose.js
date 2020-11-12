import React from "react";

function SvgClose(props) {
  const {color = "#fff"} = props
  return (
    <svg width={28} height={27} fill="none"  {...props}>
      <path
        fill="currentColor"
        stroke={'currentColor'}
        strokeWidth={5}
        d="M1.939 25.939l24-24M2.061 1.939l24 24"
      />
    </svg>
  );
}

export default SvgClose;