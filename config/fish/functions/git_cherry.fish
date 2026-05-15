function git_cherry
    if not git rev-parse --git-dir >/dev/null 2>&1
        echo "Not a git repo."
        return 1
    end

    set -q argv[1]; or set upstream "main"
    set -q argv[2]; or set head "HEAD"

    git cherry -v $upstream $head
end