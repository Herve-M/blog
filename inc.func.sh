# Functions
#-----------------------------------------------------------------------------

displayTitle() {
    displayMessage "------------------------------------------------------------------------------"
    displayMessage "$*"
    displayMessage "------------------------------------------------------------------------------"

}

displayMessage() {
    echo "$*"
}
displayError() {
    displayMessage "$*" >&2
}

# First parameter: ERROR CODE
# Second parameter: MESSAGE
displayErrorAndExit() {
    local exitcode=$1
    shift
    displayError "$*"
    exit $exitcode
}

# First parameter: MESSAGE
# Others parameters: COMMAND (! not |)
displayAndExec() {
	local message=$1
	echo -n "[In progress] $message"
	shift
	echo ">>> $*" >> $LOG_FILE 2>&1
	sh -c "$*" >> $LOG_FILE 2>&1
	local ret=$?
	if [ $ret -ne 0 ]; then
		echo -e "\r\e[0;31m [ERROR]\e[0m $message"
	else
		echo -e "\r\e[0;32m [OK]\e[0m $message"
	fi
	return $ret
}
