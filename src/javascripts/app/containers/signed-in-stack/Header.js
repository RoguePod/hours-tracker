import { Clock } from "javascripts/shared/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HEADER_HEIGHT } from "javascripts/globals";
import { Link } from "react-router-dom";
import PropTypes from "javascripts/prop-types";
import React from "react";
import Tab from "./Tab";
import styled from "styled-components";

const Header = styled.header`
  height: ${HEADER_HEIGHT};
`;

class SignedInHeader extends React.Component {
  static propTypes = {
    location: PropTypes.routerLocation.isRequired,
    running: PropTypes.entry,
    user: PropTypes.user.isRequired,
    width: PropTypes.number.isRequired
  };

  static defaultProps = {
    running: null
  };

  shouldComponentUpdate(nextProps) {
    const { location, running, user, width } = this.props;

    return (
      location.pathname !== nextProps.location.pathname ||
      location.hash !== nextProps.location.hash ||
      Boolean(running) !== Boolean(nextProps.running) ||
      user.name !== nextProps.user.name ||
      width !== nextProps.width
    );
  }

  render() {
    const { location, running, user } = this.props;
    const { hash, pathname } = location;

    const headerClasses =
      "fixed pin-t pin-x px-4 bg-blue text-white overflow-hidden z-10";

    const menuHash = hash.match(/sidebar/u) ? "" : "sidebar";
    const logoHash = hash.match(/stopwatch/u) ? "" : "stopwatch";

    const barClasses =
      "flex justify-center rounded py-1 px-2 hover:bg-blue-light";

    return (
      <Header className={headerClasses}>
        <div className="flex items-center h-full">
          <div className="flex-1 flex items-center">
            <div className="pr-2 hidden lg:flex">
              <Clock animate={false} size="40px" />
            </div>
            <Link
              className="mr-2 md:hidden flex hover:bg-blue-light rounded"
              to={{ ...location, hash: logoHash, replace: true }}
            >
              <Clock animate={Boolean(running)} size="40px" />
            </Link>
            <Link className="text-xl" to="/">
              {"Hours Tracker"}
            </Link>
          </div>
          <ul className="list-reset items-center hidden md:flex">
            <li className="mr-3 lg:mr-6 uppercase text-sm">{user.name}</li>

            <li className="mr-2 lg:mr-4">
              <Tab selected={pathname === "/" || pathname.length === 0} to="/">
                {"Home"}
              </Tab>
            </li>
            <li className="mr-2 lg:mr-4">
              <Tab selected={pathname.startsWith("/entries")} to="/entries">
                {"Entries"}
              </Tab>
            </li>
            <li className="mr-2 lg:mr-4">
              <Tab selected={pathname.startsWith("/clients")} to="/clients">
                {"Clients/Projects"}
              </Tab>
            </li>
            <li className="mr-2 lg:mr-4">
              <Tab selected={pathname.startsWith("/profile")} to="/profile">
                {"Profile"}
              </Tab>
            </li>
            <li>
              <Tab to="/sign-out">{"Sign Out"}</Tab>
            </li>
          </ul>
          <ul className="list-reset flex items-center md:hidden">
            <li>
              <Link
                className={barClasses}
                to={{ ...location, hash: menuHash, replace: true }}
              >
                <FontAwesomeIcon icon="bars" size="2x" />
              </Link>
            </li>
          </ul>
        </div>
      </Header>
    );
  }
}

export default SignedInHeader;
