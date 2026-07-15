function __c_complete
    test -d "$CODE_PATH"; or return

    for dir in "$CODE_PATH"/*/
        test -d "$dir"; or continue
        string replace -r '/$' '' -- (string replace "$CODE_PATH/" '' -- $dir)
    end
end

complete -f -c c -a '(__c_complete)'
