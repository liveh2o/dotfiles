source ~/.bash/config

# Add RVM to PATH for scripting
if [ -d "${HOME}/.rvm/bin" ]; then
  PATH=$PATH:$HOME/.rvm/bin
fi

# Use .localrc for settings specific to one system
if [ -f ~/.localrc ]; then
  source ~/.localrc
fi
