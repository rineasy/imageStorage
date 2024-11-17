import React from "react";
import LogoutButton from "./logout";

const Navbar = () => {
  return (
    <div className="navbar bg-base-300 fixed top-0">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">Shimage Cloud</a>
      </div>
      <div className="flex-none gap-2">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://cdn.kessoku.live/shimagecloud.jpg"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-32 p-2 shadow"
          >
            <li>
              <a className="bg-base-300"><LogoutButton /></a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
