# Adam Hutchison's Dot Files

These are config files to set up a system the way I like it. They are heavily
inspired by Ryan Bates' Dot Files (http://github.com/ryanb/dotfiles)

I am running on Mac OS X, but it will likely work on Linux as well.

## Installation

Run the following commands in your terminal. It will prompt you before it does anything destructive. Check out the [Rakefile](https://github.com/liveh2o/dotfiles/blob/main/Rakefile) to see exactly what it does.

Clone the repo:

```
$ git clone git://github.com/liveh2o/dotfiles ~/.dotfiles
```

Setup the environment:

```
cd ~/.dotfiles
rake env
```

Setup the dotfiles:

```
cd ~/.dotfiles
rake install
```

Or setup the environment and dotfiles at once:

```
cd ~/.dotfiles
rake setup
```

## Features

Many of the following features are added through the "liveh2o" Oh My ZSH plugin. If you're using rbenv, it's automatically loaded as well.

#### Project helpers

I normally place all of my coding projects in the ~/Code directory, specified using `PROJECT_PATH`:

```terminal
export PROJECT_PATH=$HOME/Code
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

#### rbenv helpers

**jrb**

Set Ruby to latest JRuby version in shell optionally specifying the version as an argument (equivalent to `rbenv shell jruby-9.4.1.0`).

```terminal
jrb 9.4.1
```

**localrb**

Set Ruby to the version specified in `./.ruby-version` (equivalent to `rbenv shell --unset`)

```terminal
localrb
```

_also aliased as `lrb`_

**rb**

Set Ruby to latest JRuby version in shell optionally specifying the version as an argument (equivalent to `rbenv shell 3.2.1`).

```terminal
rb 3.2
```
