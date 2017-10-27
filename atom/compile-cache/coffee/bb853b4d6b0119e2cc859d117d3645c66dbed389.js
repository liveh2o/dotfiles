(function() {
  module.exports = {
    'JavaScript (JSX)': {
      regex: ["(^|\\s|\\.){word}\\s*[:=]\\s*function\\s*\\(", "(^|\\s)function\\s+{word}\\s*\\(", "(^|\\s){word}\\([\\s\\S]*?\\)\\s*{", "(^|\\s)class\\s+{word}(\\s|$)"],
      type: ["*.jsx", "*.js", "*.html"]
    },
    CoffeeScript: {
      regex: ["(^|\\s)class\\s+{word}(\\s|$)", "(^|\\s|\\.){word}\\s*[:=]\\s*(\\([\\s\\S]*?\\))?\\s*[=-]>", "(^|\\s|\\.){word}\\s*[:=]\\s*function\\s*\\(", "(^|\\s)function\\s+{word}\\s*\\(", "(^|\\s){word}\\([\\s\\S]*?\\)\\s*{"],
      type: ["*.coffee", "*.js", "*.html"]
    },
    TypeScript: {
      regex: ["(^|\\s)class\\s+{word}(\\s|$)", "(^|\\s|\\.){word}\\s*[:=]\\s*(\\([\\s\\S]*?\\))?\\s*[=-]>", "(^|\\s|\\.){word}\\s*[:=]\\s*function\\s*\\(", "(^|\\s)function\\s+{word}\\s*\\(", "(^|\\s){word}\\([\\s\\S]*?\\)\\s*{"],
      type: ["*.ts", "*.html"]
    },
    Python: {
      regex: ["(^|\\s)class\\s+{word}\\s*\\(", "(^|\\s)def\\s+{word}\\s*\\("],
      type: ["*.py"]
    },
    PHP: {
      regex: ["(^|\\s)class\\s+{word}(\\s|{|$)", "(^|\\s)interface\\s+{word}(\\s|{|$)", "(^|\\s)(static\\s+)?((public|private|protected)\\s+)?(static\\s+)?function\\s+{word}\\s*\\("],
      type: ["*.php"]
    },
    Hack: {
      regex: ["(^|\\s)class\\s+{word}(\\s|{|$)", "(^|\\s)interface\\s+{word}(\\s|{|$)", "(^|\\s)(static\\s+)?((public|private|protected)\\s+)?(static\\s+)?function\\s+{word}\\s*\\("],
      type: ["*.hh"]
    },
    Ruby: {
      regex: ["(^|\\s)class\\s+{word}(\\s|$)", "(^|\\s)module\\s+{word}(\\s|$)", "(^|\\s)def\\s+(?:self\\.)?{word}\\s*\\(?", "(^|\\s)define_method\\s+:?{word}\\s*\\(?"],
      type: ["*.rb"]
    },
    KRL: {
      regex: ["(^|\\s)DEF\\s+{word}\\s*\\(", "(^|\\s)DECL\\s+\\w*?{word}\\s*\\=?", "(^|\\s)(SIGNAL|INT|BOOL|REAL|STRUC|CHAR|ENUM|EXT|\\s)\\s*\\w*{word}.*"],
      type: ["*.src", "*.dat"]
    },
    Perl: {
      regex: ["(^|\\s)sub\\s+{word}\\s*\\{", "(^|\\s)package\\s+(\\w+::)*{word}\\s*\\;"],
      type: ["*.pm", "*.pl"]
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2dvdG8tZGVmaW5pdGlvbi9saWIvY29uZmlnLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxrQkFBQSxFQUNFO0FBQUEsTUFBQSxLQUFBLEVBQU8sQ0FDTCw4Q0FESyxFQUVMLGtDQUZLLEVBR0wsb0NBSEssRUFJTCwrQkFKSyxDQUFQO0FBQUEsTUFNQSxJQUFBLEVBQU0sQ0FBQyxPQUFELEVBQVUsTUFBVixFQUFrQixRQUFsQixDQU5OO0tBREY7QUFBQSxJQVNBLFlBQUEsRUFDRTtBQUFBLE1BQUEsS0FBQSxFQUFPLENBQ0wsK0JBREssRUFFTCwyREFGSyxFQUdMLDhDQUhLLEVBSUwsa0NBSkssRUFLTCxvQ0FMSyxDQUFQO0FBQUEsTUFPQSxJQUFBLEVBQU0sQ0FBQyxVQUFELEVBQWEsTUFBYixFQUFxQixRQUFyQixDQVBOO0tBVkY7QUFBQSxJQW1CQSxVQUFBLEVBQ0U7QUFBQSxNQUFBLEtBQUEsRUFBTyxDQUNMLCtCQURLLEVBRUwsMkRBRkssRUFHTCw4Q0FISyxFQUlMLGtDQUpLLEVBS0wsb0NBTEssQ0FBUDtBQUFBLE1BT0EsSUFBQSxFQUFNLENBQUMsTUFBRCxFQUFTLFFBQVQsQ0FQTjtLQXBCRjtBQUFBLElBNkJBLE1BQUEsRUFDRTtBQUFBLE1BQUEsS0FBQSxFQUFPLENBQ0wsK0JBREssRUFFTCw2QkFGSyxDQUFQO0FBQUEsTUFJQSxJQUFBLEVBQU0sQ0FBQyxNQUFELENBSk47S0E5QkY7QUFBQSxJQW9DQSxHQUFBLEVBQ0U7QUFBQSxNQUFBLEtBQUEsRUFBTyxDQUNMLGlDQURLLEVBRUwscUNBRkssRUFHTCw2RkFISyxDQUFQO0FBQUEsTUFLQSxJQUFBLEVBQU0sQ0FBQyxPQUFELENBTE47S0FyQ0Y7QUFBQSxJQTRDQSxJQUFBLEVBQ0U7QUFBQSxNQUFBLEtBQUEsRUFBTyxDQUNMLGlDQURLLEVBRUwscUNBRkssRUFHTCw2RkFISyxDQUFQO0FBQUEsTUFLQSxJQUFBLEVBQU0sQ0FBQyxNQUFELENBTE47S0E3Q0Y7QUFBQSxJQW9EQSxJQUFBLEVBQ0U7QUFBQSxNQUFBLEtBQUEsRUFBTyxDQUNMLCtCQURLLEVBRUwsZ0NBRkssRUFHTCwwQ0FISyxFQUlMLDBDQUpLLENBQVA7QUFBQSxNQU1BLElBQUEsRUFBTSxDQUFDLE1BQUQsQ0FOTjtLQXJERjtBQUFBLElBNkRBLEdBQUEsRUFDRTtBQUFBLE1BQUEsS0FBQSxFQUFPLENBQ0wsNkJBREssRUFFTCxvQ0FGSyxFQUdMLHVFQUhLLENBQVA7QUFBQSxNQUtBLElBQUEsRUFBTSxDQUFDLE9BQUQsRUFBUyxPQUFULENBTE47S0E5REY7QUFBQSxJQXFFQSxJQUFBLEVBQ0U7QUFBQSxNQUFBLEtBQUEsRUFBTyxDQUNMLDZCQURLLEVBRUwsMENBRkssQ0FBUDtBQUFBLE1BSUEsSUFBQSxFQUFNLENBQUMsTUFBRCxFQUFRLE1BQVIsQ0FKTjtLQXRFRjtHQURGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/ah/.atom/packages/goto-definition/lib/config.coffee
