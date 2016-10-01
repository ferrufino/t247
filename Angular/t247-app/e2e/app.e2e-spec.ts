import { T247AppPage } from './app.po';

describe('t247-app App', function() {
  let page: T247AppPage;

  beforeEach(() => {
    page = new T247AppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
