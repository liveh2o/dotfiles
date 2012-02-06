source ~/.bash/aliases
source ~/.bash/config

if [ -d ~/.rvm ]; then
  # Load RVM into a shell session *as a function*
  [[ -s "~/.rvm/scripts/rvm" ]] && source "~/.rvm/scripts/rvm"
fi