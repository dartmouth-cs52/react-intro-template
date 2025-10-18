describe('Frontend Starterpack Tests', () => {
  beforeEach(() => {
    // Clear localStorage before each test to ensure clean state
    cy.clearLocalStorage();
    cy.visit('/');
  });

  describe('Basic Page Loading', () => {
    it('should load the page successfully', () => {
      cy.visit('/');
      cy.get('#main').should('exist');
    });

    it('should have the correct page title', () => {
      cy.title().should('eq', 'starter pack');
    });

    it('should load with navigation menu', () => {
      cy.get('nav').should('exist');
      cy.get('nav ul').should('exist');
    });
  });

  describe('Navigation Tests', () => {
    it('should navigate to Home page', () => {
      cy.contains('a', 'Home').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/');
      cy.contains('Welcome').should('be.visible');
    });

    it('should navigate to About page', () => {
      cy.contains('a', 'About').click();
      cy.url().should('include', '/about');
      cy.contains('All there is to know about me').should('be.visible');
    });

    it('should navigate to test id1 page', () => {
      cy.contains('a', 'test id1').click();
      cy.url().should('include', '/test/id1');
      cy.contains('ID:').should('be.visible');
      cy.contains('id1').should('be.visible');
    });

    it('should navigate to test id2 page', () => {
      cy.contains('a', 'test id2').click();
      cy.url().should('include', '/test/id2');
      cy.contains('ID:').should('be.visible');
      cy.contains('id2').should('be.visible');
    });

    it('should show fallback for non-existent routes', () => {
      cy.visit('/nonexistent');
      cy.contains('URL Not Found').should('be.visible');
    });
  });

  describe('Counter Functionality', () => {
    beforeEach(() => {
      cy.visit('/');
    });

    it('should display the counter component', () => {
      cy.contains('Current Count:').should('be.visible');
    });

    it('should start with count of 0', () => {
      cy.contains('Current Count: 0').should('be.visible');
    });

    it('should increment counter when + button is clicked', () => {
      cy.contains('Current Count: 0').should('be.visible');
      cy.contains('button', '+').click();
      cy.contains('Current Count: 1').should('be.visible');
    });

    it('should decrement counter when - button is clicked', () => {
      cy.contains('Current Count: 0').should('be.visible');
      cy.contains('button', '-').click();
      cy.contains('Current Count: -1').should('be.visible');
    });

    it('should handle multiple increments', () => {
      cy.contains('button', '+').click();
      cy.contains('button', '+').click();
      cy.contains('button', '+').click();
      cy.contains('Current Count: 3').should('be.visible');
    });

    it('should handle multiple decrements', () => {
      cy.contains('button', '-').click();
      cy.contains('button', '-').click();
      cy.contains('Current Count: -2').should('be.visible');
    });

    it('should handle mixed increment and decrement operations', () => {
      cy.contains('button', '+').click();
      cy.contains('button', '+').click();
      cy.contains('button', '+').click();
      cy.contains('Current Count: 3').should('be.visible');
      cy.contains('button', '-').click();
      cy.contains('Current Count: 2').should('be.visible');
      cy.contains('button', '-').click();
      cy.contains('button', '-').click();
      cy.contains('Current Count: 0').should('be.visible');
    });
  });

  describe('State Persistence (Zustand Persist)', () => {
    it('should persist counter state after page reload', () => {
      cy.visit('/');
      cy.contains('button', '+').click();
      cy.contains('button', '+').click();
      cy.contains('button', '+').click();
      cy.contains('Current Count: 3').should('be.visible');

      // Reload the page
      cy.reload();

      // Counter should still be at 3
      cy.contains('Current Count: 3').should('be.visible');
    });

    it('should persist counter state across navigation', () => {
      cy.visit('/');
      cy.contains('button', '+').click();
      cy.contains('button', '+').click();
      cy.contains('Current Count: 2').should('be.visible');

      // Navigate to About page
      cy.contains('a', 'About').click();
      cy.url().should('include', '/about');

      // Navigate back to Home
      cy.contains('a', 'Home').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/');

      // Counter should still be at 2
      cy.contains('Current Count: 2').should('be.visible');
    });
  });

  describe('React Router Integration', () => {
    it('should have working NavLink components with active states', () => {
      cy.get('nav a[href="/"]').should('exist');
      cy.get('nav a[href="/about"]').should('exist');
    });

    it('should handle URL parameters correctly', () => {
      cy.visit('/test/custom-id');
      cy.contains('ID:').should('be.visible');
      cy.contains('custom-id').should('be.visible');
    });

    it('should maintain navigation structure across all pages', () => {
      cy.visit('/about');
      cy.get('nav').should('exist');
      cy.get('nav ul li').should('have.length', 4);
    });
  });

  describe('Component Rendering', () => {
    it('should render Counter component on home page', () => {
      cy.visit('/');
      cy.contains('Current Count:').should('be.visible');
    });

    it('should render Controls component on home page', () => {
      cy.visit('/');
      cy.get('button').should('have.length', 2);
      cy.contains('button', '+').should('be.visible');
      cy.contains('button', '-').should('be.visible');
    });

    it('should not render Counter on About page', () => {
      cy.visit('/about');
      cy.contains('Current Count:').should('not.exist');
    });
  });

  describe('Styling and Assets', () => {
    it('should have loaded the stylesheet', () => {
      cy.visit('/');
      cy.get('body').should('have.css', 'font-family').and('include', 'Roboto');
    });

    it('should have logo div element', () => {
      cy.get('.logo').should('exist');
    });
  });

  describe('Vite Build Verification', () => {
    it('should load JavaScript modules correctly', () => {
      cy.visit('/');
      // If React loaded, the app will render
      cy.get('#main').should('not.contain', 'Loading');
    });

    it('should have React application running', () => {
      cy.visit('/');
      cy.get('#main').children().should('have.length.greaterThan', 0);
    });
  });

  describe('Button Interaction and Accessibility', () => {
    it('should have properly typed buttons', () => {
      cy.visit('/');
      cy.get('button[type="button"]').should('have.length', 2);
    });

    it('should be clickable and responsive', () => {
      cy.visit('/');
      cy.contains('button', '+').should('be.enabled').click();
      cy.contains('button', '-').should('be.enabled').click();
    });
  });

  describe('Error Handling', () => {
    it('should handle rapid button clicks', () => {
      cy.visit('/');
      // Rapidly click increment button
      cy.contains('button', '+').click().click().click().click().click();
      cy.contains('Current Count: 5').should('be.visible');
    });

    it('should handle navigation to invalid routes gracefully', () => {
      cy.visit('/this/route/does/not/exist', { failOnStatusCode: false });
      cy.contains('URL Not Found').should('be.visible');
    });
  });
});
