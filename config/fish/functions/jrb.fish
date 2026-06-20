function jrb -d "Switch Ruby to JRuby via mise" -a jruby_version
    if not type -q mise
        echo "mise is not installed or not on PATH."
        return 1
    end

    set -l target $JRUBY_LATEST_VERSION
    if test -z "$target"
        set target 10.1
    end

    if set -q jruby_version[1]; and test -n "$jruby_version"
        set target $jruby_version
    end

    set -l tool $target
    if not string match -rq '^jruby-' -- $tool
        set tool "jruby-$tool"
    end

    if functions -q mise
        mise shell "ruby@$tool"; or return 1
    else
        command mise shell "ruby@$tool" | source; or return 1
    end
    command mise hook-env -s fish | source; or return 1

    echo "Switched to ruby@$tool"
end
