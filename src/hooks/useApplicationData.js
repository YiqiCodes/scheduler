import React, { useState, useEffect, useReducer } from "react";
import axios from "axios";

import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from "reducers/application";

export default function useApplicationData(props) {
  // original rendered state
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  const setDay = day => dispatch({ type: SET_DAY, day });

  // dispatch and update appointment/days/type when user books interview
  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    // const tempDays = [...state.days];
    const tempDays = JSON.parse(JSON.stringify(state.days));
    for (let day in tempDays) {
      if (tempDays[day].appointments.includes(id)) {
        tempDays[day].spots--;
        break;
      }
    }

    return axios
      .put(`http://localhost:8001/api/appointments/${id}`, appointment)
      .then(() =>
        dispatch({
          type: SET_INTERVIEW,
          appointments,
          tempDays
        })
      );
  }
  // dispatch and update appointment/days/type when user deletes interview
  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    // const tempDays = [...state.days];
    const tempDays = JSON.parse(JSON.stringify(state.days));
    for (let day in tempDays) {
      if (tempDays[day].appointments.includes(id)) {
        tempDays[day].spots++;
        break;
      }
    }

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios
      .delete(`http://localhost:8001/api/appointments/${id}`)
      .then(() =>
        dispatch({
          type: SET_INTERVIEW,
          appointments,
          tempDays
        })
      );
  }
  // axios calls to connect database
  useEffect(() => {
    if (state.days.length === 0) {
      Promise.all([
        axios.get(`api/days`),
        axios.get(`api/appointments`),
        axios.get(`api/interviewers`)
      ]).then(all => {
        dispatch({
          type: SET_APPLICATION_DATA,
          days: all[0].data,
          appointments: all[1].data,
          interviewers: all[2].data
        });
      });
    }
  });
  return { state, setDay, bookInterview, cancelInterview };
}
