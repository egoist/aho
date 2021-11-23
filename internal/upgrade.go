package internal

import (
	"os"
	"os/exec"
	"path"
)

func Upgrade() {
	bin := os.Args[0]
	dir := path.Dir(bin)

	// Run command
	cmd := exec.Command("bash", "-c", "curl -fsSL https://install.egoist.sh/aho.sh | bash -s -- -b "+dir)
	cmd.Stdin = os.Stdin
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	cmd.Run()

}