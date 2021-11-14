**💛 You can help the author become a full-time open-source maintainer by [sponsoring him on GitHub](https://github.com/sponsors/egoist).**

---

# aho

[![npm version](https://badgen.net/npm/v/aho)](https://npm.im/aho) [![npm downloads](https://badgen.net/npm/dm/aho)](https://npm/im/aho) [![install size](https://packagephobia.com/badge?p=aho)](https://packagephobia.com/result?p=aho)

> ultra simple project scaffolding

## Usage

With Node.js:

```bash
# NPM
npx aho user/repo [destination]
# PNPM
pnpm dlx aho user/repo [destination]
```

With Deno:

```bash
deno install --allow-net --allow-read --allow-write https://denopkg.com/egoist/aho@main/aho.ts

aho user/repo [destination]
```

## Flags

### `aho <repo> [destination]`

Generate a project from `<repo>` to `[destination]`, destination defaults to current directory.

### `--force`

By default the command would abort if destination is not empty, use `--force` if you want to overwrite it.

## License

MIT &copy; [EGOIST](https://github.com/sponsors/egoist)