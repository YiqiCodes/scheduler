import React from "react";
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header.js";
import Show from "components/Appointment/Show.js";
import Empty from "components/Appointment/Empty.js";
import useVisualMode from "../../hooks/useVisualMode.js";
import Form from "components/Appointment/Form.js";
import Status from "components/Appointment/Status.js";
import Confirm from "components/Appointment/Confirm.js";
import Error from "components/Appointment/Error.js";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR = "ERROR";

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props
      .bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(error => transition(ERROR, true));
  }

  function cancel() {
    transition(DELETING, true);
    props
      .cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(error => transition(ERROR, true));
  }

  return (
    <article className="appointment" data-testid="appointment">
      <h4 className="text--semi-bold">{props.time}</h4>
      <section>
        {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
        {mode === CREATE && (
          <Form
            interviewers={props.interviewers}
            onSave={save}
            onCancel={() => back()}
          />
        )}
        {mode === SHOW && (
          <Show
            student={props.interview.student}
            interviewer={props.interview.interviewer}
            onDelete={() => transition(CONFIRM)}
            onEdit={() => transition(EDIT)}
          />
        )}
        {mode === SAVING && <Status message={"saving..."} />}
        {mode === DELETING && <Status message={"deleting..."} />}
        {mode === CONFIRM && (
          <Confirm
            message={"Warning, this action is permanent - please confirm"}
            onConfirm={cancel}
            onCancel={() => back()}
          />
        )}
        {mode === EDIT && (
          <Form
            interviewers={props.interviewers}
            onSave={save}
            onCancel={() => back()}
            name={props.interview.student}
            interviewer={props.interview.interviewer.id}
          />
        )}
        {mode === ERROR && <Error message={"Error"} onClose={() => back()} />}
      </section>
    </article>
  );
}
