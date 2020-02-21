import React, { useState, useEffect, useReducer } from "react";
import axios from "axios";

export default function useApplicationData(props) {
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  const setDay = day => dispatch({ type: SET_DAY, day });

  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return {
          ...state,
          day: action.day
        };
      case SET_APPLICATION_DATA:
        return {
          ...state,
          days: action.days,
          appointments: action.appointments,
          interviewers: action.interviewers
        };
      case SET_INTERVIEW: {
        return {
          ...state,
          appointments: action.appointments,
          days: action.tempDays
        };
      }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    const tempDays = [...state.days];
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

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const tempDays = [...state.days];
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
      .delete(`http://localhost:8001/api/appointments/${id}`, appointment)
      .then(() =>
        dispatch({
          type: SET_INTERVIEW,
          appointments,
          tempDays
        })
      );
  }

  useEffect(() => {
    if (state.days.length === 0) {
      Promise.all([
        axios.get(`http://localhost:8001/api/days`),
        axios.get(`http://localhost:8001/api/appointments`),
        axios.get(`http://localhost:8001/api/interviewers`)
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
