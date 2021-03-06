**💛 You can help the author become a full-time open-source maintainer by [sponsoring him on GitHub](https://github.com/sponsors/egoist).**

---

# aho

[![npm version](https://badgen.net/npm/v/aho)](https://npm.im/aho) [![npm downloads](https://badgen.net/npm/dm/aho)](https://npm/im/aho) [![install size](https://packagephobia.com/badge?p=aho)](https://packagephobia.com/result?p=aho)

> ultra simple project scaffolding

## Usage

```bash
# NPM
npx aho user/repo [destination]
# PNPM
pnpm dlx aho user/repo [destination]
```

## Flags

### `aho <repo> [destination]`

Generate a project from `<repo>` to `[destination]`, destination defaults to current directory.

`<repo>` is in the format of `user/repo#branch_or_tag`, currently only GitHub repositories are supported. `#branch_or_tag` is optional.

You can also download a sub folder from the repo: `user/repo/sub_folder#dev`.

### `--force`

By default the command would abort if destination is not empty, use `--force` if you want to empty the dir before writing to it.

## Sponsors

[![sponsors](https://sponsors-images.egoist.sh/sponsors.svg)](https://github.com/sponsors/egoist)

## License

MIT &copy; [EGOIST](https://github.com/sponsors/egoist)
