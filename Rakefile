require "rake"
require "erb"
require "shellwords"

NOVA_EXTENSIONS_IMPORT_PATH = File.join(ENV["HOME"], "Library/Application Support/Nova/Extensions/").shellescape
NOVA_EXTENSIONS_EXPORT_PATH = File.join(ENV["HOME"], ".dotfiles/config/nova/extensions.zip").shellescape
NOVA_SETTTINGS_PATH = File.join(ENV["HOME"], ".dotfiles/config/nova/settings.plist").shellescape

desc "Install the dot files into user's home directory"
task :dotfiles do
  files = Dir["*"] - %w[LICENSE Rakefile README.md config oh-my-zsh]

  # Skip all Brewfiles
  files.reject! { |file| file.start_with?("Brewfile") }

  files << "config/gh/config.yml"
  files << "config/ghostty"
  files << "config/mise"
  files << "config/opencode/opencode.jsonc"
  files << "config/opencode/tui.json"
  files << "config/starship.toml"

  if switch_to_zsh && install_oh_my_zsh
    files << "oh-my-zsh/custom/aliases.zsh"
    files << "oh-my-zsh/custom/plugins/liveh2o"
  end

  link_or_replace_dotfiles(files)
end

desc "Setup the environment"
task :env do
  install_command_line_tools
  install_homebrew
  install_homebrew_packages
  create_postgresql_user
  import_divvy_shortcuts
  import_nova_settings_and_extensions
  generate_ssh_key
end

desc "Setup environment, install apps, and link dotfiles"
task setup: [:env, :dotfiles]

