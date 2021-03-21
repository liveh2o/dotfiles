## Export some environment variables
export PROJECT_PATH=$HOME/Code
export EDITOR=vim
export GIT_PS1_SHOWDIRTYSTATE="1"
export JRUBY_OPTS="-J-Xmx2048m"

## Setup the path
export PATH=$HOME/.bin:$HOME/.jenv/bin:/usr/local/bin:/opt/homebrew/bin:/usr/bin:/opt/bin:/bin:/usr/local/sbin:/usr/sbin:/opt/sbin:/sbin

### Setup jenv
#eval "$(jenv init -)"

### Load the rest of the configuration
source ~/.bash/colors
source ~/.bash/completions
source ~/.bash/functions
source ~/.bash/aliases

alias reload='. ~/.bash_profile'

### Setup the prompt
PS1="$BRIGHT_CYAN\w$VIOLET \$(parse_git_branch)$BRIGHT_WHITE\n∴ "

# Add RVM to PATH for scripting. Make sure this is the last PATH variable change.
export PATH="$PATH:$HOME/.rvm/bin"

# heroku autocomplete setup
HEROKU_AC_BASH_SETUP_PATH=/Users/ah/Library/Caches/heroku/autocomplete/bash_setup && test -f $HEROKU_AC_BASH_SETUP_PATH && source $HEROKU_AC_BASH_SETUP_PATH;
