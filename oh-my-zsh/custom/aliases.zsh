# Additional bundler aliases
alias b='bundle install'
alias bc='bundle console'
alias bo='EDITOR=nova bundle open'
alias bx='bundle exec'
alias tb='t b'
alias tbu='t bu'
alias tbx='t bx'

# Additional docker-compose aliases
alias dc='docker-compose'
alias dcx='dc exec web'

# Additional git aliases
alias ghe='g rev-parse HEAD'
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
alias cloud='cd ~/Library/Mobile\ Documents/com~apple~CloudDocs'
alias derp='RUBYOPT=W0'
alias dotfiles='cd ~/.dotfiles'
alias http='python -m SimpleHTTPServer'
alias jitless='JRUBY_OPTS="$JRUBY_OPTS -J-Djruby.compile.mode=OFF"'
alias jrbdev='JRUBY_OPTS="$JRUBY_OPTS --dev --disable:did_you_mean --debug"'
alias kp='ps auxwww' # the "kp" alias ("que pasa"), in honor of tony p.
alias lp='ls -p'
alias mspec='rspec $(git ls-files --modified spec)'
alias ns='nslookup'
alias o='open .'
alias path='echo $PATH'
alias redis='redis-server $HOMEBREW_REPOSITORY/etc/redis.conf'
alias reload='. ~/.zshrc'
alias spf='t bin/rspec --only-failures'
alias std='standardize'
alias std!='standardize!'
alias standardize='bin/standardrb --fix'
alias standardize!='bin/standardrb --fix-unsafely'
alias t='turbo'
alias turbo='derp jrbdev'
