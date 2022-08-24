# Coffee HyperDrive

The latest and greatest iteration of Beef's personal Discord bot.

## Self-hosting

### Prerequisites

* [node.js & npm](//nodejs.org)
* [Git](//git-scm.com/)
* Optional: [pnpm](//pnpm.io)*

### Instructions

1. Install dependencies
```sh
pnpm i # or equivalent for your package manager of choice
```

2. Create a new file called `config.json`, and fill in the fields. An example config will be provided soon.

3. Then, build the bot with:
```sh
pnpm build
```

4. Once it is built (it should exit with no output), run it with:
```sh
pnpm start
```

Congratulations, you are now running Coffee locally!

## Local development

1. Follow step 1 and 2 of the selfhosting instructions.

2. Then, run:
```sh
pnpm dev
```

This automatically restarts the bot when a file is changed.


<div><sub>*Coffee was created with pnpm as the package manager, you may run into lockfile issues with others.</sub></div>
