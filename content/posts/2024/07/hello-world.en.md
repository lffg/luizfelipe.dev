---
title: Hello, world!
date: 2024-07-01
---

We couldn't start off differently:

> Hello, world!

This is the first post of this blog. So, welcome.

Here's some Rust[^1] code:

[^1]:
    Rust is a multi-paradigm, general-purpose programming language that
    emphasizes performance, type safety, and concurrency. It enforces memory
    safety—meaning that all references point to valid memory—without a garbage
    collector. To simultaneously enforce memory safety and prevent data races,
    its "borrow checker" tracks the object lifetime of all references in a
    program during compilation. (from [Wikipedia])

[Wikipedia]: https://en.wikipedia.org/wiki/Rust_(programming_language)

```rs
fn main<T>(name: T) -> String
  where
    T: Display,
{
    // This is a really long comment, that shall span across the string for testing purposes.
    format!("hi, {name}!")
}
```

It'll probably be deleted in the future, though.
