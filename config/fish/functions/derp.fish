function derp -d "Run a command with RUBYOPT='-W:no-deprecated'"
    if test (count $argv) -eq 0
        return 0
    end

    set -lx RUBYOPT '-W:no-deprecated'
    $argv
end
