## Export some environment variables
export EDITOR=vim
export GIT_PS1_SHOWDIRTYSTATE="1"
export JRUBY_OPTS="-J-Xmx2048m"
export PROJECT_PATH=$HOME/Code

## Setup the path
PATH=$HOME/.bin:$HOME/.jenv/bin:/usr/local/bin:/usr/bin:/bin:/usr/local/sbin:/usr/sbin:/sbin

### Setup jenv
eval "$(jenv init -)"

### Load the rest of the configuration
source ~/.bash/colors
source ~/.bash/completions
source ~/.bash/functions
source ~/.bash/aliases

### Setup the prompt
PS1="$BRIGHT_CYAN\w$VIOLET \$(parse_git_branch)$BRIGHT_WHITE\n∴ "

# Add RVM to PATH for scripting. Make sure this is the last PATH variable change.
export PATH="$PATH:$HOME/.rvm/bin"

# heroku autocomplete setup
HEROKU_AC_BASH_SETUP_PATH=/Users/ah/Library/Caches/heroku/autocomplete/bash_setup && test -f $HEROKU_AC_BASH_SETUP_PATH && source $HEROKU_AC_BASH_SETUP_PATH;
