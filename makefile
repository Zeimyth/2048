
###############################################
# Compilation Variables                       #
###############################################

LESSC := tools/less/bin/lessc
LESS_FILES := $(shell find css/ -name "*.less")
LESS_DEST := target/css/base.css

CLOSURE_BUILDER := tools/closure-lib/closure/bin/build/closurebuilder.py
CLOSURE_LIBRARY := tools/closure-lib/
CLOSURE_JAR := tools/closure/compiler.jar
JS_FILES := js/
JS_NAMESPACE := zeimyth.game
JS_DEST := target/js/game-compiled.js

###############################################
# Common Targets                              #
###############################################

.DEFAULT: help

.PHONY: help
help:
	@echo "### Common Targets ###"
	@echo "clean         Clean all targets"
	@echo "help          Print this help"
	@echo "install       Sets up the folder structure and runs the initial build"
	@echo
	@echo "### Build Targets ###"
	@echo "css           Less CSS compiler"
	@echo "js            Closure Javascript compiler"
	@echo
	@echo "### Clean Targets ###"
	@echo "clean-css     Clean css"
	@echo "clean-js      Clean js"

.PHONY: clean
clean: clean-css clean-js

###############################################
# CSS Targets                                 #
###############################################

.PHONY: css clean-css
css:
	$(LESSC) -x $(LESS_FILES) $(LESS_DEST)

clean-css:
	rm -f $(LESS_DEST)

###############################################
# Javascript Targets                          #
###############################################

.PHONY: js clean-js
js:
	$(CLOSURE_BUILDER) \
		--root $(CLOSURE_LIBRARY) \
		--root $(JS_FILES) \
		--namespace "$(JS_NAMESPACE)" \
		--output_mode=compiled \
		--compiler_jar=$(CLOSURE_JAR) \
		--compiler_flags="--warning_level=VERBOSE" \
		--compiler_flags="--jscomp_off=es5Strict" \
		--compiler_flags="--jscomp_error=checkTypes" \
		--output_file=$(JS_DEST)

clean-js:
	rm -f $(JS_DEST)

###############################################
# Install Target                              #
###############################################

.PHONY: init install
install: init js css

init:
	mkdir target
	mkdir target/js
	mkdir target/css
