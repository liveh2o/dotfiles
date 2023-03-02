# Adam Hutchison's Dot Files

These are config files to set up a system the way I like it. They are heavily
inspired by Ryan Bates' Dot Files (http://github.com/ryanb/dotfiles)

## Installation

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
rake dotfiles
```

Or setup the environment and dotfiles at once:

```
cd ~/.dotfiles
rake setup
```

## Environment

I am running on Mac OS X, but it will likely work on Linux as well with
minor fiddling.

## Features

Tab completion is available for rake commands:

rake db:mi<tab>

To speed things up, the results are cached in local .rake_tasks~ and
.cap_tasks~. It is smart enough to expire the cache automatically in
most cases, but you can simply remove the files to flush the cache.

If you're using git, you'll notice the current branch name shows up in
the prompt while in a git repository.

If there are some shell configuration settings which you want secure or specific to one system,
place it into a ~/.localrc file. This will be loaded automatically if it exists.

If you're using rbenv, it's automatically loaded as well.
