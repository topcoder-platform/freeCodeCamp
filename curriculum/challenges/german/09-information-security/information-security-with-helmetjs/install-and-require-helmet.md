---
id: 587d8247367417b2b2512c36
title: Install and Require Helmet
challengeType: 2
forumTopicId: 301581
dashedName: install-and-require-helmet
---

# --description--

Bei der Arbeit an diesen Aufgaben wirst du deinen Code mithilfe folgender Methoden schreiben:

- Klone <a href="https://github.com/topcoder-platform/boilerplate-infosec/" target="_blank" rel="noopener noreferrer nofollow">dieses GitHub-Repo</a> und beende diese Aufgaben lokal.
- Use <a href="https://replit.com/github/topcoder-platform/boilerplate-infosec" target="_blank" rel="noopener noreferrer nofollow">our Replit starter project</a> to complete these challenges.
- Benutze einen Website-Builder deiner Wahl, um das Projekt abzuschließen. Be sure to incorporate all the files from our GitHub repo.

If you use Replit, follow these steps to set up the project:

-   Start by importing the project on Replit.
-   Next, you will see a `.replit` window.
-   Select `Use run command` and click the `Done` button.

When you are done, make sure a working demo of your project is hosted somewhere public. Then submit the URL to it in the `Solution Link` field.

Helmet helps you secure your Express apps by setting various HTTP headers.

# --instructions--

All your code for these lessons goes in the `myApp.js` file between the lines of code we have started you off with. Do not change or delete the code we have added for you.

Helmet version `3.21.3` has already been installed, so require it as `helmet` in `myApp.js`.

# --hints--

`helmet` version `3.21.3` should be in `package.json`

```js
(getUserInput) =>
  $.get(getUserInput('url') + '/_api/package.json').then(
    (data) => {
      const packJson = JSON.parse(data);
      const helmet = packJson.dependencies.helmet;
      assert(helmet === '3.21.3' || helmet === '^3.21.3');
    },
    (xhr) => {
      throw new Error(xhr.responseText);
    }
  );
```

# --solutions--

```js
/**
  Backend challenges don't need solutions, 
  because they would need to be tested against a full working project. 
  Please check our contributing guidelines to learn more.
*/
```
