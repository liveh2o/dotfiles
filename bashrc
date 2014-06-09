source ~/.bash/aliases
source ~/.bash/config

PATH=/usr/local/bin:/usr/bin:/bin:/usr/local/sbin:/usr/sbin:/sbin

# Add ~/.bin to the path
if [ -d ${HOME}/.bin ]; then
  PATH=$HOME/.bin:$PATH
fi

# Add RVM to PATH for scripting
if [ -d "${HOME}/.rvm/bin" ]; then
  PATH=$PATH:$HOME/.rvm/bin
fi

# Use .localrc for settings specific to one system
if [ -f ~/.localrc ]; then
  source ~/.localrc
fi
