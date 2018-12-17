# Readlint

> Inline code block linting for the README generation.

![Travis](http://img.shields.io/travis/Wildhoney/Readlint.svg?style=for-the-badge)
&nbsp;
![npm](http://img.shields.io/npm/v/readlint.svg?style=for-the-badge)
&nbsp;
![License MIT](http://img.shields.io/badge/license-mit-lightgrey.svg?style=for-the-badge)
&nbsp;
![Coveralls](https://img.shields.io/coveralls/Wildhoney/Readlint.svg?style=for-the-badge)
&nbsp;
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=for-the-badge)](https://github.com/prettier/prettier)

**npm**: `npm install readlint --save-dev`

<img src="media/screenshot.png" alt="Readlint" />

## Getting Started

Using `readlint` is as easy as installing it, and then running it local to your project. There is no configuration as `eslint` and `stylelint` takes its configuration from their respective config files, which ideally should be the same as the config you're using for the entire project.

**`package.json`**

```json
{
    "scripts": {
        "lint": "eslint && stylelint && readlint"
    }
}
```

## Support Languages

| Language     | Linter      | Requires Configuration? |
| -------------| ----------- | ------------------------|
| `javascript` | `eslint`    | Yes                     |
| `css`        | `stylelint` | Yes                     |
| `json`       | `jsonlint`  | No                      |
| `html`       | `htmllint`  | Yes                     |
| `yaml`       | `yamllint`  | No                      |
| -------------| ----------- | ------------------------|
