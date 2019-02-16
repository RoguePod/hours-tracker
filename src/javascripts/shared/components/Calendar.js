import Button from "./Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "javascripts/prop-types";
import React from "react";
import _times from "lodash/times";
import cx from "classnames";
import moment from "moment-timezone";

const Calendar = ({ onChange, value }) => {
  const [viewDate, setViewDate] = React.useState(
    (moment(value).isValid() ? moment(value) : moment()).startOf("month")
  );

  const _handlePreviousMonth = () => {
    setViewDate(moment(viewDate).subtract(1, "months"));
  };

  const _handleNextMonth = () => {
    setViewDate(moment(viewDate).add(1, "months"));
  };

  const _handleMonthChange = event => {
    setViewDate(moment(viewDate).month(Number(event.target.value) - 1));
  };

  const _handleYearChange = event => {
    setViewDate(moment(viewDate).year(Number(event.target.value)));
  };

  const _handleDayChange = day => onChange(day);

  const selectedDate = moment(value).isValid()
    ? moment(value).startOf("day")
    : null;

  const startDate = moment(viewDate)
    .startOf("month")
    .day(0);
  const endDate = moment(viewDate)
    .endOf("month")
    .day(6);

  const rows = [];

  let week = -1;
  while (startDate.isBefore(endDate)) {
    const day = moment(startDate);
    const dow = day.day();

    if (dow === 0) {
      week++;
    }

    if (!rows[week]) {
      rows.push([]);
    }

    const dayClasses = cx(
      "py-2 flex-1 text-center hover:bg-blue hover:text-white cursor-pointer",
      "text-sm",
      {
        "bg-blue-lighter text-blue":
          day.format("YYYY-MM-DD") === moment().format("YYYY-MM-DD") &&
          day.format("YYYY-MM-DD") !== selectedDate?.format("YYYY-MM-DD"),
        "border-l": dow !== 0,
        "border-t": week !== 0,
        "text-grey-dark": day.format("MM") !== viewDate.format("MM"),
        "bg-blue text-white":
          day.format("YYYY-MM-DD") === selectedDate?.format("YYYY-MM-DD")
      }
    );

    rows[week][dow] = (
      <div
        className={dayClasses}
        key={`${week}-${dow}`}
        onClick={() => _handleDayChange(moment(day))}
        role="button"
        tabIndex="-1"
      >
        {day.format("DD")}
      </div>
    );

    startDate.add(1, "days");
  }

  const weeks = rows.map((days, week) => {
    return (
      <div className="flex flex-no-wrap" key={week}>
        {days}
      </div>
    );
  });

  const dowClasses = "flex-1 py-1 text-xs";

  const selectClasses =
    "block bg-blue text-white appearance-none outline-none py-2 pr-8 " +
    "cursor-pointer";

  const arrowClasses =
    "pointer-events-none absolute pin-y pin-r flex items-center px-4 " +
    "text-white";

  const currentYear = moment().year() - 20;
  const yearOptions = [];

  _times(40, year => {
    const value = year + currentYear;
    yearOptions.push(
      <option key={value} value={value}>
        {value}
      </option>
    );
  });

  const headerClasses =
    "flex-1 py-2 text-center flex justify-center items-center";

  const buttonClasses = "text-sm mx-1 mb-2 py-1 px-2";

  const lastMonday = moment()
    .day(1)
    .startOf("day");

  const today = moment().startOf("day");

  const nextSunday = moment()
    .add(1, "weeks")
    .day(0)
    .startOf("day");

  return (
    <>
      <div className="bg-blue text-white">
        <div className="flex">
          <div
            className="lg:pl-4 p-2 cursor-pointer"
            onClick={_handlePreviousMonth}
            role="button"
            tabIndex="-1"
          >
            <FontAwesomeIcon icon="caret-left" size="2x" />
          </div>
          <div className={headerClasses}>
            <div className="relative">
              <select
                className={selectClasses}
                onChange={_handleMonthChange}
                value={viewDate.format("MM")}
              >
                <option value="01">{"January"}</option>
                <option value="02">{"February"}</option>
                <option value="03">{"March"}</option>
                <option value="04">{"April"}</option>
                <option value="05">{"May"}</option>
                <option value="06">{"June"}</option>
                <option value="07">{"July"}</option>
                <option value="08">{"August"}</option>
                <option value="09">{"September"}</option>
                <option value="10">{"October"}</option>
                <option value="11">{"November"}</option>
                <option value="12">{"December"}</option>
              </select>
              <div className={arrowClasses}>
                <FontAwesomeIcon icon="caret-down" />
              </div>
            </div>
            <div className="relative">
              <select
                className={selectClasses}
                onChange={_handleYearChange}
                value={viewDate.format("YYYY")}
              >
                {yearOptions}
              </select>
              <div className={arrowClasses}>
                <FontAwesomeIcon icon="caret-down" />
              </div>
            </div>
          </div>
          <div
            className="py-2 px-4 cursor-pointer"
            onClick={_handleNextMonth}
            role="button"
            tabIndex="-1"
          >
            <FontAwesomeIcon icon="caret-right" size="2x" />
          </div>
        </div>
        <div className="flex flex-wrap justify-center items-center">
          <Button
            className={buttonClasses}
            color="white"
            onClick={() => onChange(lastMonday)}
            textColor="blue"
          >
            {"Start of Week"}
            <br />
            {lastMonday.format("MM/DD")}
          </Button>
          <Button
            className={buttonClasses}
            color="white"
            onClick={() => onChange(moment().startOf("day"))}
            textColor="blue"
          >
            {"Today"}
            <br />
            {today.format("MM/DD")}
          </Button>
          <Button
            className={buttonClasses}
            color="white"
            onClick={() => onChange(nextSunday)}
            textColor="blue"
          >
            {"End of Week"}
            <br />
            {nextSunday.format("MM/DD")}
          </Button>
        </div>
        <div className="flex text-center">
          <div className={dowClasses}>{"Sun"}</div>
          <div className={dowClasses}>{"Mon"}</div>
          <div className={dowClasses}>{"Tue"}</div>
          <div className={dowClasses}>{"Wed"}</div>
          <div className={dowClasses}>{"Thu"}</div>
          <div className={dowClasses}>{"Fri"}</div>
          <div className={dowClasses}>{"Sat"}</div>
        </div>
      </div>
      {weeks}
    </>
  );
};

Calendar.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string
};

Calendar.defaultProps = {
  value: null
};

export default Calendar;
