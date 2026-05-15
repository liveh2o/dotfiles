function c
    cd $PROJECT_PATH/$argv[1]
end

function __c_complete
    for dir in (ls -d $PROJECT_PATH/*/ 2>/dev/null | string replace -r "$PROJECT_PATH/" '' | string replace -r '/$' '')
        echo $dir
    end
end

complete -f -c c -a '(__c_complete)'