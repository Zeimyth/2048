
###############################################
# Compilation Variables                       #
###############################################

LESSC := tools/less/bin/lessc
LESS_FILES := $(shell find css/ -name "*.less")
LESS_DEST := target/css/base.css

CLOSURE_LIBRARY := tools/closure-lib
CLOSURE_BASE := $(CLOSURE_LIBRARY)/closure/bin/build
CLOSURE_BUILDER := $(CLOSURE_BASE)/closurebuilder.py
CLOSURE_DEPS_BUILDER := $(CLOSURE_BASE)/depswriter.py
CLOSURE_JAR := tools/closure/compiler.jar
JS_FILES := js/
JS_NAMESPACE := zeimyth.game.base
JS_DEST := target/js/game-compiled.js
JS_DEPS_DEST := target/js/game-deps.js

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
	@echo "deps          Javascript dependency resolver"
	@echo "js            Closure Javascript compiler"
	@echo
	@echo "### Clean Targets ###"
	@echo "clean-css     Clean css"
	@echo "clean-js      Clean js"
	@echo "clean-deps    Clean dependency file"

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
	$(CLOSURE_BUILDER)                                 \
		--root $(CLOSURE_LIBRARY)                      \
		--root $(JS_FILES)                             \
		--namespace "$(JS_NAMESPACE)"                  \
		--output_mode=compiled                         \
		--compiler_jar=$(CLOSURE_JAR)                  \
		-f "--warning_level=VERBOSE"                   \
		-f "--output_wrapper=(function(){%output%})()" \
		-f "--language_in=ECMASCRIPT5"                 \
		-f "--jscomp_off=accessControls"               \
		-f "--jscomp_off=es5Strict"                    \
		-f "--jscomp_off=checkRegExp"                  \
		-f "--jscomp_error=checkTypes"                 \
		-f "--jscomp_error=checkVars"                  \
		-f "--jscomp_error=deprecated"                 \
		-f "--jscomp_error=fileoverviewTags"           \
		-f "--jscomp_error=invalidCasts"               \
		-f "--jscomp_error=missingProperties"          \
		-f "--jscomp_error=nonStandardJsDocs"          \
		-f "--jscomp_error=strictModuleDepCheck"       \
		-f "--jscomp_error=undefinedVars"              \
		-f "--jscomp_error=unknownDefines"             \
		--output_file=$(JS_DEST)

clean-js:
	rm -f $(JS_DEST)

.PHONY: deps clean-deps
deps:
	$(CLOSURE_DEPS_BUILDER)                                   \
	--root_with_prefix="$(JS_FILES) ../../../../$(JS_FILES)"  \
	--output_file=$(JS_DEPS_DEST)

clean-deps:
	rm -f $(JS_DEPS_DEST)

###############################################
# Install Target                              #
###############################################

.PHONY: init install
install: init js css deps
	echo "To run the game, open index.html or uncompiled.html in a web browser."

init:
	mkdir target
	mkdir target/js
	mkdir target/css
