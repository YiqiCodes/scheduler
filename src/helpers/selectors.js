export function getAppointmentsForDay(state, day) {
  let result = [];
  let stateDays = state.days;

  stateDays.forEach(element => {
    if (element.name === day) {
      for (let i = 0; i < element.appointments.length; i++)
        result.push(state.appointments[element.appointments[i]]);
    }
  });

  return result;
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
