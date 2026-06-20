function jitless -d "Run a command with JRuby compile mode off"
    if test (count $argv) -eq 0
        return 0
    end

    set -l jruby_opts $JRUBY_OPTS
    if not string match -q "*-J-Djruby.compile.mode=OFF*" -- "$jruby_opts"
        if test -n "$jruby_opts"
            set jruby_opts "$jruby_opts -J-Djruby.compile.mode=OFF"
        else
            set jruby_opts "-J-Djruby.compile.mode=OFF"
        end
    end

    set -lx JRUBY_OPTS $jruby_opts
    $argv
end
