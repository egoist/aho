package main

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

func parseArgs(args []string) (*AppArgs, error) {
	appArgs := new(AppArgs)
	repo := ""
	force := false
	subpath := ""
	destination := ""
	help := false
	version := false

	for index := 0; index < len(args); index++ {
		arg := args[index]
		if strings.HasPrefix(arg, "-") {
			if arg == "-f" || arg == "--force" {
				force = true
			} else if arg == "-h" || arg == "--help" {
				help = true
			} else if arg == "-v" || arg == "--version" {
				version = true
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
			if repo == "" {
				repo = arg
			} else if destination == "" {
				destination = arg
			} else {
				return nil, fmt.Errorf("too many arguments: %s", arg)
			}
		}

	}

	if version {
		PrintVersion()
		os.Exit(0)
	}

	if help {
		PrintHelp()
		os.Exit(0)
	}

	if repo == "" {
		return nil, fmt.Errorf("missing repo")
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

//go:embed version.txt
var version string

//go:embed help.txt
var help string

func PrintHelp() {
	fmt.Printf(help, version)
}

func PrintVersion() {
	fmt.Println(version)
}
