source ~/.bash/aliases
source ~/.bash/config

# Use .localrc for settings specific to one system
if [ -f ~/.localrc ]; then
  source ~/.localrc
fi

# Load RVM into a shell session *as a function*
if [ -d ${HOME}/.rvm ]; then
  [[ -s "${HOME}/.rvm/scripts/rvm" ]] && source "${HOME}/.rvm/scripts/rvm"
fi
