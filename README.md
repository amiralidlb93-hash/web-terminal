# Web Terminal

A simulated command-line terminal that runs entirely in your browser. No server, no dependencies, no build step: just HTML, CSS and vanilla JavaScript.

It has a virtual in-memory file system, command history, tab completion and a light/dark theme. Nothing runs on your real computer, and files are lost when the page is refreshed.

**[Live demo](https://amiralidlb93-hash.github.io/web-terminal/)**, hosted on GitHub Pages.

## Quick start

Try it online with the live demo above, or run it locally:

1. Download or clone the repository.
2. Open `index.html` in any modern browser.
3. Type `help`.

## Features

- Virtual file system with files and nested directories
- 25+ commands (see below)
- Tab autocomplete for commands and paths
- Command history with the Up and Down arrow keys
- Output redirection with `>` and `>>`
- Light and dark theme, follows the system setting or switch with `theme`
- Responsive layout that works on mobile

## Commands

| Command | Description |
| --- | --- |
| `help` | Show all commands |
| `ls [-a] [path]` | List files |
| `cd [path]` | Change directory |
| `pwd` | Print working directory |
| `cat file` | Show file contents |
| `mkdir name` | Create a directory |
| `touch name` | Create an empty file |
| `rm [-r] name` | Remove a file or directory |
| `cp src dest` | Copy a file or directory |
| `mv src dest` | Move or rename |
| `echo text [> file]` | Print text or write to a file (`>>` appends) |
| `head` / `tail [-n N] file` | First or last lines of a file |
| `wc file` | Count lines, words and characters |
| `grep pattern file` | Find matching lines |
| `tree [path]` | Show directory tree |
| `calc expr` | Calculator, e.g. `calc 2*(3+4)` |
| `js expression` | Run JavaScript, e.g. `js [1,2,3].map(x=>x*2)` |
| `date` | Current date and time |
| `whoami`, `hostname`, `uname` | User and system info |
| `neofetch` | System summary |
| `history` | Previous commands |
| `theme [dark\|light]` | Switch theme |
| `clear` | Clear the screen |

## Keyboard shortcuts

| Key | Action |
| --- | --- |
| `Tab` | Autocomplete |
| `Up` / `Down` | Browse history |
| `Ctrl+L` | Clear the screen |
| `Ctrl+C` | Cancel the current line |

## Project structure

```
.
├── index.html   # page structure
├── style.css    # theme and layout
├── script.js    # file system, commands and input handling
└── README.md
```

## Adding your own command

Commands live in the `C` object in `script.js`. Add a new method and it is available immediately, including in tab completion:

```js
hello(args) {
  print('Hello, ' + (args[0] || 'world') + '!', 'ok');
},
```

Helpers you can use: `print(text, cls)`, `parts(path)` and `get(parts)` for the file system, and `need(args, n, name)` to validate arguments. Throw an `Error` to show an error message.

## Changing the prompt

Search for `user@terminal` in `index.html` and `script.js` to change the user and host name.

## Notes

- The `js` and `calc` commands evaluate expressions in the page, so only run code you trust.
- The monospace font (IBM Plex Mono) is loaded from Google Fonts, with system fonts as a fallback.
