---
id: 587d8247367417b2b2512c36
title: Instalar y Requerir Helmet
challengeType: 2
forumTopicId: 301581
dashedName: install-and-require-helmet
---

# --description--

Trabajar en estos desafíos implica escribir tu código usando uno de los siguientes métodos:

- Clona <a href="https://github.com/topcoder-platform/boilerplate-infosec/" target="_blank" rel="noopener noreferrer nofollow">este repositorio de GitHub </a> y completa esos retos localmente.
- Usa <a href="https://replit.com/github/topcoder-platform/boilerplate-infosec" target="_blank" rel="noopener noreferrer nofollow">nuestro proyecto de inicial Replit</a> para completar estos retos.
- Utilice un constructor de sitios de su elección para completar el proyecto. Asegúrese de incorporar todos los archivos de nuestro repositorio de GitHub.

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
