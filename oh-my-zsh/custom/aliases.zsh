# rbenv aliases
alias defaultrb='rbenv shell default' # Switch to default Ruby
alias drb='defaultrb'
alias localrb='rbenv shell --unset' # Switch to Ruby version specified in the current directory
alias lrb='localrb'

# Additional bundler aliases
alias b='bundle'
alias bc='bundle console'
alias biv='bi --path vendor && echo "vendor/ruby" >> .gitignore'
alias bivp='biv && bp'
alias bo='EDITOR=nova bundle open'
alias bu='bundle update'
alias bx='bundle exec'
alias tb='t b'
alias tbu='t bu'
alias tbx='t bx'

# Additional git aliases
alias ghe='g rev-parse HEAD'
alias gi='g commit'
alias gl='g log'
alias gpo='ggpush --set-upstream'
alias grbm='grb $(git_main_branch)'
alias gs='g status'
alias pop='g stash pop'
alias stash='g stash'

# GitHub CLI aliases
alias ghpr='gh pr create --web'

# Editor aliases
alias m='mate -w .'
alias n='nova .'

# Misc
alias bullet='BULLET=1'
alias cd..='cd ..'
alias ci='bin/rails ci'
alias derp='PB_IGNORE_DEPRECATIONS=1 RUBYOPT=W0'
alias dotfiles='cd ~/.dotfiles'
alias ffi='LDFLAGS="-L/opt/homebrew/opt/libffi/lib" PKG_CONFIG_PATH="/opt/homebrew/opt/libffi/lib/pkgconfig"'
alias http='python -m SimpleHTTPServer'
alias javah='javahome'
alias javahome='/usr/libexec/java_home'
alias jh='javah'
alias jitless='JRUBY_OPTS="$JRUBY_OPTS -J-Djruby.compile.mode=OFF"'
alias jrbdev='JRUBY_OPTS="$JRUBY_OPTS --dev --disable:did_you_mean --debug"'
alias jx='jenv exec'
alias kp='ps auxwww' # the "kp" alias ("que pasa"), in honor of tony p.
alias lp='ls -p'
alias mspec='rspec $(git ls-files --modified spec)'
alias nats='PB_CLIENT_TYPE="protobuf/nats/client" PB_SERVER_TYPE="protobuf/nats/server"'
alias ns='nslookup'
alias o='open .'
alias path='echo $PATH'
alias redis='redis-server $HOMEBREW_REPOSITORY/etc/redis.conf'
alias reload='. ~/.zshrc'
alias sprung='DISABLE_SPRING=1'
alias std='standardize'
alias std!='standardize!'
alias standardize='standardrb --fix'
alias standardize!='standardrb --fix-unsafely'
alias t='turbo'
alias turbo='derp jrbdev sprung'
