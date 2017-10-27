(function() {
  var aliases, files;

  files = {
    grunt: ['Gruntfile.coffee'],
    lib: ['lib/**/*.coffee'],
    less: ['styles/**/*.less'],
    tmp: ['.tmp/'],
    doc: ['doc/']
  };

  aliases = {
    grunt: ['coffeelint:grunt', 'lintspaces:grunt'],
    lib: ['coffeelint:lib', 'lintspaces:lib', 'coffee:lib', 'clean:tmp'],
    less: ['lesslint:less', 'lintspaces:less']
  };

  module.exports = function(grunt) {
    'use strict';
    grunt.initConfig({
      watch: {
        gruntfile: {
          files: files.grunt,
          tasks: aliases.grunt
        },
        lib: {
          files: files.lib,
          tasks: aliases.lib
        },
        less: {
          files: files.less,
          tasks: aliases.less
        }
      },
      coffeelint: {
        lib: files.lib,
        grunt: files.grunt,
        options: {
          configFile: 'coffeelint.json'
        }
      },
      lesslint: {
        less: files.less,
        options: {
          csslint: {
            'important': false,
            'box-sizing': false,
            'adjoining-classes': false,
            'fallback-colors': false
          }
        }
      },
      coffee: {
        lib: {
          expand: true,
          flatten: true,
          src: files.lib,
          dest: '.tmp/',
          ext: '.js'
        }
      },
      clean: {
        tmp: files.tmp,
        doc: files.doc
      },
      'gh-pages': {
        options: {
          base: "doc"
        },
        src: ['**']
      },
      lintspaces: {
        options: {
          editorconfig: '.editorconfig'
        },
        grunt: files.grunt,
        lib: files.lib,
        less: files.less
      },
      exec: {
        build_docs: {
          command: "./node_modules/.bin/biscotto",
          cwd: './'
        }
      },
      connect: {
        doc: {
          options: {
            port: '9001',
            base: files.doc,
            keepalive: true,
            open: {
              target: 'http://localhost:9001/index.html',
              app: 'open'
            }
          }
        }
      }
    });
    require('load-grunt-tasks')(grunt);
    grunt.registerTask('dev', aliases.grunt.concat(aliases.lib, aliases.less, 'watch'));
    grunt.registerTask('doc', ['doc-build', 'connect:doc']);
    grunt.registerTask('doc-build', ['clean:doc', 'exec:build_docs']);
    return grunt.registerTask('publish-doc', ['doc-build', 'gh-pages']);
  };

}).call(this);
