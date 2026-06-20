function hunt
    if test (count $argv) -lt 1
        echo "Usage: hunt <filename> [<search_term>]"
        return 1
    end

    set -l filename $argv[1]
    set -l search_term $argv[2]

    if test -n "$search_term"
        find $PROJECT_PATH -type f -name "$filename" -not -path "*vendor*" -print0 | xargs -0 ack -Q $search_term
    else
        find $PROJECT_PATH -type f -name "$filename" -not -path "*vendor*" -print0 | xargs -0 ls
    end
end