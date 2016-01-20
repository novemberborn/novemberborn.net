<p><iframe width="100%" height="200" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/50776099&amp;auto_play=false&amp;hide_related=true&amp;show_comments=false&amp;show_user=true&amp;show_reposts=false&amp;visual=true"></iframe></p>

# Functional Promise-Based Libraries

Back in the ES5 era I wrote a [Promises/A+](https://promisesaplus.com/) named
[`legendary`](https://github.com/novemberborn/legendary). Its [theme
song](https://soundcloud.com/buck65/legendary) is embedded above. Legendary came
with plenty of [sugar
methods](https://novemberborn.github.io/legendary/lib/promise.js.html),
[timeout](https://novemberborn.github.io/legendary/lib/timed.js.html) and
[cancellation](https://novemberborn.github.io/legendary/lib/promise.js.html#promise-cancel-)
handling, [functional](https://novemberborn.github.io/legendary/lib/fn.js.html)
[utilities](https://novemberborn.github.io/legendary/lib/concurrent.js.html),
and the ability to *subclass* the `Promise` constructor. That resulted in the
[`Series`](https://novemberborn.github.io/legendary/lib/series.js.html) subclass
which enabled functional composition of promises-for-arrays.

That same idea was applied to streams in
[`streamist`](https://github.com/novemberborn/streamist).

Built on top of both modules was [`helo`](https://github.com/novemberborn/helo),
a promise-based HTTP request handling stack. The stack model supported
[customizing the request
object](https://novemberborn.github.io/helo/index.html#requests) and [adding
middleware](https://novemberborn.github.io/helo/index.html#middleware), as well
as [default error
responses](https://novemberborn.github.io/helo/index.html#low-level-error-responses)
and various [response formatting
helpers](https://novemberborn.github.io/helo/doc/Responses.md.html).

Finally [`aitch`](https://github.com/novemberborn/aitch) was a toolkit for
constructing hypertext service clients. It abstracted
[clients](https://novemberborn.github.io/aitch/lib/Client.js.html) from
[transports](https://novemberborn.github.io/aitch/lib/Transport.js.html) and had
subclassable [request](https://novemberborn.github.io/aitch/lib/Request.js.html)
and [response](https://novemberborn.github.io/aitch/lib/Response.js.html)
objects (the latter being a `Promise` subclass!)

These libraries are still used in various Node services powering
[State](https://state.com). For all intents and purposes though they're no
longer maintained. Their last supported Node.js version is 0.10.
