function pull
    if test "$argv[1]" = "-A" -o "$argv[1]" = "--all"
        set -l current_directory $PWD
        set -l had_error 0

        for repo in */
            test -d "$repo"; or continue
            test -d "$repo/.git"; or continue

            cd "$current_directory/$repo"; or begin
                echo "Unable to enter $current_directory/$repo"
                set had_error 1
                continue
            end

            set -l repo_had_error 0

            __git.status_check; or begin
                set repo_had_error 1
                set had_error 1
                continue
            end

            if not git remote get-url origin >/dev/null 2>&1
                echo "No origin remote configured."
                set repo_had_error 1
                set had_error 1
                continue
            end

            git remote prune origin; or begin
                set repo_had_error 1
                set had_error 1
                continue
            end

            git fetch origin; or begin
                set repo_had_error 1
                set had_error 1
                continue
            end

            set -l startbranch (__git.current_branch)

            for branch in (git branch | sed -e 's|* ||g' -e 's|^[ ]*||')
                if git rev-parse origin/$branch >/dev/null 2>&1
                    set -l currev (git rev-parse $branch)
                    set -l syncrev (git rev-parse origin/$branch)

                    if test "$currev" != "$syncrev"
                        echo " > Synchronizing branch $branch"
                        git checkout $branch; or begin
                            set repo_had_error 1
                            set had_error 1
                            break
                        end
                        git merge origin/$branch; or begin
                            set repo_had_error 1
                            set had_error 1
                            break
                        end
                    end
                else
                    echo " ! Branch $branch doesn't have an origin"
                end
            end

            if test -n "$startbranch" -a "$startbranch" != (__git.current_branch)
                git checkout $startbranch; or begin
                    set repo_had_error 1
                    set had_error 1
                end
            end

            if test $repo_had_error -eq 0
                echo "Local branches are in sync."
            end
        end

        cd "$current_directory"
        return $had_error
    else
        __git.status_check; or return 1

        if not git remote get-url origin >/dev/null 2>&1
            echo "No origin remote configured."
            return 1
        end

        git remote prune origin; or return 1
        git fetch origin; or return 1

        set -l startbranch (__git.current_branch)

        for branch in (git branch | sed -e 's|* ||g' -e 's|^[ ]*||')
            if git rev-parse origin/$branch >/dev/null 2>&1
                set -l currev (git rev-parse $branch)
                set -l syncrev (git rev-parse origin/$branch)

                if test "$currev" != "$syncrev"
                    echo " > Synchronizing branch $branch"
                    git checkout $branch; or return 1
                    git merge origin/$branch; or return 1
                end
            else
                echo " ! Branch $branch doesn't have an origin"
            end
        end

        if test -n "$startbranch" -a "$startbranch" != (__git.current_branch)
            git checkout $startbranch; or return 1
        end

        echo "Local branches are in sync."
    end
end
