require "json"

namespace :gh do
  ENV["GITHUB_SSHKEY"] ||= "~/.ssh/github_ed25519"

  task :install do
    system("/opt/homebrew/bin/brew install -q gh")
  end

  task sshkey: [:install] do
    key_path = File.expand_path(ENV["GITHUB_SSHKEY"])
    hostname = `hostname`.strip
    email = ENV["USER"] || `whoami`.strip
    comment = "#{email}@#{hostname}"

    if File.exist?(key_path)
      next unless ask("SSH key #{key_path} already exists. Regenerate?") do
        system %(rm "#{key_path}" "#{key_path}.pub")
      end
    end

    puts "Generating SSH key with comment: #{comment}"
    system %(ssh-keygen -t ed25519 -f "#{key_path}" -C "#{comment}")
    system %(ssh-add --apple-use-keychain "#{key_path}")

    config_path = File.join(ENV["HOME"], ".ssh/config")
    github_entry = <<~CONFIG
      Host github.com
        AddKeysToAgent yes
        UseKeychain yes
        IdentityFile #{key_path}
        IdentitiesOnly yes
    CONFIG

    if File.exist?(config_path)
      content = File.read(config_path)
      if content.include?("Host github.com")
        puts "Existing github.com entry in ~/.ssh/config."
      else
        ask("Add github.com entry to ~/.ssh/config?") do
          content.sub!(/^Host \*/, "#{github_entry}\nHost *")
          File.write(config_path, content)
        end
      end
    else
      ask("Create ~/.ssh/config with github.com entry?") { File.write(config_path, github_entry) }
    end
  end

  task "sshkey:add" => [:install] do
    key_path = File.expand_path(ENV["GITHUB_SSHKEY"])
    unless File.exist?(key_path)
      puts "No key found at #{key_path}. Run rake gh:sshkey first."
      next
    end

    title = `hostname`.strip
    scopes = ["admin:public_key", "admin:ssh_signing_key"]

    status = `gh auth status -h github.com 2>&1`
    scopes_line = status.each_line.find { |l| l.include?("Token scopes:") }
    current_scopes = scopes_line ? scopes_line.scan(/'([^']+)'/).flatten : []
    missing_scopes = scopes - current_scopes

    if missing_scopes.any?
      scope_list = missing_scopes.join(", ")
      next unless ask("GitHub CLI needs the #{scope_list} scope(s). Authorize them?") do
        system("gh", "auth", "refresh", "-h", "github.com", "-s", missing_scopes.join(","))
      end
    end

    puts "Adding SSH key to GitHub (authentication)..."
    system %(gh ssh-key add "#{key_path}.pub" --type authentication --title "#{title}")

    puts "Adding SSH key to GitHub (signing)..."
    system %(gh ssh-key add "#{key_path}.pub" --type signing --title "#{title}")
  end

  task "sshkey:delete" => [:install] do
    key_path = File.expand_path(ENV["GITHUB_SSHKEY"])
    pub_path = "#{key_path}.pub"

    if File.exist?(key_path)
      next unless ask("Remove SSH key from GitHub and delete #{key_path}?")
    else
      puts "No key found at #{key_path}."
      next
    end

    if File.exist?(pub_path)
      pub_key = File.read(pub_path).strip
      key_id = pub_key.split(" ").first(2).join(" ")
      auth_keys = JSON.parse(`gh api user/keys 2>/dev/null`) rescue []
      signing_keys = JSON.parse(`gh api user/ssh_signing_keys 2>/dev/null`) rescue []

      auth_keys.select { |k| k["key"] == key_id }.each do |k|
        puts "Deleting authentication key #{k["id"]} from GitHub..."
        system("gh", "ssh-key", "delete", k["id"].to_s, "-y")
      end

      signing_keys.select { |k| k["key"] == key_id }.each do |k|
        puts "Deleting signing key #{k["id"]} from GitHub..."
        system("gh", "ssh-key", "delete", k["id"].to_s, "-y")
      end
    else
      puts "No public key at #{pub_path}; skipping GitHub lookup."
    end

    system %(ssh-add --apple-use-keychain -d "#{key_path}" 2>/dev/null)
    system %(rm -f "#{key_path}" "#{key_path}.pub")
    puts "Deleted SSH key #{key_path}."
  end
end
