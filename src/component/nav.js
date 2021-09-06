import React, { useState, useEffect } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { nav_list } from "../api/nav";

const Nav = () => {
  const [navActive, setNavActive] = useState(true);
  const [page, setPage] = useState("");
  const [building, setBuilding] = useState([]);
  const [villa, setVilla] = useState([]);

  useEffect(() => {
    auth();
    set_nav();
  }, []);

  const history = useHistory();

  const auth = () => {
    if (localStorage.usertoken) {
      const token = localStorage.usertoken;
      const decoded = jwt_decode(token);

      if (decoded.exp < (new Date().getTime() + 1) / 1000) {
        localStorage.removeItem("usertoken");
        return <Redirect to="/" />;
      }
    } else {
      return <Redirect to="/" />;
    }
  };

  const logout = () => {
    localStorage.removeItem("usertoken");
    localStorage.removeItem("technician");
    history.push("/");
  };

  const open_nav = (page_nav) => {
    setPage(page_nav);
  };

  const set_nav = () => {
    nav_list(1).then((res) => {
      setBuilding(res);
    });

    nav_list(2).then((res) => {
      setVilla(res);
    });
  };

  return (
    <nav className={navActive ? "nav-container " : "nav-container active-nav"}>
      <div className="text-end nav-btn">
        <i
          className={
            navActive
              ? "fas fa-arrow-right mt-3 me-3"
              : "fas fa-arrow-right mt-3 me-3 d-none"
          }
          onClick={() => setNavActive(false)}
        ></i>
        <i
          className={
            !navActive
              ? "fas fa-arrow-left mt-3 me-3"
              : "fas fa-arrow-left mt-3 me-3 d-none"
          }
          onClick={() => setNavActive(true)}
        ></i>
      </div>
      <div className="navigation">AC Control</div>
      <ul className="in menu">
        <li>
          <a
            href={"#id_1"}
            data-bs-toggle="collapse"
            className={page === "1" ? "parent active" : "parent collapsed"}
          >
            <span className="ms-3">Building</span>
          </a>
          <ul
            id={"id_1"}
            className={page === "1" ? "collapse show" : "collapse"}
            onClick={() => open_nav("1")}
          >
            {building.length ? (
              <li>
                <Link
                  to={{
                    pathname: "/control",
                    state: { group: 1 },
                  }}
                  onClick={() =>
                    setTimeout(() => {
                      window.location.reload();
                    }, 0)
                  }
                >
                  Overall
                </Link>
              </li>
            ) : null}
            {building.length
              ? building.map((item, key) => (
                  <li key={key}>
                    <Link
                      to={{
                        pathname: "/building",
                        state: { id: item.building_group_id },
                      }}
                      onClick={() =>
                        setTimeout(() => {
                          window.location.reload();
                        }, 0)
                      }
                    >
                      {item.group_name}
                    </Link>
                  </li>
                ))
              : null}
          </ul>
          <a
            href={"#id_2"}
            data-bs-toggle="collapse"
            className={page === "2" ? "parent active" : "parent collapsed"}
          >
            <span className="ms-3">Villa</span>
          </a>
          <ul
            id={"id_2"}
            className={page === "2" ? "collapse show" : "collapse"}
            onClick={() => open_nav("2")}
          >
            {villa.length ? (
              <li>
                <Link
                  to={{
                    pathname: "/control",
                    state: { group: 2 },
                  }}
                  onClick={() =>
                    setTimeout(() => {
                      window.location.reload();
                    }, 0)
                  }
                >
                  Overall
                </Link>
              </li>
            ) : null}
            {villa
              ? villa.map((item, key) => (
                  <li key={key}>
                    <Link
                      to={{
                        pathname: "/building",
                        state: { id: item.building_group_id },
                      }}
                      onClick={() =>
                        setTimeout(() => {
                          window.location.reload();
                        }, 0)
                      }
                    >
                      {item.group_name}
                    </Link>
                  </li>
                ))
              : null}
          </ul>
        </li>
      </ul>
      <div
        className={localStorage.technician === "true" ? "d-none" : "navigation"}
      >
        Setting
      </div>
      <ul className={localStorage.technician === "true" ? "d-none" : "in menu"}>
        <li>
          <Link
            to={{
              pathname: "/gateway",
            }}
          >
            <span className="ms-3">Gateway Management</span>
          </Link>
        </li>
        <li>
          <Link
            to={{
              pathname: "/group_management",
            }}
          >
            <span className="ms-3">Group Management</span>
          </Link>
        </li>
        <li>
          <Link
            to={{
              pathname: "/building_management",
            }}
          >
            <span className="ms-3">Building Management</span>
          </Link>
        </li>
        <li>
          <Link
            to={{
              pathname: "/plan_management",
            }}
          >
            <span className="ms-3">Plan Management</span>
          </Link>
        </li>
        <li>
          <Link
            to={{
              pathname: "/ac_management",
            }}
          >
            <span className="ms-3">AC Management</span>
          </Link>
        </li>
        <li>
          <a
            href={"#ac_management"}
            data-bs-toggle="collapse"
            className={
              page === "position" ? "parent active" : "parent collapsed"
            }
          >
            <span className="ms-3">AC Position Management </span>
          </a>
          <ul id="ac_management" className="collapse">
            <li>
              <Link
                to={{
                  pathname: "/ac_position",
                  state: { group: 1 },
                }}
                onClick={() =>
                  setTimeout(() => {
                    window.location.reload();
                  }, 0)
                }
              >
                Building
              </Link>
            </li>
            <li>
              <Link
                to={{
                  pathname: "/ac_position",
                  state: { group: 2 },
                }}
                onClick={() =>
                  setTimeout(() => {
                    window.location.reload();
                  }, 0)
                }
              >
                Villa
              </Link>
            </li>
          </ul>
        </li>
      </ul>
      <div
        className={localStorage.technician === "true" ? "d-none" : "navigation"}
      >
        Schedule
      </div>
      <ul className={localStorage.technician === "true" ? "d-none" : "in menu"}>
        <li>
          <Link to="/schedule">
            <span className="ms-3">Schedule List</span>
          </Link>
        </li>
      </ul>
      <div
        className={localStorage.technician === "true" ? "d-none" : "navigation"}
      >
        Report
      </div>
      <ul className={localStorage.technician === "true" ? "d-none" : "in menu"}>
        <li>
          <a
            href={"#report_1"}
            data-bs-toggle="collapse"
            className={
              page === "position" ? "parent active" : "parent collapsed"
            }
          >
            <span className="ms-3">Building </span>
          </a>
          <ul id="report_1" className="collapse">
            {building.length ? (
              <li>
                <Link
                  to={{
                    pathname: "/report",
                    state: { group: "building", id: 0 },
                  }}
                  onClick={() =>
                    setTimeout(() => {
                      window.location.reload();
                    }, 0)
                  }
                >
                  Overall
                </Link>
              </li>
            ) : null}
            {building.length
              ? building.map((item, key) => (
                  <li key={key}>
                    <Link
                      to={{
                        pathname: "/report",
                        state: {
                          group: "building",
                          id: item.building_group_id,
                        },
                      }}
                      onClick={() =>
                        setTimeout(() => {
                          window.location.reload();
                        }, 0)
                      }
                    >
                      {item.group_name}
                    </Link>
                  </li>
                ))
              : null}
          </ul>
        </li>
        <li>
          <a
            href={"#report_2"}
            data-bs-toggle="collapse"
            className={
              page === "position" ? "parent active" : "parent collapsed"
            }
          >
            <span className="ms-3">Villa </span>
          </a>
          <ul id="report_2" className="collapse">
            {villa.length ? (
              <li>
                <Link
                  to={{
                    pathname: "/report",
                    state: { group: "villa", id: 0 },
                  }}
                  onClick={() =>
                    setTimeout(() => {
                      window.location.reload();
                    }, 0)
                  }
                >
                  Overall
                </Link>
              </li>
            ) : null}
            {villa
              ? villa.map((item, key) => (
                  <li key={key}>
                    <Link
                      to={{
                        pathname: "/report",
                        state: { group: "villa", id: item.building_group_id },
                      }}
                      onClick={() =>
                        setTimeout(() => {
                          window.location.reload();
                        }, 0)
                      }
                    >
                      {item.group_name}
                    </Link>
                  </li>
                ))
              : null}
          </ul>
        </li>
      </ul>
      {/* <div className="navigation">Maintenance</div>
      <ul className="in menu">
        <li>
          <Link to="/maintenance_indoor">
            <span className="ms-3">Maintenance Indoor</span>
          </Link>
        </li>
        <li>
          <Link to="/maintenance_outdoor">
            <span className="ms-3">Maintenance Outdoor</span>
          </Link>
        </li>
      </ul> */}
      <ul className="in menu"></ul>
      <div className="logout pointer" onClick={() => logout()}>
        Logout
      </div>
    </nav>
  );
};

export default Nav;