desc "Export settings and extensions from Nova"
task "nova:export" do
  puts "Exporting Nova settings..."
  system %(defaults export com.panic.Nova #{NOVA_SETTTINGS_PATH})
  puts "Exporting Nova extensions..."
  system %(ditto -c -k --sequesterRsrc --keepParent #{NOVA_EXTENSIONS_IMPORT_PATH} #{NOVA_EXTENSIONS_EXPORT_PATH})
end

desc "Export shortcuts from Divvy (https://mizage.com/help/divvy/export_import.html)"
task "divvy:export" do
  system %(open divvy://export)
  system %(pbpaste > config/divvy.uri)
end

desc "Generate GitHub SSH key (id_github_ed25519)"
task "ssh:keygen" do
  generate_ssh_key
end

desc "Upload existing SSH key to GitHub"
task "ssh:upload" do
  key_path = File.join(ENV["HOME"], ".ssh/id_github_ed25519")
  unless File.exist?(key_path)
    puts "No key found at #{key_path}. Run rake ssh:keygen first."
    next
  end
  upload_ssh_key_to_github(key_path)
end

def import_divvy_shortcuts
  print "Import Divvy shortcuts? [Ynq] "
  case $stdin.gets.chomp
  when "Y", "y", ""
    system %(open "$(cat config/divvy.uri)")
  when "q"
    exit
  else
    puts "Skipping Divvy shortcuts"
  end
end

def import_nova_settings_and_extensions
  print "Import Nova settings? [Ynq] "
  case $stdin.gets.chomp
  when "Y", "y", ""
    system %(defaults import com.panic.Nova #{NOVA_SETTTINGS_PATH})
  when "q"
    exit
  else
    puts "Skipping Nova settings"
  end

  print "Import Nova extensions? [Ynq] "
  case $stdin.gets.chomp
  when "Y", "y", ""
    system %(ditto -x -k #{NOVA_EXTENSIONS_EXPORT_PATH} #{NOVA_EXTENSIONS_IMPORT_PATH})
  when "q"
    exit
  else
    puts "Skipping Nova extensions"
  end
end

def create_postgresql_user
  print "Create PostgreSQL user? [Ynq] "
  case $stdin.gets.chomp
  when "Y", "y", ""
    print "username [postgres]: "
    username = $stdin.gets.chomp
    username = "postgres" if username.empty?
    puts "Creating PostgreSQL user: postgres"
    system %(createuser -s #{username})
  when "q"
    exit
  else
    puts "Skipping PostgreSQL user"
  end
end

def install_command_line_tools
  print "Installing Xcode Command Line Tools? [Ynq] "
  case $stdin.gets.chomp
  when "Y", "y", ""
    puts "Installing Xcode Command Line Tools..."
    system %(xcode-select --install)
  when "q"
    exit
  else
    puts "Skipping Xcode Command Line Tools"
  end
end

def install_homebrew
  if File.exist?(File.join("/opt/homebrew"))
    puts "Found /opt/homebrew"
  else
    print "Install Homebrew? [Ynq] "
    case $stdin.gets.chomp
    when "Y", "y", ""
      puts "Installing Homebrew..."
      system '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"'
      system "/opt/homebrew/bin/brew shellenv"
    when "q"
      exit
    else
      puts "Skipping Homebrew"
    end
  end
end

def install_homebrew_packages
  print "Install Homebrew packages from #{ENV["HOMEBREW_BUNDLE_FILE"]}? [Ynq] "
  case $stdin.gets.chomp
  when "Y", "y", ""
    system %(brew bundle --no-upgrade)
  when "q"
    exit
  else
    puts "Skipping Homebrew packages"
  end
end

def install_oh_my_zsh
  if File.exist?(File.join(ENV["HOME"], ".oh-my-zsh"))
    puts "Found ~/.oh-my-zsh"
    true
  else
    print "Install Oh My Zsh? [Ynq] "
    case $stdin.gets.chomp
    when "Y", "y", ""
      puts "Installing Oh My Zsh"
      system %(git clone https://github.com/robbyrussell/oh-my-zsh.git "$HOME/.oh-my-zsh")
      true
    when "q"
      exit
    else
      puts "Skipping Oh My Zsh, you will need to change ~/.zshrc"
      false
    end
  end
end

def link_dotfile(file)
  if /.erb$/.match?(file)
    puts "Generating ~/.#{file.sub(".erb", "")}"

    if /gitconfig/.match?(file)
      print "  git user.name: "
      ENV["GIT_USER_NAME"] = $stdin.gets.chomp
      print "  git user.email: "
      ENV["GIT_USER_EMAIL"] = $stdin.gets.chomp
    end

    File.write(File.join(ENV["HOME"], ".#{file.sub(".erb", "")}"), ERB.new(File.read(file)).result(binding))
  else
    puts "linking ~/.#{file}"
    link_file("$PWD/#{file}", file)
  end
end

def link_file(source, dotfile)
  system %(ln -s "#{source}" "$HOME/.#{dotfile}")
end

def link_or_replace_dotfiles(files, force: false)
  files.each do |file|
    if File.exist?(File.join(ENV["HOME"], ".#{file.sub(".erb", "")}"))
      if File.identical? file, File.join(ENV["HOME"], ".#{file.sub(".erb", "")}")
        puts "Identical ~/.#{file.sub(".erb", "")}"
      elsif force
        replace_file(file)
      else
        print "Overwrite ~/.#{file.sub(".erb", "")}? [Ynaq] "
        case $stdin.gets.chomp
        when "a"
          force = true
          replace_file(file)
        when "Y", "y", ""
          replace_file(file)
        when "q"
          exit
        else
          puts "Skipping ~/.#{file.sub(".erb", "")}"
        end
      end
    else
      link_dotfile(file)
    end
  end
end

def replace_file(file)
  system %(rm -rf "$HOME/.#{file.sub(".erb", "")}")
  link_file("$PWD/#{file}", file)
end

def switch_to_zsh
  if /zsh/.match?(ENV["SHELL"])
    puts "Using Zsh"
    true
  else
    print "Switch to Zsh? (recommended) [Ynq] "
    case $stdin.gets.chomp
    when "Y", "y", ""
      puts "Switching to Zsh"
      system %(chsh -s `which zsh`)
      true
    when "q"
      exit
    else
      puts "Skipping Zsh"
      false
    end
  end
end

def ensure_ssh_config
  config_path = File.join(ENV["HOME"], ".ssh/config")
  github_entry = "Host github.com\n  AddKeysToAgent yes\n  UseKeychain yes\n  IdentityFile ~/.ssh/id_github_ed25519\n"

  if File.exist?(config_path)
    content = File.read(config_path)
    if content.include?("Host github.com")
      puts "Existing github.com entry in ~/.ssh/config"
      return
    end

    print "Add github.com entry to ~/.ssh/config? [Ynq] "
    case $stdin.gets.chomp
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
    case $stdin.gets.chomp
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
    case $stdin.gets.chomp
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
  case $stdin.gets.chomp
  when "Y", "y", ""
    upload_ssh_key_to_github(key_path)
  when "q"
    exit
  else
    puts "Skipping GitHub upload. Add manually at: https://github.com/settings/ssh/new"
  end
end

def upload_ssh_key_to_github(key_path)
  unless system("command -v gh >/dev/null 2>&1")
    print "GitHub CLI (gh) not found. Install via Homebrew? [Ynq] "
    case $stdin.gets.chomp
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
  key_type = $stdin.gets.chomp.downcase

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

def ensure_gh_scopes(scopes)
  status = `gh auth status -h github.com 2>&1`
  scopes_line = status.each_line.find { |l| l.include?("Token scopes:") }
  current_scopes = scopes_line ? scopes_line.split(":").last.to_s.strip.split(", ") : []
  missing_scopes = scopes - current_scopes
  return if missing_scopes.empty?

  scope_list = missing_scopes.join(", ")
  print "GitHub CLI needs the #{scope_list} scope(s). Authorize them? [Ynq] "
  case $stdin.gets.chomp
  when "Y", "y", ""
    system("gh", "auth", "refresh", "-h", "github.com", "-s", missing_scopes.join(","))
  when "q"
    exit
  else
    puts "Skipping scope authorization. Upload may fail."
  end
end
