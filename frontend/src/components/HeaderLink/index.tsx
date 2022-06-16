import React, { FC } from "react";
import { Link } from "react-router-dom";

interface HeaderLinkProps {
  text: string;
  to: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

const HeaderLink: FC<HeaderLinkProps> = ({ text, to, onClick }) => {
  return (
    <li className="nav-item">
      <Link
        to={to}
        onClick={onClick}
        className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
      >
        {text}
      </Link>
    </li>
  );
};

export default HeaderLink;
