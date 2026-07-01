namespace :ssh do
  desc "Generate GitHub SSH key (id_github_ed25519)"
  task :keygen do
    generate_ssh_key
  end

  desc "Upload existing SSH key to GitHub"
  task :upload do
    key_path = File.join(ENV["HOME"], ".ssh/id_github_ed25519")
    unless File.exist?(key_path)
      puts "No key found at #{key_path}. Run rake ssh:keygen first."
      next
    end
    upload_ssh_key_to_github(key_path)
  end

  def ensure_gh_scopes(scopes)
    status = `gh auth status -h github.com 2>&1`
    scopes_line = status.each_line.find { |l| l.include?("Token scopes:") }
    current_scopes = scopes_line ? scopes_line.split(":").last.to_s.strip.split(", ") : []
    missing_scopes = scopes - current_scopes
    return if missing_scopes.empty?

    scope_list = missing_scopes.join(", ")
    print "GitHub CLI needs the #{scope_list} scope(s). Authorize them? [Ynq] "
    case prompt_input
    when "Y", "y", ""
      system("gh", "auth", "refresh", "-h", "github.com", "-s", missing_scopes.join(","))
    when "q"
      exit
    else
      puts "Skipping scope authorization. Upload may fail."
    end
  end

  def ensure_ssh_config
    config_path = File.join(ENV["HOME"], ".ssh/config")
    github_entry = "Host github.com\n  AddKeysToAgent yes\n  UseKeychain yes\n  IdentityFile ~/.ssh/id_github_ed25519\n  IdentitiesOnly yes\n"

    if File.exist?(config_path)
      content = File.read(config_path)
      if content.include?("Host github.com")
        puts "Existing github.com entry in ~/.ssh/config"
        return
      end

      print "Add github.com entry to ~/.ssh/config? [Ynq] "
      case prompt_input
      when "Y", "y", ""
        content.sub!(/^Host \*/, "#{github_entry}\nHost *")
        File.write(config_path, content)
      when "q"
        exit
      else
        puts "Skipping SSH config update"
      end
    else
      print "Create ~/.ssh/config with github.com entry? [Ynq] "
      case prompt_input
      when "Y", "y", ""
        File.write(config_path, github_entry)
      when "q"
        exit
      else
        puts "Skipping SSH config creation"
      end
    end
  end

  def generate_ssh_key
    key_path = File.join(ENV["HOME"], ".ssh/id_github_ed25519")
    hostname = `hostname`.strip
    email = ENV["USER"] || `whoami`.strip
    comment = "#{email}@#{hostname}"

    if File.exist?(key_path)
      print "SSH key #{key_path} already exists. Regenerate? [Ynq] "
      case prompt_input
      when "Y", "y", ""
        puts "Regenerating SSH key..."
        system %(rm "#{key_path}" "#{key_path}.pub")
      when "q"
        exit
      else
        puts "Skipping SSH key generation"
        return
      end
    end

    puts "Generating SSH key with comment: #{comment}"
    system %(ssh-keygen -t ed25519 -f "#{key_path}" -C "#{comment}")

    if RUBY_PLATFORM.include?("darwin")
      system %(ssh-add --apple-use-keychain "#{key_path}")
    else
      system %(ssh-add "#{key_path}")
    end

    ensure_ssh_config

    print "Upload #{key_path} to GitHub? [Ynq] "
    case prompt_input
    when "Y", "y", ""
      upload_ssh_key_to_github(key_path)
    when "q"
      exit
    else
      puts "Skipping GitHub upload. Add manually at: https://github.com/settings/ssh/new"
    end
  end

  def prompt_input(prompt = nil)
    print prompt if prompt

    input = $stdin.gets
    abort "Error: setup requires interactive input. Run `cd ~/.dotfiles && rake setup` in a terminal." if input.nil?

    input.chomp
  end

  def upload_ssh_key_to_github(key_path)
    unless system("command -v gh >/dev/null 2>&1")
      print "GitHub CLI (gh) not found. Install via Homebrew? [Ynq] "
      case prompt_input
      when "Y", "y", ""
        puts "Installing GitHub CLI..."
        system("brew install gh")
        puts "Please run `gh auth login` first, then re-run this task."
        return
      when "q"
        exit
      else
        puts "Skipping GitHub upload. Add manually at: https://github.com/settings/ssh/new"
        return
      end
    end

    title = `hostname`.strip

    print "Add key for? [A]uthentication, [S]igning, or [B]oth? "
    key_type = prompt_input.downcase

    scopes = case key_type
    when "a" then ["admin:public_key"]
    when "s" then ["admin:ssh_signing_key"]
    when "b" then ["admin:public_key", "admin:ssh_signing_key"]
    when "q" then exit
    else
      puts "Skipping GitHub upload. Add manually at: https://github.com/settings/ssh/new"
      return
    end

    ensure_gh_scopes(scopes)

    case key_type
    when "a"
      system %(gh ssh-key add "#{key_path}.pub" --type authentication --title "#{title}")
      puts "SSH key added to GitHub (authentication)"
    when "s"
      system %(gh ssh-key add "#{key_path}.pub" --type signing --title "#{title}")
      puts "SSH key added to GitHub (signing)"
    when "b"
      system %(gh ssh-key add "#{key_path}.pub" --type authentication --title "#{title}")
      system %(gh ssh-key add "#{key_path}.pub" --type signing --title "#{title}")
      puts "SSH key added to GitHub (authentication and signing)"
    end
  end
end
