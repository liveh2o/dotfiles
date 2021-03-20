setopt NO_CASE_GLOB # Disable case-sensitive globbing
setopt AUTO_CD      # Enable automatic CD
setopt CORRECT      # Enable correction

# Enable shell history
HISTFILE=${ZDOTDIR:-$HOME}/.zsh_history
SAVEHIST=5000
HISTSIZE=2000

setopt SHARE_HISTORY      # Share history across multiple zsh sessions
setopt APPEND_HISTORY     # Append to history
setopt EXTENDED_HISTORY   # Enable extended history
setopt INC_APPEND_HISTORY # Adds commands as they are typed, not at shell exit
setopt HIST_IGNORE_DUPS   # Do not store duplications
setopt HIST_REDUCE_BLANKS # Removes blank lines from history
setopt HIST_VERIFY        # Show the substituted commands in the prompt
# setopt HIST_EXPIRE_DUPS_FIRST # Expire duplicates first
# setopt HIST_FIND_NO_DUPS      # Ignore duplicates when searching

source ~/.bash/aliases
source ~/.bash/functions

# Initialize the zsh completion system
autoload -Uz compinit && compinit
autoload bashcompinit && bashcompinit

# Initialize git completions
if which git &> /dev/null; then
  source ~/.bash/completion_scripts/git_completion
  complete -o default -F _git_add ga
  complete -o default -F _git_branch gb
  complete -o default -F _git_checkout gc
  complete -o default -F _git_fetch gf
  complete -o default -F _git_merge gm
  complete -o default -F _git_stash stash
else
  echo "Hmmm... git doesn't seem to be installed."
fi

# Add RVM to PATH for scripting. Make sure this is the last PATH variable change.
export PATH="$PATH:$HOME/.rvm/bin"
