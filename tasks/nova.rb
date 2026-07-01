NOVA_EXTENSIONS_IMPORT_PATH = File.join(ENV["HOME"], "Library/Application Support/Nova/Extensions/").shellescape
NOVA_EXTENSIONS_EXPORT_PATH = File.join(ENV["HOME"], ".dotfiles/config/nova/extensions.zip").shellescape
NOVA_SETTINGS_PATH = File.join(ENV["HOME"], ".dotfiles/config/nova/settings.plist").shellescape

namespace :nova do
  desc "Export settings and extensions from Nova"
  task :export do
    puts "Exporting Nova settings..."
    system %(defaults export com.panic.Nova #{NOVA_SETTINGS_PATH})
    puts "Exporting Nova extensions..."
    system %(ditto -c -k --sequesterRsrc --keepParent #{NOVA_EXTENSIONS_IMPORT_PATH} #{NOVA_EXTENSIONS_EXPORT_PATH})
  end

  desc "Import settings and extensions into Nova"
  task :import do
    puts "Importing Nova settings..."
    system %(defaults import com.panic.Nova #{NOVA_SETTINGS_PATH})
    puts "Importing Nova extensions..."
    system %(ditto -x -k #{NOVA_EXTENSIONS_EXPORT_PATH} #{NOVA_EXTENSIONS_IMPORT_PATH})
  end
end
