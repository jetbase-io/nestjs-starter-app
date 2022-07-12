export const setChosenPlan = (chosenPlan: {}) => {
  localStorage.setItem("chosenPlan", JSON.stringify(chosenPlan));
};

export const getChosenPlan = () => {
  return JSON.parse(localStorage.getItem("chosenPlan") || "");
};
