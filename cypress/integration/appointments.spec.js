describe("Appointments", () => {
  beforeEach(() => {
    cy.request("GET", "localhost:8001/api/debug/reset");
    cy.visit("/");
    cy.contains("Monday");
  });

  it("should book an interview", () => {
    cy.get("[alt=Add]")
      .first()
      .click();

    cy.get("[data-testid=student-name-input]").type("Kanye West");

    cy.get("[alt='Sylvia Palmer']").click();

    cy.contains("Save").click();

    cy.contains(".appointment__card--show", "Sylvia Palmer");
    cy.contains(".appointment__card--show", "Kanye West");
  });

  it("should edit an interview", () => {
    cy.get("[alt=Edit]")
      .first()
      .click({ force: true });

    cy.get("[data-testid=student-name-input]")
      .clear()
      .type("Steve Jobs");

    cy.get("[alt='Tori Malcolm']").click();

    cy.contains("Save").click();

    cy.contains(".appointment__card--show", "Tori Malcolm");
    cy.contains(".appointment__card--show", "Steve Jobs");
  });

  it("should cancel an interview", () => {
    cy.get("[alt=Delete]").click({ force: true });

    cy.contains("Confirm").click();

    cy.contains("deleting...").should("exist");
    cy.contains("deleting...").should("not.exist");

    cy.contains(".appointment__card--show", "Archie Cohen").should("not.exist");
  });
});
