NOVA_BINDINGS_EXPORT_PATH = File.join(ENV["HOME"], ".dotfiles/config/nova/Default (customized).json").shellescape
NOVA_BINDINGS_SOURCE_PATH = File.join(ENV["HOME"], "Library/Application Support/Nova/Key Bindings/Default (customized).json").shellescape
NOVA_EXTENSIONS_DIR = File.join(ENV["HOME"], "Library/Application Support/Nova/Extensions/").shellescape
NOVA_EXTENSIONS_EXPORT_PATH = File.join(ENV["HOME"], ".dotfiles/config/nova/extensions.zip").shellescape
NOVA_EXTENSIONS_IMPORT_PATH = File.join(ENV["HOME"], "Library/Application Support/Nova/").shellescape
NOVA_SETTINGS_PATH = File.join(ENV["HOME"], ".dotfiles/config/nova/settings.plist").shellescape

namespace :nova do
  desc "Export settings, extensions, and keybindings from Nova"
  task :export do
    puts "Exporting Nova settings..."
    system %(defaults export com.panic.Nova #{NOVA_SETTINGS_PATH})
    puts "Exporting Nova extensions..."
    system %(ditto -c -k --sequesterRsrc --keepParent #{NOVA_EXTENSIONS_DIR} #{NOVA_EXTENSIONS_EXPORT_PATH})
    puts "Exporting Nova bindings..."
    system %(cp #{NOVA_BINDINGS_SOURCE_PATH} #{NOVA_BINDINGS_EXPORT_PATH})
  end

  task :bindings do
    puts "Importing Nova key bindings..."
    system %(cp #{NOVA_BINDINGS_EXPORT_PATH} #{NOVA_BINDINGS_SOURCE_PATH})
  end

  task :extensions do
    puts "Importing Nova extensions..."
    system %(ditto -x -k #{NOVA_EXTENSIONS_EXPORT_PATH} #{NOVA_EXTENSIONS_IMPORT_PATH})
  end

  task :settings do
    puts "Importing Nova settings..."
    system %(defaults import com.panic.Nova #{NOVA_SETTTINGS_PATH})
  end
end
