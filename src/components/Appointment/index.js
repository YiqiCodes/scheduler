import React from "react";
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header.js";
import Show from "components/Appointment/Show.js";
import Empty from "components/Appointment/Empty.js";
import useVisualMode from "../../hooks/useVisualMode.js";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  return (
    <header className="appointment">
      <h4 className="text--semi-bold">{props.time}</h4>
      <section>
        {mode === EMPTY && <Empty onAdd={props.onAdd} />}
        {mode === SHOW && (
          <Show
            student={props.interview.student}
            interviewer={props.interview.interviewer}
          />
        )}
        {/* {props.interview ? (
          <Show
            interviewer={props.interview.interviewer.name}
            student={props.interview.student}
          />
        ) : (
          <Empty />
        )} */}
      </section>
    </header>
  );
}
