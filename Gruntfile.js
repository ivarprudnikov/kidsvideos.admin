'use strict';

var LIVERELOAD_PORT = 35727;
var lrSnippet = require('connect-livereload')({ port : LIVERELOAD_PORT });

var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  // configurable paths
  var yeomanConfig = {
    app : 'dev',
    dist : 'dist'
  };

  try {
    yeomanConfig.app = require('./bower.json').appPath || yeomanConfig.app;
  } catch (e) {
  }

  grunt.initConfig({

    yeoman : yeomanConfig,

    // *.less files processing
    ////////////////////////////
    less : {
      development : {
        options : {
          paths : ['<%= yeoman.app %>']
        },
        files : [
          {
            expand : true,
            cwd : '<%= yeoman.app %>',
            src : ['styles/core.less'],
            dest : '<%= yeoman.app %>',
            ext : '.css'
          }
        ]
      }
    },

    // prefixing css styles
    // for wider browser support
    ////////////////////////////
    autoprefixer : {
      options : ['last 10 version', 'ie 8'],
      dist : {
        files : [
          {
            expand : true,
            cwd : '.tmp',
            src : '**/*.css',
            dest : '.tmp'
          },
          {
            expand : true,
            cwd : '<%= yeoman.app %>',
            src : '**/*.css',
            dest : '<%= yeoman.app %>'
          }
        ]
      }
    },

    watch : {
      styles : {
        files : ['<%= yeoman.app %>/**/*.less'],
        tasks : ['less', 'copy:styles', 'autoprefixer']
      },
      livereload : {
        options : {
          livereload : LIVERELOAD_PORT
        },
        files : [
          '{.tmp,<%= yeoman.app %>}{,/**}/*.html',
          '<%= yeoman.app %>/**/*.less',
          '{.tmp,<%= yeoman.app %>}/**/*.css',
          '{.tmp,<%= yeoman.app %>}/**/*.js',
          '{.tmp,<%= yeoman.app %>}/**/*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    connect : {
      options : {
        port : 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname : 'localhost'
      },
      livereload : {
        options : {
          middleware : function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, yeomanConfig.app)
            ];
          }
        }
      },
      dist : {
        options : {
          middleware : function (connect) {
            return [
              mountFolder(connect, yeomanConfig.dist)
            ];
          }
        }
      }
    },

    // handy operation for opening browser
    // window after dev server starts
    // running
    ///////////////////////////////////////
    open : {
      server : {
        url : 'http://localhost:<%= connect.options.port %>'
      }
    },

    // clean task
    ///////////////////////////////////////
    clean : {
      dist : {
        files : [
          {
            dot : true,
            src : [
              '.tmp',
              '<%= yeoman.dist %>/*',
              '!<%= yeoman.dist %>/.git*'
            ]
          }
        ]
      },
      server : '.tmp'
    },

    // not used since Uglify task does concat,
    // but still available if needed
    /*concat: {
     dist: {}
     },*/

    // hash files
    ///////////////////////
    filerev : {
      dist : {
        src : [
          '<%= yeoman.dist %>/views/*.html',
          '<%= yeoman.dist %>/**/*.js',
          '<%= yeoman.dist %>/**/*.css',
          '<%= yeoman.dist %>/**/*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= yeoman.dist %>/fonts/*'
        ]
      }
    },

    // apply a configured transformation
    // flow to tagged files
    /////////////////////////////
    useminPrepare : {
      html : '<%= yeoman.app %>/index.html',
      options : {
        srcStrip : '<%= yeoman.app %>', // remvoe 'dev' so that files go into dist/x instead of dist/dev/x
        dest : '<%= yeoman.dist %>',
        flow : {
          steps : {
            js : ['concat'],
            css : ['concat']
          },
          post : {}
        }
      }
    },

    usemin : {
      html : ['<%= yeoman.dist %>/{,**/}*.html'],
      css : ['<%= yeoman.dist %>/**/*.css'],
      options : {
        dirs : ['<%= yeoman.dist %>']
      }
    },

    // compress images
    ///////////////////////
    imagemin : {
      dist : {
        files : [
          {
            expand : true,
            cwd : '<%= yeoman.app %>',
            src : '**/*.{png,jpg,jpeg}',
            dest : '<%= yeoman.dist %>'
          }
        ]
      }
    },
    svgmin : {
      dist : {
        files : [
          {
            expand : true,
            cwd : '<%= yeoman.app %>',
            src : '**/*.svg',
            dest : '<%= yeoman.dist %>'
          }
        ]
      }
    },

    // compress css
    ///////////////////////
    cssmin : {
      options : {
        banner : 'bang!',
        report : 'min'
      },
      dist : {
        files : [
          {
            expand : true,
            cwd : '<%= yeoman.dist %>',
            src : '**/*.css',
            dest : '<%= yeoman.dist %>'
          }
        ]
      }
    },

    // compress html
    ///////////////////////
    htmlmin : {
      dist : {
        options : {
          /*removeCommentsFromCDATA: true,
           // https://github.com/yeoman/grunt-usemin/issues/44
           //collapseWhitespace: true,
           collapseBooleanAttributes: true,
           removeAttributeQuotes: true,
           removeRedundantAttributes: true,
           useShortDoctype: true,
           removeEmptyAttributes: true,
           removeOptionalTags: true*/
        },
        files : [
          {
            expand : true,
            cwd : '<%= yeoman.app %>',
            src : ['{,**/}*.html'],
            dest : '<%= yeoman.dist %>'
          }
        ]
      }
    },

    // Put files not handled in other tasks here
    copy : {
      dist : {
        files : [
          {
            expand : true,
            dot : true,
            cwd : '<%= yeoman.app %>',
            dest : '<%= yeoman.dist %>',
            src : [
              '*.{ico,png,txt}',
              '.htaccess',
              '**/*.{gif,webp}',
              'fonts/*'
            ]
          },
          {
            expand : true,
            cwd : '.tmp',
            dest : '<%= yeoman.dist %>',
            src : [
              'generated/*'
            ]
          }
        ]
      },
      styles : {
        expand : true,
        cwd : '<%= yeoman.app %>',
        dest : '.tmp',
        src : '**/*.css'
      }
    }

  });

  grunt.registerTask('server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'less',
      'copy:styles',
      'autoprefixer',
      'connect:livereload',
      'open',
      'watch'
    ]);
  });

  grunt.registerTask('build', [
    'clean:dist',       // cleans .tmp & dist
    'less',             // generates css in dev
    'autoprefixer',     // adds prefixes in dev
    'useminPrepare',    // prepares build steps for html blocks
    'concat',           // concatinates files and moves them to dist
    'cssmin',           // minifies css in dist
    'imagemin',         // minifies images and moves them to dist
    'svgmin',           // minifies svg and moves them to dist
    'htmlmin',          // minifies html and moves them to dist
    'copy:dist',        // copies previously unhandled files to dist
    'filerev',          // hashes js/css/img/font files in dist
    'usemin'
  ]);

  grunt.registerTask('default', [
    'test',
    'build'
  ]);
};
