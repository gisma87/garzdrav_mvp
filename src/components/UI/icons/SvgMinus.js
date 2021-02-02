import * as React from "react";

function SvgMinus(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 384 512"
      className="minus_svg__svg-inline--fa minus_svg__fa-minus minus_svg__fa-w-12 minus_svg__fa-9x"
      width="1em"
      height="1em"
      {...props}
    >
      <path
        fill="currentColor"
        d="M368 224H16c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h352c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16z"
      />
    </svg>
  );
}

export default SvgMinus;