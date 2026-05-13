# Create a completion cache
autoload -Uz compinit
compinit -d ~/.zcompdump

export DOTFILES=$HOME/.dotfiles
export EDITOR=vim
export HOMEBREW_BUNDLE_FILE=$DOTFILES/Brewfile
export HYPHEN_INSENSITIVE=true
export PATH="$PATH:$HOME/.bin:$HOME/.local/bin"
export PROJECT_PATH=$HOME/Code

# Load brew automatically when installed
# Use direct exports rather than eval which spawns a subprocess
if [[ -s "/opt/homebrew/bin/brew" ]]; then
  export HOMEBREW_CELLAR="/opt/homebrew/Cellar"
  export HOMEBREW_PREFIX="/opt/homebrew"
  export HOMEBREW_REPOSITORY="/opt/homebrew"
  export PATH="/opt/homebrew/bin:$PATH"
  fpath=(/opt/homebrew/share/zsh/site-functions $fpath)
fi

# Load mise automatically when installed
[[ -s "/opt/homebrew/bin/mise" ]] && eval "$(mise activate zsh)"

# Load starship when installed
[[ -s "/opt/homebrew/bin/starship" ]] && eval "$(starship init zsh)"

source $HOME/.oh-my-zsh/lib/git.zsh
source $HOME/.oh-my-zsh/plugins/git/git.plugin.zsh
source $HOME/.oh-my-zsh/custom/aliases.zsh
source $HOME/.oh-my-zsh/custom/plugins/liveh2o/liveh2o.plugin.zsh
