(function() {
  module.exports = {
    'JavaScript (JSX)': {
      word: /[$0-9a-zA-Z_]+/,
      regex: [/(^|\s|\.){word}\s*[:=]\s*function\s*\(/, /(^|\s)function\s+{word}\s*\(/, /(^|\s)function\s+{word}\s*\(/, /(^|\s){word}\([^\(]*?\)\s*\{/, /(^|\s)class\s+{word}(\s|$)/],
      type: ['*.jsx', '*.js', '*.html']
    },
    CoffeeScript: {
      word: /[$0-9a-zA-Z_]+/,
      regex: [/(^|\s)class\s+{word}(\s|$)/, /(^|\s|\.|@){word}\s*[:=]\s*(\([^\(]*?\))?\s*[=-]>/, /(^|\s|\.){word}\s*[:=]\s*function\s*\(/, /(^|\s)function\s+{word}\s*\(/, /(^|\s){word}\([^\(]*?\)\s*\{/],
      type: ['*.coffee', '*.js', '*.html']
    },
    TypeScript: {
      word: /[$0-9a-zA-Z_]+/,
      regex: [/(^|\s)class\s+{word}(\s|$)/, /(^|\s|\.){word}\s*[:=]\s*(\([^\(]*?\))?\s*[=-]>/, /(^|\s|\.){word}\s*[:=]\s*function\s*\(/, /(^|\s)function\s+{word}\s*\(/, /(^|\s){word}\([^\(]*?\)\s*\{/],
      type: ['*.ts', '*.html']
    },
    Python: {
      word: /[0-9a-zA-Z_]+/,
      regex: [/(^|\s)class\s+{word}\s*\(/, /(^|\s)def\s+{word}\s*\(/],
      type: ['*.py']
    },
    PHP: {
      word: /[0-9a-zA-Z_]+/,
      regex: [/(^|\s)class\s+{word}(\s|\{|$)/, /(^|\s)interface\s+{word}(\s|\{|$)/, /(^|\s)trait\s+{word}(\s|\{|$)/, /(^|\s)(static\s+)?((public|private|protected)\s+)?(static\s+)?function\s+{word}\s*\(/, /(^|\s)const\s+{word}(\s|=|;|$)/],
      type: ['*.php', '*.php3', '*.phtml']
    },
    ASP: {
      word: /[0-9a-zA-Z_]+/,
      regex: [/(^|\s)(function|sub)\s+{word}\s*\(/],
      type: ['*.asp']
    },
    Hack: {
      word: /[0-9a-zA-Z_]+/,
      regex: [/(^|\s)class\s+{word}(\s|\{|$)/, /(^|\s)interface\s+{word}(\s|\{|$)/, /(^|\s)(static\s+)?((public|private|protected)\s+)?(static\s+)?function\s+{word}\s*\(/],
      type: ['*.hh']
    },
    Ruby: {
      word: /[0-9a-zA-Z_]+/,
      regex: [/(^|\s)class\s+{word}(\s|$)/, /(^|\s)module\s+{word}(\s|$)/, /(^|\s)def\s+(?:self\.)?{word}\s*\(?/, /(^|\s)scope\s+:{word}\s*\(?/, /(^|\s)attr_accessor\s+:{word}(\s|$)/, /(^|\s)attr_reader\s+:{word}(\s|$)/, /(^|\s)attr_writer\s+:{word}(\s|$)/, /(^|\s)define_method\s+:?{word}\s*\(?/],
      type: ['*.rb', '*.ru', '*.haml', '*.erb', '*.rake']
    },
    Puppet: {
      word: /[0-9a-zA-Z_]+/,
      regex: [/(^|\s)class\s+{word}(\s|$)/],
      type: ['*.pp']
    },
    KRL: {
      word: /[0-9a-zA-Z_]+/,
      regex: [/(^|\s)DEF\s+{word}\s*\(/, /(^|\s)DECL\s+\w*?{word}\s*\=?/, /(^|\s)(SIGNAL|INT|BOOL|REAL|STRUC|CHAR|ENUM|EXT|\s)\s*\w*{word}.*/],
      type: ['*.src', '*.dat']
    },
    Perl: {
      word: /[0-9a-zA-Z_]+/,
      regex: [/(^|\s)sub\s+{word}\s*\{/, /(^|\s)package\s+(\w+::)*{word}\s*\;/],
      type: ['*.pm', '*.pl']
    },
    'C/C++': {
      word: /[0-9a-zA-Z_]+/,
      regex: [/(^|\s)class\s+{word}(\s|:)/, /(^|\s)struct\s+{word}(\s|\{|$)/, /(^|\s)enum\s+{word}(\s|\{|$)/, /(^|\s)#define\s+{word}(\s|\(|$)/, /(^|\s)typedef\s.*(\s|\*|\(){word}(\s|;|\)|$)/, /(^|\s|\*|:|&){word}\s*\(.*\)(\s*|\s*const\s*)(\{|$)/],
      type: ['*.c', '*.cc', '*.cpp', '*.h', '*.hh', '*.hpp', '*.inc']
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2dvdG8tZGVmaW5pdGlvbi9saWIvY29uZmlnLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxrQkFBQSxFQUNFO01BQUEsSUFBQSxFQUFNLGdCQUFOO01BQ0EsS0FBQSxFQUFPLENBQ0wsd0NBREssRUFFTCw4QkFGSyxFQUdMLDhCQUhLLEVBSUwsOEJBSkssRUFLTCw0QkFMSyxDQURQO01BUUEsSUFBQSxFQUFNLENBQUMsT0FBRCxFQUFVLE1BQVYsRUFBa0IsUUFBbEIsQ0FSTjtLQURGO0lBV0EsWUFBQSxFQUNFO01BQUEsSUFBQSxFQUFNLGdCQUFOO01BQ0EsS0FBQSxFQUFPLENBQ0wsNEJBREssRUFFTCxtREFGSyxFQUdMLHdDQUhLLEVBSUwsOEJBSkssRUFLTCw4QkFMSyxDQURQO01BUUEsSUFBQSxFQUFNLENBQUMsVUFBRCxFQUFhLE1BQWIsRUFBcUIsUUFBckIsQ0FSTjtLQVpGO0lBc0JBLFVBQUEsRUFDRTtNQUFBLElBQUEsRUFBTSxnQkFBTjtNQUNBLEtBQUEsRUFBTyxDQUNMLDRCQURLLEVBRUwsaURBRkssRUFHTCx3Q0FISyxFQUlMLDhCQUpLLEVBS0wsOEJBTEssQ0FEUDtNQVFBLElBQUEsRUFBTSxDQUFDLE1BQUQsRUFBUyxRQUFULENBUk47S0F2QkY7SUFpQ0EsTUFBQSxFQUNFO01BQUEsSUFBQSxFQUFNLGVBQU47TUFDQSxLQUFBLEVBQU8sQ0FDTCwyQkFESyxFQUVMLHlCQUZLLENBRFA7TUFLQSxJQUFBLEVBQU0sQ0FBQyxNQUFELENBTE47S0FsQ0Y7SUF5Q0EsR0FBQSxFQUNFO01BQUEsSUFBQSxFQUFNLGVBQU47TUFDQSxLQUFBLEVBQU8sQ0FDTCwrQkFESyxFQUVMLG1DQUZLLEVBR0wsK0JBSEssRUFJTCxzRkFKSyxFQUtMLGdDQUxLLENBRFA7TUFRQSxJQUFBLEVBQU0sQ0FBQyxPQUFELEVBQVUsUUFBVixFQUFvQixTQUFwQixDQVJOO0tBMUNGO0lBb0RBLEdBQUEsRUFDRTtNQUFBLElBQUEsRUFBTSxlQUFOO01BQ0EsS0FBQSxFQUFPLENBQ0wsb0NBREssQ0FEUDtNQUlBLElBQUEsRUFBTSxDQUFDLE9BQUQsQ0FKTjtLQXJERjtJQTJEQSxJQUFBLEVBQ0U7TUFBQSxJQUFBLEVBQU0sZUFBTjtNQUNBLEtBQUEsRUFBTyxDQUNMLCtCQURLLEVBRUwsbUNBRkssRUFHTCxzRkFISyxDQURQO01BTUEsSUFBQSxFQUFNLENBQUMsTUFBRCxDQU5OO0tBNURGO0lBb0VBLElBQUEsRUFDRTtNQUFBLElBQUEsRUFBTSxlQUFOO01BQ0EsS0FBQSxFQUFPLENBQ0wsNEJBREssRUFFTCw2QkFGSyxFQUdMLHFDQUhLLEVBSUwsNkJBSkssRUFLTCxxQ0FMSyxFQU1MLG1DQU5LLEVBT0wsbUNBUEssRUFRTCxzQ0FSSyxDQURQO01BV0EsSUFBQSxFQUFNLENBQUMsTUFBRCxFQUFTLE1BQVQsRUFBaUIsUUFBakIsRUFBMkIsT0FBM0IsRUFBb0MsUUFBcEMsQ0FYTjtLQXJFRjtJQWtGQSxNQUFBLEVBQ0U7TUFBQSxJQUFBLEVBQU0sZUFBTjtNQUNBLEtBQUEsRUFBTyxDQUNMLDRCQURLLENBRFA7TUFJQSxJQUFBLEVBQU0sQ0FBQyxNQUFELENBSk47S0FuRkY7SUF5RkEsR0FBQSxFQUNFO01BQUEsSUFBQSxFQUFNLGVBQU47TUFDQSxLQUFBLEVBQU8sQ0FDTCx5QkFESyxFQUVMLCtCQUZLLEVBR0wsbUVBSEssQ0FEUDtNQU1BLElBQUEsRUFBTSxDQUFDLE9BQUQsRUFBVSxPQUFWLENBTk47S0ExRkY7SUFrR0EsSUFBQSxFQUNFO01BQUEsSUFBQSxFQUFNLGVBQU47TUFDQSxLQUFBLEVBQU8sQ0FDTCx5QkFESyxFQUVMLHFDQUZLLENBRFA7TUFLQSxJQUFBLEVBQU0sQ0FBQyxNQUFELEVBQVMsTUFBVCxDQUxOO0tBbkdGO0lBMEdBLE9BQUEsRUFDRTtNQUFBLElBQUEsRUFBTSxlQUFOO01BQ0EsS0FBQSxFQUFPLENBQ0wsNEJBREssRUFFTCxnQ0FGSyxFQUdMLDhCQUhLLEVBSUwsaUNBSkssRUFLTCw4Q0FMSyxFQU1MLHFEQU5LLENBRFA7TUFTQSxJQUFBLEVBQU0sQ0FBQyxLQUFELEVBQVEsTUFBUixFQUFnQixPQUFoQixFQUF5QixLQUF6QixFQUFnQyxNQUFoQyxFQUF3QyxPQUF4QyxFQUFpRCxPQUFqRCxDQVROO0tBM0dGOztBQURGIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPVxuICAnSmF2YVNjcmlwdCAoSlNYKSc6XG4gICAgd29yZDogL1skMC05YS16QS1aX10rL1xuICAgIHJlZ2V4OiBbXG4gICAgICAvKF58XFxzfFxcLil7d29yZH1cXHMqWzo9XVxccypmdW5jdGlvblxccypcXCgvLFxuICAgICAgLyhefFxccylmdW5jdGlvblxccyt7d29yZH1cXHMqXFwoL1xuICAgICAgLyhefFxccylmdW5jdGlvblxccyt7d29yZH1cXHMqXFwoL1xuICAgICAgLyhefFxccyl7d29yZH1cXChbXlxcKF0qP1xcKVxccypcXHsvICAjIEVTNlxuICAgICAgLyhefFxccyljbGFzc1xccyt7d29yZH0oXFxzfCQpL1xuICAgIF1cbiAgICB0eXBlOiBbJyouanN4JywgJyouanMnLCAnKi5odG1sJ11cblxuICBDb2ZmZWVTY3JpcHQ6XG4gICAgd29yZDogL1skMC05YS16QS1aX10rL1xuICAgIHJlZ2V4OiBbXG4gICAgICAvKF58XFxzKWNsYXNzXFxzK3t3b3JkfShcXHN8JCkvLFxuICAgICAgLyhefFxcc3xcXC58QCl7d29yZH1cXHMqWzo9XVxccyooXFwoW15cXChdKj9cXCkpP1xccypbPS1dPi9cbiAgICAgIC8oXnxcXHN8XFwuKXt3b3JkfVxccypbOj1dXFxzKmZ1bmN0aW9uXFxzKlxcKC8gIyBKYXZhU2NyaXB0IEZ1bmN0aW9uXG4gICAgICAvKF58XFxzKWZ1bmN0aW9uXFxzK3t3b3JkfVxccypcXCgvXG4gICAgICAvKF58XFxzKXt3b3JkfVxcKFteXFwoXSo/XFwpXFxzKlxcey8gICMgRVM2XG4gICAgXVxuICAgIHR5cGU6IFsnKi5jb2ZmZWUnLCAnKi5qcycsICcqLmh0bWwnXVxuXG4gIFR5cGVTY3JpcHQ6XG4gICAgd29yZDogL1skMC05YS16QS1aX10rL1xuICAgIHJlZ2V4OiBbXG4gICAgICAvKF58XFxzKWNsYXNzXFxzK3t3b3JkfShcXHN8JCkvXG4gICAgICAvKF58XFxzfFxcLil7d29yZH1cXHMqWzo9XVxccyooXFwoW15cXChdKj9cXCkpP1xccypbPS1dPi9cbiAgICAgIC8oXnxcXHN8XFwuKXt3b3JkfVxccypbOj1dXFxzKmZ1bmN0aW9uXFxzKlxcKC8gIyBKYXZhU2NyaXB0IEZ1bmN0aW9uXG4gICAgICAvKF58XFxzKWZ1bmN0aW9uXFxzK3t3b3JkfVxccypcXCgvXG4gICAgICAvKF58XFxzKXt3b3JkfVxcKFteXFwoXSo/XFwpXFxzKlxcey8gICMgRVM2XG4gICAgXVxuICAgIHR5cGU6IFsnKi50cycsICcqLmh0bWwnXVxuXG4gIFB5dGhvbjpcbiAgICB3b3JkOiAvWzAtOWEtekEtWl9dKy9cbiAgICByZWdleDogW1xuICAgICAgLyhefFxccyljbGFzc1xccyt7d29yZH1cXHMqXFwoL1xuICAgICAgLyhefFxccylkZWZcXHMre3dvcmR9XFxzKlxcKC9cbiAgICBdXG4gICAgdHlwZTogWycqLnB5J11cblxuICBQSFA6XG4gICAgd29yZDogL1swLTlhLXpBLVpfXSsvXG4gICAgcmVnZXg6IFtcbiAgICAgIC8oXnxcXHMpY2xhc3NcXHMre3dvcmR9KFxcc3xcXHt8JCkvXG4gICAgICAvKF58XFxzKWludGVyZmFjZVxccyt7d29yZH0oXFxzfFxce3wkKS9cbiAgICAgIC8oXnxcXHMpdHJhaXRcXHMre3dvcmR9KFxcc3xcXHt8JCkvXG4gICAgICAvKF58XFxzKShzdGF0aWNcXHMrKT8oKHB1YmxpY3xwcml2YXRlfHByb3RlY3RlZClcXHMrKT8oc3RhdGljXFxzKyk/ZnVuY3Rpb25cXHMre3dvcmR9XFxzKlxcKC9cbiAgICAgIC8oXnxcXHMpY29uc3RcXHMre3dvcmR9KFxcc3w9fDt8JCkvXG4gICAgXVxuICAgIHR5cGU6IFsnKi5waHAnLCAnKi5waHAzJywgJyoucGh0bWwnXVxuXG4gIEFTUDpcbiAgICB3b3JkOiAvWzAtOWEtekEtWl9dKy9cbiAgICByZWdleDogW1xuICAgICAgLyhefFxccykoZnVuY3Rpb258c3ViKVxccyt7d29yZH1cXHMqXFwoL1xuICAgIF1cbiAgICB0eXBlOiBbJyouYXNwJ11cblxuICBIYWNrOlxuICAgIHdvcmQ6IC9bMC05YS16QS1aX10rL1xuICAgIHJlZ2V4OiBbXG4gICAgICAvKF58XFxzKWNsYXNzXFxzK3t3b3JkfShcXHN8XFx7fCQpL1xuICAgICAgLyhefFxccylpbnRlcmZhY2VcXHMre3dvcmR9KFxcc3xcXHt8JCkvXG4gICAgICAvKF58XFxzKShzdGF0aWNcXHMrKT8oKHB1YmxpY3xwcml2YXRlfHByb3RlY3RlZClcXHMrKT8oc3RhdGljXFxzKyk/ZnVuY3Rpb25cXHMre3dvcmR9XFxzKlxcKC9cbiAgICBdXG4gICAgdHlwZTogWycqLmhoJ11cblxuICBSdWJ5OlxuICAgIHdvcmQ6IC9bMC05YS16QS1aX10rL1xuICAgIHJlZ2V4OiBbXG4gICAgICAvKF58XFxzKWNsYXNzXFxzK3t3b3JkfShcXHN8JCkvXG4gICAgICAvKF58XFxzKW1vZHVsZVxccyt7d29yZH0oXFxzfCQpL1xuICAgICAgLyhefFxccylkZWZcXHMrKD86c2VsZlxcLik/e3dvcmR9XFxzKlxcKD8vXG4gICAgICAvKF58XFxzKXNjb3BlXFxzKzp7d29yZH1cXHMqXFwoPy9cbiAgICAgIC8oXnxcXHMpYXR0cl9hY2Nlc3Nvclxccys6e3dvcmR9KFxcc3wkKS9cbiAgICAgIC8oXnxcXHMpYXR0cl9yZWFkZXJcXHMrOnt3b3JkfShcXHN8JCkvXG4gICAgICAvKF58XFxzKWF0dHJfd3JpdGVyXFxzKzp7d29yZH0oXFxzfCQpL1xuICAgICAgLyhefFxccylkZWZpbmVfbWV0aG9kXFxzKzo/e3dvcmR9XFxzKlxcKD8vXG4gICAgXVxuICAgIHR5cGU6IFsnKi5yYicsICcqLnJ1JywgJyouaGFtbCcsICcqLmVyYicsICcqLnJha2UnXVxuXG4gIFB1cHBldDpcbiAgICB3b3JkOiAvWzAtOWEtekEtWl9dKy9cbiAgICByZWdleDogW1xuICAgICAgLyhefFxccyljbGFzc1xccyt7d29yZH0oXFxzfCQpL1xuICAgIF1cbiAgICB0eXBlOiBbJyoucHAnXVxuXG4gIEtSTDpcbiAgICB3b3JkOiAvWzAtOWEtekEtWl9dKy9cbiAgICByZWdleDogW1xuICAgICAgLyhefFxccylERUZcXHMre3dvcmR9XFxzKlxcKC9cbiAgICAgIC8oXnxcXHMpREVDTFxccytcXHcqP3t3b3JkfVxccypcXD0/L1xuICAgICAgLyhefFxccykoU0lHTkFMfElOVHxCT09MfFJFQUx8U1RSVUN8Q0hBUnxFTlVNfEVYVHxcXHMpXFxzKlxcdyp7d29yZH0uKi9cbiAgICBdXG4gICAgdHlwZTogWycqLnNyYycsICcqLmRhdCddXG5cbiAgUGVybDpcbiAgICB3b3JkOiAvWzAtOWEtekEtWl9dKy9cbiAgICByZWdleDogW1xuICAgICAgLyhefFxccylzdWJcXHMre3dvcmR9XFxzKlxcey9cbiAgICAgIC8oXnxcXHMpcGFja2FnZVxccysoXFx3Kzo6KSp7d29yZH1cXHMqXFw7L1xuICAgIF1cbiAgICB0eXBlOiBbJyoucG0nLCAnKi5wbCddXG5cbiAgJ0MvQysrJzpcbiAgICB3b3JkOiAvWzAtOWEtekEtWl9dKy9cbiAgICByZWdleDogW1xuICAgICAgLyhefFxccyljbGFzc1xccyt7d29yZH0oXFxzfDopL1xuICAgICAgLyhefFxccylzdHJ1Y3RcXHMre3dvcmR9KFxcc3xcXHt8JCkvXG4gICAgICAvKF58XFxzKWVudW1cXHMre3dvcmR9KFxcc3xcXHt8JCkvXG4gICAgICAvKF58XFxzKSNkZWZpbmVcXHMre3dvcmR9KFxcc3xcXCh8JCkvXG4gICAgICAvKF58XFxzKXR5cGVkZWZcXHMuKihcXHN8XFwqfFxcKCl7d29yZH0oXFxzfDt8XFwpfCQpL1xuICAgICAgLyhefFxcc3xcXCp8OnwmKXt3b3JkfVxccypcXCguKlxcKShcXHMqfFxccypjb25zdFxccyopKFxce3wkKS9cbiAgICBdXG4gICAgdHlwZTogWycqLmMnLCAnKi5jYycsICcqLmNwcCcsICcqLmgnLCAnKi5oaCcsICcqLmhwcCcsICcqLmluYyddXG4iXX0=
