export const setChosenPlan = (chosenPlan: {}) => {
  if (typeof window !== "undefined") {
    // Perform localStorage action
    localStorage.setItem("chosenPlan", JSON.stringify(chosenPlan));
  }
};

export const getChosenPlan = () => {
  if (typeof window !== "undefined") {
    // Perform localStorage action

    return JSON.parse(localStorage.getItem("chosenPlan") || "");
  }
};
