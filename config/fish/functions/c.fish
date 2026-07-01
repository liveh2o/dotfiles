function c -d "Change to project directory with completion"
    if test -z "$CODE_PATH"
        echo "CODE_PATH is not set."
        return 1
    end

    if not test -d "$CODE_PATH"
        echo "CODE_PATH does not exist: $CODE_PATH"
        return 1
    end

    set -l destination $CODE_PATH
    if test (count $argv) -gt 0
        set destination (string join / -- $CODE_PATH $argv)
    end

    if not test -d "$destination"
        echo "Directory does not exist: $destination"
        return 1
    end

    cd "$destination"
end

function __c_complete
    test -d "$CODE_PATH"; or return

    for dir in "$CODE_PATH"/*/
        test -d "$dir"; or continue
        string replace -r '/$' '' -- (string replace "$CODE_PATH/" '' -- $dir)
    end
end

complete -f -c c -a '(__c_complete)'
