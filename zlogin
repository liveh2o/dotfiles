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
