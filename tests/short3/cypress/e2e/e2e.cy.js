const makeVideo = (id, title) => ({
  id: { kind: 'youtube#video', videoId: id },
  snippet: {
    title,
    description: `${title} description`,
    thumbnails: {
      default: { url: `https://img.youtube.com/vi/${id}/default.jpg` },
    },
  },
});

const defaultVideos = [
  makeVideo('spooked', 'Spooked And Confused'),
  makeVideo('daywalk', 'Day Walking Adventures'),
];

const jazzVideos = [
  makeVideo('smooth', 'Smooth Jazz Vibes'),
  makeVideo('late', 'Late Night Sax Sessions'),
];

describe('Testing for React Intro Lab', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/youtube/v3/search**', (req) => {
      const term = `${req.query?.q || ''}`.toLowerCase();
      if (term.includes('jazz')) {
        req.reply({ statusCode: 200, body: { items: jazzVideos } });
        return;
      }

      req.reply({ statusCode: 200, body: { items: defaultVideos } });
    }).as('youtubeSearch');

    cy.visit('/');
    cy.wait('@youtubeSearch');
  });

  it('updates video list and detail when searching for a new topic', () => {
    cy.get('input').clear().type('jazz vibes{enter}');
    cy.wait('@youtubeSearch');

    cy.get('#video-list > li')
      .should('have.length', jazzVideos.length)
      .first()
      .should('contain.text', jazzVideos[0].snippet.title);

    cy.get('#video-detail').should('contain.text', jazzVideos[0].snippet.title);
  });

  it('changes the focused video when a different list item is chosen', () => {
    cy.get('#video-list > li').should('have.length', defaultVideos.length);
    cy.get('#video-detail').should('contain.text', defaultVideos[0].snippet.title);

    cy.get('#video-list > li').eq(1).click();

    cy.get('#video-detail')
      .should('contain.text', defaultVideos[1].snippet.title)
      .and('not.contain.text', defaultVideos[0].snippet.title);
  });

  it('restores the default feed when the search box is cleared and submitted', () => {
    cy.get('input').clear().type('jazz vibes{enter}');
    cy.wait('@youtubeSearch');
    cy.get('#video-detail').should('contain.text', jazzVideos[0].snippet.title);

    cy.get('input').clear().type('{enter}');
    cy.wait('@youtubeSearch');

    cy.get('#video-list > li').first().should('contain.text', defaultVideos[0].snippet.title);
    cy.get('#video-detail').should('contain.text', defaultVideos[0].snippet.title);
  });
});
