function rb -d "Switch Ruby via mise (defaults to latest)" -a ruby_version
    if not type -q mise
        echo "mise is not installed or not on PATH."
        return 1
    end

    set -l target "ruby@latest"

    if set -q ruby_version[1]; and test -n "$ruby_version"
        set target $ruby_version
    end

    if not string match -rq '^ruby@' -- $target
        set target "ruby@$target"
    end

    if functions -q mise
        mise shell "$target"; or return 1
    else
        command mise shell "$target" | source; or return 1
    end
    command mise hook-env -s fish | source; or return 1

    echo "Switched to $target"
end
