# Load brew automatically when installed
# Use direct exports rather than eval which spawns a subprocess
if [[ -s "/opt/homebrew/bin/brew" ]]; then
  export HOMEBREW_BUNDLE_FILE=$DOTFILES/Brewfile
  export HOMEBREW_CELLAR="/opt/homebrew/Cellar"
  export HOMEBREW_PREFIX="/opt/homebrew"
  export HOMEBREW_REPOSITORY="/opt/homebrew"
  export PATH="/opt/homebrew/bin:$PATH"
  fpath=(/opt/homebrew/share/zsh/site-functions $fpath)
fi

# Path to your oh-my-zsh installation.
export ZSH=$HOME/.oh-my-zsh

# Set name of the theme to load --- if set to "random", it will
# load a random theme each time oh-my-zsh is loaded, in which case,
# to know which specific one was loaded, run: echo $RANDOM_THEME
# See https://github.com/ohmyzsh/ohmyzsh/wiki/Themes
ZSH_THEME="robbyrussell"

# Uncomment the following line to use case-sensitive completion.
# CASE_SENSITIVE="true"

# Uncomment the following line to use hyphen-insensitive completion.
# Case-sensitive completion must be off. _ and - will be interchangeable.
HYPHEN_INSENSITIVE="true"

# Uncomment one of the following lines to change the auto-update behavior
# zstyle ':omz:update' mode disabled  # disable automatic updates
# zstyle ':omz:update' mode auto      # update automatically without asking
zstyle ':omz:update' mode reminder  # just remind me to update when it's time

# Uncomment the following line to change how often to auto-update (in days).
zstyle ':omz:update' frequency 13

# Uncomment the following line if pasting URLs and other text is messed up.
# DISABLE_MAGIC_FUNCTIONS="true"

# Uncomment the following line if you want to disable marking untracked files
# under VCS as dirty. This makes repository status check for large repositories
# much, much faster.
# DISABLE_UNTRACKED_FILES_DIRTY="true"

# Would you like to use another custom folder than $ZSH/custom?
# ZSH_CUSTOM=/path/to/new-custom-folder

# Which plugins would you like to load?
# Standard plugins can be found in $ZSH/plugins/
# Custom plugins may be added to $ZSH_CUSTOM/plugins/
# Example format: plugins=(rails git textmate ruby lighthouse)
# Add wisely, as too many plugins slow down shell startup.
plugins=(bundler git liveh2o mise)

source $ZSH/oh-my-zsh.sh

# User configuration
export DOTFILES=$HOME/.dotfiles
export EDITOR=vim
export HOMEBREW_BUNDLE_FILE=$DOTFILES/Brewfile
export PATH="$PATH:$HOME/.bin:$HOME/.local/bin"
export PROJECT_PATH=$HOME/Code

# Load starship if using Ghostty
[[ "$TERM_PROGRAM" == "ghostty" ]] && eval "$(starship init zsh)"
