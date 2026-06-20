function c -d "Change to project directory with completion"
    if test -z "$PROJECT_PATH"
        echo "PROJECT_PATH is not set."
        return 1
    end

    if not test -d "$PROJECT_PATH"
        echo "PROJECT_PATH does not exist: $PROJECT_PATH"
        return 1
    end

    set -l destination $PROJECT_PATH
    if test (count $argv) -gt 0
        set destination (string join / -- $PROJECT_PATH $argv)
    end

    if not test -d "$destination"
        echo "Directory does not exist: $destination"
        return 1
    end

    cd "$destination"
end

function __c_complete
    test -d "$PROJECT_PATH"; or return

    for dir in "$PROJECT_PATH"/*/
        test -d "$dir"; or continue
        string replace -r '/$' '' -- (string replace "$PROJECT_PATH/" '' -- $dir)
    end
end

complete -f -c c -a '(__c_complete)'
