export function getAppointmentsForDay(state, day) {
  let appointments = [];
  let stateDays = state.days;

  stateDays.forEach(element => {
    if (element.name === day) {
      for (let i = 0; i < element.appointments.length; i++)
        appointments.push(state.appointments[element.appointments[i]]);
    }
  });

  return appointments;
}

export function getInterview(state, interview) {
  if (interview === null) {
    return null;
  }

  const results = {
    student: interview.student,
    interviewer: state.interviewers[interview.interviewer]
  };

  return results;
}

export function getInterviewersForDay(state, interview) {
  let interviewersArray = [];
  let stateDays = state.days;

  stateDays.forEach(element => {
    if (element.name === interview) {
      for (let i = 0; i < element.interviewers.length; i++)
        interviewersArray.push(state.interviewers[element.interviewers[i]]);
    }
  });

  return interviewersArray;
}
