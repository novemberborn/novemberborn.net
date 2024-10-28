---
description: Open source contribution highlights by Mark Wubben.
---

# Open Source

I've made many open source contributions, from a mercifully obsolete [dynamic web fonts implementation](https://en.wikipedia.org/wiki/Scalable_Inman_Flash_Replacement) to a [ground-breaking Node.js test runner](https://github.com/avajs/ava), with [promise implementations](http://dojotoolkit.org/reference-guide/1.8/dojo/promise.html) in between.

These projects have given me a chance to contribute to a commmunity, scratch an itch, and be creative with code without business constraint.

Most code is still out there, on my [npm](https://www.npmjs.com/~novemberborn) or [GitHub](https://github.com/novemberborn) accounts. Here I've highlighted those that are exceptionally interesting or useful today.

---

First, of course, is [AVA](https://github.com/avajs/ava), a Node.js test runner. This project was originally started by [Sindre Sorhus](https://sindresorhus.com/). I joined in 2016 and have pushed a lot of the development since.

[Concordance](https://github.com/concordancejs/) compares, formats, diffs and snapshots any JavaScript value. It was created to power AVA's snapshot feature.

---

Other Node.js modules include:

- [`common-path-prefix`](https://github.com/novemberborn/common-path-prefix) computes the longest prefix string that is common to each path, excluding the
  base component.
- [`ignore-by-default`](https://github.com/novemberborn/ignore-by-default) provides a list of directories that should probably be ignored by development
  tools, e.g. when watching for file changes. Used by
  [AVA](https://github.com/avajs/ava), [nodemon](https://github.com/remy/nodemon) and [many others](https://www.npmjs.com/package/ignore-by-default?activeTab=dependents).
- [`ksuid`](https://github.com/novemberborn/ksuid) is a Node.js implementation of [Segment's KSUID library](https://github.com/segmentio/ksuid).
- [`never`](https://github.com/novemberborn/never) provides a function that throws when called, useful with nullish coalescing to elide unexpected nullish values.
- [`release-zalgo`](https://github.com/novemberborn/release-zalgo) helps you write code with promise-like chains that can run both synchronously and asynchronously. Which isn't something you'd want to do, but it's still neat.
- [`x690`](https://github.com/novemberborn/x690) is a low-level decoder for X.690 Distinguished Encoding Rules (DER).
