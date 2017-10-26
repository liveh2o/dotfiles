source ~/.bash/config

# Start 'em up, the keys!
if [ -f "${HOME}/.ssh/ids/moneydesktop.com/id_rsa" ]; then
  ssh-add $HOME/.ssh/ids/moneydesktop.com/id_rsa 2> /dev/null
fi
if [ -f "${HOME}/.ssh/ids/mx.com/id_rsa" ]; then
  ssh-add $HOME/.ssh/ids/mx.com/id_rsa 2> /dev/null
fi

# Add RVM to PATH for scripting
if [ -d "${HOME}/.rvm/bin" ]; then
  PATH=$PATH:$HOME/.rvm/bin
fi

# Use .localrc for settings specific to one system
if [ -f ~/.localrc ]; then
  source ~/.localrc
fi
