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
      regex: ["(^|\\s)class\\s+{word}(\\s|{|$)", "(^|\\s)interface\\s+{word}(\\s|{|$)", "(^|\\s)trait\\s+{word}(\\s|{|$)", "(^|\\s)(static\\s+)?((public|private|protected)\\s+)?(static\\s+)?function\\s+{word}\\s*\\(", "(^|\\s)const\\s+{word}(\\s|=|;|$)"],
      type: ["*.php", "*.php3", "*.phtml"]
    },
    ASP: {
      regex: ["(^|\\s)(function|sub)\\s+{word}\\s*\\("],
      type: ["*.asp"]
    },
    Hack: {
      regex: ["(^|\\s)class\\s+{word}(\\s|{|$)", "(^|\\s)interface\\s+{word}(\\s|{|$)", "(^|\\s)(static\\s+)?((public|private|protected)\\s+)?(static\\s+)?function\\s+{word}\\s*\\("],
      type: ["*.hh"]
    },
    Ruby: {
      regex: ["(^|\\s)class\\s+{word}(\\s|$)", "(^|\\s)module\\s+{word}(\\s|$)", "(^|\\s)def\\s+(?:self\\.)?{word}\\s*\\(?", "(^|\\s)scope\\s+:{word}\\s*\\(?", "(^|\\s)attr_accessor\\s+:{word}(\\s|$)", "(^|\\s)attr_reader\\s+:{word}(\\s|$)", "(^|\\s)attr_writer\\s+:{word}(\\s|$)", "(^|\\s)define_method\\s+:?{word}\\s*\\(?"],
      type: ["*.rb", "*.ru", "*.haml", "*.erb"]
    },
    Puppet: {
      regex: ["(^|\\s)class\\s+{word}(\\s|$)"],
      type: ["*.pp"]
    },
    KRL: {
      regex: ["(^|\\s)DEF\\s+{word}\\s*\\(", "(^|\\s)DECL\\s+\\w*?{word}\\s*\\=?", "(^|\\s)(SIGNAL|INT|BOOL|REAL|STRUC|CHAR|ENUM|EXT|\\s)\\s*\\w*{word}.*"],
      type: ["*.src", "*.dat"]
    },
    Perl: {
      regex: ["(^|\\s)sub\\s+{word}\\s*\\{", "(^|\\s)package\\s+(\\w+::)*{word}\\s*\\;"],
      type: ["*.pm", "*.pl"]
    },
    'C/C++': {
      regex: ["(^|\\s)class\\s+{word}(\\s|:)", "(^|\\s)struct\\s+{word}(\\s|{|$)", "(^|\\s)enum\\s+{word}(\\s|{|$)", "(^|\\s)#define\\s+{word}(\\s|\\(|$)", "(^|\\s)typedef\\s.*(\\s|\\*|\\(){word}(\\s|;|\\)|$)", "^[^,=/(]*[^,=/(\\s]+\\s*(\\s|\\*|:|&){word}\\s*\\(.*\\)(\\s*|\\s*const\\s*)({|$)"],
      type: ["*.c", "*.cc", "*.cpp", "*.h", "*.hh", "*.hpp", "*.inc"]
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2dvdG8tZGVmaW5pdGlvbi9saWIvY29uZmlnLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxrQkFBQSxFQUNFO01BQUEsS0FBQSxFQUFPLENBQ0wsOENBREssRUFFTCxrQ0FGSyxFQUdMLG9DQUhLLEVBSUwsK0JBSkssQ0FBUDtNQU1BLElBQUEsRUFBTSxDQUFDLE9BQUQsRUFBVSxNQUFWLEVBQWtCLFFBQWxCLENBTk47S0FERjtJQVNBLFlBQUEsRUFDRTtNQUFBLEtBQUEsRUFBTyxDQUNMLCtCQURLLEVBRUwsMkRBRkssRUFHTCw4Q0FISyxFQUlMLGtDQUpLLEVBS0wsb0NBTEssQ0FBUDtNQU9BLElBQUEsRUFBTSxDQUFDLFVBQUQsRUFBYSxNQUFiLEVBQXFCLFFBQXJCLENBUE47S0FWRjtJQW1CQSxVQUFBLEVBQ0U7TUFBQSxLQUFBLEVBQU8sQ0FDTCwrQkFESyxFQUVMLDJEQUZLLEVBR0wsOENBSEssRUFJTCxrQ0FKSyxFQUtMLG9DQUxLLENBQVA7TUFPQSxJQUFBLEVBQU0sQ0FBQyxNQUFELEVBQVMsUUFBVCxDQVBOO0tBcEJGO0lBNkJBLE1BQUEsRUFDRTtNQUFBLEtBQUEsRUFBTyxDQUNMLCtCQURLLEVBRUwsNkJBRkssQ0FBUDtNQUlBLElBQUEsRUFBTSxDQUFDLE1BQUQsQ0FKTjtLQTlCRjtJQW9DQSxHQUFBLEVBQ0U7TUFBQSxLQUFBLEVBQU8sQ0FDTCxpQ0FESyxFQUVMLHFDQUZLLEVBR0wsaUNBSEssRUFJTCw2RkFKSyxFQUtMLG1DQUxLLENBQVA7TUFPQSxJQUFBLEVBQU0sQ0FBQyxPQUFELEVBQVUsUUFBVixFQUFvQixTQUFwQixDQVBOO0tBckNGO0lBOENBLEdBQUEsRUFDRTtNQUFBLEtBQUEsRUFBTyxDQUNMLHdDQURLLENBQVA7TUFHQSxJQUFBLEVBQU0sQ0FBQyxPQUFELENBSE47S0EvQ0Y7SUFvREEsSUFBQSxFQUNFO01BQUEsS0FBQSxFQUFPLENBQ0wsaUNBREssRUFFTCxxQ0FGSyxFQUdMLDZGQUhLLENBQVA7TUFLQSxJQUFBLEVBQU0sQ0FBQyxNQUFELENBTE47S0FyREY7SUE0REEsSUFBQSxFQUNFO01BQUEsS0FBQSxFQUFPLENBQ0wsK0JBREssRUFFTCxnQ0FGSyxFQUdMLDBDQUhLLEVBSUwsaUNBSkssRUFLTCx3Q0FMSyxFQU1MLHNDQU5LLEVBT0wsc0NBUEssRUFRTCwwQ0FSSyxDQUFQO01BVUEsSUFBQSxFQUFNLENBQUMsTUFBRCxFQUFTLE1BQVQsRUFBaUIsUUFBakIsRUFBMkIsT0FBM0IsQ0FWTjtLQTdERjtJQXlFQSxNQUFBLEVBQ0U7TUFBQSxLQUFBLEVBQU8sQ0FDTCwrQkFESyxDQUFQO01BR0EsSUFBQSxFQUFNLENBQUMsTUFBRCxDQUhOO0tBMUVGO0lBK0VBLEdBQUEsRUFDRTtNQUFBLEtBQUEsRUFBTyxDQUNMLDZCQURLLEVBRUwsb0NBRkssRUFHTCx1RUFISyxDQUFQO01BS0EsSUFBQSxFQUFNLENBQUMsT0FBRCxFQUFTLE9BQVQsQ0FMTjtLQWhGRjtJQXVGQSxJQUFBLEVBQ0U7TUFBQSxLQUFBLEVBQU8sQ0FDTCw2QkFESyxFQUVMLDBDQUZLLENBQVA7TUFJQSxJQUFBLEVBQU0sQ0FBQyxNQUFELEVBQVEsTUFBUixDQUpOO0tBeEZGO0lBOEZBLE9BQUEsRUFDRTtNQUFBLEtBQUEsRUFBTyxDQUNMLCtCQURLLEVBRUwsa0NBRkssRUFHTCxnQ0FISyxFQUlMLHFDQUpLLEVBS0wscURBTEssRUFNTCxrRkFOSyxDQUFQO01BUUEsSUFBQSxFQUFNLENBQUMsS0FBRCxFQUFPLE1BQVAsRUFBYyxPQUFkLEVBQXNCLEtBQXRCLEVBQTRCLE1BQTVCLEVBQW1DLE9BQW5DLEVBQTJDLE9BQTNDLENBUk47S0EvRkY7O0FBREYiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9XG4gICdKYXZhU2NyaXB0IChKU1gpJzpcbiAgICByZWdleDogW1xuICAgICAgXCIoXnxcXFxcc3xcXFxcLil7d29yZH1cXFxccypbOj1dXFxcXHMqZnVuY3Rpb25cXFxccypcXFxcKFwiXG4gICAgICBcIihefFxcXFxzKWZ1bmN0aW9uXFxcXHMre3dvcmR9XFxcXHMqXFxcXChcIlxuICAgICAgXCIoXnxcXFxccyl7d29yZH1cXFxcKFtcXFxcc1xcXFxTXSo/XFxcXClcXFxccyp7XCIgICMgRVM2XG4gICAgICBcIihefFxcXFxzKWNsYXNzXFxcXHMre3dvcmR9KFxcXFxzfCQpXCJcbiAgICBdXG4gICAgdHlwZTogW1wiKi5qc3hcIiwgXCIqLmpzXCIsIFwiKi5odG1sXCJdXG5cbiAgQ29mZmVlU2NyaXB0OlxuICAgIHJlZ2V4OiBbXG4gICAgICBcIihefFxcXFxzKWNsYXNzXFxcXHMre3dvcmR9KFxcXFxzfCQpXCJcbiAgICAgIFwiKF58XFxcXHN8XFxcXC4pe3dvcmR9XFxcXHMqWzo9XVxcXFxzKihcXFxcKFtcXFxcc1xcXFxTXSo/XFxcXCkpP1xcXFxzKls9LV0+XCJcbiAgICAgIFwiKF58XFxcXHN8XFxcXC4pe3dvcmR9XFxcXHMqWzo9XVxcXFxzKmZ1bmN0aW9uXFxcXHMqXFxcXChcIiAjIEphdmFTY3JpcHQgRnVuY3Rpb25cbiAgICAgIFwiKF58XFxcXHMpZnVuY3Rpb25cXFxccyt7d29yZH1cXFxccypcXFxcKFwiXG4gICAgICBcIihefFxcXFxzKXt3b3JkfVxcXFwoW1xcXFxzXFxcXFNdKj9cXFxcKVxcXFxzKntcIiAgIyBFUzZcbiAgICBdXG4gICAgdHlwZTogW1wiKi5jb2ZmZWVcIiwgXCIqLmpzXCIsIFwiKi5odG1sXCJdXG5cbiAgVHlwZVNjcmlwdDpcbiAgICByZWdleDogW1xuICAgICAgXCIoXnxcXFxccyljbGFzc1xcXFxzK3t3b3JkfShcXFxcc3wkKVwiXG4gICAgICBcIihefFxcXFxzfFxcXFwuKXt3b3JkfVxcXFxzKls6PV1cXFxccyooXFxcXChbXFxcXHNcXFxcU10qP1xcXFwpKT9cXFxccypbPS1dPlwiXG4gICAgICBcIihefFxcXFxzfFxcXFwuKXt3b3JkfVxcXFxzKls6PV1cXFxccypmdW5jdGlvblxcXFxzKlxcXFwoXCIgIyBKYXZhU2NyaXB0IEZ1bmN0aW9uXG4gICAgICBcIihefFxcXFxzKWZ1bmN0aW9uXFxcXHMre3dvcmR9XFxcXHMqXFxcXChcIlxuICAgICAgXCIoXnxcXFxccyl7d29yZH1cXFxcKFtcXFxcc1xcXFxTXSo/XFxcXClcXFxccyp7XCIgICMgRVM2XG4gICAgXVxuICAgIHR5cGU6IFtcIioudHNcIiwgXCIqLmh0bWxcIl1cblxuICBQeXRob246XG4gICAgcmVnZXg6IFtcbiAgICAgIFwiKF58XFxcXHMpY2xhc3NcXFxccyt7d29yZH1cXFxccypcXFxcKFwiXG4gICAgICBcIihefFxcXFxzKWRlZlxcXFxzK3t3b3JkfVxcXFxzKlxcXFwoXCJcbiAgICBdXG4gICAgdHlwZTogW1wiKi5weVwiXVxuXG4gIFBIUDpcbiAgICByZWdleDogW1xuICAgICAgXCIoXnxcXFxccyljbGFzc1xcXFxzK3t3b3JkfShcXFxcc3x7fCQpXCJcbiAgICAgIFwiKF58XFxcXHMpaW50ZXJmYWNlXFxcXHMre3dvcmR9KFxcXFxzfHt8JClcIlxuICAgICAgXCIoXnxcXFxccyl0cmFpdFxcXFxzK3t3b3JkfShcXFxcc3x7fCQpXCJcbiAgICAgIFwiKF58XFxcXHMpKHN0YXRpY1xcXFxzKyk/KChwdWJsaWN8cHJpdmF0ZXxwcm90ZWN0ZWQpXFxcXHMrKT8oc3RhdGljXFxcXHMrKT9mdW5jdGlvblxcXFxzK3t3b3JkfVxcXFxzKlxcXFwoXCJcbiAgICAgIFwiKF58XFxcXHMpY29uc3RcXFxccyt7d29yZH0oXFxcXHN8PXw7fCQpXCJcbiAgICBdXG4gICAgdHlwZTogW1wiKi5waHBcIiwgXCIqLnBocDNcIiwgXCIqLnBodG1sXCJdXG5cbiAgQVNQOlxuICAgIHJlZ2V4OiBbXG4gICAgICBcIihefFxcXFxzKShmdW5jdGlvbnxzdWIpXFxcXHMre3dvcmR9XFxcXHMqXFxcXChcIlxuICAgIF1cbiAgICB0eXBlOiBbXCIqLmFzcFwiXVxuXG4gIEhhY2s6XG4gICAgcmVnZXg6IFtcbiAgICAgIFwiKF58XFxcXHMpY2xhc3NcXFxccyt7d29yZH0oXFxcXHN8e3wkKVwiXG4gICAgICBcIihefFxcXFxzKWludGVyZmFjZVxcXFxzK3t3b3JkfShcXFxcc3x7fCQpXCJcbiAgICAgIFwiKF58XFxcXHMpKHN0YXRpY1xcXFxzKyk/KChwdWJsaWN8cHJpdmF0ZXxwcm90ZWN0ZWQpXFxcXHMrKT8oc3RhdGljXFxcXHMrKT9mdW5jdGlvblxcXFxzK3t3b3JkfVxcXFxzKlxcXFwoXCJcbiAgICBdXG4gICAgdHlwZTogW1wiKi5oaFwiXVxuXG4gIFJ1Ynk6XG4gICAgcmVnZXg6IFtcbiAgICAgIFwiKF58XFxcXHMpY2xhc3NcXFxccyt7d29yZH0oXFxcXHN8JClcIlxuICAgICAgXCIoXnxcXFxccyltb2R1bGVcXFxccyt7d29yZH0oXFxcXHN8JClcIlxuICAgICAgXCIoXnxcXFxccylkZWZcXFxccysoPzpzZWxmXFxcXC4pP3t3b3JkfVxcXFxzKlxcXFwoP1wiXG4gICAgICBcIihefFxcXFxzKXNjb3BlXFxcXHMrOnt3b3JkfVxcXFxzKlxcXFwoP1wiXG4gICAgICBcIihefFxcXFxzKWF0dHJfYWNjZXNzb3JcXFxccys6e3dvcmR9KFxcXFxzfCQpXCJcbiAgICAgIFwiKF58XFxcXHMpYXR0cl9yZWFkZXJcXFxccys6e3dvcmR9KFxcXFxzfCQpXCJcbiAgICAgIFwiKF58XFxcXHMpYXR0cl93cml0ZXJcXFxccys6e3dvcmR9KFxcXFxzfCQpXCJcbiAgICAgIFwiKF58XFxcXHMpZGVmaW5lX21ldGhvZFxcXFxzKzo/e3dvcmR9XFxcXHMqXFxcXCg/XCJcbiAgICBdXG4gICAgdHlwZTogW1wiKi5yYlwiLCBcIioucnVcIiwgXCIqLmhhbWxcIiwgXCIqLmVyYlwiXVxuXG4gIFB1cHBldDpcbiAgICByZWdleDogW1xuICAgICAgXCIoXnxcXFxccyljbGFzc1xcXFxzK3t3b3JkfShcXFxcc3wkKVwiXG4gICAgXVxuICAgIHR5cGU6IFtcIioucHBcIl1cblxuICBLUkw6XG4gICAgcmVnZXg6IFtcbiAgICAgIFwiKF58XFxcXHMpREVGXFxcXHMre3dvcmR9XFxcXHMqXFxcXChcIlxuICAgICAgXCIoXnxcXFxccylERUNMXFxcXHMrXFxcXHcqP3t3b3JkfVxcXFxzKlxcXFw9P1wiXG4gICAgICBcIihefFxcXFxzKShTSUdOQUx8SU5UfEJPT0x8UkVBTHxTVFJVQ3xDSEFSfEVOVU18RVhUfFxcXFxzKVxcXFxzKlxcXFx3Knt3b3JkfS4qXCJcbiAgICBdXG4gICAgdHlwZTogW1wiKi5zcmNcIixcIiouZGF0XCJdXG5cbiAgUGVybDpcbiAgICByZWdleDogW1xuICAgICAgXCIoXnxcXFxccylzdWJcXFxccyt7d29yZH1cXFxccypcXFxce1wiXG4gICAgICBcIihefFxcXFxzKXBhY2thZ2VcXFxccysoXFxcXHcrOjopKnt3b3JkfVxcXFxzKlxcXFw7XCJcbiAgICBdXG4gICAgdHlwZTogW1wiKi5wbVwiLFwiKi5wbFwiXVxuXG4gICdDL0MrKyc6XG4gICAgcmVnZXg6IFtcbiAgICAgIFwiKF58XFxcXHMpY2xhc3NcXFxccyt7d29yZH0oXFxcXHN8OilcIlxuICAgICAgXCIoXnxcXFxccylzdHJ1Y3RcXFxccyt7d29yZH0oXFxcXHN8e3wkKVwiXG4gICAgICBcIihefFxcXFxzKWVudW1cXFxccyt7d29yZH0oXFxcXHN8e3wkKVwiXG4gICAgICBcIihefFxcXFxzKSNkZWZpbmVcXFxccyt7d29yZH0oXFxcXHN8XFxcXCh8JClcIlxuICAgICAgXCIoXnxcXFxccyl0eXBlZGVmXFxcXHMuKihcXFxcc3xcXFxcKnxcXFxcKCl7d29yZH0oXFxcXHN8O3xcXFxcKXwkKVwiXG4gICAgICBcIl5bXiw9LyhdKlteLD0vKFxcXFxzXStcXFxccyooXFxcXHN8XFxcXCp8OnwmKXt3b3JkfVxcXFxzKlxcXFwoLipcXFxcKShcXFxccyp8XFxcXHMqY29uc3RcXFxccyopKHt8JClcIlxuICAgIF1cbiAgICB0eXBlOiBbXCIqLmNcIixcIiouY2NcIixcIiouY3BwXCIsXCIqLmhcIixcIiouaGhcIixcIiouaHBwXCIsXCIqLmluY1wiXVxuIl19
