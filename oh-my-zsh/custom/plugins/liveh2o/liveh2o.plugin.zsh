# Change to project directory with autocompletion
c() { cd $PROJECT_PATH/$1; }
_c() { _files -W $PROJECT_PATH -/; }
compdef _c c

# Search all projects skipping vendor/
function hunt() { find $PROJECT_PATH -type f -name "$1" -not -path "*vendor*" -print0 | xargs -0 ack -Q $2; }

# Set Ruby to latest JRuby version in shell
# Specify the version as an argument: jrb 9.4.1
# Works with any aliased version
function jrb {
  if [ -z "$1" ]
  then
	rbenv shell jruby
  else
	rbenv shell jruby-$1
  fi
}

# Set Ruby to latest CRuby version in shell
# Specify the version as an argument: rb 3.2
# Works with any aliased version
function rb {
  if [ -z "$1" ]
  then
	rbenv shell ruby
  else
	rbenv shell $1
  fi
}

function git_branches {
  git branch | sed -e 's|* ||g' -e 's|^[ ]*||'
}

# Find commit diffs between two branches
function git_cherry {
  git_repo_check

  local upstream=${1:-'main'}
  local head=${2:-'HEAD'}

  git cherry -v $upstream $head
}
alias cherry="git_cherry"

function git_checkout_unless_current {
  [ $1 ] && [ $1 != $(git_current_branch) ] && git checkout $1
}

# Interactively rebase the current git branch going back the specified number of commits.
function git_rebase {
  git_status_check
  git rebase -i HEAD~$1
}
alias rebase="git_rebase"

function git_repo_check {
  [ -d '.git' ] || (echo "Not a git repo." && return)
}

function git_status_check {
  git_repo_check

  git status -s
  git diff-index --quiet HEAD --

  [ $? -ne 0 ] && echo "You have local changes that haven't been committed!" && return
}

# Pull all remote git branches
# Pass `-A` or `--all` to pull remote git branches for all repos in the current directory
function git_pull {
  case $1 in
	'-A' | '--all')
	  local current_directory=$PWD

	  for repo in $(ls -d */)
	  do
		cd $current_directory/$repo
		git_sync_remote_branches
	  done

	  cd $current_directory;;
	*)
	  git_pull_remote_branches;;
  esac
}
alias gsync="git_pull"
alias pull="git_pull"

# Pull all changes from origin
function git_pull_remote_branches {
  git_status_check

  git remote prune origin
  git fetch origin

  local startbranch=$(git_current_branch)

  for branch in $(git_branches)
  do
	git rev-parse origin/$branch &> /dev/null

	if [[ $? -eq 0 ]]
	then
	  local currev=$(git rev-parse $branch)
	  local syncrev=$(git rev-parse origin/$branch)

	  if [[ $currev != $syncrev ]]
	  then
		echo " > Synchronizing branch $branch"
		git checkout $branch
		git merge origin/$branch
	  fi
	else
	  echo " ! Branch $branch doesn't have an origin"
	fi
  done

  git_checkout_unless_current $startbranch

  echo "Local branches are in sync."
}