import React from "react";

import "components/DayListItem.scss";

let classNames = require("classnames");

export default function DayListItem(props) {
  function formatSpots(propSpots) {
    let output = "";
    if (propSpots === 0) {
      output = "no spots remaining";
    } else if (propSpots === 1) {
      output = `${propSpots} spot remaining`;
    } else {
      output = `${propSpots} spots remaining`;
    }
    return output;
  }

  const dayClass = classNames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": props.spots === 0
  });

  return (
    <li
      className={dayClass}
      data-testid="day"
      onClick={() => props.setDay(props.name)}
    >
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{formatSpots(props.spots)}</h3>
    </li>
  );
}
