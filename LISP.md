# LISP in Coffee

## Intro

> Lisp (historically LISP) is a family of programming languages with a long history and a distinctive, fully parenthesized prefix notation. Originally specified in 1960, Lisp is the second-oldest high-level programming language still in common use, after Fortran.

[Lisp (programming language) - Wikipedia](https://en.wikipedia.org/wiki/Lisp_(programming_language))

In Coffee's LISP-enabled commands, all expressions are prefixed with `%`. So, an example of a basic LISP expression would be:
```lisp
%(test-func hello)
```
This would run the function named `test-func`, with the first argument being `hello`.
Of course, `test-func` is not a real function. For examples of functions you *can* use, look below!

## Libraries

Coffee uses a LISP dialect called [CumLISP](https://www.npmjs.com/package/cumlisp), which provides it's own standard library. However, Coffee provides several utility libraries:

### libDiscord - eases interfacing with Discord

**emote** - returns the emote closest to the given name

For example, here is how to print the emote named closest to "husk":
```lisp
(emote husk)
```
<sup>Note that Coffee needs to be in a server with this emote for this to work correctly.</sup>

**author** - allows accessing properties on the author's [user object](https://discord.js.org/#/docs/discord.js/main/class/User)

For example, one can get their own username via:
```lisp
(author username)
```

**user** - allows accessing properties on another user's [user object](https://discord.js.org/#/docs/discord.js/main/class/User)

For example, one can get Coffee's username via:
```lisp
(user Coffee username)
```

### libCoffee - Get information about Coffee

**package** - access a property from Coffee's package.json

For example, one can get the current version via:
```lisp
(package version)
```

**dependency** - get the version of an installed dependency

For example, one can get the current TypeScript version via:
```lisp
(dependency typescript)
```