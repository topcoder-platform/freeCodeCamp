---
id: 587d7fb0367417b2b2512bed
title: Meet the Node console
challengeType: 2
forumTopicId: 301515
dashedName: meet-the-node-console
---

# --description--

Working on these challenges will involve you writing your code using one of the following methods:

- Clone <a href="https://github.com/topcoder-platform/boilerplate-express/" target="_blank" rel="noopener noreferrer nofollow">this GitHub repo</a> and complete these challenges locally.
- Use <a href="https://replit.com/github/topcoder-platform/boilerplate-express" target="_blank" rel="noopener noreferrer nofollow">our Replit starter project</a> to complete these challenges.
- Use a site builder of your choice to complete the project. Be sure to incorporate all the files from our GitHub repo.

If you use Replit, follow these steps to set up the project:

-   Start by importing the project on Replit.
-   Next, you will see a `.replit` window.
-   Select `Use run command` and click the `Done` button.

When you are done, make sure a working demo of your project is hosted somewhere public. Then submit the URL to it in the `Solution Link` field.

During the development process, it is important to be able to check what’s going on in your code.

Node is just a JavaScript environment. Like client side JavaScript, you can use the console to display useful debug information. On your local machine, you would see console output in a terminal. On Replit, a terminal is open in the right pane by default.

We recommend to keep the terminal open while working at these challenges. By reading the output in the terminal, you can see any errors that may occur.

# --instructions--

Modify the `myApp.js` file to log "Hello World" to the console.

# --hints--

`"Hello World"` should be in the console

```js
(getUserInput) =>
  $.get(getUserInput('url') + '/_api/hello-console').then(
    (data) => {
      assert.isTrue(data.passed, '"Hello World" is not in the server console');
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
