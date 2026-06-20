function redis -d "Start redis-server with Homebrew config"
    if type -q brew
        redis-server (brew --prefix)/etc/redis.conf $argv
    else
        echo "Homebrew not found" >&2
        return 1
    end
end
