function git_pull
    if test "$argv[1]" = "-A" -o "$argv[1]" = "--all"
        set -l current_directory $PWD

        for repo in (ls -d */)
            cd $current_directory/$repo
            git_pull_remote_branches
        end

        cd $current_directory
    else
        git_pull_remote_branches
    end
end

function git_pull_remote_branches
    git_status_check

    git remote prune origin
    git fetch origin

    set -l startbranch (git_current_branch)

    for branch in (git_branches)
        if git rev-parse origin/$branch >/dev/null 2>&1
            set -l currev (git rev-parse $branch)
            set -l syncrev (git rev-parse origin/$branch)

            if test "$currev" != "$syncrev"
                echo " > Synchronizing branch $branch"
                git checkout $branch
                git merge origin/$branch
            end
        else
            echo " ! Branch $branch doesn't have an origin"
        end
    end

    git_checkout_unless_current $startbranch
    echo "Local branches are in sync."
end

alias gsync git_pull
alias pull git_pull