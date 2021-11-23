package internal

import (
	_ "embed"
	"fmt"
	"os"
	"path"
	"strings"
)

type AppArgs struct {
	repo        string
	destination string
	force       bool
	subpath     string
}

func ParseArgs(args []string, help string, version string) (*AppArgs, error) {
	appArgs := new(AppArgs)
	repo := ""
	force := false
	subpath := ""
	destination := ""
	showHelp := false
	showVersion := false

	for index := 0; index < len(args); index++ {
		arg := args[index]
		if strings.HasPrefix(arg, "-") {
			if arg == "-f" || arg == "--force" {
				force = true
			} else if arg == "-h" || arg == "--help" {
				showHelp = true
			} else if arg == "-v" || arg == "--version" {
				showVersion = true
			} else if arg == "-p" || arg == "--path" {
				v := ""
				if index+1 <= len(args)-1 {
					v = args[index+1]
				}
				if v == "" {
					return nil, fmt.Errorf("missing path value")
				}
				subpath = v
				index += 1
			} else {
				return nil, fmt.Errorf("unknown flag: %s", arg)
			}
		} else {
			if arg == "upgrade" {
				Upgrade()
				os.Exit(0)
			} else if repo == "" {
				repo = arg
			} else if destination == "" {
				destination = arg
			} else {
				return nil, fmt.Errorf("too many arguments: %s", arg)
			}
		}

	}

	if showVersion {
		fmt.Println(version)
		os.Exit(0)
	}

	if showHelp {
		fmt.Printf(help, version)
		os.Exit(0)
	}

	if repo == "" {
		fmt.Printf(help, version)
		fmt.Println("\nmissing repo")
		os.Exit(1)
	}

	appArgs.repo = repo
	appArgs.force = force
	appArgs.subpath = subpath

	if destination == "" {
		// set destination to current directory with absolute path
		appArgs.destination = GetCurrentDirectory()
	} else {
		appArgs.destination = path.Join(GetCurrentDirectory(), destination)
	}

	return appArgs, nil
}

func GetCurrentDirectory() string {
	dir, err := os.Getwd()
	if err != nil {
		panic(err)
	}
	return dir
}
