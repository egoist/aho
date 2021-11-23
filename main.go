package main

import (
	"fmt"
	"os"
)

func main() {
	args, err := parseArgs(os.Args[1:])
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	err = FetchRepo(args)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
