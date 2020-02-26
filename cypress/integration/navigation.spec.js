describe("Navigation", () => {
  it("should visit root", () => {
    cy.visit("/");
  });
  it("should nagivate to tuesday", () => {
    cy.contains("[data-cy=day]", "Tuesday")
      .click()
      .should("have.class", "day-list__item--selected");
    // .should("have.css", "background-color", "rgb(242, 242, 242)");
  });
});
