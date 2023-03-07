# rbenv aliases
alias defaultrb="rbenv shell default" # Switch to default Ruby
alias drb="defaultrb"
alias localrb="rbenv shell --unset" # Switch to Ruby version specified in the current directory
alias lrb="localrb"

# Additional bundler aliases
alias b="bundle"
alias bc="bundle console"
alias biv="bi --path vendor && echo 'vendor/ruby' >> .gitignore"
alias bivp="biv && bp"
alias bo="EDITOR=nova bundle open"
alias bx="bundle exec"
alias tb='t bundle'
alias tbu='t bu'
alias tbx='t bx'

# Additional git aliases
alias ghe="g rev-parse HEAD"
alias gi="g commit"
alias gl="g log"
alias gpush="ggpush"
alias gs="g status"
alias pop="g stash pop"
alias stash="g stash"

# Editor aliases
alias m="mate -w ."
alias n="nova ."

# Misc
alias cd..="cd .."
alias derp='PB_IGNORE_DEPRECATIONS=1 RUBYOPT="-W0"'
alias dotfiles='cd ~/.dotfiles'
alias ffi='LDFLAGS="-L/opt/homebrew/opt/libffi/lib" PKG_CONFIG_PATH="/opt/homebrew/opt/libffi/lib/pkgconfig"'
alias http='python -m SimpleHTTPServer'
alias javah='javahome'
alias javahome='/usr/libexec/java_home'
alias jh='javah'
alias jitless='JRUBY_OPTS="$JRUBY_OPTS -J-Djruby.compile.mode=OFF"'
alias jrbdev='JRUBY_OPTS="$JRUBY_OPTS --dev --disable:did_you_mean --debug"'
alias jx='jenv exec'
alias kp="ps auxwww" # the "kp" alias ("que pasa"), in honor of tony p.
alias lp="ls -p"
alias nats='PB_CLIENT_TYPE="protobuf/nats/client" PB_SERVER_TYPE="protobuf/nats/server"'
alias ns='nslookup'
alias o="open ."
alias path='echo $PATH'
alias redis='redis-server $HOMEBREW_REPOSITORY/etc/redis.conf'
alias reload=". ~/.zshrc"
alias t='turbo'
alias turbo='derp jrbdev'