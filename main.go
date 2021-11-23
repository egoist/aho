package main

import (
	_ "embed"
	"fmt"
	"os"

	"github.com/egoist/aho/internal"
)

//go:embed help.txt
var help string

//go:embed version.txt
var version string

func main() {
	args, err := internal.ParseArgs(os.Args[1:], help, version)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	err = internal.FetchRepo(args)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
