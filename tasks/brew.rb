namespace :brew do
  task :devtools do
    system("xcode-select --install") unless system("xcode-select -p > /dev/null 2>&1")
  end

  task install: [:devtools] do
    next if File.exist?(File.join("/opt/homebrew"))

    system('/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"')
    system("/opt/homebrew/bin/brew shellenv")
  end

  desc "Install Mac App Store apps via Homebrew"
  task apps: [:install] do
    system("/opt/homebrew/bin/brew bundle --no-upgrade --file #{ENV["DOTFILES"]}/Brewfile.apps")
  end

  desc "Install Homebrew packages from HOMEBREW_BUNDLE_FILE"
  task bundle: [:install] do
    system("/opt/homebrew/bin/brew bundle --no-upgrade --file #{ENV["HOMEBREW_BUNDLE_FILE"]}")
  end
end
