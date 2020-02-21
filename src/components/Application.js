import React, { useState, useEffect } from "react";
import axios from "axios";
import "components/Application.scss";
import DayList from "components/DayList";
import Appointment from "components/Appointment";

const {
  getAppointmentsForDay,
  getInterviewersForDay,
  getInterview
} = require("../helpers/selectors");

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios
      .put(`http://localhost:8001/api/appointments/${id}`, appointment)
      .then(() =>
        setState({
          ...state,
          appointments
        })
      );
  }

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios
      .delete(`http://localhost:8001/api/appointments/${id}`, appointment)
      .then(() =>
        setState({
          ...state,
          appointments
        })
      );
  }

  const appointmentInList = getAppointmentsForDay(state, state.day).map(
    appointment => {
      const interview = getInterview(state, appointment.interview);
      const interviewers = getInterviewersForDay(state, state.day);

      return (
        <Appointment
          {...appointment}
          key={appointment.id}
          interview={interview}
          interviewers={interviewers}
          bookInterview={bookInterview}
          cancelInterview={cancelInterview}
        />
      );
    }
  );

  useEffect(() => {
    if (state.days.length === 0) {
      Promise.all([
        axios.get(`http://localhost:8001/api/days`),
        axios.get(`http://localhost:8001/api/appointments`),
        axios.get(`http://localhost:8001/api/interviewers`)
      ]).then(all => {
        setState(prev => ({
          ...state,
          days: all[0].data,
          appointments: all[1].data,
          interviewers: all[2].data
        }));
      });
    }
  });

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day={state.day}
            setDay={day => setState({ ...state, day: day })}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {appointmentInList}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
