---
id: 587d824c367417b2b2512c4d
title: 2 つの要素のプロパティを比較する
challengeType: 2
forumTopicId: 301588
dashedName: compare-the-properties-of-two-elements
---

# --description--

注意点として、このプロジェクトは <a href="https://replit.com/github/topcoder-platform/boilerplate-mochachai" target="_blank" rel="noopener noreferrer nofollow">Replit</a> にあるスタータープロジェクトをベースに構築されているか、または <a href="https://github.com/topcoder-platform/boilerplate-mochachai/" target="_blank" rel="noopener noreferrer nofollow">GitHub</a> からクローンされています。

# --instructions--

`tests/1_unit-tests.js` の中の、`Comparisons` スイート内の `#8` に分類されたテストにおいて、テストを成功させる (`true` と評価する必要があります) ために、それぞれの `assert` を `assert.isAbove` または `assert.isAtMost` に変更してください。 アサートに渡された引数を変更しないでください。

# --hints--

すべてのテストが成功する必要があります。

```js
(getUserInput) =>
  $.get(getUserInput('url') + '/_api/get-tests?type=unit&n=7').then(
    (data) => {
      assert.equal(data.state, 'passed');
    },
    (xhr) => {
      throw new Error(xhr.responseText);
    }
  );
```

最初のアサーションに、正しいメソッドを選ぶ必要があります - `isAbove` もしくは `isAtMost` です。

```js
(getUserInput) =>
  $.get(getUserInput('url') + '/_api/get-tests?type=unit&n=7').then(
    (data) => {
      assert.equal(
        data.assertions[0].method,
        'isAtMost',
        '5 is at most (<=) 5'
      );
    },
    (xhr) => {
      throw new Error(xhr.responseText);
    }
  );
```

2 番目のアサーションに、正しいメソッドを選ぶ必要があります - `isAbove` もしくは `isAtMost` です。

```js
(getUserInput) =>
  $.get(getUserInput('url') + '/_api/get-tests?type=unit&n=7').then(
    (data) => {
      assert.equal(data.assertions[1].method, 'isAbove', '1 is greater than 0');
    },
    (xhr) => {
      throw new Error(xhr.responseText);
    }
  );
```

3 番目のアサーションに、正しいメソッドを選ぶ必要があります - `isAbove` もしくは `isAtMost` です。

```js
(getUserInput) =>
  $.get(getUserInput('url') + '/_api/get-tests?type=unit&n=7').then(
    (data) => {
      assert.equal(
        data.assertions[2].method,
        'isAbove',
        'Math.PI = 3.14159265 is greater than 3'
      );
    },
    (xhr) => {
      throw new Error(xhr.responseText);
    }
  );
```

4 番目のアサーションに、正しいメソッドを選ぶ必要があります - `isAbove` もしくは `isAtMost` です。

```js
(getUserInput) =>
  $.get(getUserInput('url') + '/_api/get-tests?type=unit&n=7').then(
    (data) => {
      assert.equal(
        data.assertions[3].method,
        'isAtMost',
        '1 - Math.random() is > 0 and <= 1. It is atMost 1 !'
      );
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
