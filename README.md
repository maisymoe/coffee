# Coffee

Beef's personal Discord bot, but rewritten.

## Self-hosting

### Prerequisites

* Node.JS
* Git
* Optional: `pnpm`

1. Ensure you have the dependencies installed by running:
```sh
pnpm i # or equivalent for your package manager of choice
```

2. Rename `example.config.json`, to `config.json`, and fill out the fields (this will be easier soon, but for now see the type definitions)

3. Then, build the bot with:
```sh
pnpm build
```

4. Once it is built (it should exit with no message), run it with:
```sh
pnpm start
```

### Local development

You can also run:
```sh
pnpm dev
```

This automatically restarts the bot when a file is changed. Note that for this to work, steps 1 and 2 of the previous section must be completed.
