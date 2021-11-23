**💛 You can help the author become a full-time open-source maintainer by [sponsoring him on GitHub](https://github.com/sponsors/egoist).**

---

# aho

> ultra simple project scaffolding

## Install

```bash
curl -sf https://gobinaries.com/egoist/aho | sh
```

## Usage

```bash
aho user/repo [destination]
```

## Flags

### `aho <repo> [destination]`

Generate a project from `<repo>` to `[destination]`, destination defaults to current directory.

`<repo>` is in the format of `user/repo#branch_or_tag`, currently only GitHub repositories are supported. `#branch_or_tag` is optional.

### `--force`

By default the command would abort if destination is not empty, use `--force` if you want to empty the dir before writing to it.

### `-p, --path <path>`

Extract a sub directory from `<repo>` to `[destination]`.

## Sponsors

[![sponsors](https://sponsors-images.egoist.sh/sponsors.svg)](https://github.com/sponsors/egoist)

## License

MIT &copy; [EGOIST](https://github.com/sponsors/egoist)
