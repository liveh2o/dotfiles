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

# User configuration
export DOTFILES=$HOME/.dotfiles
export EDITOR=vim
export HOMEBREW_BUNDLE_FILE=$DOTFILES/Brewfile
export PATH="$PATH:$HOME/.bin:$HOME/.local/bin"
export PROJECT_PATH=$HOME/Code
