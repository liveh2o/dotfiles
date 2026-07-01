# Adam Hutchison's Dot Files

These are config files to set up macOS the way I like it. They are heavily
inspired by Ryan Bates' Dot Files (http://github.com/ryanb/dotfiles)

## Installation

Run the setup script below. It clones this repo into `~/.dotfiles` and runs `rake setup`. It will prompt you before it does anything destructive. Check out the [Rakefile](https://github.com/liveh2o/dotfiles/blob/main/Rakefile) to see exactly what it does.

```terminal
curl -fsSL https://raw.githubusercontent.com/liveh2o/dotfiles/main/setup.sh | sh
```

If you prefer to run the steps manually:

```
$ git clone git://github.com/liveh2o/dotfiles ~/.dotfiles
```

Install the dotfiles:

```
cd ~/.dotfiles
rake dotfiles
```

Setup the environment:

```
cd ~/.dotfiles
rake env
```

Or install the dotfiles and setup the environment at once:

```
cd ~/.dotfiles
rake setup
```

## Features

Many of the following features are provided by Fish shell functions. If you're using Ruby, it's automatically loaded via mise.

#### Project helpers

I normally place all of my coding projects in the ~/Code directory, specified using `CODE_PATH`:

```terminal
export CODE_PATH=$HOME/Code
```

**c**

Easily access (and tab complete) the project path with the "c" command.

```terminal
c rail<tab>
```

**hunt**

Search the project path skipping any vendor/ directories (i.e., find the current Rails version specified in Gemfiles):

```terminal
hunt Gemfile rails
```

#### git helpers

If you're using git, you'll notice the current branch name shows up in the prompt while in a git repository. I've also added some custom git functions I find very useful.

**cherry**

Find commit diffs between two branches (equivalent to `git cherry -v my-topic-branch main`):

```terminal
cherry my-topic-branch main
```

This is especially useful for finding differences between stable and development branches (i.e., changes in `stable` that are not in `main`, and vice versa)

**pull**

Pull all remote git branches for a repo.

```terminal
pull
```

Pass `-A` or `--all` to pull remote git branches for all repos in the current directory (i.e., ~/Code)

**rebase**

Interactively rebase the current branch going back the specified number of commits (equivalent to `git rebase -i HEAD~3`)

```terminal
rebase 3
```

This is useful for editing, squashing, rewording, or removing previous commits. I use this on local topic branches.
