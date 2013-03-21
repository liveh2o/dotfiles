source ~/.bash/aliases
source ~/.bash/config

PATH=/usr/local/bin:/usr/bin:/bin:/usr/local/sbin:/usr/sbin:/sbin

# Add ~/.bin to the path
if [ -d ${HOME}/.bin ]; then
  PATH=$HOME/.bin:$PATH
fi

# Use .localrc for settings specific to one system
if [ -f ~/.localrc ]; then
  source ~/.localrc
fi

# Load RVM into a shell session *as a function*
if [ -d ${HOME}/.rvm ]; then
  [[ -s "${HOME}/.rvm/scripts/rvm" ]] && source "${HOME}/.rvm/scripts/rvm"
  PATH=$PATH:$HOME/.rvm/bin # Add RVM to PATH for scripting
fi
