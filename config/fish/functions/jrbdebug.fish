function jrbdebug -d "Enable JRuby debug mode for current shell"
    if string match -q "*--debug*" -- "$JRUBY_OPTS"
        return 0
    end

    set -l jruby_opts $JRUBY_OPTS
    if not string match -q "*--debug*" -- "$jruby_opts"
        if test -n "$jruby_opts"
            set jruby_opts "$jruby_opts --debug"
        else
            set jruby_opts "--debug"
        end
    end

    set -lx JRUBY_OPTS $jruby_opts

    if test (count $argv) -eq 0
        return 0
    end
    $argv
end
