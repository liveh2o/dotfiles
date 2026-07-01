namespace :divvy do
  desc "Export shortcuts from Divvy (https://mizage.com/help/divvy/export_import.html)"
  task :export do
    system %(open divvy://export)
    system %(pbpaste > config/divvy.uri)
  end

  task :import do
    system %(open "$(cat config/divvy.uri)")
  end
end
