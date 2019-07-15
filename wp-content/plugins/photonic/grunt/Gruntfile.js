module.exports = function(grunt) {
	// Config
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		dirs: {
			src_js: '../include/scripts/front-end/src',
			src_css: '../include/css/front-end/core',
			tp: '../include/scripts/third-party',
			build_jq: '../include/scripts/front-end/jq',
			dest_js_solo: '../include/scripts/front-end/jq/solo',
			dest_js_solo_slider: '../include/scripts/front-end/jq/solo-slider',
			dest_js_combo: '../include/scripts/front-end/jq/combo',
			dest_js_combo_slider: '../include/scripts/front-end/jq/combo-slider',
			dest_css_solo_slider: '../include/css/front-end/solo-slider',
			dest_css_combo: '../include/css/front-end/combo',
			dest_css_combo_slider: '../include/css/front-end/combo-slider',
			no_jq_src: '../include/scripts/front-end/src-no-jq',
			no_jq_dest: '../include/scripts/front-end/build-no-jq',
			i18n_src: '..',
			langs: 'languages'
		},

		vars: { },

		clean: {
			build: {
				options: {
					force: true
				},
				src: [
					'<%= dirs.dest_js_solo %>',
					'<%= dirs.dest_js_solo_slider %>',
					'<%= dirs.dest_js_combo %>',
					'<%= dirs.dest_js_combo_slider %>',
					'<%= dirs.dest_css_solo_slider %>',
					'<%= dirs.dest_css_combo %>',
					'<%= dirs.dest_css_combo_slider %>'
				]
			}
		},

		concat: {
			lb_header: {
				options: {
					process: true
				},
				src: [
					'<%= dirs.src_js %>/core/external.js',
					'<%= dirs.src_js %>/core/jq-start.tmpl',
					'<%= dirs.src_js %>/core/core.js',
					'<%= dirs.src_js %>/lightboxes/Lightbox.js'
				],
				dest: '<%= dirs.dest_js_solo %>/lb-start.tmpl'
			},
			lb_footer : {
				options: {
					process: true
				},
				src: [
					'<%= dirs.src_js %>/core/layouts.js',
					'<%= dirs.src_js %>/core/jq-end.tmpl'
				],
				dest: '<%= dirs.dest_js_solo %>/lb-end.tmpl'
			},

			no_jq_lightgallery: {
				options: {
					process: true
				},
				src: [
					'<%= dirs.no_jq_src %>/core/util.js',
					'<%= dirs.no_jq_src %>/core/external.js',
					'<%= dirs.no_jq_src %>/core/no-jq-start.tmpl',
					'<%= dirs.no_jq_src %>/core/core.js',
					'<%= dirs.no_jq_src %>/core/no-jq-end.tmpl'
				],
				dest: '<%= dirs.no_jq_dest %>/photonic-lightgallery.js'
			}
		},

		makepot: {
			target: {
				options: {
					type: 'wp-plugin',
					potFilename: 'photonic.pot',
					cwd: '<%= dirs.i18n_src %>',
					domainPath: '<%= dirs.langs %>'
				}
			}
		}
	});

	// Load plugins
	var cwd = process.cwd();
	process.chdir('../../../../..');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-wp-i18n');
	process.chdir(cwd);

	function buildAll() {
		var lightboxes = [
			'Colorbox',
			'Fancybox',
			'Fancybox2',
			'Fancybox3',
			'Featherlight',
			'ImageLightbox',
			'Galleria',
			'Lightcase',
			'Lightgallery',
			'Magnific',
			'none',
			'PhotoSwipe',
			'PrettyPhoto',
			'Strip',
			'Swipebox',
			'Thickbox'
		];
		var no_combo = [
			'Fancybox2',
			'none',
			'Strip',
			'Thickbox'
		];
		var firstSet = [], secondSet = [];

		var coreCSS = [
			'<%= dirs.src_css %>/photonic.css'
		];

		grunt.task.run([
			'clean:build',
			'concat:lb_header',
			'concat:lb_footer'
		]);

		for (var i = 0; i < lightboxes.length; i++) {
			var lower = lightboxes[i].toLowerCase();
			var core = [
				'<%= dirs.dest_js_solo %>/lb-start.tmpl',
				'<%= dirs.src_js %>/lightboxes/Lightbox_' + lightboxes[i] + '.js',
				'<%= dirs.dest_js_solo %>/lb-end.tmpl'
			];
			var combo = ['<%= dirs.tp %>/' + lower + '/' + lower + '.js'].concat(core);
			var soloSlider = ['<%= dirs.tp %>/lightslider/lightslider.js'].concat(core);
			var comboSlider = ['<%= dirs.tp %>/lightslider/lightslider.js'].concat(combo);

			var comboCSS = ['<%= dirs.tp %>/' + lower + '/' + lower + '.css'].concat(coreCSS);
			var comboSliderCSS = ['<%= dirs.tp %>/lightslider/lightslider.css'].concat(comboCSS);

			// Scenario 1:
			//      1. Core, Photonic Lightbox and Layout scripts together, unminified
			//      2. Third-party lightbox scripts separate
			//      3. Slider separate
			grunt.config(['concat', lower], {
				options: {
					process: true
				},
				separator: '\r\n',
				src: core,
				dest: '<%= dirs.dest_js_solo %>/photonic-' + lower + '.js'
			});
			firstSet.push('concat:' + lower);

			// Scenario 2:
			//      1. Core, Photonic Lightbox and Layout scripts together, unminified. Slider combined with this, unminified
			//      2. Third-party lightbox scripts separate
			grunt.config(['concat', lower + '_slider'], {
				options: {
					process: true
				},
				separator: '\r\n',
				src: soloSlider,
				dest: '<%= dirs.dest_js_solo_slider %>/photonic-' + lower + '.js'
			});
			firstSet.push('concat:' + lower + '_slider');

			if (no_combo.indexOf(lightboxes[i]) < 0) {
				// Scenario 3a:
				//      1. Core, Photonic Lightbox and Layout scripts together, unminified, combined with unminified third-party lightbox
				//      2. Slider separate
				// This will not work for Lightgallery, which has additional plugins
				grunt.config(['concat', lower + '_combo'], {
					options: {
						process: true
					},
					separator: '\r\n',
					src: combo,
					dest: '<%= dirs.dest_js_combo %>/photonic-' + lower + '.js'
				});
				firstSet.push('concat:' + lower + '_combo');

				// Scenario 4a:
				//      1. Core, Photonic Lightbox and Layout scripts together, minified, combined with minified third-party lightbox
				//      2. Slider separate
				// This will not work for Lightgallery, which has additional plugins
				grunt.config(['concat', lower + '_combo_min'], {
					options: {
						process: true
					},
					separator: '\r\n',
					src: [
						'<%= dirs.tp %>/' + lower + '/' + lower + '.min.js',
						'<%= dirs.dest_js_solo %>/photonic-' + lower + '.min.js'
					],
					dest: '<%= dirs.dest_js_combo %>/photonic-' + lower + '.min.js'
				});
				secondSet.push('concat:' + lower + '_combo_min');

				// Scenario 5a:
				//      1. All scripts including third-party lightbox and slider combined, unminified
				// This will not work for Lightgallery, which has additional plugins
				grunt.config(['concat', lower + '_combo_slider'], {
					options: {
						process: true
					},
					separator: '\r\n',
					src: comboSlider,
					dest: '<%= dirs.dest_js_combo_slider %>/photonic-' + lower + '.js'
				});
				firstSet.push('concat:' + lower + '_combo_slider');

				// Scenario 6a:
				//      1. All scripts including third-party lightbox and slider combined, minified
				// This will not work for Lightgallery, which has additional plugins
				grunt.config(['concat', lower + '_combo_slider_min'], {
					options: {
						process: true
					},
					separator: '\r\n',
					src: [
						'<%= dirs.tp %>/lightslider/lightslider.min.js',
						'<%= dirs.dest_js_combo %>/photonic-' + lower + '.min.js'
					],
					dest: '<%= dirs.dest_js_combo_slider %>/photonic-' + lower + '.min.js'
				});
				secondSet.push('concat:' + lower + '_combo_slider_min');

				grunt.config(['concat', lower + '_combo_css'], {
					options: {
						process: true
					},
					separator: '\r\n',
					src: combo,
					dest: '<%= dirs.dest_js_combo %>/photonic-' + lower + '.js'
				});
				firstSet.push('concat:' + lower + '_combo');

			}
			else {
				// Scenario 3b:
				//      1. Similar to 3a, but for scripts where no third-party source is applicable (i.e. Fancybox2, Strip, "none" and Thickbox)
				//      2. Slider separate
				grunt.config(['copy', lower + '_combo'], {
					files: [{
						expand: true,
						cwd: '<%= dirs.dest_js_solo %>',
						src: [
							'photonic-' + lower + '.js',
							'photonic-' + lower + '.min.js'
						],
						dest: '<%= dirs.dest_js_combo %>/'
					}]
				});
				secondSet.push('copy:' + lower + '_combo');

				// Scenario 4b:
				//      1. Similar to 3a, but for scripts where no third-party source is applicable (i.e. Fancybox2, Strip, "none" and Thickbox)
				//      2. Slider separate
				grunt.config(['copy', lower + '_combo_slider'], {
					files: [{
						expand: true,
						cwd: '<%= dirs.dest_js_solo_slider %>',
						src: [
							'photonic-' + lower + '.js',
							'photonic-' + lower + '.min.js'
						],
						dest: '<%= dirs.dest_js_combo_slider %>/'
					}]
				});
				secondSet.push('copy:' + lower + '_combo_slider');
			}

			grunt.config(['concat', lower + '_css_combo'], {
				options: {
					process: true
				},
				separator: '\r\n',
				src: comboCSS,
				dest: '<%= dirs.dest_css_combo %>/photonic-' + lower + '.css'
			});
			firstSet.push('concat:' + lower + '_css_combo');

			grunt.config(['concat', lower + '_css_slider_combo'], {
				options: {
					process: true
				},
				separator: '\r\n',
				src: comboSliderCSS,
				dest: '<%= dirs.dest_css_combo_slider %>/photonic-' + lower + '.css'
			});
			firstSet.push('concat:' + lower + '_css_slider_combo');

			grunt.config(['copy', lower + '_css_img'], {
				files: [{
					expand: true,
					cwd: '<%= dirs.tp %>/' + lower,
					src: [
						lower + '-img/**',
						lower + '-fonts/**'
					],
					dest: '<%= dirs.dest_css_combo %>/'
				}]
			});
			firstSet.push('copy:' + lower + '_css_img');

			grunt.config(['copy', lower + '_css_img_slider'], {
				files: [{
					expand: true,
					cwd: '<%= dirs.tp %>/' + lower,
					src: [
						lower + '-img/**',
						lower + '-fonts/**'
					],
					dest: '<%= dirs.dest_css_combo_slider %>/'
				}]
			});
			firstSet.push('copy:' + lower + '_css_img_slider');
		}

		grunt.config(['uglify', 'solo'], {
			files: [{
				expand: true,
				cwd: '<%= dirs.dest_js_solo %>',
				src: ['*.js'],
				dest: '<%= dirs.dest_js_solo %>/',
				ext: '.min.js',
				extDot: 'first'
			}]
		});
		firstSet.push('uglify:solo');

		grunt.config(['uglify', 'solo_slider'], {
			files: [{
				expand: true,
				cwd: '<%= dirs.dest_js_solo_slider %>',
				src: ['*.js'],
				dest: '<%= dirs.dest_js_solo_slider %>/',
				ext: '.min.js',
				extDot: 'first'
			}]
		});
		firstSet.push('uglify:solo_slider');

		grunt.config(['cssmin', 'combo'], {
			files: [{
				expand: true,
				cwd: '<%= dirs.dest_css_combo %>',
				src: ['*.css', '!*.min.css'],
				dest: '<%= dirs.dest_css_combo %>/',
				ext: '.min.css'
			}]
		});
		firstSet.push('cssmin:combo');

		grunt.config(['cssmin', 'combo_slider'], {
			files: [{
				expand: true,
				cwd: '<%= dirs.dest_css_combo_slider %>',
				src: ['*.css', '!*.min.css'],
				dest: '<%= dirs.dest_css_combo_slider %>/',
				ext: '.min.css'
			}]
		});
		firstSet.push('cssmin:combo_slider');

		grunt.config(['copy', 'img_slider'], {
			files: [{
				expand: true,
				cwd: '<%= dirs.tp %>/lightslider',
				src: [
					'lightslider-img/**'
				],
				dest: '<%= dirs.dest_css_combo_slider %>/'
			}]
		});
		firstSet.push('copy:img_slider');

		firstSet.push('makepot:target');

		grunt.task.run(firstSet);
		grunt.task.run(secondSet);
	}

	// Tasks
	grunt.registerTask('default', [
		'concat:no_jq_lightgallery'
	]);

	grunt.registerTask('build_all', buildAll);
};