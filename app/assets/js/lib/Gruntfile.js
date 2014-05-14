module.exports = function (grunt) {
  var transport = require('grunt-cmd-transport');
  var style = transport.style.init(grunt);
  var text = transport.text.init(grunt);
  var script = transport.script.init(grunt);

  var default_opt = {
    pkg: grunt.file.readJSON("package.json"),
    //定义标示了
    transport: {
      options: {
        paths: ['.'],
        alias: '<%= pkg.spm.alias %>',
        parsers: {
          '.js': [script.jsParser],
          '.css': [style.css2jsParser],
          '.html': [text.html2jsParser]
        }
      },
      //生成一个以当前版本号为基名模块文件
      curfile: {
        options: {
          idleading: '<%= pkg.name %>/<%= pkg.version %>/'
        },
        files: [
          {
            cwd: 'src/<%= pkg.version %>/',
            src: '**/*',
            filter: 'isFile',
            dest: '.build/<%= pkg.version %>/'
          }
        ]
      },
      //当前版本再生产生成一个名为“latest”的基名模块文件
      latestfile: {
        options: {
          idleading: '<%= pkg.name %>/latest/'
        },
        files: [
          {
            cwd: 'src/<%= pkg.version %>/',
            src: '**/*',
            filter: 'isFile',
            dest: '.build/latest/'
          }
        ]
      }
    },
    //对当前版本下的.build文件进行合并
    concat: {
      options: {
        paths: ['.'],
        include: 'relative',
        //文件内容的分隔符
        separator: ';',
        banner: '/*! <%= pkg.name %>(<%= pkg.version %>) - <%= pkg.author %> - <%= grunt.template.today("yyyy-mm-dd H:MM:ss") %>*/\n'
      },
      curfile: {
        files: [
          {
            expand: true,
            cwd: '.build/',
            src: ['<%= pkg.version %>/*.js'],
            dest: 'dist/',
            ext: '.js'
          }
        ]
      },
      latestfile: {
        files: [
          {
            expand: true,
            cwd: '.build/',
            src: ['latest/*.js'],
            dest: 'dist/',
            ext: '.js'
          }
        ]
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %>(<%= pkg.version %>) - <%= pkg.author %> - <%= grunt.template.today("yyyy-mm-dd H:MM:ss") %>*/\n',
        footer: '',
        beautify: {
          ascii_only: true
        }
      },
      curfile: {
        files: [
          {
            expand: true,
            cwd: 'dist/',
            src: ['<%= pkg.version %>/*.js', '!<%= pkg.version %>/*-debug.js'],
            dest: 'dist/',
            ext: '.js'
          }
        ]
      },
      latestfile: {
        files: [
          {
            expand: true,
            cwd: 'dist/',
            src: ['latest/*.js', '!latest/*-debug.js'],
            dest: 'dist/',
            ext: '.js'
          }
        ]
      }
    },
    copy: {
      curfile: {
        files: [
          {
            expand: true,
            cwd: 'dist/',
            src: ['<%= pkg.version %>/**'],
            dest: '../../../../public/assets/js_modules/<%= pkg.name %>',
            filter: 'isFile'
          }
        ]
      },
      latestfile: {
        files: [
          {
            expand: true,
            cwd: 'dist/',
            src: ['latest/**'],
            dest: '../../../../public/assets/js_modules/<%= pkg.name %>',
            filter: 'isFile'
          }
        ]
      }
    },
    clean: {
      spm: ['.build']
    }
  };

  //定义项目
  grunt.initConfig(default_opt);

  //载入grunt插件
  grunt.loadNpmTasks('grunt-cmd-transport');
  grunt.loadNpmTasks('grunt-cmd-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');

  //执行开发模式所有任务(开发模式不压缩)
  grunt.registerTask('build', ['transport:curfile','transport:latestfile','concat:curfile','concat:latestfile','copy:curfile','copy:latestfile']);
  //执行发布产品模式所有任务(一条龙服务)
  grunt.registerTask('build-all', ['transport:curfile','transport:latestfile','concat:curfile','concat:latestfile','uglify:curfile','uglify:latestfile','copy:curfile','copy:latestfile']);
  //提取依赖名转换为具名模块
  grunt.registerTask('build-tran', ['transport:curfile','transport:latestfile']);
  //合并
  grunt.registerTask('build-concat', ['concat:curfile','concat:latestfile']);
  //压缩
  grunt.registerTask('build-uglify', ['uglify:curfile','uglify:latestfile']);
  //拷贝至产品目录
  grunt.registerTask('build-copy', ['copy:curfile','copy:latestfile']);
  //清楚临时文件
  grunt.registerTask('build-clean', ['clean']);

};


