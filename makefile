
###############################################
# Compilation Variables                       #
###############################################

LESSC := tools/less/bin/lessc
LESS_FILES := $(shell find css/ -name "*.less")
LESS_DEST := target/css/base.css


###############################################
# Common Targets                              #
###############################################

.DEFAULT: help

.PHONY: help
help:
	@echo "### Common Targets ###"
	@echo "clean         Clean all targets"
	@echo "help          Print this help"
	@echo
	@echo "### Build Targets ###"
	@echo "css           Less CSS compiler"
	@echo
	@echo "### Clean Targets ###"
	@echo "clean-css     Clean css"

.PHONY: clean
clean: clean-css

###############################################
# CSS Targets                                 #
###############################################

.PHONY: css clean-css
css:
	$(LESSC) -x $(LESS_FILES) $(LESS_DEST)

clean-css:
	rm -f $(LESS_DEST)